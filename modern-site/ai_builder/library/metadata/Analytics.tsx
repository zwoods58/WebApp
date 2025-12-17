/**
 * Analytics - React component for analytics scripts
 * Supports Google Analytics, Plausible, and custom analytics
 */

import React, { useEffect } from 'react'

export interface AnalyticsProps {
  googleAnalyticsId?: string
  plausibleDomain?: string
  customScript?: string
  customScriptUrl?: string
}

export default function Analytics({
  googleAnalyticsId,
  plausibleDomain,
  customScript,
  customScriptUrl
}: AnalyticsProps) {
  useEffect(() => {
    // Google Analytics
    if (googleAnalyticsId && typeof window !== 'undefined') {
      // Initialize gtag
      if (!window.dataLayer) {
        window.dataLayer = []
      }
      function gtag(...args: any[]) {
        if (window.dataLayer) {
          window.dataLayer.push(args)
        }
      }
      gtag('js', new Date())
      gtag('config', googleAnalyticsId)

      // Load Google Analytics script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
      document.head.appendChild(script)
    }

    // Plausible Analytics
    if (plausibleDomain && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.defer = true
      script.setAttribute('data-domain', plausibleDomain)
      script.src = 'https://plausible.io/js/script.js'
      document.head.appendChild(script)
    }

    // Custom script URL
    if (customScriptUrl && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = customScriptUrl
      script.async = true
      document.head.appendChild(script)
    }

    // Custom inline script
    if (customScript && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.innerHTML = customScript
      document.head.appendChild(script)
    }
  }, [googleAnalyticsId, plausibleDomain, customScript, customScriptUrl])

  return null // This component doesn't render anything
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer?: any[]
  }
}
