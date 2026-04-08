import { NextRequest, NextResponse } from 'next/server';
import { startButtonService } from '@/lib/startbutton';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Test transfer initialization
    const transferData = {
      bankCode: body.bankCode || '058', // GTBank test code
      accountNumber: body.accountNumber || '0123456789',
      accountName: body.accountName || 'Test Account',
      amount: body.amount || 10000, // 100 NGN in kobo
      currency: body.currency || 'NGN',
      reference: `transfer_test_${Date.now()}`,
      narration: body.narration || 'Test transfer',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Testing StartButton transfer initialization:', transferData);
    
    const result = await startButtonService.initializeTransfer(transferData);
    
    return NextResponse.json({
      success: true,
      message: 'Transfer initialization test successful',
      data: result
    });
  } catch (error) {
    console.error('StartButton transfer test error:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Transfer test failed',
      error: error
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'StartButton Transfer Test Endpoint',
    usage: 'POST with bankCode, accountNumber, accountName, amount, currency in request body',
    example: {
      bankCode: '058',
      accountNumber: '0123456789',
      accountName: 'Test Account',
      amount: 10000,
      currency: 'NGN'
    }
  });
}
