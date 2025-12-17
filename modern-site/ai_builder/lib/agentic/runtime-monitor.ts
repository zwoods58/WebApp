/**
 * P2 Feature 13: Runtime Error Monitoring
 * Monitors console errors, network errors, and performance
 */

export interface RuntimeError {
  type: 'console' | 'network' | 'unhandled' | 'promise'
  message: string
  stack?: string
  timestamp: Date
  url?: string
  line?: number
  column?: number
  userAgent?: string
}

export type ErrorHandler = (error: RuntimeError) => void

class RuntimeMonitor {
  private errorHandlers: ErrorHandler[] = []
  private errors: RuntimeError[] = []
  private maxErrors = 100

  /**
   * Initialize runtime error monitoring
   */
  init(): void {
    if (typeof window === 'undefined') return

    // Console errors
    const originalError = console.error
    console.error = (...args: any[]) => {
      originalError.apply(console, args)
      this.handleError({
        type: 'console',
        message: args.map(arg => String(arg)).join(' '),
        timestamp: new Date(),
        userAgent: navigator.userAgent
      })
    }

    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'unhandled',
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        userAgent: navigator.userAgent
      })
    })

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      })
    })

    // Network errors
    this.monitorNetworkErrors()
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
          this.handleError({
            type: 'network',
            message: `Network error: ${response.status} ${response.statusText}`,
            timestamp: new Date(),
            url: args[0] as string,
            userAgent: navigator.userAgent
          })
        }
        
        return response
      } catch (error: any) {
        this.handleError({
          type: 'network',
          message: `Network error: ${error.message}`,
          timestamp: new Date(),
          url: args[0] as string,
          userAgent: navigator.userAgent
        })
        throw error
      }
    }
  }

  /**
   * Handle error
   */
  private handleError(error: RuntimeError): void {
    this.errors.push(error)
    
    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Notify handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(error)
      } catch (e) {
        console.error('Error handler failed:', e)
      }
    })
  }

  /**
   * Register error handler
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler)
    
    // Return unsubscribe function
    return () => {
      const index = this.errorHandlers.indexOf(handler)
      if (index > -1) {
        this.errorHandlers.splice(index, 1)
      }
    }
  }

  /**
   * Get all errors
   */
  getErrors(): RuntimeError[] {
    return [...this.errors]
  }

  /**
   * Clear errors
   */
  clearErrors(): void {
    this.errors = []
  }

  /**
   * Get error count by type
   */
  getErrorCounts(): Record<string, number> {
    const counts: Record<string, number> = {}
    
    this.errors.forEach(error => {
      counts[error.type] = (counts[error.type] || 0) + 1
    })
    
    return counts
  }
}

// Singleton instance
let monitorInstance: RuntimeMonitor | null = null

/**
 * Get runtime monitor instance
 */
export function getRuntimeMonitor(): RuntimeMonitor {
  if (!monitorInstance) {
    monitorInstance = new RuntimeMonitor()
    monitorInstance.init()
  }
  return monitorInstance
}

/**
 * Auto-fix runtime errors (integrate with error fixing system)
 */
export function setupAutoFixRuntimeErrors(
  onError: (error: RuntimeError) => Promise<void>
): () => void {
  const monitor = getRuntimeMonitor()
  
  return monitor.onError(async (error) => {
    // Only auto-fix console and unhandled errors (not network errors)
    if (error.type === 'console' || error.type === 'unhandled') {
      await onError(error)
    }
  })
}





