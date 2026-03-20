// src/lib/connection-manager.ts
import { onlineManager } from '@tanstack/react-query'

let isChecking = false
let intervalId: NodeJS.Timeout | null = null

/**
 * Check actual internet connectivity by pinging Supabase
 */
async function checkConnection() {
  if (isChecking) return
  isChecking = true
  
  try {
    const response = await fetch(
      'https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/health',
      { 
        method: 'HEAD', 
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
      }
    )
    
    // 401 means the server exists (just not authenticated) = online
    const isOnline = response.ok || response.status === 401
    onlineManager.setOnline(isOnline)
    
    if (isOnline) {
      console.log('✅ Connection: ONLINE')
    } else {
      console.log('📴 Connection: OFFLINE')
    }
  } catch (error) {
    onlineManager.setOnline(false)
    console.log('📴 Connection: OFFLINE')
  } finally {
    isChecking = false
  }
}

/**
 * Initialize connection monitoring
 * Call this once when your app starts
 */
export function initConnectionMonitoring() {
  if (typeof window === 'undefined') return
  
  // Initial check
  checkConnection()
  
  // Listen to browser events (they're hints, not truth)
  window.addEventListener('online', () => {
    console.log('Browser says online - verifying...')
    checkConnection()
  })
  
  window.addEventListener('offline', () => {
    console.log('Browser says offline')
    onlineManager.setOnline(false)
  })
  
  // Periodic check every 30 seconds
  intervalId = setInterval(checkConnection, 30000)
}

/**
 * Cleanup connection monitoring
 * Call this when your app unmounts
 */
export function cleanupConnectionMonitoring() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

/**
 * Get current connection status
 */
export function getConnectionStatus() {
  return onlineManager.isOnline()
}
