/**
 * Offline Support
 * P1 Feature 18: Mobile Responsiveness - Offline Support
 */

export interface OfflineQueueItem {
  id: string
  type: 'api' | 'save' | 'sync'
  url?: string
  method?: string
  body?: any
  timestamp: number
}

class OfflineManager {
  private queue: OfflineQueueItem[] = []
  private listeners: Array<(online: boolean) => void> = []

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline())
      window.addEventListener('offline', () => this.handleOffline())
    }
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    if (typeof window === 'undefined') return true
    return navigator.onLine
  }

  /**
   * Queue request for when online
   */
  queueRequest(item: Omit<OfflineQueueItem, 'id' | 'timestamp'>): string {
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const queueItem: OfflineQueueItem = {
      id,
      ...item,
      timestamp: Date.now()
    }

    this.queue.push(queueItem)
    this.saveQueue()

    return id
  }

  /**
   * Process queued requests when online
   */
  async processQueue(): Promise<void> {
    if (!this.isOnline() || this.queue.length === 0) {
      return
    }

    const items = [...this.queue]
    this.queue = []

    for (const item of items) {
      try {
        if (item.type === 'api' && item.url) {
          await fetch(item.url, {
            method: item.method || 'GET',
            body: item.body ? JSON.stringify(item.body) : undefined,
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }
      } catch (error) {
        // Re-queue failed items
        this.queue.push(item)
      }
    }

    this.saveQueue()
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.notifyListeners(true)
    this.processQueue()
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.notifyListeners(false)
  }

  /**
   * Notify listeners
   */
  private notifyListeners(online: boolean): void {
    this.listeners.forEach(listener => listener(online))
  }

  /**
   * Subscribe to online/offline changes
   */
  onStatusChange(listener: (online: boolean) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('offline_queue', JSON.stringify(this.queue))
    }
  }

  /**
   * Load queue from localStorage
   */
  loadQueue(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('offline_queue')
      if (saved) {
        try {
          this.queue = JSON.parse(saved)
        } catch {
          this.queue = []
        }
      }
    }
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.queue = []
    this.saveQueue()
  }
}

// Singleton instance
let offlineManager: OfflineManager | null = null

export function getOfflineManager(): OfflineManager {
  if (!offlineManager && typeof window !== 'undefined') {
    offlineManager = new OfflineManager()
    offlineManager.loadQueue()
  }
  return offlineManager!
}





