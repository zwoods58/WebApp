import { NextRequest, NextResponse } from 'next/server';

// Your subscription plans from dashboard
const SUBSCRIPTION_PLANS = [
  { code: '3b0ee2ed7602', name: 'Nigeria Plan', currency: 'NGN', amount: 500, frequency: 'weekly' },
  { code: 'e624b74f1b92', name: 'South Africa Plan', currency: 'ZAR', amount: 30, frequency: 'weekly' },
  { code: 'dd3d15df45a0', name: 'Ghana Plan', currency: 'GHS', amount: 20, frequency: 'weekly' },
  { code: '8b80dc9ecf54', name: 'Kenya Plan', currency: 'KES', amount: 200, frequency: 'weekly' },
  { code: 'ac0cf59c69bf', name: 'Tanzania Plan', currency: 'TZS', amount: 2000, frequency: 'weekly' },
  { code: '97e6aede1698', name: 'Uganda Plan', currency: 'UGX', amount: 4000, frequency: 'weekly' },
  { code: 'f0409a10a1c7', name: 'Rwanda Plan', currency: 'RWF', amount: 1500, frequency: 'weekly' }
];

function identifySubscriptionPlan(paymentCode: string) {
  return SUBSCRIPTION_PLANS.find(plan => plan.code === paymentCode);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-startbutton-signature');
    
    console.log('StartButton webhook received:', {
      event: body.event,
      timestamp: new Date().toISOString(),
      signature: signature ? 'present' : 'missing',
      body: body
    });

    // TODO: Verify webhook signature when you have the webhook secret
    // const isValidSignature = verifyWebhookSignature(signature, body);
    // if (!isValidSignature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Handle different webhook events
    switch (body.event) {
      case 'collection.verified':
        const transaction = body.data.transaction;
        const subscriptionPlan = identifySubscriptionPlan(transaction.paymentCode);
        
        if (subscriptionPlan) {
          console.log('SUBSCRIPTION PAYMENT DETECTED:', {
            planName: subscriptionPlan.name,
            planCode: subscriptionPlan.code,
            currency: subscriptionPlan.currency,
            amount: transaction.amount,
            frequency: subscriptionPlan.frequency,
            customerEmail: transaction.customerEmail,
            transactionReference: transaction.transactionReference,
            timestamp: new Date().toISOString()
          });
          
          // TODO: Process subscription payment
          // - Update user's subscription status in database
          // - Grant access to premium features
          // - Send confirmation email
          // - Update subscription end date
          
        } else {
          console.log('REGULAR PAYMENT:', {
            paymentCode: transaction.paymentCode,
            amount: transaction.amount,
            currency: transaction.currency,
            customerEmail: transaction.customerEmail,
            timestamp: new Date().toISOString()
          });
          
          // TODO: Process regular one-time payment
        }
        break;
        
      case 'collection.completed':
        console.log('Payment completed:', body.data.transaction);
        // TODO: Handle payment completion (final settlement)
        break;
        
      case 'transfer.pending':
        console.log('Transfer pending:', body.data.transaction);
        // TODO: Process pending transfer
        break;
        
      case 'transfer.successful':
        console.log('Transfer successful:', body.data.transaction);
        // TODO: Process successful transfer
        break;
        
      case 'transfer.failed':
        console.log('Transfer failed:', body.data.transaction);
        // TODO: Process failed transfer
        break;
        
      case 'transfer.reversed':
        console.log('Transfer reversed:', body.data.transaction);
        // TODO: Process reversed transfer
        break;
        
      default:
        console.log('Unknown webhook event:', body.event);
    }

    return NextResponse.json({ 
      received: true,
      subscriptionDetected: !!identifySubscriptionPlan(body.data?.transaction?.paymentCode)
    });
  } catch (error) {
    console.error('StartButton webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'StartButton Webhook Endpoint',
    status: 'active',
    subscriptionPlans: SUBSCRIPTION_PLANS,
    supportedEvents: [
      'collection.verified',
      'collection.completed',
      'transfer.pending',
      'transfer.successful',
      'transfer.failed',
      'transfer.reversed'
    ]
  });
}
