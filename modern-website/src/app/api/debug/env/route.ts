import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    ngrokUrl: process.env.NGROK_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    kyshiApiUrl: process.env.KYSHI_API_URL,
    timestamp: new Date().toISOString()
  });
}

