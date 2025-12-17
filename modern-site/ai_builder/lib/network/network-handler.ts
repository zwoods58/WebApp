/**
 * Network Error Handler - Handle offline/online states
 * P1 Feature 6: Network Error Handling
 * 
 * Detects network status and handles offline scenarios
 */

export interface NetworkStatus {
  online: boolean
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export interface QueuedRequest {
  id: string
  url: string
  options: RequestInit
  resolve: (value: Response) => void
  reject: (error: Error) => void
  timestamp: number
  retries: number
}

class NetworkHandler {
  private online = true
  private requestQueue: QueuedRequest[] = []
  private maxRetries = 3
  private retryDelay = 1000 // 1 second

  constructor() {
    if (typeof window !== 'undefined') {
      this.online = navigator.onLine
      
      // Listen for online/offline events
      window.addEventListener('online', this.handleOnline.bind(this))
      window.addEventListener('offline', this.handleOffline.bind(this))
    }
  }

  /**
   * Get current network status
   */
  getNetworkStatus(): NetworkStatus {
    if (typeof window === 'undefined') {
      return { online: true }
    }

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData
    }
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return this.online
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    console.log('✅ Network online')
    this.online = true
    this.processQueue()
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    console.log('❌ Network offline')
    this.online = false
  }

  /**
   * Fetch with network error handling
   */
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // If offline, queue the request
    if (!this.online) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({
          id: `req-${Date.now()}-${Math.random()}`,
          url,
          options,
          resolve,
          reject,
          timestamp: Date.now(),
          retries: 0
        })
        console.log('📦 Request queued (offline):', url)
      })
    }

    // Try to fetch
    try {
      const response = await fetch(url, options)
      
      // If network error, retry
      if (!response.ok && response.status >= 500) {
        return this.retryFetch(url, options, 0)
      }
      
      return response
    } catch (error: any) {
      // Network error - check if we should retry
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        return this.retryFetch(url, options, 0)
      }
      throw error
    }
  }

  /**
   * Retry fetch with exponential backoff
   */
  private async retryFetch(url: string, options: RequestInit, attempt: number): Promise<Response> {
    if (attempt >= this.maxRetries) {
      throw new Error(`Failed to fetch after ${this.maxRetries} attempts`)
    }

    // Wait before retry (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt)))

    try {
      const response = await fetch(url, options)
      return response
    } catch (error: any) {
      if (attempt < this.maxRetries - 1) {
        return this.retryFetch(url, options, attempt + 1)
      }
      throw error
    }
  }

  /**
   * Process queued requests when online
   */
  private async processQueue(): Promise<void> {
    if (!this.online || this.requestQueue.length === 0) {
      return
    }

    const requests = [...this.requestQueue]
    this.requestQueue = []

    for (const request of requests) {
      try {
        const response = await this.fetch(request.url, request.options)
        request.resolve(response)
      } catch (error) {
        request.reject(error instanceof Error ? error : new Error(String(error)))
      }
    }
  }

  /**
   * Get queued request count
   */
  getQueueSize(): number {
    return this.requestQueue.length
  }

  /**
   * Clear request queue
   */
  clearQueue(): void {
    this.requestQueue.forEach(req => {
      req.reject(new Error('Request queue cleared'))
    })
    this.requestQueue = []
  }
}

// Singleton instance
let networkHandler: NetworkHandler | null = null

export function getNetworkHandler(): NetworkHandler {
  if (!networkHandler) {
    networkHandler = new NetworkHandler()
  }
  return networkHandler
}

// Hook for React components
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = React.useState<NetworkStatus>(() => {
    const handler = getNetworkHandler()
    return handler.getNetworkStatus()
  })

  React.useEffect(() => {
    const handler = getNetworkHandler()
    
    const updateStatus = () => {
      setStatus(handler.getNetworkStatus())
    }

    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  return status
}

// Import React for hook (conditional)
let React: any = null
if (typeof window !== 'undefined') {
  try {
    React = require('react')
  } catch {
    // React not available
  }
}





