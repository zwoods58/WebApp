import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import KyshiAPI from '@/lib/kyshi-api';

export async function POST(request: NextRequest) {
  try {
    // Get webhook body
    const body = await request.text();
    const signature = request.headers.get('x-kyshi-signature');

    // Verify webhook signature (SHA512)
    if (!signature || !KyshiAPI.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse webhook data
    const webhookData = JSON.parse(body);
    console.log('🔔 Kyshi Webhook received:', webhookData);

    // Only handle transaction.successful events
    if (webhookData.event !== 'transaction.successful') {
      console.log(`ℹ️ Ignoring event: ${webhookData.event}`);
      return NextResponse.json({ received: true });
    }

    const transaction = webhookData.data;
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', transaction.customerEmail)
      .single();

    if (userError || !user) {
      console.error('❌ User not found:', transaction.customerEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if transaction already processed
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', transaction.reference)
      .single();

    if (existingTransaction) {
      console.log('ℹ️ Transaction already processed:', transaction.reference);
      return NextResponse.json({ received: true });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        reference: transaction.reference,
        transaction_id: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        customer_email: transaction.customerEmail,
        customer_name: transaction.customerName,
        created_at: transaction.createdAt,
        paid_at: transaction.paidAt,
        webhook_data: transaction,
        type: 'subscription_payment'
      });

    if (transactionError) {
      console.error('❌ Failed to create transaction record:', transactionError);
      return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
    }

    // Update user subscription
    const nextPaymentDue = new Date();
    nextPaymentDue.setDate(nextPaymentDue.getDate() + 7); // Add 7 days

    const { error: subscriptionError } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_amount: transaction.amount,
        subscription_currency: transaction.currency,
        next_payment_due: nextPaymentDue.toISOString(),
        last_payment_at: transaction.paidAt || new Date().toISOString(),
        access_granted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (subscriptionError) {
      console.error('❌ Failed to update subscription:', subscriptionError);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'subscription_activated',
        data: {
          transactionId: transaction.transactionId,
          reference: transaction.reference,
          amount: transaction.amount,
          currency: transaction.currency,
          nextPaymentDue: nextPaymentDue.toISOString()
        },
        created_at: new Date().toISOString()
      });

    console.log(`✅ Subscription activated for ${transaction.customerEmail}`);
    console.log(`📅 Next payment due: ${nextPaymentDue.toISOString()}`);

    return NextResponse.json({ 
      success: true,
      message: 'Subscription activated successfully',
      nextPaymentDue: nextPaymentDue.toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

