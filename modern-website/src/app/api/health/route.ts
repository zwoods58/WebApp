// =====================================================
// Phase 3: Health Check Endpoint
// Monitors database connectivity, Redis availability, connection pool usage, and realtime subscription health
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectionPoolManager } from '@/lib/connection-pool';
import { connectionMonitor } from '@/lib/supabase';
import { autoScalingManager } from '@/lib/supabase';
import { getDatabaseConfig } from '@/lib/db/config';
import { supabaseCache } from '@/lib/cache/supabase-cache';
import { supabaseCachedQueries } from '@/lib/cache/supabase-cached-queries';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const config = getDatabaseConfig();
  
  try {
    // Simple health checks without complex PromiseSettledResult handling
    let dbHealthy = false;
    let dbResponseTime = 0;
    let poolHealthy = false;
    let redisAvailable = false;
    let realtimeHealthy = false;
    let cacheHealthy = false;

    // Database health check (optimized - lightweight query)
    try {
      const start = Date.now();
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('health_check').select('status').eq('id', 1).single();
      dbResponseTime = Date.now() - start;
      dbHealthy = true;
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Connection pool health check
    try {
      const health = await connectionPoolManager.healthCheck();
      poolHealthy = health.user && health.admin;
    } catch (error) {
      console.error('Connection pool health check failed:', error);
    }

    // Redis health check
    try {
      const redisResult = await checkRedisHealth();
      redisAvailable = redisResult.available;
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    // Realtime health check
    try {
      const realtimeResult = await checkRealtimeHealth();
      realtimeHealthy = realtimeResult.healthy;
    } catch (error) {
      console.error('Realtime health check failed:', error);
    }

    // Cache health check
    try {
      cacheHealthy = await supabaseCachedQueries.cacheHealthCheck();
    } catch (error) {
      console.error('Cache health check failed:', error);
    }

    // Get metrics
    const connectionStats = connectionMonitor.getStats();
    const poolMetrics = connectionPoolManager.getAllMetrics();
    const autoScalingMetrics = autoScalingManager.getCurrentMetrics();

    // Calculate overall health
    const healthyChecks = [dbHealthy, poolHealthy, redisAvailable, realtimeHealthy, cacheHealthy];
    const healthyCount = healthyChecks.filter(Boolean).length;
    
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === 5) {
      overallStatus = 'healthy';
    } else if (healthyCount >= 4) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }

    // Prepare response
    const healthReport = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      version: '2.0.0',
      phase: 'phase-3-optimized',
      capacity: '50k-users',
      
      // Database Health
      database: {
        status: dbHealthy ? 'healthy' : 'unhealthy',
        responseTime: dbResponseTime,
        lastCheck: connectionStats.lastHealthCheck,
      },

      // Connection Pool Metrics
      connectionPool: {
        status: poolHealthy ? 'healthy' : 'unhealthy',
        user: poolMetrics.user,
        admin: poolMetrics.admin,
        totalConnections: poolMetrics.user.totalConnections + poolMetrics.admin.totalConnections,
        utilization: Math.max(poolMetrics.user.connectionUtilization, poolMetrics.admin.connectionUtilization),
      },

      // Redis Health
      redis: {
        available: redisAvailable,
        configured: !!process.env.REDIS_URL,
        lastCheck: new Date().toISOString(),
      },
      
      // Realtime Health
      realtime: {
        healthy: realtimeHealthy,
        lastCheck: new Date().toISOString(),
      },

      // Cache Health
      cache: {
        healthy: cacheHealthy,
        stats: supabaseCachedQueries.getCacheStats(),
        lastCheck: new Date().toISOString(),
      },

      // Performance Metrics
      performance: {
        connectionStats,
        autoScaling: autoScalingMetrics,
        recommendations: getHealthRecommendations({
          poolMetrics,
          connectionStats,
          config,
        }),
      },

      // Configuration
      configuration: {
        poolSize: config.poolSize,
        timeouts: config.timeouts,
        monitoring: config.monitoring.enabled,
        environment: process.env.NODE_ENV || 'development',
      },
    };

    // Return appropriate status code
    const statusCode = overallStatus === 'healthy' ? 200 : 
                     overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthReport, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      error: 'Health check system failure',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 });
  }
}

// =====================================================
// Health Check Functions
// =====================================================

async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    const { supabase } = await import('@/lib/supabase');
    
    // Lightweight database query using health_check table
    await supabase.from('health_check').select('status').eq('id', 1).single();
    
    return {
      status: 'fulfilled' as const,
      value: {
        responseTime: Date.now() - start,
      },
    };
  } catch (error) {
    return {
      status: 'rejected' as const,
      reason: error,
    };
  }
}

async function checkConnectionPoolMetrics() {
  try {
    const userMetrics = connectionPoolManager.getPool('user').getMetrics();
    const adminMetrics = connectionPoolManager.getPool('admin').getMetrics();
    
    return {
      status: 'fulfilled' as const,
      value: {
        user: userMetrics,
        admin: adminMetrics,
      },
    };
  } catch (error) {
    return {
      status: 'rejected' as const,
      reason: error,
    };
  }
}

async function checkConnectionStats() {
  try {
    const stats = connectionMonitor.getStats();
    
    return {
      status: 'fulfilled' as const,
      value: stats,
    };
  } catch (error) {
    return {
      status: 'rejected' as const,
      reason: error,
    };
  }
}

async function checkAutoScalingMetrics() {
  try {
    const metrics = autoScalingManager.getCurrentMetrics();
    
    return {
      status: 'fulfilled' as const,
      value: metrics,
    };
  } catch (error) {
    return {
      status: 'rejected' as const,
      reason: error,
    };
  }
}

async function checkPoolHealth() {
  try {
    const health = await connectionPoolManager.healthCheck();
    
    return {
      status: 'fulfilled' as const,
      value: health,
    };
  } catch (error) {
    return {
      status: 'rejected' as const,
      reason: error,
    };
  }
}

async function checkRedisHealth() {
  try {
    // Check if Redis is configured and available
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      return {
        available: false,
        reason: 'Redis not configured',
        configured: false,
      };
    }

    // Try to import and test Redis connection
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: redisUrl,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });

    const start = Date.now();
    await redis.set('health-check', 'ok', { ex: 10 });
    const value = await redis.get('health-check');
    await redis.del('health-check');
    const responseTime = Date.now() - start;

    return {
      available: true,
      responseTime,
      configured: true,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      available: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
      configured: !!process.env.REDIS_URL,
      lastCheck: new Date().toISOString(),
    };
  }
}

async function checkRealtimeHealth() {
  try {
    const { supabase } = await import('@/lib/supabase');
    
    // Check realtime connection
    const channel = supabase.channel('health-check');
    
    // Test subscription
    const subscription = channel
      .on('broadcast', { event: 'test' }, () => {})
      .subscribe();

    // Clean up
    subscription.unsubscribe();

    return {
      healthy: true,
      subscriptions: 1, // Simplified count
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastCheck: new Date().toISOString(),
    };
  }
}

function calculateOverallHealth(health: {
  database: boolean;
  connectionPool: boolean;
  redis: any;
  realtime: any;
}) {
  const checks = [
    health.database,
    health.connectionPool,
    typeof health.redis === 'object' ? health.redis.available : false,
    typeof health.realtime === 'object' ? health.realtime.healthy : false,
  ];

  const healthyCount = checks.filter(Boolean).length;
  const totalCount = checks.length;

  if (healthyCount === totalCount) {
    return { status: 'healthy' };
  } else if (healthyCount >= totalCount * 0.75) {
    return { status: 'degraded' };
  } else {
    return { status: 'unhealthy' };
  }
}

function getHealthRecommendations(data: {
  poolMetrics?: any;
  connectionStats?: any;
  config: any;
}): string[] {
  const recommendations: string[] = [];

  // Connection pool recommendations
  if (data.poolMetrics) {
    const { user, admin } = data.poolMetrics;
    
    if (user.connectionUtilization > 0.8) {
      recommendations.push('User connection pool utilization high - consider increasing pool size');
    }
    
    if (admin.connectionUtilization > 0.6) {
      recommendations.push('Admin connection pool utilization elevated - monitor admin operations');
    }
    
    if (user.waitingRequests > 10) {
      recommendations.push('High wait queue for user pool - increase pool size or optimize queries');
    }
    
    if (user.averageWaitTime > 1000) {
      recommendations.push('High average wait time - check database performance');
    }
  }

  // Connection stats recommendations
  if (data.connectionStats) {
    const { failedConnections, averageResponseTime } = data.connectionStats.performance;
    
    if (failedConnections > 5) {
      recommendations.push('Connection failures detected - check database connectivity');
    }
    
    if (averageResponseTime > 1000) {
      recommendations.push('High response times detected - check database load');
    }
  }

  // Configuration recommendations
  if (data.config.monitoring.enabled && data.poolMetrics) {
    const { user } = data.poolMetrics;
    
    if (user.connectionUtilization > data.config.monitoring.alertThresholds.connectionUtilization) {
      recommendations.push('Connection utilization above threshold - check scaling settings');
    }
  }

  return recommendations;
}

// =====================================================
// Additional Health Endpoints
// =====================================================

export async function POST(request: NextRequest) {
  // Force refresh of all health checks
  try {
    await connectionMonitor.healthCheck();
    await connectionPoolManager.healthCheck();
    
    return NextResponse.json({
      status: 'success',
      message: 'Health checks refreshed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to refresh health checks',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
