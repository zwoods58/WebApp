import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('x-kyshi-signature');
    const webhookSecret = Deno.env.get('KYSHI_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    const expectedSignature = await createHmac('SHA-256', webhookSecret)
      .update(body)
      .toString('hex');

    if (!signature.includes(expectedSignature)) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const event = JSON.parse(body);
    console.log('Kyshi webhook event:', event);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleSubscriptionCreated(supabase: any, data: any) {
  console.log('Subscription created:', data);
  
  // Update subscription status in database
  await supabase
    .from('subscriptions')
    .update({
      status: 'pending',
      kyshi_subscription_id: data.id,
      kyshi_subscription_code: data.code,
      updated_at: new Date().toISOString(),
    })
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

  // Update next charge date
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
