import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Track server start time
const serverStartTime = Date.now();

/**
 * GET /api/admin/monitoring/health
 * System health check endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const checks = {
      database: false,
      api: true, // If we got here, API is working
      rateLimit: true // Assume working unless we detect issues
    };

    // Check database connectivity
    try {
      const { error } = await supabaseAdmin
        .from('businesses')
        .select('id')
        .limit(1);
      
      checks.database = !error;
    } catch (error) {
      checks.database = false;
    }

    // Determine overall status
    const allHealthy = Object.values(checks).every(check => check === true);
    const someUnhealthy = Object.values(checks).some(check => check === false);
    
    const status = allHealthy ? 'healthy' : someUnhealthy ? 'degraded' : 'down';

    // Calculate uptime in seconds
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000);

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      checks,
      uptime,
      version: process.env.npm_package_version || '1.0.0'
    });

  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'down',
      timestamp: new Date().toISOString(),
      checks: {
        database: false,
        api: false,
        rateLimit: false
      },
      uptime: 0,
      error: 'Health check failed'
    }, { status: 500 });
  }
}
