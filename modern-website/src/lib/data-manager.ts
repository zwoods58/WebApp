/**
 * Centralized Data Manager for PWA
 * Implements industry-standard data persistence patterns
 */

import { supabase } from './supabase';
import { db, QueuedOperation } from './database';
import { syncProcessor } from './sync-processor';

export interface DataManagerConfig {
  businessId: string;
  industry: string;
  country: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  hasErrors: boolean;
}

export interface DataOperation<T> {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  data?: T;
  id?: string;
  timestamp: Date;
  priority: 'high' | 'normal' | 'low';
}

export class DataManager {
  private config: DataManagerConfig;
  private syncStatus: SyncStatus;
  private operationQueue: DataOperation<any>[] = [];
  private syncCallbacks: ((status: SyncStatus) => void)[] = [];

  constructor(config: DataManagerConfig) {
    this.config = config;
    this.syncStatus = {
      isOnline: navigator.onLine,
      lastSync: null,
      pendingOperations: 0,
      hasErrors: false
    };

    // Listen for network changes
    window.addEventListener('online', this.handleNetworkChange.bind(this));
    window.addEventListener('offline', this.handleNetworkChange.bind(this));
  }

  /**
   * Create data with immediate local save and background sync
   */
  async create<T>(table: string, data: T, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<string> {
    const id = crypto.randomUUID();
    const timestamp = new Date();
    
    // Prepare data with metadata
    const enrichedData = {
      ...data,
      id,
      business_id: this.config.businessId,
      industry: this.config.industry,
      country: this.config.country,
      created_at: timestamp.toISOString(),
      updated_at: timestamp.toISOString(),
      sync_status: 'pending' as const
    };

    // 1. Save to IndexedDB immediately (instant UI)
    await this.saveToIndexedDB(table, enrichedData);
    
    // 2. Queue for background sync
    const operation: DataOperation<T> = {
      type: 'CREATE',
      table,
      data: enrichedData,
      timestamp,
      priority
    };
    
    await this.queueOperation(operation);
    
    // 3. Attempt immediate sync if online
    if (this.syncStatus.isOnline) {
      this.processSync().catch(console.error);
    }

    console.log(`📝 [DataManager] Created ${table} item:`, { id, priority });
    return id;
  }

  /**
   * Update data with optimistic updates and sync
   */
  async update<T>(table: string, id: string, data: Partial<T>, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<void> {
    const timestamp = new Date();
    
    // Get existing data
    const existingData = await this.getFromIndexedDB(table, id);
    if (!existingData) {
      throw new Error(`Item not found: ${table}:${id}`);
    }

    // Prepare updated data
    const updatedData = {
      ...existingData,
      ...data,
      updated_at: timestamp.toISOString(),
      sync_status: 'pending' as const
    };

    // 1. Update IndexedDB immediately (instant UI)
    await this.updateInIndexedDB(table, id, updatedData);
    
    // 2. Queue for background sync
    const operation: DataOperation<Partial<T>> = {
      type: 'UPDATE',
      table,
      id,
      data: updatedData,
      timestamp,
      priority
    };
    
    await this.queueOperation(operation);
    
    // 3. Attempt immediate sync if online
    if (this.syncStatus.isOnline) {
      this.processSync().catch(console.error);
    }

    console.log(`✏️ [DataManager] Updated ${table} item:`, { id, priority });
  }

  /**
   * Delete data with immediate local removal and sync
   */
  async delete(table: string, id: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<void> {
    const timestamp = new Date();
    
    // 1. Remove from IndexedDB immediately (instant UI)
    await this.deleteFromIndexedDB(table, id);
    
    // 2. Queue for background sync
    const operation: DataOperation<any> = {
      type: 'DELETE',
      table,
      id,
      timestamp,
      priority
    };
    
    await this.queueOperation(operation);
    
    // 3. Attempt immediate sync if online
    if (this.syncStatus.isOnline) {
      this.processSync().catch(console.error);
    }

    console.log(`🗑️ [DataManager] Deleted ${table} item:`, { id, priority });
  }

  /**
   * Get data from IndexedDB with fallback to database
   */
  async get<T>(table: string, id: string): Promise<T | null> {
    // Try IndexedDB first (fast)
    let data = await this.getFromIndexedDB<T>(table, id);
    
    // If not found and online, try database
    if (!data && this.syncStatus.isOnline) {
      try {
        const { data: dbData, error } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .eq('business_id', this.config.businessId)
          .single();
        
        if (dbData && !error) {
          // Cache in IndexedDB for future use
          await this.saveToIndexedDB(table, dbData);
          data = dbData;
        }
      } catch (error) {
        console.warn(`Failed to fetch ${table} from database:`, error);
      }
    }
    
    return data;
  }

  /**
   * Query data from IndexedDB with database fallback
   */
  async query<T>(table: string, filters?: Record<string, any>): Promise<T[]> {
    // Try IndexedDB first (fast)
    let data = await this.queryFromIndexedDB<T>(table, filters);
    
    // If no data and online, try database
    if (data.length === 0 && this.syncStatus.isOnline) {
      try {
        let query = supabase
          .from(table)
          .select('*')
          .eq('business_id', this.config.businessId);
        
        // Apply filters
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }
        
        const { data: dbData, error } = await query;
        
        if (dbData && !error) {
          // Cache in IndexedDB for future use
          for (const item of dbData) {
            await this.saveToIndexedDB(table, item);
          }
          data = dbData;
        }
      } catch (error) {
        console.warn(`Failed to query ${table} from database:`, error);
      }
    }
    
    return data;
  }

  /**
   * Force immediate sync of all pending operations
   */
  async forceSync(): Promise<void> {
    if (!this.syncStatus.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await this.processSync();
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Subscribe to sync status changes
   */
  onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.syncCallbacks.push(callback);
    return () => {
      const index = this.syncCallbacks.indexOf(callback);
      if (index > -1) {
        this.syncCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Clear all local data (for logout/reset)
   */
  async clearLocalData(): Promise<void> {
    const tables = ['inventory', 'services', 'appointments', 'transactions', 'credit', 'expenses'];
    
    for (const table of tables) {
      const tableAccess = (db as any)[table];
      if (tableAccess) {
        await tableAccess.clear();
      }
    }
    
    this.operationQueue = [];
    this.updateSyncStatus();
    
    console.log('🧹 [DataManager] Cleared all local data');
  }

  // Private methods

  private async saveToIndexedDB(table: string, data: any): Promise<void> {
    try {
      const tableAccess = (db as any)[table];
      if (tableAccess) {
        await tableAccess.put(data);
      }
    } catch (error) {
      console.error(`Failed to save to IndexedDB ${table}:`, error);
      throw error;
    }
  }

  private async updateInIndexedDB(table: string, id: string, data: any): Promise<void> {
    try {
      const tableAccess = (db as any)[table];
      if (tableAccess) {
        await tableAccess.put(data);
      }
    } catch (error) {
      console.error(`Failed to update in IndexedDB ${table}:`, error);
      throw error;
    }
  }

  private async deleteFromIndexedDB(table: string, id: string): Promise<void> {
    try {
      const tableAccess = (db as any)[table];
      if (tableAccess) {
        await tableAccess.delete(id);
      }
    } catch (error) {
      console.error(`Failed to delete from IndexedDB ${table}:`, error);
      throw error;
    }
  }

  private async getFromIndexedDB<T>(table: string, id: string): Promise<T | null> {
    try {
      const tableAccess = (db as any)[table];
      if (tableAccess) {
        const data = await tableAccess.get(id);
        return data || null;
      }
      return null;
    } catch (error) {
      console.error(`Failed to get from IndexedDB ${table}:`, error);
      return null;
    }
  }

  private async queryFromIndexedDB<T>(table: string, filters?: Record<string, any>): Promise<T[]> {
    try {
      const tableAccess = (db as any)[table];
      if (!tableAccess) {
        return [];
      }
      
      let collection = tableAccess;
      
      if (filters) {
        // Apply filters (basic implementation)
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            collection = collection.where(key, value);
          }
        });
      }
      
      const data = await collection.toArray();
      return data;
    } catch (error) {
      console.error(`Failed to query IndexedDB ${table}:`, error);
      return [];
    }
  }

  private async queueOperation(operation: DataOperation<any>): Promise<void> {
    // Add to queue based on priority
    if (operation.priority === 'high') {
      this.operationQueue.unshift(operation);
    } else {
      this.operationQueue.push(operation);
    }
    
    this.updateSyncStatus();
  }

  private async processSync(): Promise<void> {
    if (!this.syncStatus.isOnline || this.operationQueue.length === 0) {
      return;
    }

    console.log(`🔄 [DataManager] Processing ${this.operationQueue.length} operations`);

    // Process operations in order
    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift()!;
      
      try {
        await this.executeOperation(operation);
      } catch (error) {
        console.error(`Failed to execute operation:`, operation, error);
        
        // Re-queue failed operations (with retry limit)
        if (operation.priority !== 'low') {
          this.operationQueue.unshift(operation);
        }
        
        this.syncStatus.hasErrors = true;
        break;
      }
    }

    this.syncStatus.lastSync = new Date();
    this.updateSyncStatus();
  }

  private async executeOperation(operation: DataOperation<any>): Promise<void> {
    switch (operation.type) {
      case 'CREATE':
        if (!operation.data) throw new Error('CREATE operation requires data');
        await this.executeCreate(operation.table, operation.data);
        break;
        
      case 'UPDATE':
        if (!operation.id || !operation.data) throw new Error('UPDATE operation requires id and data');
        await this.executeUpdate(operation.table, operation.id, operation.data);
        break;
        
      case 'DELETE':
        if (!operation.id) throw new Error('DELETE operation requires id');
        await this.executeDelete(operation.table, operation.id);
        break;
        
      default:
        throw new Error(`Unknown operation type: ${(operation as any).type}`);
    }
  }

  private async executeCreate(table: string, data: any): Promise<void> {
    const { error } = await supabase
      .from(table)
      .insert({
        ...data,
        sync_status: 'synced'
      });
    
    if (error) throw error;
    
    // Update local status
    await this.updateInIndexedDB(table, data.id, { ...data, sync_status: 'synced' });
  }

  private async executeUpdate(table: string, id: string, data: any): Promise<void> {
    const { error } = await supabase
      .from(table)
      .update({
        ...data,
        sync_status: 'synced'
      })
      .eq('id', id);
    
    if (error) throw error;
    
    // Update local status
    await this.updateInIndexedDB(table, id, { ...data, sync_status: 'synced' });
  }

  private async executeDelete(table: string, id: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  private handleNetworkChange(): void {
    const wasOnline = this.syncStatus.isOnline;
    this.syncStatus.isOnline = navigator.onLine;
    
    // If coming back online, process pending operations
    if (!wasOnline && this.syncStatus.isOnline) {
      console.log('🌐 [DataManager] Back online, processing pending operations');
      this.processSync().catch(console.error);
    }
    
    this.updateSyncStatus();
  }

  private updateSyncStatus(): void {
    this.syncStatus.pendingOperations = this.operationQueue.length;
    
    // Notify subscribers
    this.syncCallbacks.forEach(callback => {
      try {
        callback(this.getSyncStatus());
      } catch (error) {
        console.error('Sync status callback error:', error);
      }
    });
  }
}

// Singleton instance for the app
let dataManagerInstance: DataManager | null = null;

export function getDataManager(config: DataManagerConfig): DataManager {
  if (!dataManagerInstance || 
      dataManagerInstance.getSyncStatus().pendingOperations === 0) {
    dataManagerInstance = new DataManager(config);
  }
  return dataManagerInstance;
}

export function clearDataManager(): void {
  dataManagerInstance = null;
}
