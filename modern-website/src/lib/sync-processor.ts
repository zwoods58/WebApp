import { db, QueuedOperation } from './database';
import { supabase } from './supabase';
import { getOnlineStatus } from './connection-manager';

/**
 * Process pending operations from the queue and sync to Supabase
 */
export class SyncProcessor {
  private static instance: SyncProcessor;
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SyncProcessor {
    if (!SyncProcessor.instance) {
      SyncProcessor.instance = new SyncProcessor();
    }
    return SyncProcessor.instance;
  }

  /**
   * Start automatic sync processing
   */
  startAutoSync(intervalMs: number = 10000): void {
    if (this.syncInterval) return;

    console.log('[SyncProcessor] Starting auto-sync every', intervalMs, 'ms');
    
    // Initial sync
    this.processPendingOperations();

    // Periodic sync
    this.syncInterval = setInterval(() => {
      this.processPendingOperations();
    }, intervalMs);
  }

  /**
   * Stop automatic sync processing
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[SyncProcessor] Auto-sync stopped');
    }
  }

  /**
   * Process all pending operations in the queue with batching
   */
  async processPendingOperations(): Promise<void> {
    if (this.isSyncing) {
      console.log('[SyncProcessor] Sync already in progress, skipping');
      return;
    }

    // Check if online using real connectivity test
    if (!getOnlineStatus()) {
      console.log('[SyncProcessor] Offline, skipping sync');
      return;
    }

    this.isSyncing = true;

    try {
      // Get all pending operations, ordered by timestamp
      const pendingOps = await db.operations_queue
        .where('status')
        .equals('pending')
        .sortBy('timestamp');

      if (pendingOps.length === 0) {
        return;
      }

      console.log(`[SyncProcessor] Processing ${pendingOps.length} pending operations in batches`);

      // Process in batches of 5 operations with 1-second delays
      const BATCH_SIZE = 5;
      const BATCH_DELAY = 1000; // 1 second between batches
      
      for (let i = 0; i < pendingOps.length; i += BATCH_SIZE) {
        const batch = pendingOps.slice(i, i + BATCH_SIZE);
        console.log(`[SyncProcessor] Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(pendingOps.length/BATCH_SIZE)} (${batch.length} operations)`);
        
        // Process each operation in the current batch
        for (const operation of batch) {
          try {
            await this.processOperation(operation);
          } catch (error) {
            console.error('[SyncProcessor] Failed to process operation:', operation.id, error);
            
            // Update retry count
            await db.operations_queue.update(operation.id, {
              retryCount: (operation.retryCount || 0) + 1,
              status: (operation.retryCount || 0) >= 3 ? 'failed' : 'pending'
            });
          }
        }
        
        // Add delay between batches (except after the last batch)
        if (i + BATCH_SIZE < pendingOps.length) {
          console.log(`[SyncProcessor] Batch completed, waiting ${BATCH_DELAY}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
      }

      console.log('[SyncProcessor] All batches completed - Sync finished');
    } catch (error) {
      console.error('[SyncProcessor] Sync process failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Process a single operation
   */
  private async processOperation(operation: QueuedOperation): Promise<void> {
    console.log(`[SyncProcessor] Processing ${operation.type} on ${operation.table}:`, operation.id);

    const { table, type, data } = operation;

    switch (type) {
      case 'CREATE':
        await this.syncCreate(table, data);
        break;
      case 'UPDATE':
        await this.syncUpdate(table, data);
        break;
      case 'DELETE':
        await this.syncDelete(table, data.id);
        break;
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }

    // Mark as completed and remove from queue
    await db.operations_queue.delete(operation.id);
    console.log(`[SyncProcessor] ✅ Completed ${operation.type} on ${operation.table}`);
  }

  /**
   * Sync CREATE operation to Supabase
   */
  private async syncCreate(table: string, data: any): Promise<void> {
    // Remove sync-related fields
    const { syncStatus, _deleted, ...cleanData } = data;

    const { error } = await supabase
      .from(table)
      .insert(cleanData);

    if (error) {
      throw new Error(`Supabase CREATE failed: ${error.message}`);
    }

    // Update local cache to mark as synced
    await db.table(table as any).update(data.id, { syncStatus: 'synced' });
  }

  /**
   * Sync UPDATE operation to Supabase
   */
  private async syncUpdate(table: string, data: any): Promise<void> {
    const { id, syncStatus, _deleted, ...cleanData } = data;

    const { error } = await supabase
      .from(table)
      .update(cleanData)
      .eq('id', id);

    if (error) {
      throw new Error(`Supabase UPDATE failed: ${error.message}`);
    }

    // Update local cache to mark as synced
    await db.table(table as any).update(id, { syncStatus: 'synced' });
  }

  /**
   * Sync DELETE operation to Supabase
   */
  private async syncDelete(table: string, id: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Supabase DELETE failed: ${error.message}`);
    }

    // Remove from local cache
    await db.table(table as any).delete(id);
  }

  /**
   * Get pending operations count
   */
  async getPendingCount(businessId?: string): Promise<number> {
    if (businessId) {
      return await db.operations_queue
        .where('businessId')
        .equals(businessId)
        .and(op => op.status === 'pending')
        .count();
    }
    
    return await db.operations_queue
      .where('status')
      .equals('pending')
      .count();
  }

  /**
   * Force immediate sync
   */
  async forceSync(): Promise<void> {
    console.log('[SyncProcessor] Force sync triggered');
    await this.processPendingOperations();
  }
}

export const syncProcessor = SyncProcessor.getInstance();
