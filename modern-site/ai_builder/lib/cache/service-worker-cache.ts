/**
 * Browser Caching with Service Worker
 * P1 Feature 17: Caching Strategy - Browser Caching
 */

export interface CacheConfig {
  cacheName: string
  maxAge: number // milliseconds
  maxEntries: number
}

class BrowserCache {
  private caches: Map<string, CacheConfig> = new Map()

  /**
   * Register cache configuration
   */
  registerCache(name: string, config: CacheConfig): void {
    this.caches.set(name, config)
  }

  /**
   * Cache request with Service Worker cache API
   */
  async cacheRequest(url: string, response: Response, cacheName: string = 'default'): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return
    }

    try {
      const cache = await caches.open(cacheName)
      await cache.put(url, response.clone())
    } catch (error) {
      console.error('Cache put error:', error)
    }
  }

  /**
   * Get cached response
   */
  async getCachedResponse(url: string, cacheName: string = 'default'): Promise<Response | null> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return null
    }

    try {
      const cache = await caches.open(cacheName)
      return await cache.match(url) || null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Clear cache
   */
  async clearCache(cacheName?: string): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return
    }

    try {
      if (cacheName) {
        await caches.delete(cacheName)
      } else {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  /**
   * Cache with stale-while-revalidate strategy
   */
  async staleWhileRevalidate(
    url: string,
    fetchFn: () => Promise<Response>,
    cacheName: string = 'default'
  ): Promise<Response> {
    // Try cache first
    const cachedResponse = await this.getCachedResponse(url, cacheName)
    if (cachedResponse) {
      // Return cached response immediately
      // Fetch fresh data in background
      fetchFn().then(response => {
        this.cacheRequest(url, response, cacheName)
      }).catch(() => {
        // Ignore fetch errors in background
      })
      return cachedResponse
    }

    // No cache, fetch fresh
    const response = await fetchFn()
    await this.cacheRequest(url, response, cacheName)
    return response
  }
}

// Singleton instance
let browserCache: BrowserCache | null = null

export function getBrowserCache(): BrowserCache {
  if (!browserCache && typeof window !== 'undefined') {
    browserCache = new BrowserCache()
  }
  return browserCache!
}





