/**
 * Error Queue Manager
 * P2 Feature 18: Error Queue System
 */

import { Error } from '../error-handling/error-categorizer'

export interface QueuedError {
  id: string
  error: Error
  priority: number
  timestamp: Date
  attempts: number
  metadata?: Record<string, any>
}

class ErrorQueueManager {
  private queue: QueuedError[] = []
  private processing: boolean = false

  /**
   * Add error to queue
   */
  enqueue(error: Error, priority: number = 5, metadata?: Record<string, any>): string {
    const queuedError: QueuedError = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error,
      priority,
      timestamp: new Date(),
      attempts: 0,
      metadata
    }

    this.queue.push(queuedError)
    this.queue.sort((a, b) => b.priority - a.priority) // Higher priority first

    return queuedError.id
  }

  /**
   * Process queue
   */
  async processQueue(
    processor: (error: QueuedError) => Promise<boolean>
  ): Promise<void> {
    if (this.processing) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const queuedError = this.queue.shift()
      if (!queuedError) break

      try {
        queuedError.attempts++
        const success = await processor(queuedError)

        if (!success && queuedError.attempts < 3) {
          // Re-queue with lower priority
          queuedError.priority = Math.max(1, queuedError.priority - 1)
          this.queue.push(queuedError)
        }
      } catch (error) {
        console.error('Error processing queue item:', error)
        // Re-queue with lower priority
        if (queuedError.attempts < 3) {
          queuedError.priority = Math.max(1, queuedError.priority - 1)
          this.queue.push(queuedError)
        }
      }
    }

    this.processing = false
  }

  /**
   * Batch process errors
   */
  async processBatch(
    processor: (errors: QueuedError[]) => Promise<void>,
    batchSize: number = 5
  ): Promise<void> {
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, batchSize)
      await processor(batch)
    }
  }

  /**
   * Deduplicate errors
   */
  deduplicate(): void {
    const seen = new Map<string, QueuedError>()

    this.queue = this.queue.filter(queuedError => {
      const key = `${queuedError.error.message}-${queuedError.error.name}`
      if (seen.has(key)) {
        // Keep the one with higher priority
        const existing = seen.get(key)!
        if (queuedError.priority > existing.priority) {
          seen.set(key, queuedError)
          return true
        }
        return false
      }
      seen.set(key, queuedError)
      return true
    })
  }

  /**
   * Get queue size
   */
  getSize(): number {
    return this.queue.length
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = []
  }

  /**
   * Get queue
   */
  getQueue(): QueuedError[] {
    return [...this.queue]
  }
}

// Singleton instance
let errorQueueManager: ErrorQueueManager | null = null

export function getErrorQueueManager(): ErrorQueueManager {
  if (!errorQueueManager) {
    errorQueueManager = new ErrorQueueManager()
  }
  return errorQueueManager
}





