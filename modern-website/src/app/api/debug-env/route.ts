import { NextResponse } from 'next/server';

export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  console.log('Environment check:', env);

  return NextResponse.json({ 
    environment: env,
    message: 'Environment variables check'
  });
}
