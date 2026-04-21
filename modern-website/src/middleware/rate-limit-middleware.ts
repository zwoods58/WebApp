import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limit/phone-limiter';
import { rateLimitErrorResponse } from '@/lib/rate-limit/response-helper';
import { RateLimitType } from '@/types/rate-limit';

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    type: RateLimitType;
    getIdentifier: (body: any) => Promise<string> | string;
    isProgressive?: boolean;
  }
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    const identifier = await options.getIdentifier(body);
    
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
    
    // Create a new request with the same body and headers for the handler
    const headers = new Headers(request.headers);
    const newRequest = new NextRequest(request.url, {
      method: request.method,
      headers: headers,
      body: JSON.stringify(body),
    });
    
    const response = await handler(newRequest);
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', result.remaining.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetAt.getTime().toString());
    
    return response;
  };
}

