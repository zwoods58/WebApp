import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Force console output to be visible
    console.error('=== DEBUG ERROR START ===');
    console.error('Request URL:', req.url);
    console.error('Headers:', Object.fromEntries(req.headers.entries()));
    console.error('Environment variables check:');
    console.error('- NODE_ENV:', process.env.NODE_ENV);
    console.error('- NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.error('- SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Try to import Supabase to see if that's the issue
    console.error('Attempting to import Supabase...');
    const { createClient } = require('@supabase/supabase-js');
    console.error('Supabase import successful');
    
    // Try to import our helper functions
    console.error('Attempting to import helper functions...');
    const { getSupabaseClient } = require('@/lib/supabase');
    console.error('Helper functions import successful');
    
    console.error('=== DEBUG ERROR END ===');
    
    return NextResponse.json({
      success: true,
      message: 'Debug endpoint completed successfully',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('=== CAUGHT ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'N/A');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    console.error('=== END CAUGHT ERROR ===');
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack available',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
