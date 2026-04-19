import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const KYSHI_API = 'https://api.kyshi.co';
    const KYSHI_SECRET_KEY = Deno.env.get('KYSHI_SECRET_KEY');

    // 1. Find subscriptions due for billing
    // We target both 'active' and 'pending' (if they are in grace period)
    const { data: dueSubscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .lte('next_billing_date', new Date().toISOString())
      .in('status', ['active', 'pending']);

    if (fetchError) throw fetchError;

    console.log(`[BillingEngine] Found ${dueSubscriptions?.length || 0} renewals to process`);

    for (const sub of (dueSubscriptions || [])) {
      try {
        console.log(`[BillingEngine] Processing ${sub.email} (Retry: ${sub.retry_index})`);

        let success = false;
        let reference = `RENEW-${sub.id.slice(0, 8)}-${Date.now()}`;

        // STRATEGY: Switch to Transactions API
        // For Mobile Money (most African markets), we cannot auto-pull.
        // We initialize a new transaction and rely on the webhook to confirm success.
        
        const kyshiPayload = {
          email: sub.email,
          amount: sub.amount,
          localCurrency: sub.currency,
          reference: reference,
          channels: sub.payment_method === 'bank_transfer' ? ['bank_transfer'] : ['mobileMoney'],
          // For recurring charges, we might want to email the user a link if it's MoMo
          redirectUrl: `${Deno.env.get('APP_URL')}/dashboard`
        };

        const chargeResponse = await fetch(`${KYSHI_API}/v1/transactions/initialize`, {
          method: 'POST',
          headers: {
            'x-api-key': KYSHI_SECRET_KEY || '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(kyshiPayload)
        });

        const chargeData = await chargeResponse.json();

        // Note: For MoMo, 'status: true' just means the push was SENT or initialized.
        // We treat it as a "success" in attempt, but but not "success" in payment yet.
        // The real "success" comes from the webhook.
        if (chargeData.status) {
           console.log(`[BillingEngine] Successfully re-initialized transaction for ${sub.email}`);
           // We don't advance the next_billing_date yet!
           // We only do that when the webhook confirms payment.
        } else {
           throw new Error(chargeData.message || 'Kyshi initialization failed');
        }

      } catch (err) {
        const error = err as Error;
        console.error(`[BillingEngine] Failure for ${sub.email}:`, error.message);

        // GRACE PERIOD LOGIC
        const newRetryIndex = (sub.retry_index || 0) + 1;
        
        if (newRetryIndex >= 3) {
          // Final failure: Cancel subscription
          await supabase
            .from('subscriptions')
            .update({
              status: 'failed',
              is_active: false,
              last_error: error.message,
              updated_at: new Date().toISOString()
            })
            .eq('id', sub.id);
          
          console.log(`[BillingEngine] Subscription ${sub.id} CANCELLED after 3 attempts.`);
        } else {
          // Grace period: Retry tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          await supabase
            .from('subscriptions')
            .update({
              retry_index: newRetryIndex,
              next_billing_date: tomorrow.toISOString(),
              last_error: error.message,
              updated_at: new Date().toISOString()
            })
            .eq('id', sub.id);
          
          console.log(`[BillingEngine] Subscription ${sub.id} moved to grace period (Attempt ${newRetryIndex}/3).`);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
