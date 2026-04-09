/**
 * Supabase Cache Invalidation Service
 * Handles cache invalidation for Supabase native cache
 */

import { supabaseCache, CACHE_KEYS } from './supabase-cache';
import { supabaseCachedQueries } from './supabase-cached-queries';

export interface CacheInvalidationOptions {
  businessId: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  operation?: 'CREATE' | 'UPDATE' | 'DELETE';
  metadata?: Record<string, any>;
}

export class SupabaseCacheInvalidationService {
  // Invalidate cache based on data changes
  async invalidateOnDataChange(options: CacheInvalidationOptions): Promise<void> {
    const { businessId, entityType, entityId, userId, operation, metadata } = options;

    try {
      console.log(`Invalidating cache for ${entityType} in business ${businessId}`);

      // Invalidate based on entity type
      switch (entityType) {
        case 'transactions':
          await this.invalidateTransactionCache(businessId);
          break;
        case 'expenses':
          await this.invalidateExpenseCache(businessId);
          break;
        case 'appointments':
          await this.invalidateAppointmentCache(businessId);
          break;
        case 'inventory':
          await this.invalidateInventoryCache(businessId);
          break;
        case 'credit':
          await this.invalidateCreditCache(businessId);
          break;
        case 'business':
          await this.invalidateBusinessCache(businessId);
          break;
        default:
          await this.invalidateAllBusinessCache(businessId);
      }

      // Log the invalidation for monitoring
      console.log(`Cache invalidated for ${entityType}:${entityId || 'all'} in business ${businessId}`);
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  // Invalidate transaction cache
  private async invalidateTransactionCache(businessId: string): Promise<void> {
    try {
      // Delete transaction-related cache
      await supabaseCache.deleteByPrefix(CACHE_KEYS.TRANSACTIONS);
      
      // Also invalidate dashboard data as it includes transaction summaries
      await supabaseCache.deleteByPrefix(CACHE_KEYS.DASHBOARD);
      
      // Invalidate business data that might include transaction counts
      await supabaseCache.deletePattern(`%:${businessId}%`);
    } catch (error) {
      console.error('Transaction cache invalidation error:', error);
    }
  }

  // Invalidate expense cache
  private async invalidateExpenseCache(businessId: string): Promise<void> {
    try {
      await supabaseCache.deleteByPrefix(CACHE_KEYS.EXPENSES);
      await supabaseCache.deleteByPrefix(CACHE_KEYS.DASHBOARD);
      await supabaseCache.deletePattern(`%:${businessId}%`);
    } catch (error) {
      console.error('Expense cache invalidation error:', error);
    }
  }

  // Invalidate appointment cache
  private async invalidateAppointmentCache(businessId: string): Promise<void> {
    try {
      await supabaseCache.deleteByPrefix(CACHE_KEYS.APPOINTMENTS);
      await supabaseCache.deleteByPrefix(CACHE_KEYS.DASHBOARD);
      await supabaseCache.deletePattern(`%:${businessId}%`);
    } catch (error) {
      console.error('Appointment cache invalidation error:', error);
    }
  }

  // Invalidate inventory cache
  private async invalidateInventoryCache(businessId: string): Promise<void> {
    try {
      await supabaseCache.deleteByPrefix(CACHE_KEYS.INVENTORY);
      await supabaseCache.deleteByPrefix(CACHE_KEYS.DASHBOARD);
      await supabaseCache.deletePattern(`%:${businessId}%`);
    } catch (error) {
      console.error('Inventory cache invalidation error:', error);
    }
  }

  // Invalidate credit cache
  private async invalidateCreditCache(businessId: string): Promise<void> {
    try {
      await supabaseCache.deleteByPrefix(CACHE_KEYS.CREDIT);
      await supabaseCache.deleteByPrefix(CACHE_KEYS.DASHBOARD);
      await supabaseCache.deletePattern(`%:${businessId}%`);
    } catch (error) {
      console.error('Credit cache invalidation error:', error);
    }
  }

  // Invalidate business cache
  private async invalidateBusinessCache(businessId: string): Promise<void> {
    try {
      await supabaseCache.deleteByPrefix(CACHE_KEYS.BUSINESS);
      await supabaseCache.deleteByPrefix(CACHE_KEYS.DASHBOARD);
      await supabaseCache.deletePattern(`%:${businessId}%`);
    } catch (error) {
      console.error('Business cache invalidation error:', error);
    }
  }

  // Invalidate all business cache
  private async invalidateAllBusinessCache(businessId: string): Promise<void> {
    try {
      await supabaseCache.invalidateBusinessCache(businessId);
    } catch (error) {
      console.error('All business cache invalidation error:', error);
    }
  }

  // Invalidate cache based on operation type
  async invalidateOnOperation(
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    entityType: string,
    businessId: string,
    entityId?: string
  ): Promise<void> {
    const options: CacheInvalidationOptions = {
      businessId,
      entityType,
      entityId,
      operation,
    };

    await this.invalidateOnDataChange(options);
  }

  // Warm cache after invalidation
  async warmCacheAfterInvalidation(businessId: string, entityType?: string): Promise<void> {
    try {
      // Wait a short moment for the invalidation to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Warm cache based on entity type
      switch (entityType) {
        case 'transactions':
          await this.warmTransactionCache(businessId);
          break;
        case 'expenses':
          await this.warmExpenseCache(businessId);
          break;
        case 'appointments':
          await this.warmAppointmentCache(businessId);
          break;
        default:
          await supabaseCachedQueries.warmBusinessCache(businessId);
      }

      console.log(`Cache warmed for ${entityType || 'all'} in business ${businessId}`);
    } catch (error) {
      console.error('Cache warming after invalidation error:', error);
    }
  }

  // Warm transaction cache
  private async warmTransactionCache(businessId: string): Promise<void> {
    try {
      // Warm recent transactions
      await supabaseCachedQueries.getTransactions(businessId, undefined, 50);
      
      // Warm dashboard data that includes transaction summaries
      await supabaseCachedQueries.getDashboardData(businessId);
      
      // Warm quick stats
      await supabaseCachedQueries.getQuickStats(businessId);
    } catch (error) {
      console.error('Transaction cache warming error:', error);
    }
  }

  // Warm expense cache
  private async warmExpenseCache(businessId: string): Promise<void> {
    try {
      await supabaseCachedQueries.getExpenses(businessId, undefined, 50);
      await supabaseCachedQueries.getDashboardData(businessId);
    } catch (error) {
      console.error('Expense cache warming error:', error);
    }
  }

  // Warm appointment cache
  private async warmAppointmentCache(businessId: string): Promise<void> {
    try {
      await supabaseCachedQueries.getAppointments(businessId, undefined, 50);
      await supabaseCachedQueries.getDashboardData(businessId);
    } catch (error) {
      console.error('Appointment cache warming error:', error);
    }
  }

  // Invalidate multiple businesses
  async invalidateMultipleBusinesses(businessIds: string[], entityType = 'all'): Promise<void> {
    try {
      const invalidationPromises = businessIds.map(async (businessId) => {
        if (entityType === 'all') {
          await this.invalidateAllBusinessCache(businessId);
        } else {
          await this.invalidateOnOperation('UPDATE', entityType, businessId);
        }
      });

      await Promise.allSettled(invalidationPromises);
      console.log(`Cache invalidated for ${businessIds.length} businesses, entity type: ${entityType}`);
    } catch (error) {
      console.error('Multiple business cache invalidation error:', error);
    }
  }

  // Clean up expired cache entries
  async cleanupExpiredCache(): Promise<number> {
    try {
      const deletedCount = await supabaseCache.cleanup();
      console.log(`Cleaned up ${deletedCount} expired cache entries`);
      return deletedCount;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }

  // Get invalidation statistics
  getInvalidationStats(): {
    totalInvalidations: number;
    invalidationsByType: Record<string, number>;
    lastInvalidation: string | null;
  } {
    // This would typically be stored in a database or memory
    // For now, returning placeholder data
    return {
      totalInvalidations: 0,
      invalidationsByType: {},
      lastInvalidation: null,
    };
  }

  // Smart invalidation based on data dependencies
  async smartInvalidate(
    businessId: string,
    changedData: {
      type: string;
      id?: string;
      impact?: 'high' | 'medium' | 'low';
    }
  ): Promise<void> {
    try {
      const { type, id, impact = 'medium' } = changedData;

      switch (impact) {
        case 'high':
          // High impact: invalidate all cache for the business
          await this.invalidateAllBusinessCache(businessId);
          break;
        case 'medium':
          // Medium impact: invalidate related cache
          await this.invalidateOnDataChange({
            businessId,
            entityType: type,
            entityId: id,
          });
          break;
        case 'low':
          // Low impact: invalidate only specific cache
          await this.invalidateSpecificCache(businessId, type, id);
          break;
      }

      // Warm cache if needed
      if (impact !== 'low') {
        setTimeout(() => {
          this.warmCacheAfterInvalidation(businessId, type);
        }, 500);
      }
    } catch (error) {
      console.error('Smart cache invalidation error:', error);
    }
  }

  // Invalidate specific cache entries
  private async invalidateSpecificCache(businessId: string, type: string, id?: string): Promise<void> {
    try {
      if (id) {
        // Invalidate specific entity cache
        await supabaseCache.deletePattern(`%:${businessId}:${id}%`);
      } else {
        // Invalidate type-specific cache
        await this.invalidateOnDataChange({
          businessId,
          entityType: type,
        });
      }
    } catch (error) {
      console.error('Specific cache invalidation error:', error);
    }
  }

  // Batch invalidation for multiple operations
  async batchInvalidate(operations: CacheInvalidationOptions[]): Promise<void> {
    try {
      // Group operations by business to optimize
      const operationsByBusiness = operations.reduce((acc, op) => {
        if (!acc[op.businessId]) {
          acc[op.businessId] = [];
        }
        acc[op.businessId].push(op);
        return acc;
      }, {} as Record<string, CacheInvalidationOptions[]>);

      // Process each business
      for (const [businessId, businessOps] of Object.entries(operationsByBusiness)) {
        // Determine if we need full invalidation
        const hasHighImpact = businessOps.some(op => op.metadata?.impact === 'high');
        
        if (hasHighImpact) {
          await this.invalidateAllBusinessCache(businessId);
        } else {
          // Process individual operations
          await Promise.allSettled(
            businessOps.map(op => this.invalidateOnDataChange(op))
          );
        }
      }

      console.log(`Batch cache invalidation completed for ${operations.length} operations`);
    } catch (error) {
      console.error('Batch cache invalidation error:', error);
    }
  }
}

// Export singleton instance
export const supabaseCacheInvalidation = new SupabaseCacheInvalidationService();
export default supabaseCacheInvalidation;
