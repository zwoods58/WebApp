import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test with a simple invalid token
    const { data, error } = await supabase.auth.getUser('invalid_token');
    
    return NextResponse.json({ 
      message: 'JWT test completed',
      hasError: !!error,
      errorMessage: error?.message,
      hasUser: !!data?.user,
      envVarsPresent: !!(supabaseUrl && supabaseAnonKey)
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
