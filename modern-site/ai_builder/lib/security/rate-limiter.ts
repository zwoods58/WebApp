/**
 * Rate Limiter - Prevent API abuse
 * P0 Feature 3: Rate Limiting & Abuse Prevention
 * 
 * Limits auto-fix API calls per draft/user to prevent abuse
 */

export interface RateLimitConfig {
  maxRequests: number // Maximum requests per window
  windowMs: number // Time window in milliseconds
  keyGenerator?: (draftId: string, userId?: string) => string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number // Seconds until next request allowed
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()
  private config: Required<RateLimitConfig>

  constructor(config: RateLimitConfig) {
    this.config = {
      maxRequests: config.maxRequests || 10,
      windowMs: config.windowMs || 60000, // 1 minute default
      keyGenerator: config.keyGenerator || ((draftId) => `draft:${draftId}`)
    }
  }

  /**
   * Check if request is allowed
   */
  check(draftId: string, userId?: string): RateLimitResult {
    const key = this.config.keyGenerator(draftId, userId)
    const now = Date.now()
    const record = this.requests.get(key)

    // Clean up expired records
    this.cleanup()

    if (!record || now >= record.resetTime) {
      // New window or expired - allow request
      const resetTime = now + this.config.windowMs
      this.requests.set(key, {
        count: 1,
        resetTime
      })

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime
      }
    }

    // Check if limit exceeded
    if (record.count >= this.config.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000)
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter
      }
    }

    // Increment count
    record.count++
    this.requests.set(key, record)

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime
    }
  }

  /**
   * Clean up expired records
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.requests.entries()) {
      if (now >= record.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  /**
   * Reset rate limit for a key
   */
  reset(draftId: string, userId?: string): void {
    const key = this.config.keyGenerator(draftId, userId)
    this.requests.delete(key)
  }

  /**
   * Get current rate limit status
   */
  getStatus(draftId: string, userId?: string): RateLimitResult {
    const key = this.config.keyGenerator(draftId, userId)
    const record = this.requests.get(key)
    const now = Date.now()

    if (!record || now >= record.resetTime) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs
      }
    }

    return {
      allowed: record.count < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - record.count),
      resetTime: record.resetTime,
      retryAfter: record.count >= this.config.maxRequests
        ? Math.ceil((record.resetTime - now) / 1000)
        : undefined
    }
  }
}

// Client-side rate limiter (for UI feedback)
let clientRateLimiter: RateLimiter | null = null

export function getClientRateLimiter(): RateLimiter {
  if (!clientRateLimiter) {
    clientRateLimiter = new RateLimiter({
      maxRequests: 10, // 10 requests
      windowMs: 60000 // per minute
    })
  }
  return clientRateLimiter
}

// Server-side rate limiter (for API protection)
// This should be implemented in the API route
export function createServerRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config)
}

// Helper function to check rate limit before API call
export async function checkRateLimit(draftId: string, userId?: string): Promise<RateLimitResult> {
  const limiter = getClientRateLimiter()
  return limiter.check(draftId, userId)
}





