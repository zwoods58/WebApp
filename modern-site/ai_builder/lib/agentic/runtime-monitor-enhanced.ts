/**
 * Enhanced Runtime Error Detection
 * P2 Feature 15: Enhanced Runtime Error Detection
 */

import { getRuntimeMonitor } from './runtime-monitor'

export interface PreviewError {
  type: 'console' | 'network' | 'performance' | 'unhandled'
  message: string
  stack?: string
  url?: string
  line?: number
  column?: number
  timestamp: Date
}

class EnhancedRuntimeMonitor {
  private errors: PreviewError[] = []
  private maxErrors = 100

  /**
   * Initialize enhanced monitoring
   */
  init(previewIframe: HTMLIFrameElement): void {
    // Monitor iframe errors
    this.monitorIframe(previewIframe)

    // Monitor network errors
    this.monitorNetworkErrors()

    // Monitor performance
    this.monitorPerformance()
  }

  /**
   * Monitor preview iframe errors
   */
  private monitorIframe(iframe: HTMLIFrameElement): void {
    iframe.addEventListener('load', () => {
      try {
        const iframeWindow = iframe.contentWindow
        if (!iframeWindow) return

        // Capture errors from iframe
        iframeWindow.addEventListener('error', (event) => {
          this.errors.push({
            type: 'unhandled',
            message: event.message,
            url: event.filename,
            line: event.lineno,
            column: event.colno,
            timestamp: new Date()
          })

          // Limit errors
          if (this.errors.length > this.maxErrors) {
            this.errors.shift()
          }
        })

        // Capture console errors from iframe
        const originalConsoleError = iframeWindow.console.error
        iframeWindow.console.error = (...args: any[]) => {
          originalConsoleError.apply(iframeWindow.console, args)
          this.errors.push({
            type: 'console',
            message: args.map(a => String(a)).join(' '),
            timestamp: new Date()
          })
        }
      } catch (error) {
        // Cross-origin restrictions may prevent access
        console.warn('Cannot monitor iframe errors (cross-origin):', error)
      }
    })
  }

  /**
   * Monitor network errors
   */
  private monitorNetworkErrors(): void {
    if (typeof window === 'undefined') return

    // Intercept fetch
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        if (!response.ok) {
          this.errors.push({
            type: 'network',
            message: `Network error: ${response.status} ${response.statusText}`,
            url: args[0] as string,
            timestamp: new Date()
          })
        }
        return response
      } catch (error: any) {
        this.errors.push({
          type: 'network',
          message: `Network error: ${error.message}`,
          url: args[0] as string,
          timestamp: new Date()
        })
        throw error
      }
    }
  }

  /**
   * Monitor performance issues
   */
  private monitorPerformance(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.duration > 1000) {
            this.errors.push({
              type: 'performance',
              message: `Slow operation detected: ${entry.name} took ${entry.duration}ms`,
              timestamp: new Date()
            })
          }
        }
      })

      observer.observe({ entryTypes: ['measure', 'navigation'] })
    } catch (error) {
      console.warn('Performance monitoring not available:', error)
    }
  }

  /**
   * Get all errors
   */
  getErrors(): PreviewError[] {
    return [...this.errors]
  }

  /**
   * Clear errors
   */
  clearErrors(): void {
    this.errors = []
  }
}

// Singleton instance
let enhancedRuntimeMonitor: EnhancedRuntimeMonitor | null = null

export function getEnhancedRuntimeMonitor(): EnhancedRuntimeMonitor {
  if (!enhancedRuntimeMonitor) {
    enhancedRuntimeMonitor = new EnhancedRuntimeMonitor()
  }
  return enhancedRuntimeMonitor
}





