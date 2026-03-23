import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetric {
  endpoint: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  requestCount: number;
  errorRate: number;
}

interface RequestLog {
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  timestamp: number;
}

// In-memory storage for request logs (in production, use database or external service)
const requestLogs: RequestLog[] = [];
const MAX_LOGS = 10000;

/**
 * Log an API request
 */
export function logApiRequest(log: RequestLog) {
  requestLogs.unshift(log);

  // Keep only recent logs
  if (requestLogs.length > MAX_LOGS) {
    requestLogs.pop();
  }
}

/**
 * Calculate metrics from request logs
 */
function calculateMetrics(timeWindowMs: number = 24 * 60 * 60 * 1000): PerformanceMetric[] {
  const cutoff = Date.now() - timeWindowMs;
  const recentLogs = requestLogs.filter(log => log.timestamp > cutoff);

  // Group by endpoint
  const byEndpoint = new Map<string, RequestLog[]>();
  
  recentLogs.forEach(log => {
    const key = `${log.method} ${log.endpoint}`;
    if (!byEndpoint.has(key)) {
      byEndpoint.set(key, []);
    }
    byEndpoint.get(key)!.push(log);
  });

  // Calculate metrics for each endpoint
  const metrics: PerformanceMetric[] = [];

  byEndpoint.forEach((logs, endpoint) => {
    const durations = logs.map(l => l.duration).sort((a, b) => a - b);
    const errorCount = logs.filter(l => l.status >= 400).length;

    const avgResponseTime = Math.round(
      durations.reduce((sum, d) => sum + d, 0) / durations.length
    );

    const p95Index = Math.floor(durations.length * 0.95);
    const p95ResponseTime = durations[p95Index] || durations[durations.length - 1] || 0;

    const errorRate = (errorCount / logs.length) * 100;

    metrics.push({
      endpoint,
      avgResponseTime,
      p95ResponseTime,
      requestCount: logs.length,
      errorRate: parseFloat(errorRate.toFixed(2))
    });
  });

  // Sort by request count (most active endpoints first)
  return metrics.sort((a, b) => b.requestCount - a.requestCount);
}

/**
 * GET /api/admin/monitoring/metrics
 * Retrieve performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const timeWindow = parseInt(url.searchParams.get('timeWindow') || '86400000'); // 24h default

    const metrics = calculateMetrics(timeWindow);

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return NextResponse.json({
      error: 'Failed to fetch metrics'
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/monitoring/metrics
 * Log a new request metric
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { endpoint, method, status, duration } = body;

    if (!endpoint || !method || status === undefined || duration === undefined) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 });
    }

    logApiRequest({
      endpoint,
      method,
      status,
      duration,
      timestamp: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Metric logged'
    });

  } catch (error) {
    console.error('Failed to log metric:', error);
    return NextResponse.json({
      error: 'Failed to log metric'
    }, { status: 500 });
  }
}
