import { NextRequest, NextResponse } from 'next/server';

// Kyshi subscription plans (matching StartButton pricing)
const KYSHI_SUBSCRIPTION_PLANS = [
  {
    id: 'plan_ke_weekly',
    name: 'Kenya Weekly Plan',
    amount: 200,
    currency: 'KES',
    interval: 'weekly',
    code: 'KE_WEEKLY_200'
  },
  {
    id: 'plan_gh_weekly', 
    name: 'Ghana Weekly Plan',
    amount: 20,
    currency: 'GHS',
    interval: 'weekly',
    code: 'GH_WEEKLY_20'
  },
  {
    id: 'plan_ng_weekly', 
    name: 'Nigeria Weekly Plan',
    amount: 500,
    currency: 'NGN',
    interval: 'weekly',
    code: 'NG_WEEKLY_500'
  },
  {
    id: 'plan_za_weekly',
    name: 'South Africa Weekly Plan',
    amount: 30,
    currency: 'ZAR',
    interval: 'weekly',
    code: 'ZA_WEEKLY_30'
  },
  {
    id: 'plan_ug_weekly',
    name: 'Uganda Weekly Plan',
    amount: 4000,
    currency: 'UGX',
    interval: 'weekly',
    code: 'UG_WEEKLY_4000'
  },
  {
    id: 'plan_rw_weekly',
    name: 'Rwanda Weekly Plan',
    amount: 1500,
    currency: 'RWF',
    interval: 'weekly',
    code: 'RW_WEEKLY_1500'
  },
  {
    id: 'plan_tz_weekly',
    name: 'Tanzania Weekly Plan',
    amount: 2000,
    currency: 'TZS',
    interval: 'weekly',
    code: 'TZ_WEEKLY_2000'
  }
];

function identifyKyshiPlan(planId: string) {
  return KYSHI_SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-kyshi-signature');
    
    console.log('Kyshi webhook received:', {
      event: body.event,
      timestamp: new Date().toISOString(),
      signature: signature ? 'present' : 'missing',
      body: body
    });

    // TODO: Verify webhook signature when you have the webhook secret
    // According to docs: "Signature Inclusion: Every webhook sent includes a signature in the headers"
    // Merchants should validate this signature using their webhook secret key
    // const isValidSignature = verifyKyshiWebhookSignature(signature, body);
    // if (!isValidSignature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Handle different webhook events based on Kyshi documentation
    // Note: The exact event names need to be confirmed from Kyshi webhook events documentation
    switch (body.event) {
      case 'subscription.created':
        const subscription = body.data?.subscription || body.data;
        const plan = identifyKyshiPlan(subscription.plan?.id);
        
        if (plan) {
          console.log('KYSHI SUBSCRIPTION CREATED:', {
            planName: plan.name,
            planId: plan.id,
            currency: plan.currency,
            amount: plan.amount,
            interval: plan.interval,
            customerEmail: subscription.customer?.email,
            subscriptionId: subscription.id,
            subscriptionCode: subscription.code,
            startDate: subscription.startDate,
            nextPaymentDate: subscription.nextPaymentDate,
            isActive: subscription.isActive,
            timestamp: new Date().toISOString()
          });
          
          // TODO: Process subscription creation
          // - Create subscription record in database using subscription.code
          // - Grant access to premium features
          // - Send welcome email
          // - Set up billing reminders
          
        } else {
          console.log('KYSHI SUBSCRIPTION CREATED (Unknown Plan):', {
            planId: subscription.plan?.id,
            customerEmail: subscription.customer?.email,
            subscriptionId: subscription.id,
            subscriptionCode: subscription.code,
            timestamp: new Date().toISOString()
          });
        }
        break;
        
      case 'subscription.updated':
        console.log('KYSHI SUBSCRIPTION UPDATED:', body.data?.subscription || body.data);
        // TODO: Handle subscription updates (plan changes, etc.)
        break;
        
      case 'subscription.cancelled':
        console.log('KYSHI SUBSCRIPTION CANCELLED:', body.data?.subscription || body.data);
        // TODO: Handle subscription cancellation
        // - Revoke access to premium features
        // - Send cancellation confirmation
        // - Update database records
        break;
        
      case 'payment.completed':
        console.log('KYSHI PAYMENT COMPLETED:', body.data);
        // TODO: Handle successful payment
        // - Extend subscription period
        // - Send payment confirmation
        // - Update payment records
        break;
        
      case 'payment.failed':
        console.log('KYSHI PAYMENT FAILED:', body.data);
        // TODO: Handle failed payment
        // - Notify customer of payment failure
        // - Retry payment if applicable
        // - Update subscription status
        break;
        
      default:
        console.log('Unknown Kyshi webhook event:', body.event);
    }

    return NextResponse.json({ 
      received: true,
      subscriptionDetected: !!(body.data?.subscription?.plan && identifyKyshiPlan(body.data?.subscription?.plan?.id))
    });
  } catch (error) {
    console.error('Kyshi webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Kyshi Webhook Endpoint',
    status: 'active',
    subscriptionPlans: KYSHI_SUBSCRIPTION_PLANS,
    supportedEvents: [
      'subscription.created',
      'subscription.updated',
      'subscription.cancelled',
      'payment.completed',
      'payment.failed'
    ]
  });
}
