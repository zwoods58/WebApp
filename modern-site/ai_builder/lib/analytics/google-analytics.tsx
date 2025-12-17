/**
 * Google Analytics Integration
 * Provides Google Analytics 4 (GA4) tracking
 */

'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export interface GoogleAnalyticsProps {
  measurementId: string
  enabled?: boolean
}

/**
 * Google Analytics Component
 */
export function GoogleAnalytics({ measurementId, enabled = true }: GoogleAnalyticsProps) {
  if (!enabled || !measurementId) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

/**
 * Track custom event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string) {
  trackEvent('form_submit', 'engagement', formName)
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string) {
  trackEvent('click', 'button', buttonName)
}

/**
 * Track outbound link
 */
export function trackOutboundLink(url: string) {
  trackEvent('click', 'outbound', url)
}

/**
 * Hook for tracking page views on route changes
 */
export function usePageTracking() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname)
    }
  }, [])
}



