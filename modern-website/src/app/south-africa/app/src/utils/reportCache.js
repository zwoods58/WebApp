// Report Cache Management
// Caches generated reports for 24 hours to improve performance

const CACHE_PREFIX = 'beezee_report_';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get report from cache
 * @param {string} key - Cache key
 * @returns {Object|null} Cached report data or null
 */
export function getReportFromCache(key) {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const { data, expiry } = JSON.parse(cached);
    
    // Check if expired
    if (Date.now() > expiry) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    console.log('Report cache hit:', key);
    return data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Save report to cache
 * @param {string} key - Cache key
 * @param {Object} data - Report data
 * @param {number} ttl - Time to live in milliseconds
 */
export function saveReportToCache(key, data, ttl = DEFAULT_TTL) {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cacheData = {
      data,
      expiry: Date.now() + ttl,
      cached_at: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('Report cached:', key);
  } catch (error) {
    console.error('Error saving to cache:', error);
    // If localStorage is full, try to clear old cache
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      // Try again
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Still cannot save to cache after cleanup');
      }
    }
  }
}

/**
 * Invalidate specific report cache
 * @param {string} key - Cache key
 */
export function invalidateReportCache(key) {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    localStorage.removeItem(cacheKey);
    console.log('Report cache invalidated:', key);
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Invalidate all report caches
 */
export function invalidateAllReportCaches() {
  try {
    const keys = Object.keys(localStorage);
    const reportKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    reportKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`Invalidated ${reportKeys.length} report caches`);
  } catch (error) {
    console.error('Error invalidating all caches:', error);
  }
}

/**
 * Clear old/expired cache entries
 */
export function clearOldCache() {
  try {
    const keys = Object.keys(localStorage);
    const reportKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    let clearedCount = 0;

    reportKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { expiry } = JSON.parse(cached);
          
          // Remove if expired
          if (Date.now() > expiry) {
            localStorage.removeItem(key);
            clearedCount++;
          }
        }
      } catch (error) {
        // If we can't parse it, remove it
        localStorage.removeItem(key);
        clearedCount++;
      }
    });

    console.log(`Cleared ${clearedCount} old cache entries`);
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  try {
    const keys = Object.keys(localStorage);
    const reportKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    let totalSize = 0;
    let validCount = 0;
    let expiredCount = 0;

    reportKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          totalSize += cached.length;
          
          const { expiry } = JSON.parse(cached);
          if (Date.now() > expiry) {
            expiredCount++;
          } else {
            validCount++;
          }
        }
      } catch (error) {
        expiredCount++;
      }
    });

    return {
      totalEntries: reportKeys.length,
      validEntries: validCount,
      expiredEntries: expiredCount,
      totalSizeBytes: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalEntries: 0,
      validEntries: 0,
      expiredEntries: 0,
      totalSizeBytes: 0,
      totalSizeKB: '0.00',
    };
  }
}

/**
 * Pre-cache common reports
 * @param {string} userId - User ID
 */
export async function preCacheCommonReports(userId) {
  // This would be called after user logs in
  // To pre-generate and cache today, week, month reports
  console.log('Pre-caching common reports for user:', userId);
  
  // Implementation would call generateReport for common date ranges
  // and cache them proactively
}


