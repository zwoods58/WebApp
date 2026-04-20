/// <reference path="./deno-types.d.ts" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kyshi-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Read ENTIRE raw body as text first before anything else
    const rawBody = await req.text();
    
    // Validate using HMAC-SHA512
    const KYSHI_WEBHOOK_SECRET = Deno.env.get("KYSHI_WEBHOOK_SECRET");
    if (!KYSHI_WEBHOOK_SECRET) {
      console.error('❌ KYSHI_WEBHOOK_SECRET not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const expected = createHmac("sha512", KYSHI_WEBHOOK_SECRET).update(rawBody).digest("hex");
    const received = req.headers.get("x-kyshi-signature");
    
    if (expected !== received) {
      console.error('❌ Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON from rawBody
    const event = JSON.parse(rawBody);
    
    // Only process when event === "successful" — return 200 for all other events
    if (event.event !== "successful") {
      console.log(`ℹ️ Ignoring non-successful event: ${event.event}`);
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get reference from event.data.reference
    const reference = event.data?.reference;
    if (!reference) {
      console.error('❌ No reference found in webhook data');
      return new Response(
        JSON.stringify({ error: 'Missing reference' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Query subscriptions table where kyshi_reference = reference
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('kyshi_reference', reference)
      .single();

    if (fetchError || !subscription) {
      console.log(`ℹ️ No subscription found for reference: ${reference}`);
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If subscription.status already === "active" return 200 (idempotency)
    if (subscription.status === 'active') {
      console.log(`ℹ️ Subscription ${subscription.id} already active`);
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate dates
    const now = new Date();
    const nextChargeDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // NOW + 7 days

    // Update subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        is_active: true,
        grace_period_day: 0,
        last_charge_date: now.toISOString(),
        next_charge_date: nextChargeDate.toISOString(),
        current_period_start: now.toISOString(),
        current_period_end: nextChargeDate.toISOString(),
        bank_account_number: null,
        bank_account_name: null,
        bank_name: null,
        bank_account_expires_at: null,
        updated_at: now.toISOString()
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('❌ Failed to update subscription:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update subscription' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Successfully activated subscription ${subscription.id} for reference ${reference}`);

    return new Response(
      JSON.stringify({ received: true, subscription_id: subscription.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
