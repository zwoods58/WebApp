import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and ensures fair usage
 * 
 * Uses Upstash Redis for distributed rate limiting in production
 * Falls back to in-memory rate limiting for development
 */

// In-memory store for development (not suitable for production with multiple instances)
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup old entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.requests.entries()) {
        if (now > value.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 60000);
  }

  async limit(identifier: string, maxRequests: number, windowMs: number): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const current = this.requests.get(identifier);
    
    if (!current || now > current.resetTime) {
      // New window
      this.requests.set(identifier, { count: 1, resetTime });
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: resetTime
      };
    }
    
    if (current.count >= maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: current.resetTime
      };
    }
    
    // Increment count
    current.count++;
    this.requests.set(identifier, current);
    
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - current.count,
      reset: current.resetTime
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Initialize rate limiter based on environment
let rateLimiter: Ratelimit | null = null;
let inMemoryLimiter: InMemoryRateLimiter | null = null;

function getRateLimiter(config: RateLimitConfig): Ratelimit | InMemoryRateLimiter {
  // Use Upstash Redis in production if configured
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!rateLimiter) {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      rateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowMs} ms`),
        analytics: true,
        prefix: '@beezee/ratelimit',
      });
    }
    return rateLimiter;
  }

  // Fall back to in-memory for development
  if (!inMemoryLimiter) {
    inMemoryLimiter = new InMemoryRateLimiter();
    console.log('⚠️  Using in-memory rate limiting (development only)');
  }
  return inMemoryLimiter;
}

// Rate limit configurations for different endpoint types
export interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

export const RATE_LIMITS = {
  // Authentication endpoints - stricter limits
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // PIN verification - very strict to prevent brute force
  PIN_VERIFY: {
    maxRequests: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Data operations - moderate limits
  DATA: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // Read operations - more lenient
  READ: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
  },
  // Sync operations - moderate limits
  SYNC: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minute
  },
  // Default for unspecified endpoints
  DEFAULT: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

/**
 * Get identifier for rate limiting (IP address or user ID)
 */
export function getRateLimitIdentifier(request: NextRequest): string {
  // Try to get user ID from headers (if authenticated)
  const userId = request.headers.get('x-user-id');
  if (userId) {
    return `user:${userId}`;
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  return `ip:${ip}`;
}

/**
 * Check rate limit for a request
 */
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.DEFAULT
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const identifier = getRateLimitIdentifier(request);
  const limiter = getRateLimiter(config);

  if (limiter instanceof Ratelimit) {
    // Upstash rate limiter
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } else {
    // In-memory rate limiter
    return await limiter.limit(identifier, config.maxRequests, config.windowMs);
  }
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: { limit: number; remaining: number; reset: number }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.reset.toString());
  
  // Add Retry-After header if rate limited
  if (result.remaining === 0) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    response.headers.set('Retry-After', retryAfter.toString());
  }

  return response;
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(result: {
  limit: number;
  remaining: number;
  reset: number;
}): NextResponse {
  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
  
  const response = NextResponse.json(
    {
      success: false,
      error: 'Too many requests',
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      details: {
        limit: result.limit,
        remaining: result.remaining,
        resetAt: new Date(result.reset).toISOString(),
      },
    },
    { status: 429 }
  );

  return addRateLimitHeaders(response, result);
}

/**
 * Rate limit middleware wrapper for API routes
 * 
 * Usage:
 * export const POST = withRateLimit(handler, RATE_LIMITS.AUTH);
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig = RATE_LIMITS.DEFAULT
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Check rate limit
    const rateLimitResult = await checkRateLimit(request, config);

    // If rate limit exceeded, return error
    if (!rateLimitResult.success) {
      console.log(`⚠️  Rate limit exceeded for ${getRateLimitIdentifier(request)}`);
      return createRateLimitResponse(rateLimitResult);
    }

    // Execute handler
    const response = await handler(request);

    // Add rate limit headers to successful response
    return addRateLimitHeaders(response, rateLimitResult);
  };
}

/**
 * Manual rate limit check (for use in route handlers)
 * 
 * Usage:
 * const rateLimitCheck = await rateLimitGuard(request, RATE_LIMITS.PIN_VERIFY);
 * if (!rateLimitCheck.success) {
 *   return rateLimitCheck.response;
 * }
 */
export async function rateLimitGuard(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.DEFAULT
): Promise<{
  success: boolean;
  response?: NextResponse;
  result: { limit: number; remaining: number; reset: number };
}> {
  const result = await checkRateLimit(request, config);

  if (!result.success) {
    return {
      success: false,
      response: createRateLimitResponse(result),
      result,
    };
  }

  return {
    success: true,
    result,
  };
}

