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
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all active subscriptions that need to be charged
    const now = new Date();
    const { data: subscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'active')
      .lte('next_charge_date', now.toISOString())
      .order('next_charge_date', { ascending: true });

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      throw new Error('Failed to fetch subscriptions');
    }

    console.log(`Found ${subscriptions.length} subscriptions to charge`);

    const KYSHI_API = 'https://api.kyshi.co';
    const KYSHI_SECRET_KEY = Deno.env.get('KYSHI_SECRET_KEY');

    const results = [];

    for (const subscription of subscriptions) {
      try {
        console.log(`Processing subscription ${subscription.id} for ${subscription.user_email}`);

        // Charge subscription via Kyshi
        const chargeResponse = await fetch(`${KYSHI_API}/v1/subscriptions/charge`, {
          method: 'POST',
          headers: {
            'x-api-key': KYSHI_SECRET_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subscriptionId: subscription.kyshi_subscription_id,
            amount: subscription.amount,
          })
        });

        const chargeData = await chargeResponse.json();

        if (!chargeData.status) {
          console.error(`Failed to charge subscription ${subscription.id}:`, chargeData.message);
          results.push({
            subscriptionId: subscription.id,
            success: false,
            error: chargeData.message,
          });
          continue;
        }

        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            kyshi_transaction_id: chargeData.data.id,
            kyshi_reference: chargeData.data.reference,
            subscription_id: subscription.id,
            amount: subscription.amount,
            currency: subscription.currency,
            status: chargeData.data.status === 'success' ? 'success' : 'failed',
            payment_method: subscription.payment_method,
            processed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });

        if (transactionError) {
          console.error('Error creating transaction record:', transactionError);
        }

        // Update subscription next charge date
        const nextChargeDate = new Date();
        nextChargeDate.setDate(nextChargeDate.getDate() + 7); // Add 7 days for weekly

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            last_charge_date: new Date().toISOString(),
            next_charge_date: nextChargeDate.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
        }

        results.push({
          subscriptionId: subscription.id,
          success: true,
          transactionId: chargeData.data.id,
          status: chargeData.data.status,
        });

        console.log(`Successfully charged subscription ${subscription.id}`);

      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        results.push({
          subscriptionId: subscription.id,
          success: false,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: subscriptions.length,
        results: results,
        summary: {
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Process weekly charges error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
