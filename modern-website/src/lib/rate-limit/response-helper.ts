import { NextResponse } from 'next/server';
import { RateLimitResult } from '@/types/rate-limit';

export function rateLimitErrorResponse(result: RateLimitResult): NextResponse {
  const retryAfter = result.lockoutUntil 
    ? Math.ceil((result.lockoutUntil.getTime() - Date.now()) / 1000)
    : Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
  
  return NextResponse.json(
    {
      error: 'rate_limit_exceeded',
      message: result.message || 'Too many attempts. Please try again later.',
      retryAfter,
      resetAt: result.resetAt.toISOString(),
      escalationLevel: result.escalationLevel,
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': result.remaining.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': result.resetAt.getTime().toString(),
      },
    }
  );
}

export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.remaining.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetAt.getTime().toString());
  return response;
}
