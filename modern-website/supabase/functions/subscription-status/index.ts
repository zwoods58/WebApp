import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { subscription_id, kyshi_subscription_id } = await req.json();

    if (!subscription_id || !kyshi_subscription_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: subscription_id, kyshi_subscription_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get subscription from Kyshi
    const KYSHI_API = 'https://api.kyshi.co';
    const KYSHI_SECRET_KEY = Deno.env.get('KYSHI_SECRET_KEY');

    const kyshiResponse = await fetch(`${KYSHI_API}/v1/subscriptions/${kyshi_subscription_id}`, {
      headers: {
        'x-api-key': KYSHI_SECRET_KEY
      }
    });

    const kyshiData = await kyshiResponse.json();

    if (!kyshiData.status) {
      throw new Error(kyshiData.message || 'Failed to get subscription from Kyshi');
    }

    // Update local database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update({
        status: kyshiData.data.isActive ? 'active' : 'pending',
        is_active: kyshiData.data.isActive,
        current_period_start: kyshiData.data.startDate,
        current_period_end: kyshiData.data.nextPaymentDate,
        last_charge_date: kyshiData.data.lastChargeDate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription_id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      throw new Error('Failed to update subscription in database');
    }

    return new Response(
      JSON.stringify({
        success: true,
        isActive: kyshiData.data.isActive,
        nextPaymentDate: kyshiData.data.nextPaymentDate,
        subscription: subscription,
        kyshiSubscription: kyshiData.data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Subscription status error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
