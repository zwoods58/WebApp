import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import {
  getRateLimitIdentifier,
  checkRateLimit,
  addRateLimitHeaders,
  createRateLimitResponse,
  withRateLimit,
  rateLimitGuard,
  RATE_LIMITS
} from '../rateLimit';

describe('Rate Limiting Middleware', () => {
  describe('getRateLimitIdentifier', () => {
    it('should use user ID if available', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-user-id': 'user123'
        }
      });

      const identifier = getRateLimitIdentifier(request);
      expect(identifier).toBe('user:user123');
    });

    it('should fall back to IP from x-forwarded-for', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1'
        }
      });

      const identifier = getRateLimitIdentifier(request);
      expect(identifier).toBe('ip:192.168.1.1');
    });

    it('should use x-real-ip if x-forwarded-for not available', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-real-ip': '192.168.1.100'
        }
      });

      const identifier = getRateLimitIdentifier(request);
      expect(identifier).toBe('ip:192.168.1.100');
    });

    it('should use unknown if no IP headers', () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      const identifier = getRateLimitIdentifier(request);
      expect(identifier).toBe('ip:unknown');
    });
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1'
        }
      });

      const result = await checkRateLimit(request, {
        maxRequests: 5,
        windowMs: 60000
      });

      expect(result.success).toBe(true);
      expect(result.limit).toBe(5);
      expect(result.remaining).toBeGreaterThan(0);
      expect(result.reset).toBeGreaterThan(Date.now());
    });

    it('should block requests exceeding limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.2'
        }
      });

      const config = {
        maxRequests: 2,
        windowMs: 60000
      };

      // Make requests up to limit
      await checkRateLimit(request, config);
      await checkRateLimit(request, config);

      // This should be blocked
      const result = await checkRateLimit(request, config);

      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after time window', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.3'
        }
      });

      const config = {
        maxRequests: 2,
        windowMs: 100 // 100ms window
      };

      // Exhaust limit
      await checkRateLimit(request, config);
      await checkRateLimit(request, config);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be allowed again
      const result = await checkRateLimit(request, config);
      expect(result.success).toBe(true);
    });
  });

  describe('addRateLimitHeaders', () => {
    it('should add rate limit headers to response', () => {
      const response = new NextResponse();
      const result = {
        limit: 100,
        remaining: 95,
        reset: Date.now() + 60000
      };

      const updatedResponse = addRateLimitHeaders(response, result);

      expect(updatedResponse.headers.get('X-RateLimit-Limit')).toBe('100');
      expect(updatedResponse.headers.get('X-RateLimit-Remaining')).toBe('95');
      expect(updatedResponse.headers.get('X-RateLimit-Reset')).toBeTruthy();
    });

    it('should add Retry-After header when rate limited', () => {
      const response = new NextResponse();
      const result = {
        limit: 100,
        remaining: 0,
        reset: Date.now() + 45000 // 45 seconds
      };

      const updatedResponse = addRateLimitHeaders(response, result);

      const retryAfter = updatedResponse.headers.get('Retry-After');
      expect(retryAfter).toBeTruthy();
      expect(parseInt(retryAfter!)).toBeGreaterThan(0);
      expect(parseInt(retryAfter!)).toBeLessThanOrEqual(45);
    });
  });

  describe('createRateLimitResponse', () => {
    it('should create 429 error response', () => {
      const result = {
        limit: 5,
        remaining: 0,
        reset: Date.now() + 60000
      };

      const response = createRateLimitResponse(result);

      expect(response.status).toBe(429);
    });

    it('should include error details in response body', async () => {
      const result = {
        limit: 5,
        remaining: 0,
        reset: Date.now() + 60000
      };

      const response = createRateLimitResponse(result);
      const body = await response.json();

      expect(body.success).toBe(false);
      expect(body.error).toBe('Too many requests');
      expect(body.message).toContain('Rate limit exceeded');
      expect(body.details.limit).toBe(5);
      expect(body.details.remaining).toBe(0);
    });

    it('should include rate limit headers', () => {
      const result = {
        limit: 5,
        remaining: 0,
        reset: Date.now() + 60000
      };

      const response = createRateLimitResponse(result);

      expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response.headers.get('Retry-After')).toBeTruthy();
    });
  });

  describe('withRateLimit wrapper', () => {
    it('should allow requests within limit', async () => {
      const handler = vi.fn(async (req: NextRequest) => {
        return NextResponse.json({ message: 'success' });
      });

      const wrappedHandler = withRateLimit(handler, {
        maxRequests: 10,
        windowMs: 60000
      });

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.10'
        }
      });

      const response = await wrappedHandler(request);

      expect(response.status).toBe(200);
      expect(handler).toHaveBeenCalled();
    });

    it('should block requests exceeding limit', async () => {
      const handler = vi.fn(async (req: NextRequest) => {
        return NextResponse.json({ message: 'success' });
      });

      const wrappedHandler = withRateLimit(handler, {
        maxRequests: 2,
        windowMs: 60000
      });

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.11'
        }
      });

      // Make requests up to limit
      await wrappedHandler(request);
      await wrappedHandler(request);

      // This should be blocked
      const response = await wrappedHandler(request);

      expect(response.status).toBe(429);
      expect(handler).toHaveBeenCalledTimes(2); // Only called for successful requests
    });

    it('should add rate limit headers to successful responses', async () => {
      const handler = async (req: NextRequest) => {
        return NextResponse.json({ message: 'success' });
      };

      const wrappedHandler = withRateLimit(handler, {
        maxRequests: 10,
        windowMs: 60000
      });

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.12'
        }
      });

      const response = await wrappedHandler(request);

      expect(response.headers.get('X-RateLimit-Limit')).toBeTruthy();
      expect(response.headers.get('X-RateLimit-Remaining')).toBeTruthy();
      expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
    });
  });

  describe('rateLimitGuard', () => {
    it('should return success when within limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.20'
        }
      });

      const guard = await rateLimitGuard(request, {
        maxRequests: 10,
        windowMs: 60000
      });

      expect(guard.success).toBe(true);
      expect(guard.response).toBeUndefined();
      expect(guard.result.limit).toBe(10);
    });

    it('should return error response when limit exceeded', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.21'
        }
      });

      const config = {
        maxRequests: 2,
        windowMs: 60000
      };

      // Exhaust limit
      await rateLimitGuard(request, config);
      await rateLimitGuard(request, config);

      // This should fail
      const guard = await rateLimitGuard(request, config);

      expect(guard.success).toBe(false);
      expect(guard.response).toBeDefined();
      expect(guard.response!.status).toBe(429);
    });
  });

  describe('RATE_LIMITS configurations', () => {
    it('should have PIN_VERIFY with strictest limits', () => {
      expect(RATE_LIMITS.PIN_VERIFY.maxRequests).toBe(3);
      expect(RATE_LIMITS.PIN_VERIFY.windowMs).toBe(15 * 60 * 1000);
    });

    it('should have AUTH with moderate limits', () => {
      expect(RATE_LIMITS.AUTH.maxRequests).toBe(5);
      expect(RATE_LIMITS.AUTH.windowMs).toBe(15 * 60 * 1000);
    });

    it('should have DATA with higher limits', () => {
      expect(RATE_LIMITS.DATA.maxRequests).toBe(100);
      expect(RATE_LIMITS.DATA.windowMs).toBe(60 * 1000);
    });

    it('should have READ with highest limits', () => {
      expect(RATE_LIMITS.READ.maxRequests).toBe(200);
      expect(RATE_LIMITS.READ.windowMs).toBe(60 * 1000);
    });

    it('should have DEFAULT fallback', () => {
      expect(RATE_LIMITS.DEFAULT.maxRequests).toBe(60);
      expect(RATE_LIMITS.DEFAULT.windowMs).toBe(60 * 1000);
    });
  });

  describe('Security Tests', () => {
    it('should prevent brute force on PIN verification', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/verify-pin', {
        headers: {
          'x-forwarded-for': '192.168.1.30'
        }
      });

      // Simulate 3 PIN attempts
      const result1 = await checkRateLimit(request, RATE_LIMITS.PIN_VERIFY);
      const result2 = await checkRateLimit(request, RATE_LIMITS.PIN_VERIFY);
      const result3 = await checkRateLimit(request, RATE_LIMITS.PIN_VERIFY);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);

      // 4th attempt should be blocked
      const result4 = await checkRateLimit(request, RATE_LIMITS.PIN_VERIFY);
      expect(result4.success).toBe(false);
    });

    it('should track different IPs separately', async () => {
      const request1 = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'x-forwarded-for': '192.168.1.40' }
      });

      const request2 = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'x-forwarded-for': '192.168.1.41' }
      });

      const config = { maxRequests: 2, windowMs: 60000 };

      // Exhaust limit for IP 1
      await checkRateLimit(request1, config);
      await checkRateLimit(request1, config);
      const result1 = await checkRateLimit(request1, config);

      // IP 2 should still be allowed
      const result2 = await checkRateLimit(request2, config);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(true);
    });

    it('should prioritize user ID over IP', async () => {
      const request1 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-user-id': 'user456',
          'x-forwarded-for': '192.168.1.50'
        }
      });

      const request2 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.50' // Same IP, no user ID
        }
      });

      const config = { maxRequests: 2, windowMs: 60000 };

      // Exhaust limit for user456
      await checkRateLimit(request1, config);
      await checkRateLimit(request1, config);
      const result1 = await checkRateLimit(request1, config);

      // Same IP but no user ID should be tracked separately
      const result2 = await checkRateLimit(request2, config);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(true);
    });
  });
});

