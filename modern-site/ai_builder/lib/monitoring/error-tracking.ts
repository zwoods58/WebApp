/**
 * Error Tracking - Production error monitoring
 * P0 Feature 2: Error Tracking & Analytics
 * 
 * Integrates with Sentry (or similar) for production error tracking
 */

export interface ErrorContext {
  componentCode?: string
  draftId?: string
  errorType: 'render' | 'runtime' | 'network' | 'transpilation' | 'validation' | 'syntax' | 'memory' | 'timeout' | 'unknown'
  severity: 'critical' | 'high' | 'medium' | 'low'
  userAgent?: string
  url?: string
  timestamp: number
  [key: string]: any
}

export interface ErrorTrackingService {
  captureError(error: Error, context?: ErrorContext): void
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', context?: ErrorContext): void
  setUser(userId: string, email?: string): void
  setContext(key: string, value: any): void
}

class SentryErrorTracking implements ErrorTrackingService {
  private initialized = false

  async initialize(dsn?: string): Promise<void> {
    if (this.initialized) {
      return
    }

    // Only initialize in production or if DSN is provided
    if (typeof window === 'undefined' || (!dsn && process.env.NODE_ENV !== 'production')) {
      console.log('⚠️ Error tracking not initialized (development mode or no DSN)')
      return
    }

    try {
      // Dynamic import to avoid bundling Sentry in development
      const Sentry = await import('@sentry/nextjs')
      
      Sentry.init({
        dsn: dsn || process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: 0.1, // 10% of transactions
        beforeSend(event, hint) {
          // Filter out development errors
          if (process.env.NODE_ENV === 'development') {
            return null
          }
          return event
        },
        ignoreErrors: [
          // Ignore common browser extensions
          'ResizeObserver loop limit exceeded',
          'Non-Error promise rejection captured'
        ]
      })

      this.initialized = true
      console.log('✅ Error tracking initialized')
    } catch (error) {
      console.warn('⚠️ Failed to initialize error tracking:', error)
    }
  }

  captureError(error: Error, context?: ErrorContext): void {
    if (!this.initialized) {
      console.error('Error (not tracked):', error, context)
      return
    }

    try {
      // Dynamic import
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureException(error, {
          tags: {
            errorType: context?.errorType || 'unknown',
            severity: context?.severity || 'medium'
          },
          extra: context,
          level: this.getSeverityLevel(context?.severity)
        })
      })
    } catch (err) {
      console.error('Failed to capture error:', err)
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
    if (!this.initialized) {
      console.log(`Message (not tracked) [${level}]:`, message, context)
      return
    }

    try {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureMessage(message, {
          level: this.getSeverityLevel(context?.severity || 'low'),
          tags: {
            errorType: context?.errorType || 'unknown'
          },
          extra: context
        })
      })
    } catch (err) {
      console.error('Failed to capture message:', err)
    }
  }

  setUser(userId: string, email?: string): void {
    if (!this.initialized) return

    try {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.setUser({
          id: userId,
          email
        })
      })
    } catch (err) {
      console.error('Failed to set user:', err)
    }
  }

  setContext(key: string, value: any): void {
    if (!this.initialized) return

    try {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.setContext(key, value)
      })
    } catch (err) {
      console.error('Failed to set context:', err)
    }
  }

  private getSeverityLevel(severity?: string): 'debug' | 'info' | 'warning' | 'error' | 'fatal' {
    switch (severity) {
      case 'critical':
        return 'fatal'
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'info'
    }
  }
}

class ConsoleErrorTracking implements ErrorTrackingService {
  captureError(error: Error, context?: ErrorContext): void {
    console.error('🔴 Error:', error.message, context)
    console.error('Stack:', error.stack)
  }

  captureMessage(message: string, level?: 'info' | 'warning' | 'error', context?: ErrorContext): void {
    const prefix = level === 'error' ? '🔴' : level === 'warning' ? '⚠️' : 'ℹ️'
    console.log(`${prefix} ${message}`, context)
  }

  setUser(userId: string, email?: string): void {
    console.log('👤 User:', userId, email)
  }

  setContext(key: string, value: any): void {
    console.log(`📝 Context [${key}]:`, value)
  }
}

// Singleton instance
let errorTracker: ErrorTrackingService | null = null

export function getErrorTracker(): ErrorTrackingService {
  if (!errorTracker) {
    // Use Sentry in production, console in development
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      errorTracker = new SentryErrorTracking()
      // Initialize async (don't await)
      errorTracker.initialize().catch(console.error)
    } else {
      errorTracker = new ConsoleErrorTracking()
    }
  }
  return errorTracker
}

export function initializeErrorTracking(dsn?: string): Promise<void> {
  const tracker = getErrorTracker()
  if (tracker instanceof SentryErrorTracking) {
    return tracker.initialize(dsn)
  }
  return Promise.resolve()
}

// Helper functions
export function trackError(error: Error, context?: Partial<ErrorContext>): void {
  const tracker = getErrorTracker()
  const fullContext: ErrorContext = {
    errorType: 'unknown',
    severity: 'medium',
    timestamp: Date.now(),
    ...context
  }
  tracker.captureError(error, fullContext)
}

export function trackMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Partial<ErrorContext>): void {
  const tracker = getErrorTracker()
  const fullContext: ErrorContext = {
    errorType: 'unknown',
    severity: 'low',
    timestamp: Date.now(),
    ...context
  }
  tracker.captureMessage(message, level, fullContext)
}





