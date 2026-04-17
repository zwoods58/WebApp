import { syncProcessor } from './sync-processor';
import { swManager } from './serviceWorker';
import { testInternetConnectivity } from '@/lib/network-status';

/**
 * Single Sync Controller - Prevents multiple sync processes from running simultaneously
 * All sync requests go through this controller instead of directly to sync processor
 */
class SyncManager {
  private static instance: SyncManager;
  private isSyncRequested = false;
  private isProcessing = false;
  private syncTimeout: NodeJS.Timeout | null = null;
  private readonly SYNC_COOLDOWN = 5000; // 5 seconds between syncs

  private constructor() {
    // No deleted items tracking needed with hard deletes
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Request sync - all triggers should call this instead of syncProcessor directly
   */
  async requestSync(source: string = 'unknown'): Promise<void> {
    console.log(`[SyncManager] Sync requested from: ${source}`);
    
    // Don't allow multiple sync requests
    if (this.isSyncRequested) {
      console.log('[SyncManager] Sync already requested, ignoring duplicate request');
      return;
    }

    // Check if online first
    const isOnline = await testInternetConnectivity();
    if (!isOnline) {
      console.log('[SyncManager] Offline, ignoring sync request');
      return;
    }

    // Mark as requested
    this.isSyncRequested = true;

    // Clear any existing timeout
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    // Start sync after a small delay (to handle rapid events)
    this.syncTimeout = setTimeout(async () => {
      await this.executeSync();
    }, 1000);
  }

  /**
   * Execute the actual sync - only one can run at a time
   */
  private async executeSync(): Promise<void> {
    if (this.isProcessing) {
      console.log('[SyncManager] Sync already in progress, skipping');
      return;
    }

    // Double check online status
    const isOnline = await testInternetConnectivity();
    if (!isOnline) {
      console.log('[SyncManager] Status changed to offline, cancelling sync');
      this.isSyncRequested = false;
      return;
    }

    this.isProcessing = true;
    console.log('[SyncManager] 🚀 Starting unified sync process...');

    try {
      // Run the main sync processor (with batching)
      await syncProcessor.forceSync();
      
      // Also trigger service worker sync (non-blocking)
      try {
        await swManager.triggerSync();
        console.log('[SyncManager] Service worker sync triggered');
      } catch (swError) {
        console.warn('[SyncManager] Service worker sync failed:', swError);
      }

      console.log('[SyncManager] ✅ Unified sync completed successfully');
    } catch (error) {
      console.error('[SyncManager] ❌ Unified sync failed:', error);
    } finally {
      this.isProcessing = false;
      this.isSyncRequested = false;
      this.syncTimeout = null;

      // Set cooldown before next sync can start
      setTimeout(() => {
        console.log('[SyncManager] Cooldown ended, ready for next sync');
      }, this.SYNC_COOLDOWN);
    }
  }

  /**
   * Check if sync is currently running
   */
  isActive(): boolean {
    return this.isProcessing || this.isSyncRequested;
  }

  /**
   * Get current sync status
   */
  getStatus(): {
    isRequested: boolean;
    isProcessing: boolean;
    isActive: boolean;
  } {
    return {
      isRequested: this.isSyncRequested,
      isProcessing: this.isProcessing,
      isActive: this.isActive()
    };
  }

  /**
   * Cancel any pending sync
   */
  cancelPendingSync(): void {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = null;
    }
    this.isSyncRequested = false;
    console.log('[SyncManager] Pending sync cancelled');
  }

  /**
   * Force sync immediately (bypasses cooldown and deduplication)
   * Use sparingly - only for critical user actions
   */
  async forceSyncNow(source: string = 'manual'): Promise<void> {
    console.log(`[SyncManager] Force sync requested from: ${source}`);
    
    // Cancel any pending sync
    this.cancelPendingSync();
    
    // Wait a moment for cancellation to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Execute immediately
    await this.executeSync();
  }
}

// Export singleton instance
export const syncManager = SyncManager.getInstance();

