/**
 * Service Worker Registration and Background Sync Management
 * Handles SW lifecycle, sync registration, and client communication
 */

import { initializeQueue } from '@/utils/offlineQueue'

type SyncCompleteCallback = (data?: { successCount: number; failureCount: number; total: number }) => void
const syncCallbacks: SyncCompleteCallback[] = []

export function onSyncComplete(cb: SyncCompleteCallback) {
  syncCallbacks.push(cb)
}

// Re-export initializeQueue for convenience
export { initializeQueue }

export async function registerSync(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  
  try {
    const sw = await navigator.serviceWorker.ready
    if ('sync' in sw) {
      await (sw as any).sync.register('sync-beezee-queue')
      console.log('[SW] Background sync registered')
    } else {
      console.log('[SW] Background Sync not supported')
    }
  } catch (err) {
    console.warn('[SW] Background Sync registration failed:', err)
  }
}

export function initServiceWorker() {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Service Worker not supported')
    return
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('[SW] Service Worker registered:', registration.scope)

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New SW is available, show update notification
              console.log('[SW] New version available')
              // You could show a UI prompt here to refresh the page
            }
          })
        }
      })

      // Listen for sync complete message from SW
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data?.type === 'SYNC_COMPLETE') {
          console.log('[SW] Sync complete received:', event.data)
          syncCallbacks.forEach(cb => cb(event.data))
        }
      })

    } catch (err) {
      console.error('[SW] Service Worker registration failed:', err)
    }
  })
}

// Check if Service Worker is supported and ready
export async function isServiceWorkerReady(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false
  
  try {
    const registration = await navigator.serviceWorker.ready
    return !!registration.active
  } catch {
    return false
  }
}

// Trigger manual sync (for Safari fallback or manual refresh)
export async function triggerManualSync(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  
  try {
    const registration = await navigator.serviceWorker.ready
    if ('sync' in registration) {
      await (registration as any).sync.register('sync-beezee-queue')
      console.log('[SW] Manual sync triggered')
    } else {
      // Safari fallback: trigger client-side sync
      console.log('[SW] Background Sync not supported, using client-side fallback')
      const { flushQueueFromClient } = await import('@/services/offlineSyncHandler')
      await flushQueueFromClient()
    }
  } catch (err) {
    console.error('[SW] Manual sync failed:', err)
  }
}

// Get current service worker version/info
export async function getServiceWorkerInfo(): Promise<{
  active: boolean
  state: string
  scope: string
}> {
  if (!('serviceWorker' in navigator)) {
    return { active: false, state: 'unsupported', scope: '' }
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const active = registration.active
    return {
      active: !!active,
      state: active?.state || 'none',
      scope: registration.scope
    }
  } catch {
    return { active: false, state: 'error', scope: '' }
  }
}

// Update service worker (skip waiting and activate new version)
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.ready
    if (registration.waiting) {
      // Tell the waiting SW to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Reload the page to activate the new SW
      window.location.reload()
    } else if (registration.installing) {
      console.log('[SW] Service Worker is installing...')
    } else {
      console.log('[SW] Service Worker is up to date')
    }
  } catch (err) {
    console.error('[SW] Failed to update service worker:', err)
  }
}
