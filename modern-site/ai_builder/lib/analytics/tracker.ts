/**
 * Analytics & Monitoring Tracker
 * P1 Feature 13: Analytics & Monitoring
 */

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
  projectId?: string
  timestamp: number
}

export interface UsageMetrics {
  aiRequests: number
  projectsCreated: number
  deployments: number
  storageUsed: number
  apiCalls: number
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = []
  private maxEvents = 1000
  private listeners: Array<(event: AnalyticsEvent) => void> = []

  /**
   * Track event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now()
    }

    this.events.push(event)

    // Limit event count
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(event))

    // Send to analytics service (PostHog, Mixpanel, etc.)
    this.sendToAnalytics(event)
  }

  /**
   * Track AI request
   */
  trackAIRequest(userId: string, tokens: number, cost: number, projectId?: string): void {
    this.track('ai_request', {
      userId,
      projectId,
      tokens,
      cost,
      type: 'code_generation'
    })
  }

  /**
   * Track project creation
   */
  trackProjectCreation(userId: string, projectId: string): void {
    this.track('project_created', {
      userId,
      projectId
    })
  }

  /**
   * Track deployment
   */
  trackDeployment(userId: string, projectId: string, platform: string): void {
    this.track('deployment', {
      userId,
      projectId,
      platform
    })
  }

  /**
   * Track user action
   */
  trackUserAction(userId: string, action: string, metadata?: Record<string, any>): void {
    this.track('user_action', {
      userId,
      action,
      ...metadata
    })
  }

  /**
   * Get usage metrics
   */
  getUsageMetrics(userId: string, startDate?: Date, endDate?: Date): UsageMetrics {
    const start = startDate?.getTime() || 0
    const end = endDate?.getTime() || Date.now()

    const userEvents = this.events.filter(
      e => e.properties?.userId === userId && e.timestamp >= start && e.timestamp <= end
    )

    return {
      aiRequests: userEvents.filter(e => e.name === 'ai_request').length,
      projectsCreated: userEvents.filter(e => e.name === 'project_created').length,
      deployments: userEvents.filter(e => e.name === 'deployment').length,
      storageUsed: 0, // Would calculate from actual storage
      apiCalls: userEvents.length
    }
  }

  /**
   * Send to analytics service
   */
  private sendToAnalytics(event: AnalyticsEvent): void {
    // PostHog integration
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event.name, event.properties)
    }

    // Mixpanel integration
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(event.name, event.properties)
    }

    // Send to API
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(err => console.error('Analytics tracking failed:', err))
    }
  }

  /**
   * Subscribe to events
   */
  onEvent(listener: (event: AnalyticsEvent) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Clear events
   */
  clear(): void {
    this.events = []
  }
}

// Singleton instance
let analyticsTracker: AnalyticsTracker | null = null

export function getAnalyticsTracker(): AnalyticsTracker {
  if (!analyticsTracker) {
    analyticsTracker = new AnalyticsTracker()
  }
  return analyticsTracker
}





