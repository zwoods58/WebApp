/**
 * Enhanced Offline Queue System
 * Manages all offline operations across all app features
 */

import { 
  OfflineOperation, 
  OfflineQueue, 
  SyncStatus, 
  OFFLINE_STORAGE_KEYS,
  FEATURE_SYNC_ORDER,
  SYNC_PRIORITY 
} from '@/types/offlineTypes';
import { localStorageManager } from '@/utils/localStorageManager';

export class OfflineQueueManager {
  private queue: OfflineQueue;
  private syncStatus: SyncStatus;
  private isProcessing = false;
  private maxRetries = 5;
  private retryDelays = [1000, 2000, 5000, 10000, 30000]; // Exponential backoff

  constructor() {
    this.queue = this.loadQueue();
    this.syncStatus = this.loadSyncStatus();
    this.initializeEventListeners();
  }

  /**
   * Add operation to offline queue
   */
  public addOperation(operation: Omit<OfflineOperation, 'id' | 'timestamp' | 'retryCount'>): string {
    const fullOperation: OfflineOperation = {
      ...operation,
      id: `${operation.feature}-${operation.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    } as OfflineOperation;

    // Insert based on priority
    if (operation.priority === SYNC_PRIORITY.HIGH) {
      this.queue.operations.unshift(fullOperation);
    } else {
      this.queue.operations.push(fullOperation);
    }

    this.saveQueue();
    this.updateSyncStatus();
    
    console.log(`Added ${operation.feature} operation to queue: ${operation.type}`);
    return fullOperation.id;
  }

  /**
   * Get operations by feature
   */
  public getOperationsByFeature(feature: string): OfflineOperation[] {
    return this.queue.operations.filter(op => op.feature === feature);
  }

  /**
   * Get pending operations count by feature
   */
  public getPendingCount(feature?: string): number {
    if (feature) {
      return this.queue.operations.filter(op => 
        op.feature === feature && op.status === 'pending'
      ).length;
    }
    return this.queue.operations.filter(op => op.status === 'pending').length;
  }

  /**
   * Get next operation to process
   */
  public getNextOperation(): OfflineOperation | null {
    if (this.queue.operations.length === 0) return null;

    // Find operations that are ready to retry
    const now = Date.now();
    const readyOperations = this.queue.operations.filter(op => {
      if (op.status !== 'pending') return false;
      
      if (op.retryCount === 0) return true;
      
      const retryDelay = this.retryDelays[Math.min(op.retryCount, this.retryDelays.length - 1)];
      return (now - op.timestamp) > retryDelay;
    });

    if (readyOperations.length === 0) return null;

    // Sort by feature priority and timestamp
    readyOperations.sort((a, b) => {
      const aPriority = FEATURE_SYNC_ORDER.indexOf(a.feature);
      const bPriority = FEATURE_SYNC_ORDER.indexOf(b.feature);
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return a.timestamp - b.timestamp;
    });

    return readyOperations[0];
  }

  /**
   * Mark operation as syncing
   */
  public markAsSyncing(operationId: string): void {
    const operation = this.queue.operations.find(op => op.id === operationId);
    if (operation) {
      operation.status = 'syncing';
      this.saveQueue();
      this.updateSyncStatus();
    }
  }

  /**
   * Mark operation as synced
   */
  public markAsSynced(operationId: string): void {
    const index = this.queue.operations.findIndex(op => op.id === operationId);
    if (index !== -1) {
      const operation = this.queue.operations[index];
      operation.status = 'synced';
      this.queue.lastProcessed = Date.now();
      this.queue.totalProcessed++;
      
      // Remove from queue after successful sync
      this.queue.operations.splice(index, 1);
      this.saveQueue();
      this.updateSyncStatus();
      
      console.log(`Operation ${operationId} synced successfully`);
    }
  }

  /**
   * Mark operation as failed and retry
   */
  public markAsFailed(operationId: string, error: string): void {
    const operation = this.queue.operations.find(op => op.id === operationId);
    if (operation) {
      operation.retryCount++;
      
      if (operation.retryCount >= this.maxRetries) {
        operation.status = 'error';
        this.queue.failedOperations.push(operation);
        // Remove from active queue
        const index = this.queue.operations.findIndex(op => op.id === operationId);
        if (index !== -1) {
          this.queue.operations.splice(index, 1);
        }
        this.syncStatus.errors.push(`Failed to sync ${operation.feature} operation after ${this.maxRetries} attempts: ${error}`);
      } else {
        operation.status = 'pending';
        console.log(`Operation ${operationId} failed, will retry (${operation.retryCount}/${this.maxRetries})`);
      }
      
      this.saveQueue();
      this.updateSyncStatus();
    }
  }

  /**
   * Get current sync status
   */
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Clear all operations
   */
  public clearQueue(): void {
    this.queue = {
      operations: [],
      lastProcessed: Date.now(),
      totalProcessed: 0,
      failedOperations: []
    };
    this.saveQueue();
    this.updateSyncStatus();
  }

  /**
   * Clear failed operations
   */
  public clearFailedOperations(): void {
    this.queue.failedOperations = [];
    this.syncStatus.errors = [];
    this.saveQueue();
    this.updateSyncStatus();
  }

  /**
   * Get queue statistics
   */
  public getQueueStats(): {
    total: number;
    pending: number;
    syncing: number;
    failed: number;
    byFeature: Record<string, number>;
  } {
    const stats = {
      total: this.queue.operations.length,
      pending: 0,
      syncing: 0,
      failed: this.queue.failedOperations.length,
      byFeature: {} as Record<string, number>
    };

    this.queue.operations.forEach(op => {
      if (op.status === 'pending') stats.pending++;
      if (op.status === 'syncing') stats.syncing++;
      
      stats.byFeature[op.feature] = (stats.byFeature[op.feature] || 0) + 1;
    });

    return stats;
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): OfflineQueue {
    const saved = localStorageManager.get<OfflineQueue>(OFFLINE_STORAGE_KEYS.QUEUE);
    return saved || {
      operations: [],
      lastProcessed: 0,
      totalProcessed: 0,
      failedOperations: []
    };
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    localStorageManager.set(OFFLINE_STORAGE_KEYS.QUEUE, this.queue);
  }

  /**
   * Load sync status from localStorage
   */
  private loadSyncStatus(): SyncStatus {
    const saved = localStorageManager.get<SyncStatus>(OFFLINE_STORAGE_KEYS.SYNC_STATUS);
    return saved || {
      isOnline: navigator.onLine,
      isSyncing: false,
      lastSync: 0,
      pendingItems: {
        total: 0,
        beehive: 0,
        cash: 0,
        inventory: 0,
        calendar: 0,
        credit: 0
      },
      errors: [],
      featureStatus: {
        beehive: 'online',
        cash: 'online',
        inventory: 'online',
        calendar: 'online',
        credit: 'online'
      }
    };
  }

  /**
   * Save sync status to localStorage
   */
  private saveSyncStatus(): void {
    localStorageManager.set(OFFLINE_STORAGE_KEYS.SYNC_STATUS, this.syncStatus);
  }

  /**
   * Update sync status based on current queue
   */
  private updateSyncStatus(): void {
    const pendingItems = {
      total: 0,
      beehive: 0,
      cash: 0,
      inventory: 0,
      calendar: 0,
      credit: 0
    };

    this.queue.operations.forEach(op => {
      if (op.status === 'pending') {
        pendingItems.total++;
        pendingItems[op.feature as keyof typeof pendingItems]++;
      }
    });

    this.syncStatus.pendingItems = pendingItems;
    this.syncStatus.isOnline = navigator.onLine;
    this.saveSyncStatus();
  }

  /**
   * Initialize online/offline event listeners
   */
  private initializeEventListeners(): void {
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true;
      this.updateSyncStatus();
      console.log('Network restored, ready to sync');
      
      // Trigger sync if there are pending operations
      if (this.queue.operations.length > 0) {
        this.processQueue();
      }
    });

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
      this.updateSyncStatus();
      console.log('Network lost, entering offline mode');
    });
  }

  /**
   * Process the queue (called by background sync service)
   */
  public async processQueue(): Promise<void> {
    if (this.isProcessing || !this.syncStatus.isOnline) {
      return;
    }

    this.isProcessing = true;
    this.syncStatus.isSyncing = true;
    this.updateSyncStatus();

    console.log(`Processing offline queue with ${this.queue.operations.length} operations`);

    try {
      while (this.queue.operations.length > 0 && this.syncStatus.isOnline) {
        const operation = this.getNextOperation();
        if (!operation) break;

        this.markAsSyncing(operation.id);

        // Emit event for background sync service to handle
        window.dispatchEvent(new CustomEvent('offline-operation-ready', {
          detail: operation
        }));

        // Wait for operation to complete (timeout after 30 seconds)
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    } catch (error) {
      console.error('Error processing queue:', error);
      this.syncStatus.errors.push(`Queue processing error: ${error}`);
    } finally {
      this.isProcessing = false;
      this.syncStatus.isSyncing = false;
      this.syncStatus.lastSync = Date.now();
      this.updateSyncStatus();
    }
  }

  /**
   * Force retry failed operations
   */
  public retryFailedOperations(): void {
    this.queue.failedOperations.forEach(op => {
      op.status = 'pending';
      op.retryCount = 0;
      this.queue.operations.push(op);
    });
    
    this.queue.failedOperations = [];
    this.syncStatus.errors = [];
    this.saveQueue();
    this.updateSyncStatus();
    
    console.log(`Retrying ${this.queue.failedOperations.length} failed operations`);
  }
}

// Export singleton instance
export const offlineQueueManager = new OfflineQueueManager();
export default OfflineQueueManager;
