import { supabase } from './supabase'

export interface AnalyticsEvent {
  page: string
  event: string
  metadata?: Record<string, any>
}

export class Analytics {
  private sessionId: string

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  async track(event: AnalyticsEvent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase.from('analytics').insert({
        page: event.page,
        event: event.event,
        user_id: user?.id || null,
        session_id: this.sessionId,
        metadata: event.metadata || null
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Page view tracking
  async trackPageView(page: string): Promise<void> {
    await this.track({
      page,
      event: 'page_view'
    })
  }

  // Form submission tracking
  async trackFormSubmission(formName: string, success: boolean = true): Promise<void> {
    await this.track({
      page: window.location.pathname,
      event: 'form_submission',
      metadata: {
        form_name: formName,
        success
      }
    })
  }

  // Button click tracking
  async trackButtonClick(buttonName: string, location: string): Promise<void> {
    await this.track({
      page: window.location.pathname,
      event: 'button_click',
      metadata: {
        button_name: buttonName,
        location
      }
    })
  }

  // Contact form tracking
  async trackContactForm(data: {
    name: string
    email: string
    projectType: string
    budget?: string
  }): Promise<void> {
    await this.track({
      page: window.location.pathname,
      event: 'contact_form_submission',
      metadata: {
        has_name: !!data.name,
        has_email: !!data.email,
        project_type: data.projectType,
        has_budget: !!data.budget,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Portfolio view tracking
  async trackPortfolioView(projectId: string, projectTitle: string): Promise<void> {
    await this.track({
      page: '/portfolio',
      event: 'portfolio_view',
      metadata: {
        project_id: projectId,
        project_title: projectTitle
      }
    })
  }
}

// Create a singleton instance
export const analytics = new Analytics()

// Hook for React components
export function useAnalytics() {
  return analytics
}
