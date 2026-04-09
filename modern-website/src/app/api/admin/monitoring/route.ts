/**
 * Comprehensive Monitoring API
 * Provides system health, performance metrics, and alerting
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET endpoint for monitoring data
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
    const type = url.searchParams.get('type') || 'overview';
    const hours = parseInt(url.searchParams.get('hours') || '24');

    switch (type) {
      case 'overview':
        return await getMonitoringOverview(hours);
      case 'alerts':
        return await getPerformanceAlerts();
      case 'health':
        return await getSystemHealth();
      case 'cache':
        return await getCacheMetrics(hours);
      case 'rate-limiting':
        return await getRateLimitingMetrics(hours);
      case 'cleanup':
        return await getCleanupStatistics();
      case 'recommendations':
        return await getPerformanceRecommendations();
      default:
        return NextResponse.json(
          { error: 'Invalid monitoring type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint for monitoring actions
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
    const { action, ...params } = body;

    switch (action) {
      case 'cleanup':
        return await triggerCleanup(params);
      case 'schedule-cleanup':
        return await scheduleCleanup();
      case 'reset-cache':
        return await resetCache(params);
      case 'clear-blocks':
        return await clearBlocks(params);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Monitoring action API error:', error);
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

// Get monitoring overview
async function getMonitoringOverview(hours: number): Promise<NextResponse> {
  try {
    // Get system health score
    const { data: healthScore } = await supabase.rpc('get_system_health_score');
    
    // Get performance summary
    const { data: performanceSummary } = await supabase
      .from('database_performance_summary')
      .select('*')
      .single();

    // Get system performance overview
    const { data: systemOverview } = await supabase
      .from('system_performance_overview')
      .select('*');

    // Get active alerts
    const { data: alerts } = await supabase
      .from('performance_alerts')
      .select('*')
      .eq('severity', 'critical');

    const overview = {
      healthScore: healthScore || 0,
      performance: performanceSummary || {},
      systemMetrics: systemOverview || [],
      criticalAlerts: alerts || [],
      timestamp: new Date().toISOString(),
      dataRange: `${hours} hours`,
    };

    return NextResponse.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error('Error getting monitoring overview:', error);
    return NextResponse.json(
      { error: 'Failed to get monitoring overview' },
      { status: 500 }
    );
  }
}

// Get performance alerts
async function getPerformanceAlerts(): Promise<NextResponse> {
  try {
    const { data: alerts, error } = await supabase.rpc('check_performance_alerts');

    if (error) {
      console.error('Error getting performance alerts:', error);
      return NextResponse.json(
        { error: 'Failed to get performance alerts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: alerts || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting performance alerts:', error);
    return NextResponse.json(
      { error: 'Failed to get performance alerts' },
      { status: 500 }
    );
  }
}

// Get system health
async function getSystemHealth(): Promise<NextResponse> {
  try {
    // Get health score
    const { data: healthScore } = await supabase.rpc('get_system_health_score');
    
    // Get performance summary
    const { data: performanceSummary } = await supabase
      .from('database_performance_summary')
      .select('*')
      .single();

    // Get system overview
    const { data: systemOverview } = await supabase
      .from('system_performance_overview')
      .select('*');

    const health = {
      score: healthScore || 0,
      status: healthScore ? (healthScore > 80 ? 'healthy' : healthScore > 60 ? 'warning' : 'critical') : 'unknown',
      performance: performanceSummary || {},
      metrics: systemOverview || [],
      recommendations: await getPerformanceRecommendationsData(),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error('Error getting system health:', error);
    return NextResponse.json(
      { error: 'Failed to get system health' },
      { status: 500 }
    );
  }
}

// Get cache metrics
async function getCacheMetrics(hours: number): Promise<NextResponse> {
  try {
    // Get cache efficiency monitoring
    const { data: cacheEfficiency } = await supabase
      .from('cache_efficiency_monitoring')
      .select('*')
      .gte('time_bucket', new Date(Date.now() - hours * 3600000).toISOString())
      .order('time_bucket', { ascending: false })
      .limit(24);

    // Get cache performance summary
    const { data: cacheSummary } = await supabase
      .from('cache_performance_summary')
      .select('*')
      .eq('category', 'cache_performance')
      .single();

    const metrics = {
      efficiency: cacheEfficiency || [],
      summary: cacheSummary || {},
      timestamp: new Date().toISOString(),
      dataRange: `${hours} hours`,
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error getting cache metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get cache metrics' },
      { status: 500 }
    );
  }
}

// Get rate limiting metrics
async function getRateLimitingMetrics(hours: number): Promise<NextResponse> {
  try {
    // Get rate limiting monitoring
    const { data: rateLimitingData } = await supabase
      .from('rate_limiting_monitoring')
      .select('*')
      .gte('time_bucket', new Date(Date.now() - hours * 3600000).toISOString())
      .order('time_bucket', { ascending: false })
      .limit(24);

    // Get rate limiting summary
    const { data: rateLimitingSummary } = await supabase
      .from('rate_limiting_summary')
      .select('*')
      .eq('category', 'rate_limiting')
      .single();

    // Get active blocks
    const { data: activeBlocks } = await supabase
      .from('rate_limit_active_blocks')
      .select('*')
      .order('remaining_seconds', { ascending: true })
      .limit(10);

    const metrics = {
      violations: rateLimitingData || [],
      summary: rateLimitingSummary || {},
      activeBlocks: activeBlocks || [],
      timestamp: new Date().toISOString(),
      dataRange: `${hours} hours`,
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error getting rate limiting metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get rate limiting metrics' },
      { status: 500 }
    );
  }
}

// Get cleanup statistics
async function getCleanupStatistics(): Promise<NextResponse> {
  try {
    const { data: stats, error } = await supabase.rpc('get_cleanup_statistics');

    if (error) {
      console.error('Error getting cleanup statistics:', error);
      return NextResponse.json(
        { error: 'Failed to get cleanup statistics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting cleanup statistics:', error);
    return NextResponse.json(
      { error: 'Failed to get cleanup statistics' },
      { status: 500 }
    );
  }
}

// Get performance recommendations
async function getPerformanceRecommendations(): Promise<NextResponse> {
  try {
    const recommendations = await getPerformanceRecommendationsData();

    return NextResponse.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting performance recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get performance recommendations' },
      { status: 500 }
    );
  }
}

// Helper to get performance recommendations
async function getPerformanceRecommendationsData(): Promise<any[]> {
  try {
    const { data: recommendations } = await supabase.rpc('get_performance_recommendations');
    return recommendations || [];
  } catch (error) {
    console.error('Error getting performance recommendations data:', error);
    return [];
  }
}

// Trigger cleanup
async function triggerCleanup(params: any): Promise<NextResponse> {
  try {
    const { tables, daysOld } = params;
    
    let result;
    if (tables && Array.isArray(tables)) {
      // Manual cleanup for specific tables
      const { data } = await supabase.rpc('trigger_manual_cleanup', {
        p_table_names: tables,
      });
      result = data;
    } else {
      // General cleanup with default parameters
      const { data } = await supabase.rpc('schedule_cleanup');
      result = data;
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Cleanup triggered successfully',
    });
  } catch (error) {
    console.error('Error triggering cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to trigger cleanup' },
      { status: 500 }
    );
  }
}

// Schedule cleanup
async function scheduleCleanup(): Promise<NextResponse> {
  try {
    const { data: result, error } = await supabase.rpc('schedule_cleanup');

    if (error) {
      console.error('Error scheduling cleanup:', error);
      return NextResponse.json(
        { error: 'Failed to schedule cleanup' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Cleanup scheduled successfully',
    });
  } catch (error) {
    console.error('Error scheduling cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to schedule cleanup' },
      { status: 500 }
    );
  }
}

// Reset cache
async function resetCache(params: any): Promise<NextResponse> {
  try {
    const { identifier } = params;
    
    if (identifier) {
      // Reset specific identifier
      await supabase
        .from('cache_store')
        .delete()
        .like('cache_key', `${identifier}%`);
    } else {
      // Reset all cache
      await supabase
        .from('cache_store')
        .delete();
    }

    return NextResponse.json({
      success: true,
      message: identifier ? `Cache reset for ${identifier}` : 'All cache reset',
    });
  } catch (error) {
    console.error('Error resetting cache:', error);
    return NextResponse.json(
      { error: 'Failed to reset cache' },
      { status: 500 }
    );
  }
}

// Clear blocks
async function clearBlocks(params: any): Promise<NextResponse> {
  try {
    const { identifier } = params;
    
    if (identifier) {
      // Clear specific identifier blocks
      await supabase
        .from('rate_limit_blocks')
        .update({ is_active: false })
        .eq('identifier', identifier);
    } else {
      // Clear all blocks
      await supabase
        .from('rate_limit_blocks')
        .update({ is_active: false })
        .eq('is_active', true);
    }

    return NextResponse.json({
      success: true,
      message: identifier ? `Blocks cleared for ${identifier}` : 'All blocks cleared',
    });
  } catch (error) {
    console.error('Error clearing blocks:', error);
    return NextResponse.json(
      { error: 'Failed to clear blocks' },
      { status: 500 }
    );
  }
}
