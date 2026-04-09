/**
 * Dashboard API with Rate Limiting
 * Applies user tier-based rate limiting to dashboard endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRateLimitMiddleware, DEFAULT_RATE_LIMITS } from '@/lib/rate-limit/rate-limit-middleware';
import { UserTier } from '@/lib/rate-limit/supabase-distributed-rate-limit';
import { supabaseCachedQueries } from '@/lib/cache/supabase-cached-queries';
import { supabaseRateLimiter } from '@/lib/rate-limit/supabase-distributed-rate-limit';

// Rate limiting configuration for dashboard endpoints
const dashboardRateLimit = createRateLimitMiddleware({
  ...DEFAULT_RATE_LIMITS.api,
  endpoint: '/api/dashboard',
  method: 'GET',
  
  // User tier detection
  getUserTier: async (req) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return 'free';
    }

    try {
      const token = authHeader.substring(7);
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return 'free';
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single();

      return business?.subscription_tier as UserTier || 'free';
    } catch (error) {
      console.error('Error getting user tier:', error);
      return 'free';
    }
  },
  
  // Check if corporate request
  isCorporateRequest: (req) => {
    // For simplicity, we'll use a synchronous check
    // In production, you might want to cache this information
    const userAgent = req.headers.get('user-agent') || '';
    const authHeader = req.headers.get('authorization');
    
    // Simple corporate detection based on headers or user agent
    return userAgent.includes('corporate') || 
           authHeader?.includes('corporate') || 
           req.headers.get('x-corporate-account') === 'true';
  },
  
  // Skip rate limiting for admin users
  skipForAdmin: true,
  
  // Custom rate limit response
  onRateLimit: (result, req) => {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many dashboard requests. Please try again later.',
        retryAfter: result.retryAfter,
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toISOString(),
          'Retry-After': result.retryAfter?.toString() || '60',
        }
      }
    );
  },
});

// GET dashboard data with rate limiting and caching
export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    // Apply rate limiting first
    const rateLimitResult = await dashboardRateLimit(req);
    
    // If rate limit middleware returns a response, use it
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { businessId } = params;
    const url = new URL(req.url);
    const dateRange = url.searchParams.get('dateRange');
    const forceRefresh = url.searchParams.get('forceRefresh') === 'true';

    // Get dashboard data from cache
    const dashboardData = await supabaseCachedQueries.getDashboardData(
      businessId,
      dateRange || undefined,
      forceRefresh
    );

    if (!dashboardData) {
      return NextResponse.json(
        { error: 'Dashboard data not found' },
        { status: 404 }
      );
    }

    // Add rate limit headers
    const response = NextResponse.json({
      success: true,
      data: dashboardData,
      cached: !forceRefresh,
      timestamp: new Date().toISOString(),
    });

    // Add rate limit headers to the response
    const rateLimitCheck = await supabaseRateLimiter.checkRateLimit(
      await getIdentifier(req),
      DEFAULT_RATE_LIMITS.api
    );
    
    response.headers.set('X-RateLimit-Limit', rateLimitCheck.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitCheck.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitCheck.resetTime.toISOString());

    return response;
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get identifier
async function getIdentifier(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (!error && user) {
      return `user_${user.id}`;
    }
  }

  // Fall back to IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
  
  return `ip_${ip}`;
}
