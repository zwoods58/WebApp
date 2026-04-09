/**
 * Rate Limiting Middleware
 * Provides Express/Next.js middleware for rate limiting API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseRateLimiter, RateLimitConfig, RateLimitResult, USER_TIER_LIMITS, UserTier } from './supabase-distributed-rate-limit';

// Middleware configuration
export interface RateLimitMiddlewareConfig extends RateLimitConfig {
  // Endpoint-specific configuration
  endpoint?: string;
  method?: string;
  
  // User tier detection
  getUserTier?: (req: NextRequest) => Promise<UserTier>;
  isCorporateRequest?: (req: NextRequest) => boolean;
  isPhoneRequest?: (req: NextRequest) => boolean;
  
  // Custom identifier generation
  getIdentifier?: (req: NextRequest) => string;
  
  // Response customization
  onRateLimit?: (result: RateLimitResult, req: NextRequest) => NextResponse;
  onBlock?: (blockReason: string, req: NextRequest) => NextResponse;
  
  // Skip conditions
  skipRateLimit?: (req: NextRequest) => boolean;
  skipForAdmin?: boolean;
  skipForService?: boolean;
}

// Default rate limit configurations for different endpoint types
export const DEFAULT_RATE_LIMITS = {
  // Authentication endpoints (stricter limits)
  auth: {
    windowMs: 15 * 60 * 1000,    // 15 minutes
    maxRequests: 5,              // 5 attempts per 15 minutes
    keyPrefix: 'auth',
  },
  
  // General API endpoints
  api: {
    windowMs: 60 * 1000,         // 1 minute
    maxRequests: 100,            // 100 requests per minute
    keyPrefix: 'api',
  },
  
  // File upload endpoints
  upload: {
    windowMs: 60 * 1000,         // 1 minute
    maxRequests: 10,             // 10 uploads per minute
    keyPrefix: 'upload',
  },
  
  // Search endpoints
  search: {
    windowMs: 60 * 1000,         // 1 minute
    maxRequests: 30,             // 30 searches per minute
    keyPrefix: 'search',
  },
  
  // Webhook endpoints
  webhook: {
    windowMs: 60 * 1000,         // 1 minute
    maxRequests: 1000,           // 1000 webhooks per minute
    keyPrefix: 'webhook',
  },
} as const;

// Rate limiting middleware function
export function createRateLimitMiddleware(config: RateLimitMiddlewareConfig) {
  return async function rateLimitMiddleware(req: NextRequest): Promise<NextResponse | null> {
    // Skip rate limiting if conditions are met
    if (config.skipRateLimit && await config.skipRateLimit(req)) {
      return null; // Continue to next middleware
    }

    // Skip for admin users if configured
    if (config.skipForAdmin && await isAdminRequest(req)) {
      return null;
    }

    // Skip for service accounts if configured
    if (config.skipForService && await isServiceRequest(req)) {
      return null;
    }

    // Get identifier for rate limiting
    const identifier = await getIdentifier(req, config);
    
    // Get request information
    const requestInfo = await getRequestInfo(req, config);
    
    // Check rate limit
    const result = await supabaseRateLimiter.checkRateLimit(
      identifier,
      config,
      requestInfo
    );

    // Handle blocked requests
    if (result.isBlocked && config.onBlock) {
      return config.onBlock(result.blockReason || 'Request blocked', req);
    }

    // Handle rate limited requests
    if (!result.allowed) {
      if (config.onRateLimit) {
        return config.onRateLimit(result, req);
      }
      
      return createRateLimitResponse(result);
    }

    // Add rate limit headers to response
    const response = new NextResponse(null, { status: 200 });
    addRateLimitHeaders(response, result);
    
    return response;
  };
}

// Helper functions

// Get identifier for rate limiting
async function getIdentifier(req: NextRequest, config: RateLimitMiddlewareConfig): Promise<string> {
  // Use custom identifier generator if provided
  if (config.getIdentifier) {
    return config.getIdentifier(req);
  }

  // Default identifier generation logic
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
  
  // Try to get user ID from auth token
  const userId = await getUserIdFromRequest(req);
  if (userId) {
    return `user_${userId}`;
  }
  
  // Fall back to IP address
  return `ip_${ip}`;
}

// Get user ID from request
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Error getting user ID from request:', error);
    return null;
  }
}

// Get request information
async function getRequestInfo(req: NextRequest, config: RateLimitMiddlewareConfig) {
  const url = new URL(req.url);
  const userAgent = req.headers.get('user-agent') || undefined;
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
  
  // Get country code from IP (simplified - in production use a proper GeoIP service)
  const countryCode = await getCountryCode(ip);
  
  // Get user tier
  let userTier: UserTier = 'free';
  if (config.getUserTier) {
    userTier = await config.getUserTier(req);
  } else {
    userTier = await getUserTierFromRequest(req);
  }
  
  // Check if corporate request
  const isCorporate = config.isCorporateRequest 
    ? await config.isCorporateRequest(req)
    : await isCorporateRequest(req);
  
  // Check if phone request
  const isPhone = config.isPhoneRequest
    ? await config.isPhoneRequest(req)
    : isPhoneRequest(req);

  return {
    endpoint: config.endpoint || url.pathname,
    method: config.method || req.method,
    headers: Object.fromEntries(req.headers.entries()),
    userAgent,
    ipAddress: ip,
    subscriptionTier: userTier,
    countryCode,
    isCorporate,
    isPhoneRequest: isPhone,
  };
}

// Get user tier from request
async function getUserTierFromRequest(req: NextRequest): Promise<UserTier> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return 'free';
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('businesses')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return 'free';
    }

    return data.subscription_tier as UserTier || 'free';
  } catch (error) {
    console.error('Error getting user tier:', error);
    return 'free';
  }
}

// Check if request is from admin
async function isAdminRequest(req: NextRequest): Promise<boolean> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return false;
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('business_members')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Check if request is from service account
async function isServiceRequest(req: NextRequest): Promise<boolean> {
  const userAgent = req.headers.get('user-agent') || '';
  const authHeader = req.headers.get('authorization') || '';
  
  // Check for service account indicators
  return (
    userAgent.includes('service-account') ||
    authHeader.includes('service_') ||
    req.headers.get('x-service-account') === 'true'
  );
}

// Check if request is from corporate account
async function isCorporateRequest(req: NextRequest): Promise<boolean> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return false;
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('businesses')
      .select('is_corporate')
      .eq('user_id', userId)
      .single();

    return !error && data?.is_corporate === true;
  } catch (error) {
    console.error('Error checking corporate status:', error);
    return false;
  }
}

// Check if request is from phone/mobile
function isPhoneRequest(req: NextRequest): boolean {
  const userAgent = req.headers.get('user-agent') || '';
  
  // Simple mobile detection
  const mobilePatterns = [
    /Mobile/i,
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /webOS/i,
  ];
  
  return mobilePatterns.some(pattern => pattern.test(userAgent));
}

// Get country code from IP (simplified)
async function getCountryCode(ip: string): Promise<string | undefined> {
  // In production, use a proper GeoIP service
  // For now, return undefined
  return undefined;
}

// Create rate limit response
function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfter,
    },
    { status: 429 }
  );

  addRateLimitHeaders(response, result);
  return response;
}

// Add rate limit headers to response
function addRateLimitHeaders(response: NextResponse, result: RateLimitResult): void {
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetTime.toISOString());
  
  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString());
  }
  
  if (result.isBlocked) {
    response.headers.set('X-RateLimit-Blocked', 'true');
    response.headers.set('X-RateLimit-Block-Reason', result.blockReason || 'Blocked');
  }
}

// Predefined middleware configurations
export const rateLimitMiddleware = {
  // Authentication endpoints
  auth: createRateLimitMiddleware({
    ...DEFAULT_RATE_LIMITS.auth,
    endpoint: '/api/auth',
    skipForService: true,
  }),

  // General API endpoints
  api: createRateLimitMiddleware({
    ...DEFAULT_RATE_LIMITS.api,
    endpoint: '/api',
    skipForAdmin: false,
  }),

  // File upload endpoints
  upload: createRateLimitMiddleware({
    ...DEFAULT_RATE_LIMITS.upload,
    endpoint: '/api/upload',
    corporateMultiplier: 2.0,
  }),

  // Search endpoints
  search: createRateLimitMiddleware({
    ...DEFAULT_RATE_LIMITS.search,
    endpoint: '/api/search',
    phoneMultiplier: 0.5, // Reduce limits for mobile
  }),

  // Webhook endpoints
  webhook: createRateLimitMiddleware({
    ...DEFAULT_RATE_LIMITS.webhook,
    endpoint: '/api/webhook',
    skipForService: true,
  }),
};

// Export default middleware
export default createRateLimitMiddleware;
