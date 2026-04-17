/**
 * Supabase Cache Integration Examples
 * Shows how to integrate Supabase native caching with API endpoints
 */

import { supabaseCachedQueries } from './supabase-cached-queries';
import { supabaseCacheInvalidation } from './supabase-cache-invalidation';

// =====================================================
// API Endpoint Examples
// =====================================================

/**
 * Example: GET /api/dashboard/{businessId}
 */
export async function getDashboardData(businessId: string, dateRange?: string, forceRefresh = false) {
  try {
    const result = await supabaseCachedQueries.getDashboardData(businessId, dateRange, forceRefresh);
    
    return {
      success: true,
      data: result,
      cached: !forceRefresh,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return {
      success: false,
      error: 'Failed to fetch dashboard data',
    };
  }
}

/**
 * Example: GET /api/transactions/{businessId}
 */
export async function getTransactions(
  businessId: string, 
  cursor?: string, 
  limit = 50, 
  filters?: Record<string, any>,
  forceRefresh = false
) {
  try {
    const result = await supabaseCachedQueries.getTransactions(businessId, cursor, limit, filters, forceRefresh);
    
    return {
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      cached: !forceRefresh,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return {
      success: false,
      error: 'Failed to fetch transactions',
    };
  }
}

/**
 * Example: POST /api/transactions/{businessId}
 */
export async function createTransaction(businessId: string, transactionData: any, userId?: string) {
  try {
    // 1. Create transaction in database
    const newTransaction = await createTransactionInDatabase(businessId, transactionData);
    
    // 2. Invalidate cache
    await supabaseCacheInvalidation.invalidateOnDataChange({
      businessId,
      entityType: 'transactions',
      entityId: newTransaction.id,
      userId,
      operation: 'CREATE',
    });
    
    // 3. Warm cache after short delay
    setTimeout(async () => {
      await supabaseCacheInvalidation.warmCacheAfterInvalidation(businessId, 'transactions');
    }, 500);
    
    return {
      success: true,
      data: newTransaction,
      message: 'Transaction created successfully',
    };
  } catch (error) {
    console.error('Transaction creation error:', error);
    return {
      success: false,
      error: 'Failed to create transaction',
    };
  }
}

/**
 * Example: PUT /api/transactions/{businessId}/{transactionId}
 */
export async function updateTransaction(
  businessId: string, 
  transactionId: string, 
  updateData: any, 
  userId?: string
) {
  try {
    // 1. Update transaction in database
    const updatedTransaction = await updateTransactionInDatabase(transactionId, updateData);
    
    // 2. Invalidate cache
    await supabaseCacheInvalidation.invalidateOnDataChange({
      businessId,
      entityType: 'transactions',
      entityId: transactionId,
      userId,
      operation: 'UPDATE',
    });
    
    // 3. Warm cache after short delay
    setTimeout(async () => {
      await supabaseCacheInvalidation.warmCacheAfterInvalidation(businessId, 'transactions');
    }, 500);
    
    return {
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully',
    };
  } catch (error) {
    console.error('Transaction update error:', error);
    return {
      success: false,
      error: 'Failed to update transaction',
    };
  }
}

/**
 * Example: DELETE /api/transactions/{businessId}/{transactionId}
 */
export async function deleteTransaction(businessId: string, transactionId: string, userId?: string) {
  try {
    // 1. Delete transaction from database
    await deleteTransactionFromDatabase(transactionId);
    
    // 2. Invalidate cache
    await supabaseCacheInvalidation.invalidateOnDataChange({
      businessId,
      entityType: 'transactions',
      entityId: transactionId,
      userId,
      operation: 'DELETE',
    });
    
    return {
      success: true,
      message: 'Transaction deleted successfully',
    };
  } catch (error) {
    console.error('Transaction deletion error:', error);
    return {
      success: false,
      error: 'Failed to delete transaction',
    };
  }
}

// =====================================================
// Real-time Data Integration
// =====================================================

/**
 * Example: Real-time subscription with cache updates
 */
export async function setupRealtimeWithCache(businessId: string) {
  // Import supabase dynamically
  const { supabase } = await import('@/lib/supabase');
  
  // Subscribe to realtime changes
  const channel = supabase
    .channel(`business-${businessId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `business_id=eq.${businessId}`,
      },
      async (payload: any) => {
        console.log('Realtime transaction change:', payload);

        // Invalidate cache based on event type
        const eventType = payload.eventType; // INSERT, UPDATE, DELETE
        const entityId = payload.new?.id || payload.old?.id;

        await supabaseCacheInvalidation.invalidateOnOperation(
          eventType as any,
          'transactions',
          businessId,
          entityId
        );

        // Optionally warm cache after a short delay
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          setTimeout(() => {
            supabaseCachedQueries.warmBusinessCache(businessId);
          }, 500);
        }
      }
    )
    .subscribe();

  return channel;
}

// =====================================================
// Batch Operations
// =====================================================

/**
 * Example: Batch transaction creation
 */
export async function batchCreateTransactions(businessId: string, transactions: any[], userId?: string) {
  try {
    // 1. Batch insert transactions
    const newTransactions = await batchInsertTransactionsInDatabase(businessId, transactions);
    
    // 2. Invalidate cache once for all transactions
    await supabaseCacheInvalidation.invalidateOnDataChange({
      businessId,
      entityType: 'transactions',
      userId,
      operation: 'CREATE',
    });
    
    // 3. Warm cache after short delay
    setTimeout(async () => {
      await supabaseCachedQueries.warmBusinessCache(businessId);
    }, 500);
    
    return {
      success: true,
      data: newTransactions,
      count: newTransactions.length,
      message: `${newTransactions.length} transactions created successfully`,
    };
  } catch (error) {
    console.error('Batch transaction creation error:', error);
    return {
      success: false,
      error: 'Failed to create transactions',
    };
  }
}

/**
 * Example: Smart cache invalidation based on impact
 */
export async function smartDataChange(
  businessId: string,
  changeType: string,
  changeData: any,
  userId?: string
) {
  try {
    // Determine impact level
    let impact: 'high' | 'medium' | 'low' = 'medium';
    
    switch (changeType) {
      case 'business_settings':
        impact = 'high'; // Business settings affect everything
        break;
      case 'pricing':
        impact = 'medium'; // Pricing affects reports and analytics
        break;
      case 'customer_info':
        impact = 'low'; // Customer info changes are localized
        break;
      default:
        impact = 'medium';
    }
    
    // Use smart invalidation
    await supabaseCacheInvalidation.smartInvalidate(businessId, {
      type: changeType,
      id: changeData.id,
      impact,
    });
    
    return {
      success: true,
      message: `Cache invalidated with ${impact} impact`,
    };
  } catch (error) {
    console.error('Smart cache invalidation error:', error);
    return {
      success: false,
      error: 'Failed to invalidate cache',
    };
  }
}

// =====================================================
// Cache Management
// =====================================================

/**
 * Example: Manual cache warming for a business
 */
export async function warmBusinessCacheManually(businessId: string) {
  try {
    console.log(`Starting manual cache warming for business: ${businessId}`);
    
    // Warm all frequently accessed data
    await supabaseCachedQueries.warmBusinessCache(businessId);
    
    // Get cache statistics
    const stats = supabaseCachedQueries.getCacheStats();
    
    return {
      success: true,
      message: 'Cache warming completed',
      stats,
    };
  } catch (error) {
    console.error('Manual cache warming error:', error);
    return {
      success: false,
      error: 'Failed to warm cache',
    };
  }
}

/**
 * Example: Cache cleanup
 */
export async function cleanupExpiredCache() {
  try {
    const deletedCount = await supabaseCachedQueries.cleanupExpiredCache();
    
    return {
      success: true,
      deletedCount,
      message: `Cleaned up ${deletedCount} expired cache entries`,
    };
  } catch (error) {
    console.error('Cache cleanup error:', error);
    return {
      success: false,
      error: 'Failed to cleanup cache',
    };
  }
}

/**
 * Example: Get cache health information
 */
export async function getCacheHealthInfo() {
  try {
    const healthInfo = await supabaseCachedQueries.getCacheHealthInfo();
    const stats = supabaseCachedQueries.getCacheStats();
    
    return {
      success: true,
      health: healthInfo,
      stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Cache health info error:', error);
    return {
      success: false,
      error: 'Failed to get cache health info',
    };
  }
}

// =====================================================
// Helper Functions (replace with your actual database operations)
// =====================================================

async function createTransactionInDatabase(businessId: string, data: any) {
  // Replace with your actual database insertion logic
  const { supabase } = await import('@/lib/supabase');
  const { data: result, error } = await supabase
    .from('transactions')
    .insert({
      ...data,
      business_id: businessId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

async function updateTransactionInDatabase(transactionId: string, data: any) {
  // Replace with your actual database update logic
  const { supabase } = await import('@/lib/supabase');
  const { data: result, error } = await supabase
    .from('transactions')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

async function deleteTransactionFromDatabase(transactionId: string) {
  // Replace with your actual database deletion logic
  const { supabase } = await import('@/lib/supabase');
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId);
  
  if (error) throw error;
}

async function batchInsertTransactionsInDatabase(businessId: string, transactions: any[]) {
  // Replace with your actual batch insertion logic
  const { supabase } = await import('@/lib/supabase');
  const transactionsWithBusiness = transactions.map(t => ({
    ...t,
    business_id: businessId,
    created_at: new Date().toISOString(),
  }));
  
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionsWithBusiness)
    .select();
  
  if (error) throw error;
  return data;
}

// =====================================================
// Usage Examples
// =====================================================

/*
// Example API Route Usage:
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  const forceRefresh = searchParams.get('forceRefresh') === 'true';

  if (!businessId) {
    return Response.json({ error: 'Business ID required' }, { status: 400 });
  }

  const result = await getDashboardData(businessId, undefined, forceRefresh);
  return Response.json(result);
}

// Example Real-time Setup:
const channel = await setupRealtimeWithCache('business-123');
// Channel will automatically handle cache invalidation

// Example Cache Management:
const healthInfo = await getCacheHealthInfo();
console.log('Cache health:', healthInfo);

const cleanupResult = await cleanupExpiredCache();
console.log('Cleanup result:', cleanupResult);
*/

