/**
 * Progressive Web App (PWA) Support
 * P1 Feature 18: Mobile Responsiveness - PWA Support
 */

export interface PWAConfig {
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
  display: 'standalone' | 'fullscreen' | 'minimal-ui'
  icons: Array<{
    src: string
    sizes: string
    type: string
  }>
}

/**
 * Generate PWA manifest
 */
export function generatePWAManifest(config: PWAConfig): any {
  return {
    name: config.name,
    short_name: config.shortName,
    description: config.description,
    start_url: '/',
    display: config.display,
    theme_color: config.themeColor,
    background_color: config.backgroundColor,
    icons: config.icons,
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en'
  }
}

/**
 * Check if PWA is installable
 */
export function isPWAInstallable(): boolean {
  if (typeof window === 'undefined') return false

  // Check for beforeinstallprompt event support
  return 'serviceWorker' in navigator && 'PushManager' in window
}

/**
 * Request PWA installation
 */
export async function requestPWAInstall(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  // This would be triggered by the browser's install prompt
  // The actual installation is handled by the browser
  return true
}

/**
 * Check if app is running as PWA
 */
export function isRunningAsPWA(): boolean {
  if (typeof window === 'undefined') return false

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}





