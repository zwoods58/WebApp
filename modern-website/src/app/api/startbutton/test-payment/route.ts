import { NextRequest, NextResponse } from 'next/server';
import { startButtonService } from '@/lib/startbutton';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Test payment initialization
    const paymentData = {
      email: body.email || 'test@example.com',
      amount: body.amount || 10000, // 100 NGN in kobo
      currency: body.currency || 'NGN',
      reference: `test_${Date.now()}`,
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      },
      redirectUrl: body.redirectUrl || 'http://localhost:3000/payment/success',
      webhookUrl: body.webhookUrl || 'http://localhost:3000/api/webhook/startbutton'
    };

    console.log('Testing StartButton payment initialization:', paymentData);
    
    const result = await startButtonService.initializePayment(paymentData);
    
    return NextResponse.json({
      success: true,
      message: 'Payment initialization test successful',
      data: result
    });
  } catch (error) {
    console.error('StartButton payment test error:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Payment test failed',
      error: error
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'StartButton Payment Test Endpoint',
    usage: 'POST with email, amount, currency in request body',
    example: {
      email: 'test@example.com',
      amount: 10000,
      currency: 'NGN'
    }
  });
}

