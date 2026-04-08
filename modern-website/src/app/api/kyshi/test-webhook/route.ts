import { NextRequest, NextResponse } from 'next/server';

// Kyshi subscription plans (matching StartButton Kenya pricing)
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
  }
];

export async function GET() {
  return NextResponse.json({
    message: 'Kyshi Webhook Test Endpoint',
    plans: KYSHI_SUBSCRIPTION_PLANS,
    usage: 'POST to test Kyshi webhook simulation',
    webhookEvents: [
      'subscription.created',
      'subscription.updated', 
      'subscription.cancelled',
      'payment.completed',
      'payment.failed'
    ]
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, planId, eventType } = body;

    if (action === 'test-webhook') {
      // Simulate Kyshi webhook events
      const webhookTests = KYSHI_SUBSCRIPTION_PLANS.map(plan => ({
        event: 'subscription.created',
        data: {
          subscription: {
            id: `sub_${Date.now()}_${plan.id}`,
            customer: {
              id: `cust_${Date.now()}`,
              email: `test.customer@example.com`,
              currencyCode: plan.currency
            },
            plan: plan,
            startDate: new Date().toISOString(),
            nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            isActive: true,
            reference: `kyshi_ref_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      }));

      return NextResponse.json({
        success: true,
        message: 'Kyshi webhook tests generated',
        webhookTests,
        note: 'These simulate webhook payloads for Kyshi subscription events'
      });
    }

    if (planId && eventType) {
      // Test specific webhook event
      const plan = KYSHI_SUBSCRIPTION_PLANS.find(p => p.id === planId);
      
      if (!plan) {
        return NextResponse.json({
          success: false,
          message: 'Plan not found',
          availablePlans: KYSHI_SUBSCRIPTION_PLANS.map(p => p.id)
        }, { status: 404 });
      }

      const simulatedWebhook = {
        event: eventType,
        data: {
          subscription: {
            id: `sub_${Date.now()}_${planId}`,
            customer: {
              id: `cust_${Date.now()}`,
              email: 'test.kyshi@example.com',
              currencyCode: plan.currency
            },
            plan: plan,
            startDate: new Date().toISOString(),
            nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: eventType !== 'subscription.cancelled',
            reference: `kyshi_ref_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      };

      return NextResponse.json({
        success: true,
        message: `Kyshi webhook test for ${eventType}`,
        plan,
        simulatedWebhook,
        note: 'This simulates a Kyshi webhook event'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid request. Use action="test-webhook" or provide planId and eventType'
    }, { status: 400 });

  } catch (error) {
    console.error('Kyshi webhook test error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Webhook test failed',
      error: error
    }, { status: 500 });
  }
}
