import { Redis } from '@upstash/redis';

// Cache TTL constants (in seconds)
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
  USER: 'user:',
  DASHBOARD: 'dashboard:',
  TRANSACTIONS: 'transactions:',
  EXPENSES: 'expenses:',
  APPOINTMENTS: 'appointments:',
  INVENTORY: 'inventory:',
  CREDIT: 'credit:',
  REALTIME: 'realtime:',
  RATE_LIMIT: 'rate_limit:',
  SESSION: 'session:',
  QUERY: 'query:',
} as const;

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CacheResult<T> {
  data: T;
  cached: boolean;
  timestamp: number;
  ttl: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
}

class RedisCacheManager {
  private redis: Redis;
  private stats: Map<string, CacheStats> = new Map();
  private defaultStats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalRequests: 0,
  };

  constructor() {
    // Initialize Redis with environment variables
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
  }

  /**
   * Generate a cache key with prefix and identifier
   */
  public generateKey(prefix: string, identifier: string): string {
    return `${prefix}${identifier}`;
  }

  /**
   * Parse cache key to extract prefix and identifier
   */
  private parseKey(key: string): { prefix: string; identifier: string } {
    const parts = key.split(':');
    return {
      prefix: parts[0] + ':',
      identifier: parts.slice(1).join(':'),
    };
  }

  /**
   * Update cache statistics
   */
  private updateStats(prefix: string, hit: boolean): void {
    const current = this.stats.get(prefix) || { ...this.defaultStats };
    current.totalRequests++;
    
    if (hit) {
      current.hits++;
    } else {
      current.misses++;
    }
    
    current.hitRate = current.hits / current.totalRequests;
    this.stats.set(prefix, current);
  }

  /**
   * Get data from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.redis.get(key);
      
      if (result) {
        const parsed = JSON.parse(result as string);
        const { prefix } = this.parseKey(key);
        this.updateStats(prefix, true);
        
        // Check if the cache entry has expired
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          await this.delete(key);
          this.updateStats(prefix, false);
          return null;
        }
        
        return parsed.data;
      } else {
        const { prefix } = this.parseKey(key);
        this.updateStats(prefix, false);
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set data in cache with optional TTL
   */
  async set<T>(
    key: string,
    data: T,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const ttl = options.ttl || CACHE_TTL.DEFAULT;
      const expiresAt = Date.now() + (ttl * 1000);
      
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        expiresAt,
        ttl,
        tags: options.tags || [],
        metadata: options.metadata || {},
      };

      await this.redis.set(key, JSON.stringify(cacheEntry), {
        ex: ttl,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete data from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  /**
   * Clear cache by tags
   */
  async clearByTags(tags: string[]): Promise<void> {
    try {
      // This is a simplified implementation
      // In production, you'd maintain a tag-to-keys mapping
      const patterns = tags.map(tag => `*${tag}*`);
      for (const pattern of patterns) {
        await this.deletePattern(pattern);
      }
    } catch (error) {
      console.error('Cache clear by tags error:', error);
    }
  }

  /**
   * Get or set pattern - fetch from cache if exists, otherwise set and return
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, options);
    
    return data;
  }

  /**
   * Business data caching
   */
  async getBusinessData(businessId: string): Promise<any | null> {
    const key = this.generateKey(CACHE_KEYS.BUSINESS, businessId);
    return this.get(key);
  }

  async setBusinessData(businessId: string, data: any): Promise<void> {
    const key = this.generateKey(CACHE_KEYS.BUSINESS, businessId);
    await this.set(key, data, { ttl: CACHE_TTL.BUSINESS_DATA });
  }

  /**
   * Dashboard data caching
   */
  async getDashboardData(businessId: string, dateRange?: string): Promise<any | null> {
    const identifier = dateRange ? `${businessId}:${dateRange}` : businessId;
    const key = this.generateKey(CACHE_KEYS.DASHBOARD, identifier);
    return this.get(key);
  }

  async setDashboardData(businessId: string, data: any, dateRange?: string): Promise<void> {
    const identifier = dateRange ? `${businessId}:${dateRange}` : businessId;
    const key = this.generateKey(CACHE_KEYS.DASHBOARD, identifier);
    await this.set(key, data, { ttl: CACHE_TTL.DASHBOARD_DATA });
  }

  /**
   * Transaction data caching
   */
  async getTransactions(businessId: string, filters?: Record<string, any>): Promise<any[] | null> {
    const identifier = filters ? `${businessId}:${JSON.stringify(filters)}` : businessId;
    const key = this.generateKey(CACHE_KEYS.TRANSACTIONS, identifier);
    return this.get(key);
  }

  async setTransactions(businessId: string, data: any[], filters?: Record<string, any>): Promise<void> {
    const identifier = filters ? `${businessId}:${JSON.stringify(filters)}` : businessId;
    const key = this.generateKey(CACHE_KEYS.TRANSACTIONS, identifier);
    await this.set(key, data, { ttl: CACHE_TTL.TRANSACTIONS });
  }

  /**
   * Expense data caching
   */
  async getExpenses(businessId: string, filters?: Record<string, any>): Promise<any[] | null> {
    const identifier = filters ? `${businessId}:${JSON.stringify(filters)}` : businessId;
    const key = this.generateKey(CACHE_KEYS.EXPENSES, identifier);
    return this.get(key);
  }

  async setExpenses(businessId: string, data: any[], filters?: Record<string, any>): Promise<void> {
    const identifier = filters ? `${businessId}:${JSON.stringify(filters)}` : businessId;
    const key = this.generateKey(CACHE_KEYS.EXPENSES, identifier);
    await this.set(key, data, { ttl: CACHE_TTL.EXPENSES });
  }

  /**
   * Invalidate business-related cache
   */
  async invalidateBusinessCache(businessId: string): Promise<void> {
    const patterns = [
      `${CACHE_KEYS.BUSINESS}${businessId}`,
      `${CACHE_KEYS.DASHBOARD}${businessId}*`,
      `${CACHE_KEYS.TRANSACTIONS}${businessId}*`,
      `${CACHE_KEYS.EXPENSES}${businessId}*`,
      `${CACHE_KEYS.APPOINTMENTS}${businessId}*`,
      `${CACHE_KEYS.INVENTORY}${businessId}*`,
      `${CACHE_KEYS.CREDIT}${businessId}*`,
    ];

    for (const pattern of patterns) {
      await this.deletePattern(pattern);
    }
  }

  /**
   * Warm cache for frequently accessed data
   */
  async warmCache(businessId: string): Promise<void> {
    try {
      // This would be implemented based on your specific data access patterns
      // For now, it's a placeholder for the warming logic
      console.log(`Cache warming initiated for business: ${businessId}`);
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): Record<string, CacheStats> {
    const allStats = { ...this.defaultStats };
    
    // Aggregate all prefix stats
    for (const stats of this.stats.values()) {
      allStats.hits += stats.hits;
      allStats.misses += stats.misses;
      allStats.totalRequests += stats.totalRequests;
    }
    
    allStats.hitRate = allStats.totalRequests > 0 ? allStats.hits / allStats.totalRequests : 0;
    
    return {
      ...Object.fromEntries(this.stats),
      overall: allStats,
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats.clear();
  }

  /**
   * Health check for Redis connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  /**
   * Get Redis info
   */
  async getRedisInfo(): Promise<any> {
    try {
      // Use ping as a simple health check since info() might not be available
      const ping = await this.redis.ping();
      return { status: 'connected', ping };
    } catch (error) {
      console.error('Failed to get Redis info:', error);
      return { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance
export const cache = new RedisCacheManager();
export default cache;
