/// <reference path="./deno-types.d.ts" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { 
      user_id, 
      user_email, 
      user_phone, 
      country, // Frontend sends ISO (KE, NG, GH, CI)
      full_name, 
      business_id, 
      industry,
      mobile_money_provider 
    } = requestBody;

    // Validation
    if (!user_id || !user_email || !country || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required registration fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Country configurations (Prices & Currencies)
    const CONFIGS: Record<string, any> = {
      'KE': { currency: 'KES', amount: 200, channels: ['mobileMoney'], providerKey: 'm-pesa' },
      'NG': { currency: 'NGN', amount: 500, channels: ['card', 'bank_transfer'] },
      'GH': { currency: 'GHS', amount: 20, channels: ['mobileMoney'], providerKey: 'mtn' },
      'CI': { currency: 'XOF', amount: 1000, channels: ['mobileMoney'], providerKey: 'orange-money' }
    };

    const config = CONFIGS[country.toUpperCase()];
    if (!config) throw new Error(`Unsupported country code: ${country}`);

    // Generate a unique reference for this transaction attempt
    const reference = `SUB-${user_id.slice(0, 8)}-${Date.now()}`;

    // Payload for Kyshi Transactions API (Initialize)
    const kyshiPayload = {
      email: user_email,
      amount: config.amount,
      localCurrency: config.currency,
      reference: reference,
      channels: config.channels,
      redirectUrl: `${Deno.env.get('APP_URL')}/subscription/callback?user_id=${user_id}&country=${country}`
    };

    // Add Mobile Money Provider if applicable
    if (config.channels.includes('mobileMoney')) {
      (kyshiPayload as any).mobileMoneyProvider = mobile_money_provider || config.providerKey;
    }

    // Call Kyshi Transactions API (Switch from /v1/subscriptions to /v1/transactions/initialize)
    const KYSHI_API = 'https://api.kyshi.co';
    const KYSHI_SECRET_KEY = Deno.env.get('KYSHI_SECRET_KEY');

    const response = await fetch(`${KYSHI_API}/v1/transactions/initialize`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kyshiPayload)
    });

    const kyshiData = await response.json();

    if (!kyshiData.status) {
      throw new Error(kyshiData.message || 'Kyshi transaction initialization failed');
    }

    // Store in database using NEW column names (migration 20260419)
    const { data: subscription, error: dbError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user_id,
        email: user_email,
        phone: user_phone,
        user_name: full_name,
        country_code: country,
        amount: config.amount,
        currency: config.currency,
        payment_method: config.channels[0],
        status: 'pending',
        is_active: false,
        next_billing_date: new Date().toISOString(),
        last_transaction_reference: reference,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }) // Upsert to handle re-attempts cleanly
      .select()
      .single();

    if (dbError) {
      console.error('DB Error:', dbError);
      throw new Error('Database sync failed');
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: kyshiData.data.authorizationUrl,
        reference: reference,
        subscription: subscription
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const error = err as Error;
    console.error('[CreateSub] Final Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
