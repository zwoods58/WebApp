// =====================================================
// API ROUTE: Archive Trigger Webhook
// PURPOSE: Manually trigger archive via HTTP request
// USAGE: POST /api/webhook/archive-trigger
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Verify webhook secret
const WEBHOOK_SECRET = process.env.ARCHIVE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('Authorization');
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Call the archive function
    const { data, error } = await supabaseAdmin.rpc('archive_old_data');
    
    if (error) {
      throw new Error(error.message);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Archive completed',
      result: data,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Archive trigger failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check archive status
export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await supabaseAdmin.rpc('get_storage_metrics');
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Format metrics as object
    const metrics: Record<string, string> = {};
    for (const row of data) {
      metrics[row.metric_name] = row.metric_value;
    }
    
    return NextResponse.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
