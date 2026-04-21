import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('test-minimal: GET request received at', new Date().toISOString());
  
  try {
    // Absolute minimal response - no imports, no complex logic
    return new Response(JSON.stringify({
      success: true,
      message: 'Minimal test works',
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('test-minimal error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
