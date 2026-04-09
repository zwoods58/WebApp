# Supabase Native Cache Implementation

This document provides an overview of the Supabase-native caching solution that replaces Redis for the BeeZee backend optimization project.

## Overview

The Supabase Native Cache implementation uses Supabase tables and functions to provide caching capabilities without external dependencies. This approach offers several advantages:

- **No external services** - Everything runs within Supabase
- **Built-in security** - Uses Supabase RLS for cache data protection
- **Automatic scaling** - Scales with your Supabase instance
- **Real-time capabilities** - Leverages Supabase real-time for cache invalidation
- **Cost-effective** - No additional Redis service costs

## Architecture

### Database Layer

**Tables:**
- `cache_store` - Main cache storage with TTL and metadata
- `cache_statistics` - Performance tracking and hit rates

**Functions:**
- `get_cache_value()` - Retrieve cached data
- `set_cache_value()` - Store data with TTL
- `delete_cache_value()` - Remove specific cache entries
- `delete_cache_by_prefix()` - Clear cache by type
- `cleanup_expired_cache()` - Remove expired entries
- `get_cache_health()` - Health check and statistics

### Application Layer

**Core Components:**
- `supabase-cache.ts` - Cache manager with Redis-like API
- `supabase-cached-queries.ts` - Cached database queries
- `supabase-cache-invalidation.ts` - Smart cache invalidation
- `supabase-cache-integration-example.ts` - Usage examples

## Key Features

### 1. Cache-Aside Pattern
```typescript
// Automatic cache-first approach
const data = await supabaseCachedQueries.getDashboardData(businessId);
// If cache miss, automatically fetches from database and caches result
```

### 2. TTL Management
```typescript
// Different TTL for different data types
export const CACHE_TTL = {
  BUSINESS_DATA: 600,        // 10 minutes
  DASHBOARD_DATA: 60,        // 1 minute
  TRANSACTIONS: 300,         // 5 minutes
  REALTIME_DATA: 30,         // 30 seconds
};
```

### 3. Smart Invalidation
```typescript
// Automatic invalidation based on data changes
await supabaseCacheInvalidation.invalidateOnDataChange({
  businessId,
  entityType: 'transactions',
  operation: 'CREATE',
});
```

### 4. Cache Warming
```typescript
// Pre-load frequently accessed data
await supabaseCachedQueries.warmBusinessCache(businessId);
```

### 5. Performance Monitoring
```typescript
// Track cache hit rates and performance
const stats = supabaseCachedQueries.getCacheStats();
const health = await supabaseCachedQueries.getCacheHealthInfo();
```

## Usage Examples

### Basic Caching
```typescript
import { supabaseCachedQueries } from '@/lib/cache/supabase-cached-queries';

// Get dashboard data (automatically cached)
const dashboardData = await supabaseCachedQueries.getDashboardData(businessId);

// Force refresh (bypass cache)
const freshData = await supabaseCachedQueries.getDashboardData(businessId, undefined, true);
```

### Cache Invalidation
```typescript
import { supabaseCacheInvalidation } from '@/lib/cache/supabase-cache-invalidation';

// Invalidate cache when data changes
await supabaseCacheInvalidation.invalidateOnDataChange({
  businessId,
  entityType: 'transactions',
  entityId: transactionId,
  operation: 'UPDATE',
});
```

### API Integration
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  const forceRefresh = searchParams.get('forceRefresh') === 'true';

  const result = await supabaseCachedQueries.getDashboardData(businessId, undefined, forceRefresh);
  return Response.json(result);
}
```

### Real-time Integration
```typescript
// Automatic cache invalidation on data changes
const channel = await setupRealtimeWithCache(businessId);
// Cache automatically updates when database changes
```

## Performance Benefits

### Expected Improvements
- **60% database load reduction** through caching
- **30-50% faster API responses** for cached data
- **>80% cache hit rate** for frequently accessed data
- **40% increase in concurrent user support**

### Cache Hit Rate Targets
- **Dashboard data**: >90% (accessed frequently)
- **Transactions**: >80% (moderate access)
- **Reports**: >85% (periodic access)
- **Business data**: >95% (rarely changes)

## Cache Key Structure

Cache keys follow this pattern: `{prefix}:{identifier}`

### Key Prefixes
- `business:` - Business data, reports, analytics
- `dashboard:` - Dashboard summaries and metrics
- `transactions:` - Transaction lists and details
- `expenses:` - Expense data and reports
- `appointments:` - Appointment schedules
- `inventory:` - Inventory data
- `credit:` - Credit information

### Example Keys
```
business:12345                    // Business summary
dashboard:12345:2024-04          // Dashboard for April 2024
transactions:12345:first:50     // First 50 transactions
transactions:12345:cursor:abc:50 // Transactions after cursor abc
expenses:12345:{"category":"office"} // Office expenses
```

## Database Schema

### cache_store Table
```sql
CREATE TABLE cache_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key VARCHAR(255) NOT NULL UNIQUE,
    cache_prefix VARCHAR(50) NOT NULL,
    identifier VARCHAR(255),
    cache_data JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_cache_store_key ON cache_store(cache_key);
CREATE INDEX idx_cache_store_prefix ON cache_store(cache_prefix);
CREATE INDEX idx_cache_store_expires ON cache_store(expires_at);
CREATE INDEX idx_cache_store_last_accessed ON cache_store(last_accessed DESC);
```

## Health Monitoring

### Health Check Endpoint
The `/api/health` endpoint includes cache metrics:

```json
{
  "cache": {
    "healthy": true,
    "stats": {
      "overall": {
        "hits": 1250,
        "misses": 250,
        "hitRate": 0.83,
        "totalRequests": 1500
      },
      "business:": {
        "hits": 800,
        "misses": 100,
        "hitRate": 0.89
      }
    },
    "lastCheck": "2024-04-09T12:00:00.000Z"
  }
}
```

### Cache Statistics
```typescript
// Get detailed cache statistics
const stats = supabaseCachedQueries.getCacheStats();

// Get cache health information
const health = await supabaseCachedQueries.getCacheHealthInfo();
```

## Migration from Redis

### Replacing Redis Imports
```typescript
// Before (Redis)
import { cache } from '@/lib/cache/redis-cache';
import { cachedQueries } from '@/lib/cache/cached-queries';

// After (Supabase)
import { supabaseCache } from '@/lib/cache/supabase-cache';
import { supabaseCachedQueries } from '@/lib/cache/supabase-cached-queries';
```

### API Compatibility
The Supabase cache implementation maintains the same API as the Redis version:

```typescript
// Same API works for both implementations
const data = await cachedQueries.getDashboardData(businessId);
await cacheInvalidation.invalidateOnDataChange(options);
```

## Best Practices

### 1. Cache-First Approach
Always try to get data from cache first:
```typescript
// Good: Use cached queries
const data = await supabaseCachedQueries.getBusinessData(businessId);

// Avoid: Direct database calls for frequently accessed data
const data = await database.getBusinessData(businessId);
```

### 2. Smart Invalidation
Invalidate cache based on data impact:
```typescript
// High impact: Invalidate all business cache
await supabaseCacheInvalidation.smartInvalidate(businessId, {
  type: 'business_settings',
  impact: 'high'
});

// Low impact: Invalidate specific cache only
await supabaseCacheInvalidation.smartInvalidate(businessId, {
  type: 'customer_info',
  impact: 'low'
});
```

### 3. Appropriate TTL
Use appropriate TTL values:
```typescript
// Real-time data (short TTL)
await supabaseCache.set(key, data, { ttl: CACHE_TTL.REALTIME_DATA });

// Business data (longer TTL)
await supabaseCache.set(key, data, { ttl: CACHE_TTL.BUSINESS_DATA });
```

### 4. Error Handling
Always handle cache failures gracefully:
```typescript
try {
  const cached = await supabaseCache.get(key);
  if (cached) return cached;
} catch (error) {
  console.warn('Cache error, falling back to database:', error);
}

// Fall back to database
return await database.query();
```

## Performance Monitoring

### Key Metrics to Track
1. **Cache Hit Rate** - Target >80%
2. **Cache Response Time** - Target <50ms
3. **Database Load Reduction** - Target 60%
4. **API Response Time** - Should improve significantly

### Monitoring Queries
```sql
-- View cache performance
SELECT * FROM cache_performance;

-- View cache statistics
SELECT * FROM cache_overview;

-- Check expired entries
SELECT COUNT(*) FROM cache_store WHERE expires_at < NOW();
```

## Troubleshooting

### Common Issues

1. **Cache not working**: Check Supabase connection and RLS policies
2. **High cache miss rate**: Review TTL values and warming strategies
3. **Stale data**: Ensure proper cache invalidation
4. **Memory usage**: Monitor cache table size and cleanup

### Debug Commands
```typescript
// Check cache health
const isHealthy = await supabaseCachedQueries.cacheHealthCheck();

// Get cache statistics
const stats = supabaseCachedQueries.getCacheStats();

// Reset cache statistics
supabaseCachedQueries.resetCacheStats();

// Force cache invalidation
await supabaseCacheInvalidation.invalidateOnDataChange({
  businessId,
  entityType: 'all',
});

// Clean up expired cache
const deletedCount = await supabaseCachedQueries.cleanupExpiredCache();
```

## Comparison: Supabase Cache vs Redis

| Feature | Supabase Cache | Redis |
|---------|----------------|-------|
| **External Dependencies** | None | Redis service |
| **Setup Complexity** | Low | Medium |
| **Security** | Built-in RLS | Manual configuration |
| **Scalability** | Automatic | Manual scaling |
| **Cost** | Included | Additional cost |
| **Performance** | Good | Excellent |
| **Real-time** | Built-in | Requires pub/sub |
| **Monitoring** | Built-in | External tools |

## Conclusion

The Supabase Native Cache implementation provides a robust, cost-effective solution for caching that eliminates external dependencies while maintaining high performance. It's particularly well-suited for applications already using Supabase, offering seamless integration and automatic scaling.

The implementation maintains API compatibility with the Redis version, making migration straightforward while providing all the benefits of native Supabase integration.
