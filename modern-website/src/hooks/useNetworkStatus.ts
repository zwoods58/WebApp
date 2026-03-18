/**
 * Network Status Hook
 * Uses native online/offline events instead of httpbin polling
 * Integrates with Service Worker Background Sync
 */

import { useEffect, useState } from 'react'
import { registerSync } from '@/utils/registerSW'
import { getQueue } from '@/utils/offlineQueue'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = async () => {
      console.log('[Network] Connection restored')
      setIsOnline(true)

      // Primary: register Background Sync (Chromium/Android)
      await registerSync()

      // Safari fallback: if Background Sync not supported, 
      // attempt direct flush from client side
      try {
        const registration = await navigator.serviceWorker.ready
        if (!('sync' in registration)) {
          console.log('[Network] Background Sync not supported, using client-side fallback')
          const { flushQueueFromClient } = await import('@/services/offlineSyncHandler')
          await flushQueueFromClient()
        }
      } catch (err) {
        console.warn('[Network] Failed to check Background Sync support:', err)
      }
    }

    const handleOffline = () => {
      console.log('[Network] Connection lost')
      setIsOnline(false)
    }

    // Add native event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline }
}
