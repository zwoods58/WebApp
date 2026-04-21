import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Test anon client
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Test service role client
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Test basic connection
    const { data: testData, error: testError } = await anonClient
      .from('businesses')
      .select('count')
      .limit(1);

    // Test service role connection
    const { data: serviceData, error: serviceError } = await serviceClient
      .from('businesses')
      .select('count')
      .limit(1);

    // Test if we can create a client (this tests the keys)
    let clientCreationTest = 'SUCCESS';
    try {
      createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, 'dummy-key');
    } catch (e) {
      clientCreationTest = 'FAILED: ' + (e instanceof Error ? e.message : 'Unknown');
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        clientCreation: clientCreationTest,
        anonConnection: testError ? `ERROR: ${testError.message}` : 'SUCCESS',
        serviceConnection: serviceError ? `ERROR: ${serviceError.message}` : 'SUCCESS',
        anonDataReturned: !!testData,
        serviceDataReturned: !!serviceData,
      },
      envChecks: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
