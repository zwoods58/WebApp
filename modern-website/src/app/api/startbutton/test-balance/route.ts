import { NextRequest, NextResponse } from 'next/server';
import { startButtonService } from '@/lib/startbutton';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency');

    console.log('Testing StartButton balance check', currency ? `for ${currency}` : 'for all currencies');
    
    const result = await startButtonService.getBalance(currency || undefined);
    
    return NextResponse.json({
      success: true,
      message: 'Balance check test successful',
      data: result
    });
  } catch (error) {
    console.error('StartButton balance test error:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Balance test failed',
      error: error
    }, { status: 500 });
  }
}

