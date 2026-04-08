import { NextRequest, NextResponse } from 'next/server';
import { startButtonService } from '@/lib/startbutton';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.json({
        success: false,
        message: 'Reference parameter is required'
      }, { status: 400 });
    }

    console.log('Testing StartButton transaction status for reference:', reference);
    
    const result = await startButtonService.getTransactionStatus(reference);
    
    return NextResponse.json({
      success: true,
      message: 'Transaction status test successful',
      data: result
    });
  } catch (error) {
    console.error('StartButton status test error:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Status test failed',
      error: error
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference = body.reference;
    
    if (!reference) {
      return NextResponse.json({
        success: false,
        message: 'Reference parameter is required in request body'
      }, { status: 400 });
    }

    console.log('Testing StartButton transaction verification for reference:', reference);
    
    const result = await startButtonService.verifyTransaction(reference);
    
    return NextResponse.json({
      success: true,
      message: 'Transaction verification test successful',
      data: result
    });
  } catch (error) {
    console.error('StartButton verification test error:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Verification test failed',
      error: error
    }, { status: 500 });
  }
}
