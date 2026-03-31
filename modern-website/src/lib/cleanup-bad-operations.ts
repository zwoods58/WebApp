import { db } from './database';

/**
 * One-time cleanup utility to remove bad operations from previous sessions
 * that will keep failing even after fixes are deployed.
 * 
 * This should run ONCE at app initialization BEFORE sync manager starts.
 */
export async function cleanupBadOperations(): Promise<void> {
  console.log('[Cleanup] Starting cleanup of bad operations...');
  
  try {
    // Get all pending operations
    const pendingOps = await db.operations_queue
      .where('status')
      .equals('pending')
      .toArray();
    
    if (pendingOps.length === 0) {
      console.log('[Cleanup] No pending operations to check');
      return;
    }
    
    console.log(`[Cleanup] Checking ${pendingOps.length} pending operations for bad patterns...`);
    
    let cleanedCount = 0;
    const cleanupReasons: Record<string, number> = {
      missing_currency: 0,
      invalid_due_date: 0,
      internal_fields: 0,
    };
    
    for (const operation of pendingOps) {
      let shouldCleanup = false;
      let reason = '';
      
      // Check for transactions missing currency field
      if (operation.table === 'transactions' && operation.type === 'CREATE') {
        if (!operation.data?.currency) {
          shouldCleanup = true;
          reason = 'missing_currency';
          cleanupReasons.missing_currency++;
        }
      }
      
      // Check for transactions with invalid due_date field
      if (operation.table === 'transactions' && operation.data?.due_date) {
        shouldCleanup = true;
        reason = 'invalid_due_date';
        cleanupReasons.invalid_due_date++;
      }
      
      // Check for internal fields that shouldn't be synced
      if (operation.data?._pendingUpdate || operation.data?._offlineId) {
        shouldCleanup = true;
        reason = 'internal_fields';
        cleanupReasons.internal_fields++;
      }
      
      // Mark as failed if bad pattern detected
      if (shouldCleanup) {
        await db.operations_queue.update(operation.id, {
          status: 'failed',
          errorMessage: `Cleaned up pre-fix: ${reason}`,
          retryCount: 999, // High number to indicate it was cleaned up
        });
        cleanedCount++;
        console.log(`[Cleanup] Marked operation ${operation.id} as failed (${reason})`);
      }
    }
    
    console.log(`[Cleanup] ✅ Cleanup complete: ${cleanedCount} operations marked as failed`);
    console.log('[Cleanup] Breakdown:', cleanupReasons);
    
    if (cleanedCount > 0) {
      console.log('[Cleanup] These operations will no longer retry and cause errors');
    }
    
  } catch (error) {
    console.error('[Cleanup] ❌ Failed to cleanup bad operations:', error);
  }
}

/**
 * Alternative: Console command for manual cleanup
 * Run this in browser console: await window.cleanupBadOperations()
 */
if (typeof window !== 'undefined') {
  (window as any).cleanupBadOperations = cleanupBadOperations;
}
