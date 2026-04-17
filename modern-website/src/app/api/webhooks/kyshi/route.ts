import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'node:crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-kyshi-signature');
    const webhookSecret = process.env.KYSHI_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(body, 'utf8')
      .digest('hex');

    if (!signature.includes(expectedSignature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    console.log('Kyshi webhook event:', event);

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Handle different event types
    switch (event.event) {
      case 'subscription.created':
        await handleSubscriptionCreated(supabase, event.data);
        break;
      
      case 'subscription.activated':
        await handleSubscriptionActivated(supabase, event.data);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(supabase, event.data);
        break;
      
      case 'subscription.payment.succeeded':
        await handlePaymentSucceeded(supabase, event.data);
        break;
      
      case 'subscription.payment.failed':
        await handlePaymentFailed(supabase, event.data);
        break;
      
      default:
        console.log('Unhandled event type:', event.event);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(supabase: any, data: any) {
  console.log('Subscription created:', data);
  
  // Update subscription status in database with complete information
  const updateData: any = {
    status: 'pending',
    kyshi_subscription_id: data.id,
    kyshi_subscription_code: data.code,
    updated_at: new Date().toISOString(),
  };

  // Add additional data if available
  if (data.amount) updateData.amount = data.amount;
  if (data.currency) updateData.currency = data.currency;
  if (data.paymentMethod) updateData.payment_method = data.paymentMethod;
  if (data.plan) {
    updateData.plan_name = data.plan.name;
    updateData.plan_interval = data.plan.interval;
  }
  if (data.customer) {
    updateData.customer_email = data.customer.email;
    updateData.customer_phone = data.customer.phone;
  }
  
  await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('kyshi_subscription_id', data.id);
}

async function handleSubscriptionActivated(supabase: any, data: any) {
  console.log('Subscription activated:', data);
  
  // Update subscription status in database
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      is_active: true,
      current_period_start: data.startDate,
      current_period_end: data.nextPaymentDate,
      updated_at: new Date().toISOString(),
    })
    .eq('kyshi_subscription_id', data.id);
}

async function handleSubscriptionCancelled(supabase: any, data: any) {
  console.log('Subscription cancelled:', data);
  
  // Update subscription status in database
  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      is_active: false,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('kyshi_subscription_id', data.id);
}

async function handlePaymentSucceeded(supabase: any, data: any) {
  console.log('Payment succeeded:', data);
  
  // Create transaction record
  await supabase
    .from('transactions')
    .insert({
      kyshi_transaction_id: data.id,
      kyshi_reference: data.reference,
      subscription_id: data.subscriptionId,
      amount: data.amount,
      currency: data.currency,
      status: 'success',
      payment_method: data.paymentMethod,
      processed_at: data.processedAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

  // Update subscription next charge date
  await supabase
    .from('subscriptions')
    .update({
      last_charge_date: new Date().toISOString(),
      next_charge_date: data.nextPaymentDate,
      updated_at: new Date().toISOString(),
    })
    .eq('kyshi_subscription_id', data.subscriptionId);
}

async function handlePaymentFailed(supabase: any, data: any) {
  console.log('Payment failed:', data);
  
  // Create transaction record
  await supabase
    .from('transactions')
    .insert({
      kyshi_transaction_id: data.id,
      kyshi_reference: data.reference,
      subscription_id: data.subscriptionId,
      amount: data.amount,
      currency: data.currency,
      status: 'failed',
      payment_method: data.paymentMethod,
      processed_at: data.processedAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
}

