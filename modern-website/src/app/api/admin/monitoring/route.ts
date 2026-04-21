/**
 * Comprehensive Monitoring API
 * Provides system health, performance metrics, and alerting
 * TEMPORARILY DISABLED - needs supabaseAdmin fixes
 */

import { NextRequest, NextResponse } from 'next/server';

// GET endpoint for monitoring data
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Monitoring API temporarily disabled during cleanup',
      message: 'This endpoint will be re-enabled after supabaseAdmin refactoring'
    },
    { status: 503 }
  );
}
