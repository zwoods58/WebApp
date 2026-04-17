/**
 * Cache Integration Examples
 * Shows how to integrate the cache layer with existing API endpoints
 */

import { cachedQueries } from './cached-queries';
import { cacheInvalidation } from './cache-invalidation';

// =====================================================
// Example API Route Integration
// =====================================================

/**
 * Example: GET /api/dashboard - Cached dashboard data
 */
export async function getDashboardData(businessId: string, dateRange?: string, forceRefresh = false) {
  try {
    // Use cached queries instead of direct database calls
    const dashboardData = await cachedQueries.getDashboardData(
      businessId, 
      dateRange, 
      forceRefresh
    );

    if (!dashboardData) {
      return {
        success: false,
        error: 'Failed to fetch dashboard data',
        data: null,
      };
    }

    return {
      success: true,
      data: dashboardData,
      cached: !forceRefresh, // Indicates if data came from cache
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Dashboard API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

/**
 * Example: GET /api/transactions - Cached transactions with pagination
 */
export async function getTransactions(
  businessId: string,
  cursor?: string,
  limit = 50,
  filters?: Record<string, any>,
  forceRefresh = false
) {
  try {
    // Use cached queries for transactions
    const result = await cachedQueries.getTransactions(
      businessId,
      cursor,
      limit,
      filters,
      forceRefresh
    );

    return {
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      cached: !forceRefresh,
      count: result.data.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Transactions API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      nextCursor: null,
    };
  }
}

/**
 * Example: POST /api/transactions - Create transaction with cache invalidation
 */
export async function createTransaction(
  businessId: string,
  transactionData: any,
  userId?: string
) {
  try {
    // 1. Create transaction in database (your existing logic)
    const newTransaction = await createTransactionInDatabase(businessId, transactionData);

    if (!newTransaction) {
      return {
        success: false,
        error: 'Failed to create transaction',
        data: null,
      };
    }

    // 2. Invalidate relevant cache
    await cacheInvalidation.invalidateOnDataChange({
      businessId,
      entityType: 'transactions',
      userId,
    });

    // 3. Optionally warm cache for frequently accessed data
    await cacheInvalidation.warmCacheAfterInvalidation(businessId, 'transactions');

    return {
      success: true,
      data: newTransaction,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Create transaction API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

/**
 * Example: PUT /api/transactions/:id - Update transaction with cache invalidation
 */
export async function updateTransaction(
  businessId: string,
  transactionId: string,
  updateData: any,
  userId?: string
) {
  try {
    // 1. Update transaction in database (your existing logic)
    const updatedTransaction = await updateTransactionInDatabase(
      transactionId, 
      updateData
    );

    if (!updatedTransaction) {
      return {
        success: false,
        error: 'Failed to update transaction',
        data: null,
      };
    }

    // 2. Invalidate relevant cache
    await cacheInvalidation.invalidateOnDataChange({
      businessId,
      entityType: 'transactions',
      userId,
    });

    // 3. Optionally warm cache
    await cacheInvalidation.warmCacheAfterInvalidation(businessId, 'transactions');

    return {
      success: true,
      data: updatedTransaction,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Update transaction API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

/**
 * Example: DELETE /api/transactions/:id - Delete transaction with cache invalidation
 */
export async function deleteTransaction(
  businessId: string,
  transactionId: string,
  userId?: string
) {
  try {
    // 1. Delete transaction from database (your existing logic)
    const deleted = await deleteTransactionFromDatabase(transactionId);

    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete transaction',
        data: null,
      };
    }

    // 2. Invalidate relevant cache (more aggressive for DELETE)
    await cacheInvalidation.invalidateOnOperation(
      'DELETE',
      'transactions',
      businessId,
      transactionId
    );

    return {
      success: true,
      data: { id: transactionId, deleted: true },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Delete transaction API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
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

        await cacheInvalidation.invalidateOnOperation(
          eventType as any,
          'transactions',
          businessId,
          entityId
        );

        // Optionally warm cache after a short delay
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          setTimeout(() => {
            cachedQueries.warmBusinessCache(businessId);
          }, 500);
        }
      }
    )
    .subscribe();

  return channel;
}

// =====================================================
// Batch Operations with Cache
// =====================================================

/**
 * Example: Batch create transactions with cache invalidation
 */
export async function batchCreateTransactions(
  businessId: string,
  transactions: any[],
  userId?: string
) {
  try {
    // 1. Batch insert in database (your existing logic)
    const results = await batchInsertTransactionsInDatabase(businessId, transactions);

    // 2. Invalidate cache once for the entire batch
    await cacheInvalidation.invalidateOnDataChange({
      businessId,
      entityType: 'transactions',
      userId,
    });

    // 3. Warm cache for the business
    await cachedQueries.warmBusinessCache(businessId);

    return {
      success: true,
      data: results,
      count: results.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Batch create transactions error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    };
  }
}

// =====================================================
// Helper Functions (replace with your actual database operations)
// =====================================================

async function createTransactionInDatabase(businessId: string, data: any) {
  // Replace with your actual database logic
  console.log('Creating transaction in database:', { businessId, data });
  return { id: 'new-transaction-id', ...data, business_id: businessId };
}

async function updateTransactionInDatabase(transactionId: string, data: any) {
  // Replace with your actual database logic
  console.log('Updating transaction in database:', { transactionId, data });
  return { id: transactionId, ...data, updated_at: new Date().toISOString() };
}

async function deleteTransactionFromDatabase(transactionId: string) {
  // Replace with your actual database logic
  console.log('Deleting transaction from database:', { transactionId });
  return true;
}

async function batchInsertTransactionsInDatabase(businessId: string, transactions: any[]) {
  // Replace with your actual database logic
  console.log('Batch inserting transactions:', { businessId, count: transactions.length });
  return transactions.map((t, i) => ({ id: `batch-${i}`, ...t, business_id: businessId }));
}

// =====================================================
// Usage Examples
// =====================================================

/*
// In your API route (e.g., src/app/api/dashboard/route.ts):

import { getDashboardData } from '@/lib/cache/cache-integration-example';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  const dateRange = searchParams.get('dateRange');
  const forceRefresh = searchParams.get('forceRefresh') === 'true';

  if (!businessId) {
    return Response.json({ error: 'businessId required' }, { status: 400 });
  }

  const result = await getDashboardData(businessId, dateRange || undefined, forceRefresh);
  
  return Response.json(result, {
    status: result.success ? 200 : 500,
    headers: {
      'Cache-Control': 'no-cache', // Let the cache layer handle caching
    },
  });
}

// In your API route for creating transactions (e.g., src/app/api/transactions/route.ts):

import { createTransaction } from '@/lib/cache/cache-integration-example';

export async function POST(request: Request) {
  const body = await request.json();
  const { businessId, ...transactionData } = body;

  if (!businessId) {
    return Response.json({ error: 'businessId required' }, { status: 400 });
  }

  const result = await createTransaction(businessId, transactionData);
  
  return Response.json(result, {
    status: result.success ? 201 : 500,
  });
}
*/

