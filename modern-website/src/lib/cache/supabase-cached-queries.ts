/**
 * Supabase Cached Database Queries
 * Replaces Redis-based caching with Supabase native caching
 */

import { supabaseCache, CACHE_TTL, CACHE_KEYS } from './supabase-cache';
import { BeezeeDatabase } from '../database';

export interface CacheQueryOptions {
  businessId?: string;
  userId?: string;
  endpoint?: string;
  metadata?: Record<string, any>;
}

export class SupabaseCachedDatabaseQueries {
  private db: BeezeeDatabase;

  constructor() {
    this.db = new BeezeeDatabase();
  }

  // Get business data with caching
  async getBusinessData(businessId: string, forceRefresh = false): Promise<any> {
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.BUSINESS, businessId);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'business-data',
    };

    return await supabaseCache.getOrSet(
      cacheKey,
      () => this.db.getBusinessSummaryOptimized(businessId),
      { ttl: CACHE_TTL.BUSINESS_DATA, metadata: options }
    );
  }

  // Get dashboard data with caching
  async getDashboardData(businessId: string, dateRange?: string, forceRefresh = false): Promise<any> {
    const keySuffix = `${businessId}:${dateRange || 'default'}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.DASHBOARD, keySuffix);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'dashboard-data',
    };

    return await supabaseCache.getOrSet(
      cacheKey,
      () => this.db.getDashboardDataOptimized(businessId),
      { ttl: CACHE_TTL.DASHBOARD_DATA, metadata: options }
    );
  }

  // Get transactions with caching
  async getTransactions(
    businessId: string,
    cursor?: string,
    limit = 50,
    filters?: Record<string, any>,
    forceRefresh = false
  ): Promise<{ data: any[], nextCursor: string | null }> {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    const keySuffix = `${businessId}:${cursor || 'first'}:${limit}:${filterString}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.TRANSACTIONS, keySuffix);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'transactions',
    };

    const result = await supabaseCache.getOrSet(
      cacheKey,
      async () => {
        const cursorResult = await this.db.getTransactionsCursor(businessId, cursor, limit);
        return {
          data: cursorResult.data || [],
          nextCursor: cursorResult.nextCursor || null
        };
      },
      { ttl: CACHE_TTL.TRANSACTIONS, metadata: options }
    );
    return result;
  }

  // Get expenses with caching
  async getExpenses(
    businessId: string,
    cursor?: string,
    limit = 50,
    filters?: Record<string, any>,
    forceRefresh = false
  ): Promise<{ data: any[], nextCursor: string | null }> {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    const keySuffix = `${businessId}:${cursor || 'first'}:${limit}:${filterString}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.EXPENSES, keySuffix);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'expenses',
    };

    const result = await supabaseCache.getOrSet(
      cacheKey,
      async () => {
        const cursorResult = await this.db.getExpensesCursor(businessId, cursor, limit);
        return {
          data: cursorResult.data || [],
          nextCursor: cursorResult.nextCursor || null
        };
      },
      { ttl: CACHE_TTL.EXPENSES, metadata: options }
    );
    return result;
  }

  // Get appointments with caching
  async getAppointments(
    businessId: string,
    cursor?: string,
    limit = 50,
    filters?: Record<string, any>,
    forceRefresh = false
  ): Promise<{ data: any[], nextCursor: string | null }> {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    const keySuffix = `${businessId}:${cursor || 'first'}:${limit}:${filterString}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.APPOINTMENTS, keySuffix);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'appointments',
    };

    const result = await supabaseCache.getOrSet(
      cacheKey,
      async () => {
        const cursorResult = await this.db.getAppointmentsCursor(businessId, cursor, limit);
        return {
          data: cursorResult.data || [],
          nextCursor: cursorResult.nextCursor || null
        };
      },
      { ttl: CACHE_TTL.APPOINTMENTS, metadata: options }
    );
    return result;
  }

  // Get monthly report with caching
  async getMonthlyReport(businessId: string, year: number, month: number, forceRefresh = false): Promise<any> {
    const keySuffix = `${businessId}:${year}:${month}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.BUSINESS, `monthly_report:${keySuffix}`);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'monthly-report',
    };

    return await supabaseCache.getOrSet(
      cacheKey,
      () => this.db.getMonthlyReportOptimized(businessId, year, month),
      { ttl: CACHE_TTL.BUSINESS_DATA, metadata: options }
    );
  }

  // Get customer analytics with caching
  async getCustomerAnalytics(businessId: string, limit = 50, forceRefresh = false): Promise<any> {
    const keySuffix = `${businessId}:${limit}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.BUSINESS, `customer_analytics:${keySuffix}`);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'customer-analytics',
    };

    return await supabaseCache.getOrSet(
      cacheKey,
      () => this.db.getCustomerAnalyticsOptimized(businessId, limit),
      { ttl: CACHE_TTL.BUSINESS_DATA, metadata: options }
    );
  }

  // Get quick stats with caching
  async getQuickStats(businessId: string, forceRefresh = false): Promise<any> {
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.DASHBOARD, `quick_stats:${businessId}`);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'quick-stats',
    };

    return await supabaseCache.getOrSet(
      cacheKey,
      () => this.db.getQuickStatsOptimized(businessId),
      { ttl: CACHE_TTL.DASHBOARD_DATA, metadata: options }
    );
  }

  // Get daily transaction summaries with caching
  async getDailyTransactionSummaries(businessId: string, startDate: string, endDate: string, forceRefresh = false): Promise<any> {
    const keySuffix = `${businessId}:${startDate}:${endDate}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.BUSINESS, `daily_summaries:${keySuffix}`);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'daily-summaries',
    };

    return await supabaseCache.getOrSet(
      cacheKey,
      () => this.db.getDailyTransactionSummaries(businessId, startDate, endDate),
      { ttl: CACHE_TTL.BUSINESS_DATA, metadata: options }
    );
  }

  // Get monthly business metrics with caching
  async getMonthlyBusinessMetrics(businessId: string, year: number, forceRefresh = false): Promise<any> {
    const keySuffix = `${businessId}:${year}`;
    const cacheKey = supabaseCache.generateKey(CACHE_KEYS.BUSINESS, `monthly_metrics:${keySuffix}`);
    
    if (forceRefresh) {
      await supabaseCache.delete(cacheKey);
    }

    const options: CacheQueryOptions = {
      businessId,
      endpoint: 'monthly-metrics',
    };

    return await supabaseCache.getOrSet(
      cacheKey,
      () => this.db.getMonthlyBusinessMetrics(businessId, year),
      { ttl: CACHE_TTL.BUSINESS_DATA, metadata: options }
    );
  }

  // Invalidate business cache
  async invalidateBusinessCache(businessId: string): Promise<void> {
    await supabaseCache.invalidateBusinessCache(businessId);
  }

  // Warm business cache
  async warmBusinessCache(businessId: string): Promise<void> {
    try {
      // Warm frequently accessed data
      console.log(`Warming cache for business: ${businessId}`);

      // Parallel cache warming
      const warmPromises = [
        this.getBusinessData(businessId),
        this.getDashboardData(businessId),
        this.getQuickStats(businessId),
        this.getTransactions(businessId, undefined, 50),
        this.getExpenses(businessId, undefined, 50),
        this.getAppointments(businessId, undefined, 50),
      ];

      await Promise.allSettled(warmPromises);
      console.log(`Cache warming completed for business: ${businessId}`);
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }

  // Get cache statistics
  getCacheStats(): Record<string, any> {
    const stats = supabaseCache.getStats();
    
    return {
      stats,
      timestamp: new Date().toISOString(),
      cacheType: 'supabase-native',
    };
  }

  // Reset cache statistics
  resetCacheStats(): void {
    supabaseCache.resetStats();
  }

  // Cache health check
  async cacheHealthCheck(): Promise<boolean> {
    return await supabaseCache.healthCheck();
  }

  // Generic get or set method
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = CACHE_TTL.DEFAULT,
    options?: CacheQueryOptions
  ): Promise<T> {
    return await supabaseCache.getOrSet(key, fetcher, { ttl, metadata: options });
  }

  // Clean up expired cache entries
  async cleanupExpiredCache(): Promise<number> {
    return await supabaseCache.cleanup();
  }

  // Get cache health information
  async getCacheHealthInfo(): Promise<any> {
    return await supabaseCache.getCacheInfo();
  }
}

// Export singleton instance
export const supabaseCachedQueries = new SupabaseCachedDatabaseQueries();
export default supabaseCachedQueries;

