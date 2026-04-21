import { NextRequest, NextResponse } from 'next/server';

// Simple PWA cache events endpoint
// SSE was removed — it's not needed for PWA caching and caused production issues

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'PWA cache events endpoint active',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    console.log('[pwa/cache-events] event received:', body);

    return NextResponse.json({
      success: true,
      message: 'Cache event received',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[pwa/cache-events] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to process cache event' },
      { status: 500 }
    );
  }
}