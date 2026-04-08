import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limit/phone-limiter';
import { rateLimitErrorResponse } from '@/lib/rate-limit/response-helper';
import { RateLimitType } from '@/types/rate-limit';

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    type: RateLimitType;
    getIdentifier: (request: NextRequest) => Promise<string> | string;
    isProgressive?: boolean;
  }
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    const identifier = await options.getIdentifier(request);
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'Missing identifier (phone number or user ID)' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (options.isProgressive && options.type === 'pin_verify') {
      result = await rateLimiter.checkPinVerification(identifier);
    } else {
      result = await rateLimiter.checkLimit(identifier, options.type);
    }
    
    if (!result.allowed) {
      return rateLimitErrorResponse(result);
    }
    
    const response = await handler(request);
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', result.remaining.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetAt.getTime().toString());
    
    return response;
  };
}
