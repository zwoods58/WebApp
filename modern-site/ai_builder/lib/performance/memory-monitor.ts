/**
 * Memory Monitor - Prevent memory leaks
 * P0 Feature 4: Memory Leak Prevention
 * 
 * Monitors memory usage and cleans up resources
 */

export interface MemoryStats {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  timestamp: number
}

export interface MemoryMonitorConfig {
  maxMemoryMB?: number // Maximum memory in MB (default: 100MB)
  checkInterval?: number // Check interval in ms (default: 5000)
  onMemoryWarning?: (stats: MemoryStats) => void
  onMemoryCritical?: (stats: MemoryStats) => void
}

class MemoryMonitor {
  private intervalId: NodeJS.Timeout | null = null
  private config: Required<MemoryMonitorConfig>
  private codeCache = new Map<string, { code: string; timestamp: number }>()
  private maxCacheSize = 50 // Maximum cached components
  private maxCacheAge = 300000 // 5 minutes

  constructor(config: MemoryMonitorConfig = {}) {
    this.config = {
      maxMemoryMB: config.maxMemoryMB || 100,
      checkInterval: config.checkInterval || 5000,
      onMemoryWarning: config.onMemoryWarning || (() => {}),
      onMemoryCritical: config.onMemoryCritical || (() => {})
    }
  }

  /**
   * Start monitoring memory
   */
  start(): void {
    if (this.intervalId) {
      return // Already monitoring
    }

    if (typeof window === 'undefined' || !(performance as any).memory) {
      console.warn('⚠️ Memory monitoring not available in this environment')
      return
    }

    this.intervalId = setInterval(() => {
      this.checkMemory()
      this.cleanupCache()
    }, this.config.checkInterval)

    console.log('✅ Memory monitoring started')
  }

  /**
   * Stop monitoring memory
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('✅ Memory monitoring stopped')
    }
  }

  /**
   * Check current memory usage
   */
  checkMemory(): MemoryStats | null {
    if (typeof window === 'undefined' || !(performance as any).memory) {
      return null
    }

    const memory = (performance as any).memory
    const stats: MemoryStats = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      timestamp: Date.now()
    }

    const usedMB = stats.usedJSHeapSize / 1024 / 1024
    const maxMB = this.config.maxMemoryMB

    if (usedMB > maxMB * 0.9) {
      // Critical: >90% of max memory
      this.config.onMemoryCritical(stats)
      console.error(`🚨 Critical memory usage: ${usedMB.toFixed(2)}MB / ${maxMB}MB`)
    } else if (usedMB > maxMB * 0.75) {
      // Warning: >75% of max memory
      this.config.onMemoryWarning(stats)
      console.warn(`⚠️ High memory usage: ${usedMB.toFixed(2)}MB / ${maxMB}MB`)
    }

    return stats
  }

  /**
   * Get current memory stats
   */
  getStats(): MemoryStats | null {
    if (typeof window === 'undefined' || !(performance as any).memory) {
      return null
    }

    const memory = (performance as any).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      timestamp: Date.now()
    }
  }

  /**
   * Cache transpiled code
   */
  cacheCode(key: string, code: string): void {
    // Limit cache size
    if (this.codeCache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const oldestKey = Array.from(this.codeCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
      this.codeCache.delete(oldestKey)
    }

    this.codeCache.set(key, {
      code,
      timestamp: Date.now()
    })
  }

  /**
   * Get cached code
   */
  getCachedCode(key: string): string | null {
    const cached = this.codeCache.get(key)
    if (!cached) {
      return null
    }

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.maxCacheAge) {
      this.codeCache.delete(key)
      return null
    }

    return cached.code
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now()
    for (const [key, value] of this.codeCache.entries()) {
      if (now - value.timestamp > this.maxCacheAge) {
        this.codeCache.delete(key)
      }
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.codeCache.clear()
    console.log('✅ Code cache cleared')
  }

  /**
   * Force garbage collection (if available)
   */
  forceGC(): void {
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc()
      console.log('✅ Garbage collection triggered')
    } else {
      console.warn('⚠️ Garbage collection not available')
    }
  }
}

// Singleton instance
let memoryMonitor: MemoryMonitor | null = null

export function getMemoryMonitor(): MemoryMonitor {
  if (!memoryMonitor) {
    memoryMonitor = new MemoryMonitor({
      maxMemoryMB: 100,
      checkInterval: 5000,
      onMemoryWarning: (stats) => {
        const usedMB = stats.usedJSHeapSize / 1024 / 1024
        console.warn(`⚠️ Memory warning: ${usedMB.toFixed(2)}MB used`)
      },
      onMemoryCritical: (stats) => {
        const usedMB = stats.usedJSHeapSize / 1024 / 1024
        console.error(`🚨 Critical memory: ${usedMB.toFixed(2)}MB used`)
        // Clear cache on critical memory
        memoryMonitor?.clearCache()
        memoryMonitor?.forceGC()
      }
    })
  }
  return memoryMonitor
}





