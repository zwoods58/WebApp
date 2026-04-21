import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('test-basic: Request received');
    
    return NextResponse.json({
      success: true,
      message: 'Basic test works - no Supabase involved',
      timestamp: new Date().toISOString(),
      method: 'GET',
      headers: Object.fromEntries(req.headers.entries()),
    });
  } catch (error) {
    console.error('test-basic error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('test-basic: POST request received');
    
    const body = await req.json().catch(() => ({}));
    
    return NextResponse.json({
      success: true,
      message: 'Basic POST test works - no Supabase involved',
      timestamp: new Date().toISOString(),
      method: 'POST',
      bodyReceived: body,
    });
  } catch (error) {
    console.error('test-basic POST error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
