import { cache, CACHE_TTL, CACHE_KEYS } from './redis-cache';
import { BeezeeDatabase } from '../database';

/**
 * Cached Database Queries
 * Integrates Redis caching with existing database operations
 */

export interface CacheQueryOptions {
  businessId: string;
  userId?: string;
  endpoint?: string;
  forceRefresh?: boolean;
  filters?: Record<string, any>;
}

export class CachedDatabaseQueries {
  private db: BeezeeDatabase;

  constructor() {
    this.db = new BeezeeDatabase();
  }

  /**
   * Log cache event to database for tracking
   */
  private async logCacheEvent(
    cacheKey: string,
    hit: boolean,
    ttl?: number,
    options?: CacheQueryOptions
  ): Promise<void> {
    try {
      const prefix = cacheKey.split(':')[0] + ':';
      const identifier = cacheKey.split(':').slice(1).join(':');

      // This would call the database function we created in the migration
      // For now, we'll just log to console in a real implementation
      console.log(`Cache ${hit ? 'HIT' : 'MISS'}: ${cacheKey}`, {
        prefix,
        identifier,
        businessId: options?.businessId,
        userId: options?.userId,
        endpoint: options?.endpoint,
      });
    } catch (error) {
      console.error('Failed to log cache event:', error);
    }
  }

  /**
   * Get business data with caching
   */
  async getBusinessData(businessId: string, forceRefresh = false): Promise<any> {
    const cacheKey = cache.generateKey(CACHE_KEYS.BUSINESS, businessId);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { businessId });
        return cached;
      }
    }

    // Fetch from database
    const data = await this.db.getBusinessSummaryOptimized(businessId);
    
    if (data) {
      await cache.setBusinessData(businessId, data);
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.BUSINESS_DATA, { businessId });
    }

    return data;
  }

  /**
   * Get dashboard data with caching
   */
  async getDashboardData(businessId: string, dateRange?: string, forceRefresh = false): Promise<any> {
    const identifier = dateRange ? `${businessId}:${dateRange}` : businessId;
    const cacheKey = cache.generateKey(CACHE_KEYS.DASHBOARD, identifier);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { businessId, endpoint: 'dashboard' });
        return cached;
      }
    }

    // Fetch from database
    const data = await this.db.getDashboardDataOptimized(businessId);
    
    if (data) {
      await cache.setDashboardData(businessId, data, dateRange);
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.DASHBOARD_DATA, { 
        businessId, 
        endpoint: 'dashboard' 
      });
    }

    return data;
  }

  /**
   * Get transactions with caching
   */
  async getTransactions(
    businessId: string, 
    cursor?: string, 
    limit = 50, 
    filters?: Record<string, any>,
    forceRefresh = false
  ): Promise<{ data: any[], nextCursor: string | null }> {
    const filterString = filters ? JSON.stringify(filters) : '';
    const identifier = `${businessId}:${cursor || 'first'}:${limit}:${filterString}`;
    const cacheKey = cache.generateKey(CACHE_KEYS.TRANSACTIONS, identifier);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'transactions' 
        });
        return cached as { data: any[], nextCursor: string | null };
      }
    }

    // Fetch from database
    const result = await this.db.getTransactionsCursor(businessId, cursor, limit);
    
    if (result.data && result.data.length > 0) {
      await cache.setTransactions(businessId, result.data, { cursor, limit, ...filters });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.TRANSACTIONS, { 
        businessId, 
        endpoint: 'transactions' 
      });
    }

    return {
      data: result.data || [],
      nextCursor: result.nextCursor || null
    };
  }

  /**
   * Get expenses with caching
   */
  async getExpenses(
    businessId: string, 
    cursor?: string, 
    limit = 50, 
    filters?: Record<string, any>,
    forceRefresh = false
  ): Promise<{ data: any[], nextCursor: string | null }> {
    const filterString = filters ? JSON.stringify(filters) : '';
    const identifier = `${businessId}:${cursor || 'first'}:${limit}:${filterString}`;
    const cacheKey = cache.generateKey(CACHE_KEYS.EXPENSES, identifier);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'expenses' 
        });
        return cached as { data: any[], nextCursor: string | null };
      }
    }

    // Fetch from database
    const result = await this.db.getExpensesCursor(businessId, cursor, limit);
    
    if (result.data && result.data.length > 0) {
      await cache.setExpenses(businessId, result.data, { cursor, limit, ...filters });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.EXPENSES, { 
        businessId, 
        endpoint: 'expenses' 
      });
    }

    return {
      data: result.data || [],
      nextCursor: result.nextCursor || null
    };
  }

  /**
   * Get appointments with caching
   */
  async getAppointments(
    businessId: string, 
    cursor?: string, 
    limit = 50, 
    filters?: Record<string, any>,
    forceRefresh = false
  ): Promise<{ data: any[], nextCursor: string | null }> {
    const filterString = filters ? JSON.stringify(filters) : '';
    const identifier = `${businessId}:${cursor || 'first'}:${limit}:${filterString}`;
    const cacheKey = cache.generateKey(CACHE_KEYS.APPOINTMENTS, identifier);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'appointments' 
        });
        return cached as { data: any[], nextCursor: string | null };
      }
    }

    // Fetch from database
    const result = await this.db.getAppointmentsCursor(businessId, cursor, limit);
    
    if (result.data && result.data.length > 0) {
      await cache.set(cacheKey, result.data, { ttl: CACHE_TTL.APPOINTMENTS });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.APPOINTMENTS, { 
        businessId, 
        endpoint: 'appointments' 
      });
    }

    return {
      data: result.data || [],
      nextCursor: result.nextCursor || null
    };
  }

  /**
   * Get monthly report with caching
   */
  async getMonthlyReport(
    businessId: string, 
    year: number, 
    month: number, 
    forceRefresh = false
  ): Promise<any> {
    const identifier = `${businessId}:${year}:${month}`;
    const cacheKey = cache.generateKey(CACHE_KEYS.BUSINESS, `monthly_report:${identifier}`);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'monthly_report' 
        });
        return cached;
      }
    }

    // Fetch from database
    const data = await this.db.getMonthlyReportOptimized(businessId, year, month);
    
    if (data) {
      await cache.set(cacheKey, data, { ttl: CACHE_TTL.BUSINESS_DATA });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.BUSINESS_DATA, { 
        businessId, 
        endpoint: 'monthly_report' 
      });
    }

    return data;
  }

  /**
   * Get customer analytics with caching
   */
  async getCustomerAnalytics(
    businessId: string, 
    limit = 50, 
    forceRefresh = false
  ): Promise<any> {
    const identifier = `${businessId}:${limit}`;
    const cacheKey = cache.generateKey(CACHE_KEYS.BUSINESS, `customer_analytics:${identifier}`);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'customer_analytics' 
        });
        return cached;
      }
    }

    // Fetch from database
    const data = await this.db.getCustomerAnalyticsOptimized(businessId, limit);
    
    if (data) {
      await cache.set(cacheKey, data, { ttl: CACHE_TTL.BUSINESS_DATA });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.BUSINESS_DATA, { 
        businessId, 
        endpoint: 'customer_analytics' 
      });
    }

    return data;
  }

  /**
   * Get quick stats with caching (shorter TTL for real-time feel)
   */
  async getQuickStats(businessId: string, forceRefresh = false): Promise<any> {
    const cacheKey = cache.generateKey(CACHE_KEYS.BUSINESS, `quick_stats:${businessId}`);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'quick_stats' 
        });
        return cached;
      }
    }

    // Fetch from database
    const data = await this.db.getQuickStatsOptimized(businessId);
    
    if (data) {
      await cache.set(cacheKey, data, { ttl: CACHE_TTL.REALTIME_DATA });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.REALTIME_DATA, { 
        businessId, 
        endpoint: 'quick_stats' 
      });
    }

    return data;
  }

  /**
   * Get daily transaction summaries with caching
   */
  async getDailyTransactionSummaries(
    businessId: string, 
    startDate: string, 
    endDate: string, 
    forceRefresh = false
  ): Promise<any> {
    const identifier = `${businessId}:${startDate}:${endDate}`;
    const cacheKey = cache.generateKey(CACHE_KEYS.BUSINESS, `daily_summaries:${identifier}`);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'daily_summaries' 
        });
        return cached;
      }
    }

    // Fetch from database
    const data = await this.db.getDailyTransactionSummaries(businessId, startDate, endDate);
    
    if (data && !data.error) {
      await cache.set(cacheKey, data, { ttl: CACHE_TTL.BUSINESS_DATA });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.BUSINESS_DATA, { 
        businessId, 
        endpoint: 'daily_summaries' 
      });
    }

    return data;
  }

  /**
   * Get monthly business metrics with caching
   */
  async getMonthlyBusinessMetrics(
    businessId: string, 
    year: number, 
    forceRefresh = false
  ): Promise<any> {
    const identifier = `${businessId}:${year}`;
    const cacheKey = cache.generateKey(CACHE_KEYS.BUSINESS, `monthly_metrics:${identifier}`);
    
    if (!forceRefresh) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        await this.logCacheEvent(cacheKey, true, undefined, { 
          businessId, 
          endpoint: 'monthly_metrics' 
        });
        return cached;
      }
    }

    // Fetch from database
    const data = await this.db.getMonthlyBusinessMetrics(businessId, year);
    
    if (data && !data.error) {
      await cache.set(cacheKey, data, { ttl: CACHE_TTL.BUSINESS_DATA });
      await this.logCacheEvent(cacheKey, false, CACHE_TTL.BUSINESS_DATA, { 
        businessId, 
        endpoint: 'monthly_metrics' 
      });
    }

    return data;
  }

  /**
   * Invalidate cache for a specific business
   * Call this when data changes
   */
  async invalidateBusinessCache(businessId: string): Promise<void> {
    await cache.invalidateBusinessCache(businessId);
    console.log(`Invalidated cache for business: ${businessId}`);
  }

  /**
   * Warm cache for a business with frequently accessed data
   */
  async warmBusinessCache(businessId: string): Promise<void> {
    try {
      console.log(`Starting cache warming for business: ${businessId}`);

      // Warm business data
      await this.getBusinessData(businessId);
      
      // Warm dashboard data
      await this.getDashboardData(businessId);
      
      // Warm quick stats (real-time data)
      await this.getQuickStats(businessId);
      
      // Warm recent transactions
      await this.getTransactions(businessId, undefined, 20);
      
      // Warm recent expenses
      await this.getExpenses(businessId, undefined, 20);
      
      // Warm current month report
      const now = new Date();
      await this.getMonthlyReport(businessId, now.getFullYear(), now.getMonth() + 1);
      
      // Warm customer analytics
      await this.getCustomerAnalytics(businessId, 25);

      console.log(`Cache warming completed for business: ${businessId}`);
    } catch (error) {
      console.error('Cache warming failed:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): Record<string, any> {
    return cache.getStats();
  }

  /**
   * Reset cache statistics
   */
  resetCacheStats(): void {
    cache.resetStats();
  }

  /**
   * Health check for cache
   */
  async cacheHealthCheck(): Promise<boolean> {
    return await cache.healthCheck();
  }

  /**
   * Generic get or set pattern for custom queries
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = CACHE_TTL.DEFAULT,
    options?: CacheQueryOptions
  ): Promise<T> {
    return cache.getOrSet(key, fetcher, { ttl, metadata: options });
  }
}

// Export singleton instance
export const cachedQueries = new CachedDatabaseQueries();
export default cachedQueries;

