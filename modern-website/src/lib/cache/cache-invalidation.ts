import { cache } from './redis-cache';
import { cachedQueries } from './cached-queries';

/**
 * Cache Invalidation Service
 * Handles cache invalidation when data changes
 */

export interface CacheInvalidationOptions {
  businessId: string;
  userId?: string;
  entityType?: 'transactions' | 'expenses' | 'appointments' | 'inventory' | 'credit' | 'business' | 'all';
  entityId?: string;
}

export class CacheInvalidationService {
  /**
   * Invalidate cache when data changes
   */
  async invalidateOnDataChange(options: CacheInvalidationOptions): Promise<void> {
    const { businessId, entityType = 'all', userId } = options;

    try {
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
        case 'all':
        default:
          await this.invalidateAllBusinessCache(businessId);
          break;
      }

      console.log(`Cache invalidated for ${entityType} in business ${businessId}`, {
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Cache invalidation failed:', error);
    }
  }

  /**
   * Invalidate transaction-related cache
   */
  private async invalidateTransactionCache(businessId: string): Promise<void> {
    // Invalidate transaction caches
    await cache.deletePattern(`transactions:${businessId}*`);
    
    // Invalidate dashboard and business data (depends on transactions)
    await cache.deletePattern(`dashboard:${businessId}*`);
    await cache.deletePattern(`business:*${businessId}*`);
    
    // Invalidate quick stats (real-time data)
    await cache.deletePattern(`business:quick_stats:${businessId}`);
    
    // Invalidate daily and monthly summaries
    await cache.deletePattern(`business:daily_summaries:${businessId}*`);
    await cache.deletePattern(`business:monthly_report:${businessId}*`);
    await cache.deletePattern(`business:monthly_metrics:${businessId}*`);
  }

  /**
   * Invalidate expense-related cache
   */
  private async invalidateExpenseCache(businessId: string): Promise<void> {
    // Invalidate expense caches
    await cache.deletePattern(`expenses:${businessId}*`);
    
    // Invalidate dashboard and business data (depends on expenses)
    await cache.deletePattern(`dashboard:${businessId}*`);
    await cache.deletePattern(`business:*${businessId}*`);
    
    // Invalidate monthly reports
    await cache.deletePattern(`business:monthly_report:${businessId}*`);
  }

  /**
   * Invalidate appointment-related cache
   */
  private async invalidateAppointmentCache(businessId: string): Promise<void> {
    // Invalidate appointment caches
    await cache.deletePattern(`appointments:${businessId}*`);
    
    // Invalidate business data (might depend on appointments)
    await cache.deletePattern(`business:*${businessId}*`);
  }

  /**
   * Invalidate inventory-related cache
   */
  private async invalidateInventoryCache(businessId: string): Promise<void> {
    // Invalidate inventory caches
    await cache.deletePattern(`inventory:${businessId}*`);
    
    // Invalidate business data (might depend on inventory)
    await cache.deletePattern(`business:*${businessId}*`);
  }

  /**
   * Invalidate credit-related cache
   */
  private async invalidateCreditCache(businessId: string): Promise<void> {
    // Invalidate credit caches
    await cache.deletePattern(`credit:${businessId}*`);
    
    // Invalidate dashboard and business data (depends on credit)
    await cache.deletePattern(`dashboard:${businessId}*`);
    await cache.deletePattern(`business:*${businessId}*`);
    
    // Invalidate customer analytics
    await cache.deletePattern(`business:customer_analytics:${businessId}*`);
  }

  /**
   * Invalidate business-related cache
   */
  private async invalidateBusinessCache(businessId: string): Promise<void> {
    await cache.invalidateBusinessCache(businessId);
  }

  /**
   * Invalidate all cache for a business
   */
  private async invalidateAllBusinessCache(businessId: string): Promise<void> {
    await cache.invalidateBusinessCache(businessId);
  }

  /**
   * Smart invalidation based on operation type
   */
  async invalidateOnOperation(
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    entityType: string,
    businessId: string,
    entityId?: string
  ): Promise<void> {
    // For DELETE operations, be more aggressive with invalidation
    if (operation === 'DELETE') {
      await this.invalidateOnDataChange({
        businessId,
        entityType: entityType as any,
        entityId,
      });
      return;
    }

    // For CREATE and UPDATE, be more targeted
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
      default:
        await this.invalidateAllBusinessCache(businessId);
        break;
    }
  }

  /**
   * Warm cache after invalidation (for frequently accessed data)
   */
  async warmCacheAfterInvalidation(businessId: string, entityType?: string): Promise<void> {
    // Don't warm cache immediately after invalidation to avoid race conditions
    // Use a small delay to ensure the data change is committed
    setTimeout(async () => {
      try {
        await cachedQueries.warmBusinessCache(businessId);
        console.log(`Cache warmed after invalidation for business: ${businessId}`);
      } catch (error) {
        console.error('Cache warming after invalidation failed:', error);
      }
    }, 1000); // 1 second delay
  }

  /**
   * Batch invalidation for multiple businesses
   */
  async invalidateMultipleBusinesses(businessIds: string[], entityType = 'all'): Promise<void> {
    const promises = businessIds.map(businessId =>
      this.invalidateOnDataChange({
        businessId,
        entityType: entityType as any,
      })
    );

    await Promise.all(promises);
    console.log(`Batch cache invalidation completed for ${businessIds.length} businesses`);
  }

  /**
   * Periodic cache cleanup for expired entries
   */
  async cleanupExpiredCache(): Promise<void> {
    try {
      // Redis handles TTL automatically, but we can clean up any manual patterns
      const patterns = [
        'transactions:*',
        'expenses:*',
        'appointments:*',
        'dashboard:*',
        'business:*',
      ];

      for (const pattern of patterns) {
        // This is a placeholder for any additional cleanup logic
        // Redis automatically removes expired keys
      }

      console.log('Cache cleanup completed');
    } catch (error) {
      console.error('Cache cleanup failed:', error);
    }
  }

  /**
   * Get cache invalidation statistics
   */
  getInvalidationStats(): {
    totalInvalidations: number;
    invalidationsByType: Record<string, number>;
    lastInvalidation: string | null;
  } {
    // This would track invalidation statistics
    // For now, return placeholder data
    return {
      totalInvalidations: 0,
      invalidationsByType: {},
      lastInvalidation: null,
    };
  }
}

// Export singleton instance
export const cacheInvalidation = new CacheInvalidationService();
export default cacheInvalidation;

