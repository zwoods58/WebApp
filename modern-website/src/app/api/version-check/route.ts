import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mobile PWA version 104 - triggers update cycle
    const buildVersion = 'v104';
    
    // Check if we should force an update (can be set in Vercel environment variables)
    const forceUpdate = process.env.FORCE_UPDATE === 'true';
    
    return NextResponse.json({
      version: buildVersion,
      buildTime: new Date().toISOString(),
      forceUpdate: true, // Force update for mobile PWA
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'local',
      environment: process.env.NODE_ENV || 'development',
      mobileOnly: true // Indicate mobile-only strategy
    }, {
      // Prevent caching to ensure immediate version detection
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('[Version Check] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get version info' },
      { status: 500 }
    );
  }
}
