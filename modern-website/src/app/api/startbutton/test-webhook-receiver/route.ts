import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // No body provided, that's okay for this test
    }
    
    // Test webhook with Nigeria subscription
    const testWebhook = {
      event: 'collection.verified',
      data: {
        transaction: {
          _id: 'sub_test_1775643741497_3b0ee2ed7602',
          transType: 'collection',
          status: 'verified',
          merchantId: 'test_merchant_id',
          transactionReference: 'sub_ref_3b0ee2ed7602_1775643741497',
          userTransactionReference: 'user_ref_3b0ee2ed7602_1775643741497',
          paymentCode: '3b0ee2ed7602',
          customerEmail: 'test.customer.3b0ee2ed7602@example.com',
          amount: 50000,
          currency: 'NGN',
          narration: 'Subscription payment for Nigeria Plan',
          createdAt: '2026-04-08T10:22:21.497Z',
          updatedAt: '2026-04-08T10:22:21.497Z',
          metadata: {
            subscription: true,
            planName: 'Nigeria Plan',
            planCode: '3b0ee2ed7602'
          }
        }
      }
    };

    // Send this to your webhook endpoint
    const webhookResponse = await fetch('http://localhost:3000/api/webhook/startbutton', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testWebhook)
    });

    const webhookResult = await webhookResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Webhook test completed',
      testPayload: testWebhook,
      webhookResponse: webhookResult,
      note: 'Check your server console for detailed webhook processing logs'
    });

  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Webhook test failed',
      error: error
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'StartButton Webhook Test Endpoint',
    usage: 'POST to test webhook payload delivery to your webhook handler',
    testPlan: 'Nigeria Plan (3b0ee2ed7602) - 500 NGN'
  });
}

