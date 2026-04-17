import { NextRequest, NextResponse } from 'next/server';
import { startButtonService } from '@/lib/startbutton';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');

    if (!fromCurrency || !toCurrency) {
      return NextResponse.json({
        success: false,
        message: 'Both "from" and "to" currency parameters are required'
      }, { status: 400 });
    }

    console.log(`Testing StartButton FX rate from ${fromCurrency} to ${toCurrency}`);
    
    const result = await startButtonService.getFXRate(fromCurrency, toCurrency);
    
    return NextResponse.json({
      success: true,
      message: 'FX rate test successful',
      data: result
    });
  } catch (error) {
    console.error('StartButton FX rate test error:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'FX rate test failed',
      error: error
    }, { status: 500 });
  }
}

