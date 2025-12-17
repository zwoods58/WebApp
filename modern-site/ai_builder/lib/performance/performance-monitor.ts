/**
 * Performance Monitor - Track render times and Web Vitals
 * P1 Feature 7: Performance Monitoring
 * 
 * Tracks render times, API response times, and Web Vitals
 */

export interface PerformanceMetrics {
  renderTime: number
  apiResponseTime?: number
  componentName?: string
  timestamp: number
}

export interface WebVitals {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
}

export interface PerformanceMonitorConfig {
  trackRenderTimes?: boolean
  trackApiTimes?: boolean
  trackWebVitals?: boolean
  onMetrics?: (metrics: PerformanceMetrics) => void
  onWebVitals?: (vitals: WebVitals) => void
}

class PerformanceMonitor {
  private config: Required<PerformanceMonitorConfig>
  private renderTimes: number[] = []
  private apiTimes: number[] = []
  private maxHistorySize = 100

  constructor(config: PerformanceMonitorConfig = {}) {
    this.config = {
      trackRenderTimes: config.trackRenderTimes !== false,
      trackApiTimes: config.trackApiTimes !== false,
      trackWebVitals: config.trackWebVitals !== false,
      onMetrics: config.onMetrics || (() => {}),
      onWebVitals: config.onWebVitals || (() => {})
    }

    if (this.config.trackWebVitals && typeof window !== 'undefined') {
      this.initializeWebVitals()
    }
  }

  /**
   * Track render time
   */
  trackRender(componentName: string, renderTime: number): void {
    if (!this.config.trackRenderTimes) {
      return
    }

    this.renderTimes.push(renderTime)
    if (this.renderTimes.length > this.maxHistorySize) {
      this.renderTimes.shift()
    }

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    }

    this.config.onMetrics(metrics)

    // Log slow renders (>500ms)
    if (renderTime > 500) {
      console.warn(`⚠️ Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`)
    }
  }

  /**
   * Track API response time
   */
  trackApi(url: string, responseTime: number): void {
    if (!this.config.trackApiTimes) {
      return
    }

    this.apiTimes.push(responseTime)
    if (this.apiTimes.length > this.maxHistorySize) {
      this.apiTimes.shift()
    }

    const metrics: PerformanceMetrics = {
      renderTime: 0,
      apiResponseTime: responseTime,
      timestamp: Date.now()
    }

    this.config.onMetrics(metrics)

    // Log slow API calls (>2000ms)
    if (responseTime > 2000) {
      console.warn(`⚠️ Slow API call: ${url} took ${responseTime.toFixed(2)}ms`)
    }
  }

  /**
   * Get average render time
   */
  getAverageRenderTime(): number {
    if (this.renderTimes.length === 0) {
      return 0
    }
    return this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
  }

  /**
   * Get average API time
   */
  getAverageApiTime(): number {
    if (this.apiTimes.length === 0) {
      return 0
    }
    return this.apiTimes.reduce((a, b) => a + b, 0) / this.apiTimes.length
  }

  /**
   * Initialize Web Vitals tracking
   */
  private initializeWebVitals(): void {
    if (typeof window === 'undefined') {
      return
    }

    // Track LCP (Largest Contentful Paint)
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        const lcp = lastEntry.renderTime || lastEntry.loadTime
        
        this.config.onWebVitals({
          lcp
        })
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // Web Vitals not supported
    }

    // Track FID (First Input Delay)
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime
          this.config.onWebVitals({
            fid
          })
        })
      }).observe({ entryTypes: ['first-input'] })
    } catch (e) {
      // Not supported
    }

    // Track CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.config.onWebVitals({
          cls: clsValue
        })
      }).observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // Not supported
    }
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    averageRenderTime: number
    averageApiTime: number
    renderCount: number
    apiCount: number
  } {
    return {
      averageRenderTime: this.getAverageRenderTime(),
      averageApiTime: this.getAverageApiTime(),
      renderCount: this.renderTimes.length,
      apiCount: this.apiTimes.length
    }
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor({
      trackRenderTimes: true,
      trackApiTimes: true,
      trackWebVitals: true,
      onMetrics: (metrics) => {
        // Log metrics (can be sent to analytics)
        if (metrics.renderTime > 0) {
          console.log(`📊 Render: ${metrics.componentName} - ${metrics.renderTime.toFixed(2)}ms`)
        }
        if (metrics.apiResponseTime) {
          console.log(`📊 API: ${metrics.apiResponseTime.toFixed(2)}ms`)
        }
      },
      onWebVitals: (vitals) => {
        // Log Web Vitals (can be sent to analytics)
        if (vitals.lcp) {
          console.log(`📊 LCP: ${vitals.lcp.toFixed(2)}ms`)
        }
        if (vitals.fid) {
          console.log(`📊 FID: ${vitals.fid.toFixed(2)}ms`)
        }
        if (vitals.cls) {
          console.log(`📊 CLS: ${vitals.cls.toFixed(4)}`)
        }
      }
    })
  }
  return performanceMonitor
}





