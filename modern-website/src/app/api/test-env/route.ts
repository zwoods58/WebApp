import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
  };

  const details = {
    urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    urlStartsWithHttps: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') || false,
    keyFormatCorrect: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ') || false,
    nodeEnv: process.env.NODE_ENV,
  };

  // Test Supabase client creation
  let supabaseTest = 'NOT TESTED';
  try {
    const { supabase } = await import('@/lib/supabase');
    supabaseTest = 'SUCCESS';
  } catch (error) {
    supabaseTest = 'ERROR: ' + (error instanceof Error ? error.message : 'Unknown error');
  }

  return NextResponse.json({
    environment: 'SERVER-SIDE (API Route)',
    envVars,
    details,
    supabaseTest,
    timestamp: new Date().toISOString(),
  });
}
