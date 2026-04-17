import { NextRequest, NextResponse } from 'next/server';

// Your existing subscription plans from dashboard
const SUBSCRIPTION_PLANS = [
  {
    code: '3b0ee2ed7602',
    name: 'Nigeria Plan',
    currency: 'NGN',
    amount: 500,
    frequency: 'weekly',
    url: 'https://pay-sandbox.startbutton.tech/#/subscription/3b0ee2ed7602'
  },
  {
    code: 'e624b74f1b92',
    name: 'South Africa Plan',
    currency: 'ZAR',
    amount: 30,
    frequency: 'weekly',
    url: 'https://pay-sandbox.startbutton.tech/#/subscription/e624b74f1b92'
  },
  {
    code: 'dd3d15df45a0',
    name: 'Ghana Plan',
    currency: 'GHS',
    amount: 20,
    frequency: 'weekly',
    url: 'https://pay-sandbox.startbutton.tech/#/subscription/dd3d15df45a0'
  },
  {
    code: '8b80dc9ecf54',
    name: 'Kenya Plan',
    currency: 'KES',
    amount: 200,
    frequency: 'weekly',
    url: 'https://pay-sandbox.startbutton.tech/#/subscription/8b80dc9ecf54'
  },
  {
    code: 'ac0cf59c69bf',
    name: 'Tanzania Plan',
    currency: 'TZS',
    amount: 2000,
    frequency: 'weekly',
    url: 'https://pay-sandbox.startbutton.tech/#/subscription/ac0cf59c69bf'
  },
  {
    code: '97e6aede1698',
    name: 'Uganda Plan',
    currency: 'UGX',
    amount: 4000,
    frequency: 'weekly',
    url: 'https://pay-sandbox.startbutton.tech/#/subscription/97e6aede1698'
  },
  {
    code: 'f0409a10a1c7',
    name: 'Rwanda Plan',
    currency: 'RWF',
    amount: 1500,
    frequency: 'weekly',
    url: 'https://pay-sandbox.startbutton.tech/#/subscription/f0409a10a1c7'
  }
];

export async function GET() {
  return NextResponse.json({
    message: 'StartButton Subscription Plans',
    plans: SUBSCRIPTION_PLANS,
    totalPlans: SUBSCRIPTION_PLANS.length,
    usage: 'Use POST to test subscription webhook handling or POST with planCode to simulate subscription payment'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planCode, action } = body;

    if (action === 'test-webhook') {
      // Simulate subscription webhook for each plan
      const webhookTests = SUBSCRIPTION_PLANS.map(plan => ({
        event: 'collection.verified',
        data: {
          transaction: {
            _id: `sub_test_${Date.now()}_${plan.code}`,
            transType: 'collection',
            status: 'verified',
            merchantId: 'test_merchant_id',
            transactionReference: `sub_ref_${plan.code}_${Date.now()}`,
            userTransactionReference: `user_ref_${plan.code}_${Date.now()}`,
            paymentCode: plan.code, // This matches your subscription plan code
            customerEmail: `test.customer.${plan.code}@example.com`,
            amount: plan.amount * 100, // Convert to fractional units
            currency: plan.currency,
            narration: `Subscription payment for ${plan.name}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              subscription: true,
              planName: plan.name,
              planCode: plan.code
            }
          }
        }
      }));

      return NextResponse.json({
        success: true,
        message: 'Subscription webhook tests generated',
        webhookTests,
        note: 'These simulate webhook payloads for your existing subscription plans'
      });
    }

    if (planCode) {
      // Test specific subscription plan
      const plan = SUBSCRIPTION_PLANS.find(p => p.code === planCode);
      
      if (!plan) {
        return NextResponse.json({
          success: false,
          message: 'Plan not found',
          availablePlans: SUBSCRIPTION_PLANS.map(p => p.code)
        }, { status: 404 });
      }

      // Simulate a subscription payment for this plan
      const simulatedPayment = {
        event: 'collection.verified',
        data: {
          transaction: {
            _id: `sub_payment_${Date.now()}`,
            transType: 'collection',
            status: 'verified',
            merchantId: 'test_merchant_id',
            transactionReference: `sub_${plan.code}_${Date.now()}`,
            paymentCode: plan.code,
            customerEmail: 'test@example.com',
            amount: plan.amount * 100, // Fractional units
            currency: plan.currency,
            narration: `Subscription payment for ${plan.name}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              subscription: true,
              planName: plan.name,
              planCode: plan.code,
              testPayment: true
            }
          }
        }
      };

      return NextResponse.json({
        success: true,
        message: `Test payment simulated for ${plan.name}`,
        plan,
        simulatedPayment,
        subscriptionUrl: plan.url
      });
    }

    // Test getting subscribers (will need real API keys)
    const baseUrl = process.env.STARTBUTTON_BASE_URL || 'https://api.startbutton.tech';
    const secretKey = process.env.STARTBUTTON_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({
        success: false,
        message: 'StartButton secret key not configured',
        plans: SUBSCRIPTION_PLANS
      }, { status: 500 });
    }

    try {
      const response = await fetch(`${baseUrl}/subscribers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      if (response.ok) {
        const subscribers = await response.json();
        return NextResponse.json({
          success: true,
          message: 'Subscribers retrieved successfully',
          plans: SUBSCRIPTION_PLANS,
          subscribers
        });
      } else {
        throw new Error('Failed to fetch subscribers');
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch subscribers',
        error: error instanceof Error ? error.message : 'Unknown error',
        plans: SUBSCRIPTION_PLANS
      });
    }

  } catch (error) {
    console.error('Subscription test error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Subscription test failed',
      error: error
    }, { status: 500 });
  }
}

