import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple test to see if we can read environment variables
    const baseUrl = process.env.KYSHI_BASE_URL || 'NOT_SET';
    const secretKey = process.env.KYSHI_SECRET_KEY ? 'SET' : 'NOT_SET';
    const publicKey = process.env.KYSHI_PUBLIC_KEY ? 'SET' : 'NOT_SET';
    
    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      environment: {
        baseUrl,
        secretKey: secretKey,
        publicKey: publicKey,
        secretKeyLength: process.env.KYSHI_SECRET_KEY?.length || 0,
        secretKeyPrefix: process.env.KYSHI_SECRET_KEY?.substring(0, 10) || 'NOT_SET',
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }, { status: 500 });
  }
}
