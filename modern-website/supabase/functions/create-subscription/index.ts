/// <reference path="./deno-types.d.ts" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { user_id, user_email, user_phone, country, full_name, business_id, industry } = requestBody;

    // Enhanced validation for required fields
    const requiredFields = ['user_id', 'user_email', 'country', 'full_name'];
    const missingFields = requiredFields.filter(field => !requestBody[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          missing_fields: missingFields 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Debug logging
    console.log('Environment variables:', {
      SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'SET' : 'NOT_SET',
      KYSHI_SECRET_KEY: Deno.env.get('KYSHI_SECRET_KEY') ? 'SET' : 'NOT_SET',
      KYSHI_PLAN_CODE_NIGERIA: Deno.env.get('KYSHI_PLAN_CODE_NIGERIA') ? 'SET' : 'NOT_SET'
    });

    // Country configurations
    const COUNTRY_CONFIG = {
      Kenya: {
        currency: 'KES',
        amount: 200,
        paymentMethod: 'mobile_money',
        planCode: Deno.env.get('KYSHI_PLAN_CODE_KENYA') || 'PLN_MVyWThBVJ1Np0IB',
        mobileMoneyProvider: 'm-pesa',
      },
      Nigeria: {
        currency: 'NGN',
        amount: 500,
        paymentMethod: 'bank_transfer',
        planCode: Deno.env.get('KYSHI_PLAN_CODE_NIGERIA') || 'PLN_iiRmmGJcnQy5paj',
        mobileMoneyProvider: undefined, // Bank transfer doesn't use mobile money
        requiresBankSelection: true, // Bank selection required for Nigeria
      },
      Ghana: {
        currency: 'GHS',
        amount: 20,
        paymentMethod: 'mobile_money',
        planCode: Deno.env.get('KYSHI_PLAN_CODE_GHANA') || 'PLN_WQN3ZhV2AX-knWQ',
        mobileMoneyProvider: 'mtn',
      },
      CoteDIvoire: {
        currency: 'XOF',
        amount: 1000,
        paymentMethod: 'mobile_money',
        planCode: Deno.env.get('KYSHI_PLAN_CODE_CIV') || 'PLN_XdMwJ8jf8qeHhi0',
        mobileMoneyProvider: 'orange-money',
      },
      CotedIvoire: {
        currency: 'XOF',
        amount: 1000,
        paymentMethod: 'mobile_money',
        planCode: Deno.env.get('KYSHI_PLAN_CODE_CIV') || 'PLN_XdMwJ8jf8qeHhi0',
        mobileMoneyProvider: 'orange-money',
      },
    };

    const config = COUNTRY_CONFIG[country as keyof typeof COUNTRY_CONFIG];
    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unsupported country: ${country}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create subscription in Kyshi
    const KYSHI_API = 'https://api.kyshi.co';
    const KYSHI_SECRET_KEY = Deno.env.get('KYSHI_SECRET_KEY');

    const subscriptionPayload = {
      planCode: config.planCode,
      customer: user_email,
      paymentMethod: config.paymentMethod,
      redirectUrl: `${Deno.env.get('APP_URL')}/subscription/callback?user_id=${user_id}&country=${country}`
    };

    // Add mobile money provider for specific countries (REQUIRED for Kenya, Ghana, Côte d'Ivoire)
    if (config.paymentMethod === 'mobile_money') {
      if (!config.mobileMoneyProvider) {
        return new Response(
          JSON.stringify({ error: `Mobile money provider is required for ${country}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      (subscriptionPayload as any).mobileMoneyProvider = config.mobileMoneyProvider;
    }

    // Add bank selection requirement for Nigeria
    if (config.paymentMethod === 'bank_transfer') {
      if (!('requiresBankSelection' in config) || !config.requiresBankSelection) {
        return new Response(
          JSON.stringify({ error: `Bank selection is required for ${country}. Please select a bank from the list.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const kyshiResponse = await fetch(`${KYSHI_API}/v1/subscriptions`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscriptionPayload)
    });

    const kyshiData = await kyshiResponse.json();

    if (!kyshiData.status) {
      throw new Error(kyshiData.message || 'Failed to create subscription in Kyshi');
    }

    // Store subscription in database with complete data
    const subscriptionData = {
      user_id: user_id,
      user_email: user_email,
      user_phone: user_phone,
      user_name: full_name,
      country: country,
      business_id: business_id || null,
      industry: industry || null,
      amount: config.amount,
      currency: config.currency,
      payment_method: config.paymentMethod,
      kyshi_subscription_id: kyshiData.data.id,
      kyshi_subscription_code: kyshiData.data.code,
      kyshi_plan_code: config.planCode,
      status: 'pending',
      is_active: false,
      next_charge_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Storing subscription data:', subscriptionData);

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to store subscription in database');
    }

    // Return response with payment URL and metadata
    return new Response(
      JSON.stringify({
        success: true,
        subscription: subscription,
        paymentUrl: kyshiData.data.authorizationUrl || kyshiData.data.checkoutUrl,
        paymentMethod: config.paymentMethod,
        redirectBehavior: config.paymentMethod === 'bank_transfer' ? 'external' : 'modal',
        country: country,
        amount: config.amount,
        currency: config.currency,
        mobileMoneyProvider: config.mobileMoneyProvider,
        subscriptionId: kyshiData.data.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Create subscription error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as Error).message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
