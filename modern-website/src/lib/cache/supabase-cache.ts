/**
 * Supabase Native Cache Implementation
 * Replaces Redis with Supabase table-based caching
 */

import { createClient } from '@supabase/supabase-js';

// Cache TTL constants (same as before)
export const CACHE_TTL = {
  BUSINESS_DATA: 600,        // 10 minutes
  DASHBOARD_DATA: 60,        // 1 minute
  USER_PREFERENCES: 1800,    // 30 minutes
  TRANSACTIONS: 300,         // 5 minutes
  EXPENSES: 300,            // 5 minutes
  APPOINTMENTS: 300,        // 5 minutes
  INVENTORY: 300,           // 5 minutes
  CREDIT_DATA: 300,         // 5 minutes
  REALTIME_DATA: 30,        // 30 seconds
  RATE_LIMIT: 60,           // 1 minute
  SESSION_DATA: 1800,       // 30 minutes
  DEFAULT: 300,             // 5 minutes
} as const;

// Cache key prefixes
export const CACHE_KEYS = {
  BUSINESS: 'business:',
  DASHBOARD: 'dashboard:',
  TRANSACTIONS: 'transactions:',
  EXPENSES: 'expenses:',
  APPOINTMENTS: 'appointments:',
  INVENTORY: 'inventory:',
  CREDIT: 'credit:',
  REALTIME: 'realtime:',
  RATE_LIMIT: 'rate_limit:',
  SESSION: 'session:',
} as const;

// Cache options interface
export interface CacheOptions {
  ttl?: number;
  metadata?: Record<string, any>;
}

// Cache result interface
export interface CacheResult<T> {
  data: T | null;
  hit: boolean;
  cached: boolean;
  ttl?: number;
}

// Cache statistics interface
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
}

class SupabaseCacheManager {
  private supabase: any;
  private stats: Map<string, CacheStats> = new Map();
  private defaultStats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalRequests: 0,
  };

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // Generate cache key
  public generateKey(prefix: string, identifier: string): string {
    return `${prefix}${identifier}`;
  }

  // Parse cache key
  private parseKey(key: string): { prefix: string; identifier: string } {
    const colonIndex = key.indexOf(':');
    if (colonIndex === -1) {
      return { prefix: key, identifier: '' };
    }
    return {
      prefix: key.substring(0, colonIndex),
      identifier: key.substring(colonIndex + 1),
    };
  }

  // Update statistics
  private updateStats(prefix: string, hit: boolean): void {
    const currentStats = this.stats.get(prefix) || { ...this.defaultStats };
    
    if (hit) {
      currentStats.hits++;
    } else {
      currentStats.misses++;
    }
    
    currentStats.totalRequests = currentStats.hits + currentStats.misses;
    currentStats.hitRate = currentStats.totalRequests > 0 
      ? currentStats.hits / currentStats.totalRequests 
      : 0;
    
    this.stats.set(prefix, currentStats);
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_cache_value', {
        p_cache_key: key,
      });

      if (error) {
        console.error('Cache get error:', error);
        return null;
      }

      const parsedKey = this.parseKey(key);
      this.updateStats(parsedKey.prefix, data !== null);

      return data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cache value
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    try {
      const ttl = options.ttl || CACHE_TTL.DEFAULT;
      const metadata = options.metadata || {};

      const { error } = await this.supabase.rpc('set_cache_value', {
        p_cache_key: key,
        p_cache_data: data,
        p_ttl_seconds: ttl,
        p_metadata: metadata,
      });

      if (error) {
        console.error('Cache set error:', error);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Delete cache value
  async delete(key: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('delete_cache_value', {
        p_cache_key: key,
      });

      if (error) {
        console.error('Cache delete error:', error);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Delete cache by pattern
  async deletePattern(pattern: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('delete_cache_by_pattern', {
        p_pattern: pattern,
      });

      if (error) {
        console.error('Cache delete pattern error:', error);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  // Delete cache by prefix
  async deleteByPrefix(prefix: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('delete_cache_by_prefix', {
        p_prefix: prefix,
      });

      if (error) {
        console.error('Cache delete prefix error:', error);
      }
    } catch (error) {
      console.error('Cache delete prefix error:', error);
    }
  }

  // Get or set cache value (cache-aside pattern)
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Fetch fresh data
      const data = await fetcher();
      
      // Store in cache
      await this.set(key, data, options);
      
      return data;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      // Fallback to direct fetch
      return await fetcher();
    }
  }

  // Business data specific methods
  async getBusinessData(businessId: string): Promise<any | null> {
    const key = this.generateKey(CACHE_KEYS.BUSINESS, businessId);
    return await this.get(key);
  }

  async setBusinessData(businessId: string, data: any): Promise<void> {
    const key = this.generateKey(CACHE_KEYS.BUSINESS, businessId);
    await this.set(key, data, { ttl: CACHE_TTL.BUSINESS_DATA });
  }

  // Dashboard data specific methods
  async getDashboardData(businessId: string, dateRange?: string): Promise<any | null> {
    const key = this.generateKey(CACHE_KEYS.DASHBOARD, `${businessId}:${dateRange || 'default'}`);
    return await this.get(key);
  }

  async setDashboardData(businessId: string, data: any, dateRange?: string): Promise<void> {
    const key = this.generateKey(CACHE_KEYS.DASHBOARD, `${businessId}:${dateRange || 'default'}`);
    await this.set(key, data, { ttl: CACHE_TTL.DASHBOARD_DATA });
  }

  // Transactions specific methods
  async getTransactions(businessId: string, filters?: Record<string, any>): Promise<any[] | null> {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    const key = this.generateKey(CACHE_KEYS.TRANSACTIONS, `${businessId}:${filterString}`);
    return await this.get(key);
  }

  async setTransactions(businessId: string, data: any[], filters?: Record<string, any>): Promise<void> {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    const key = this.generateKey(CACHE_KEYS.TRANSACTIONS, `${businessId}:${filterString}`);
    await this.set(key, data, { ttl: CACHE_TTL.TRANSACTIONS });
  }

  // Expenses specific methods
  async getExpenses(businessId: string, filters?: Record<string, any>): Promise<any[] | null> {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    const key = this.generateKey(CACHE_KEYS.EXPENSES, `${businessId}:${filterString}`);
    return await this.get(key);
  }

  async setExpenses(businessId: string, data: any[], filters?: Record<string, any>): Promise<void> {
    const filterString = filters ? JSON.stringify(filters) : 'default';
    const key = this.generateKey(CACHE_KEYS.EXPENSES, `${businessId}:${filterString}`);
    await this.set(key, data, { ttl: CACHE_TTL.EXPENSES });
  }

  // Invalidate all business cache
  async invalidateBusinessCache(businessId: string): Promise<void> {
    try {
      // Delete all cache entries for this business
      await this.deletePattern(`%:${businessId}%`);
      
      // Also delete by common prefixes
      await this.deleteByPrefix(CACHE_KEYS.BUSINESS);
      await this.deleteByPrefix(CACHE_KEYS.DASHBOARD);
      await this.deleteByPrefix(CACHE_KEYS.TRANSACTIONS);
      await this.deleteByPrefix(CACHE_KEYS.EXPENSES);
      await this.deleteByPrefix(CACHE_KEYS.APPOINTMENTS);
      await this.deleteByPrefix(CACHE_KEYS.INVENTORY);
      await this.deleteByPrefix(CACHE_KEYS.CREDIT);
    } catch (error) {
      console.error('Business cache invalidation error:', error);
    }
  }

  // Warm cache with frequently accessed data
  async warmCache(businessId: string): Promise<void> {
    try {
      // This would typically be implemented with actual data fetching
      // For now, it's a placeholder for the warming strategy
      console.log(`Warming cache for business: ${businessId}`);
      
      // Example: Warm dashboard data
      // const dashboardData = await fetchDashboardData(businessId);
      // await this.setDashboardData(businessId, dashboardData);
      
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }

  // Get cache statistics
  getStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    
    // Add individual prefix stats
    this.stats.forEach((value, key) => {
      stats[key] = { ...value };
    });
    
    // Add overall stats
    const overall = { ...this.defaultStats };
    this.stats.forEach((value) => {
      overall.hits += value.hits;
      overall.misses += value.misses;
    });
    overall.totalRequests = overall.hits + overall.misses;
    overall.hitRate = overall.totalRequests > 0 ? overall.hits / overall.totalRequests : 0;
    
    stats['overall'] = overall;
    
    return stats;
  }

  // Reset cache statistics
  resetStats(): void {
    this.stats.clear();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('get_cache_health');
      
      if (error) {
        console.error('Cache health check error:', error);
        return false;
      }
      
      return data?.healthy || false;
    } catch (error) {
      console.error('Cache health check error:', error);
      return false;
    }
  }

  // Get cache information
  async getCacheInfo(): Promise<any> {
    try {
      const { data, error } = await this.supabase.rpc('get_cache_health');
      
      if (error) {
        console.error('Cache info error:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Cache info error:', error);
      return null;
    }
  }

  // Clean up expired cache entries
  async cleanup(): Promise<number> {
    try {
      const { data, error } = await this.supabase.rpc('cleanup_expired_cache');
      
      if (error) {
        console.error('Cache cleanup error:', error);
        return 0;
      }
      
      return data || 0;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const supabaseCache = new SupabaseCacheManager();
export default supabaseCache;
