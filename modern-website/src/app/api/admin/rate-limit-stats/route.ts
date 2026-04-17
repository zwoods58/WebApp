/**
 * Rate Limit Statistics API
 * Provides monitoring and analytics for rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseRateLimiter } from '@/lib/rate-limit/supabase-distributed-rate-limit';

// Admin-only rate limit statistics endpoint
export async function GET(req: NextRequest) {
  try {
    // Verify admin permissions
    const isAdmin = await verifyAdminPermissions(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const identifier = url.searchParams.get('identifier');
    const hours = parseInt(url.searchParams.get('hours') || '24');
    const cleanup = url.searchParams.get('cleanup') === 'true';

    // Perform cleanup if requested
    let cleanupResult = null;
    if (cleanup) {
      cleanupResult = await supabaseRateLimiter.cleanup(30); // Cleanup 30 days old data
    }

    // Get rate limit statistics
    const stats = await supabaseRateLimiter.getStats(identifier || undefined, hours);

    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to retrieve statistics' },
        { status: 500 }
      );
    }

    // Get additional metrics
    const additionalMetrics = await getAdditionalMetrics(hours);

    const response = {
      success: true,
      data: {
        ...stats,
        ...additionalMetrics,
        metadata: {
          identifier: identifier || 'all',
          hours,
          generatedAt: new Date().toISOString(),
          cleanupResult,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Rate limit stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint for manual rate limit actions
export async function POST(req: NextRequest) {
  try {
    // Verify admin permissions
    const isAdmin = await verifyAdminPermissions(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, identifier, reason } = body;

    switch (action) {
      case 'reset':
        await supabaseRateLimiter.reset(identifier);
        return NextResponse.json({
          success: true,
          message: `Rate limit reset for ${identifier}`,
        });

      case 'block':
        await createManualBlock(identifier, reason);
        return NextResponse.json({
          success: true,
          message: `Blocked ${identifier}: ${reason}`,
        });

      case 'unblock':
        await removeBlock(identifier);
        return NextResponse.json({
          success: true,
          message: `Unblocked ${identifier}`,
        });

      case 'cleanup':
        const daysOld = body.daysOld || 30;
        const deletedCount = await supabaseRateLimiter.cleanup(daysOld);
        return NextResponse.json({
          success: true,
          message: `Cleaned up ${deletedCount} old records`,
          deletedCount,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Rate limit action API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions

// Verify admin permissions
async function verifyAdminPermissions(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return false;
    }

    // Check if user is admin
    const { data: member } = await supabase
      .from('business_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return !error && !!member;
  } catch (error) {
    console.error('Error verifying admin permissions:', error);
    return false;
  }
}

// Get additional metrics
async function getAdditionalMetrics(hours: number): Promise<any> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get total violations in the time period
    const { count: totalViolations } = await supabase
      .from('rate_limit_audit')
      .select('*', { count: 'exact' })
      .gte('violated_at', new Date(Date.now() - hours * 3600000).toISOString());

    // Get unique identifiers
    const { data: uniqueIdentifiers } = await supabase
      .from('rate_limit_audit')
      .select('identifier')
      .gte('violated_at', new Date(Date.now() - hours * 3600000).toISOString());

    // Get violations by type
    const { data: violationsByType } = await supabase
      .from('rate_limit_audit')
      .select('violation_type')
      .gte('violated_at', new Date(Date.now() - hours * 3600000).toISOString());

    // Get top endpoints
    const { data: topEndpoints } = await supabase
      .from('rate_limit_audit')
      .select('endpoint')
      .gte('violated_at', new Date(Date.now() - hours * 3600000).toISOString())
      .limit(10);

    return {
      totalViolations: totalViolations || 0,
      uniqueIdentifiers: new Set(uniqueIdentifiers?.map(d => d.identifier)).size,
      violationsByType: groupByType(violationsByType || []),
      topEndpoints: groupByEndpoint(topEndpoints || []),
    };
  } catch (error) {
    console.error('Error getting additional metrics:', error);
    return {
      totalViolations: 0,
      uniqueIdentifiers: 0,
      violationsByType: {},
      topEndpoints: {},
    };
  }
}

// Group violations by type
function groupByType(violations: any[]): Record<string, number> {
  return violations.reduce((acc, v) => {
    const type = v.violation_type || 'standard';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

// Group violations by endpoint
function groupByEndpoint(violations: any[]): Record<string, number> {
  return violations.reduce((acc, v) => {
    const endpoint = v.endpoint || 'unknown';
    acc[endpoint] = (acc[endpoint] || 0) + 1;
    return acc;
  }, {});
}

// Create manual block
async function createManualBlock(identifier: string, reason: string): Promise<void> {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase
    .from('rate_limit_blocks')
    .insert({
      identifier,
      identifier_type: getIdentifierType(identifier),
      block_reason: reason || 'Manual block by admin',
      block_end: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      block_type: 'manual',
      metadata: {
        created_by: 'admin',
        manual_block: true,
      },
    });
}

// Remove block
async function removeBlock(identifier: string): Promise<void> {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase
    .from('rate_limit_blocks')
    .update({ is_active: false })
    .eq('identifier', identifier)
    .eq('is_active', true);
}

// Get identifier type
function getIdentifierType(identifier: string): string {
  if (identifier.includes('.')) {
    return 'ip';
  } else if (identifier.startsWith('user_')) {
    return 'user_id';
  } else if (identifier.startsWith('phone_')) {
    return 'phone';
  } else if (identifier.startsWith('api_')) {
    return 'api_key';
  } else {
    return 'unknown';
  }
}

