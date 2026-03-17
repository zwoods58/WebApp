import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Timezone mapping for supported countries
const COUNTRY_TIMEZONES: Record<string, string> = {
  'KE': 'Africa/Nairobi',      // UTC+3
  'NG': 'Africa/Lagos',         // UTC+1
  'ZA': 'Africa/Johannesburg',  // UTC+2
  'GH': 'Africa/Accra',         // UTC+0
  'UG': 'Africa/Kampala',       // UTC+3
  'RW': 'Africa/Kigali',        // UTC+2
  'TZ': 'Africa/Dar_es_Salaam'  // UTC+3
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Get current time in a specific timezone
 */
function getCurrentTimeInTimezone(timezone: string): Date {
  try {
    const dateString = new Date().toLocaleString('en-US', { timeZone: timezone });
    return new Date(dateString);
  } catch (error) {
    console.error('Error getting time in timezone:', error);
    return new Date();
  }
}

/**
 * Get yesterday's date in a specific timezone (YYYY-MM-DD format)
 */
function getYesterdayInTimezone(timezone: string): string {
  const currentTime = getCurrentTimeInTimezone(timezone);
  currentTime.setDate(currentTime.getDate() - 1);
  return currentTime.toISOString().split('T')[0];
}

/**
 * Check if it's currently midnight hour (00:00-00:59) in a timezone
 */
function isMidnightHour(timezone: string): boolean {
  const currentTime = getCurrentTimeInTimezone(timezone);
  const hour = currentTime.getHours();
  return hour === 0;
}

/**
 * Process daily reset for businesses in a specific timezone
 */
async function processTimezone(supabase: any, timezone: string, countryCode: string) {
  console.log(`[RESET] Processing timezone: ${timezone} (${countryCode})`);
  
  // Check if it's midnight hour in this timezone
  if (!isMidnightHour(timezone)) {
    console.log(`[RESET] Not midnight hour in ${timezone}, skipping`);
    return { processed: 0, skipped: true };
  }

  const yesterday = getYesterdayInTimezone(timezone);
  console.log(`[RESET] Yesterday's date in ${timezone}: ${yesterday}`);

  // Get all businesses in this country
  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('id, country')
    .eq('country', countryCode);

  if (businessError) {
    console.error(`[RESET] Error fetching businesses:`, businessError);
    return { processed: 0, error: businessError };
  }

  if (!businesses || businesses.length === 0) {
    console.log(`[RESET] No businesses found for ${countryCode}`);
    return { processed: 0 };
  }

  console.log(`[RESET] Found ${businesses.length} businesses in ${countryCode}`);

  let processed = 0;
  let errors = 0;

  for (const business of businesses) {
    try {
      // Check if we already processed this business for yesterday
      const { data: existing } = await supabase
        .from('daily_sales_history')
        .select('id')
        .eq('business_id', business.id)
        .eq('date', yesterday)
        .maybeSingle();

      if (existing) {
        console.log(`[RESET] Already processed business ${business.id} for ${yesterday}`);
        continue;
      }

      // Calculate yesterday's sales from transactions
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('business_id', business.id)
        .eq('transaction_date', yesterday);

      if (txError) {
        console.error(`[RESET] Error fetching transactions for ${business.id}:`, txError);
        errors++;
        continue;
      }

      const salesTotal = transactions?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0;

      // Get business's daily target
      const { data: targetData } = await supabase
        .from('targets')
        .select('daily_target')
        .eq('business_id', business.id)
        .maybeSingle();

      const dailyTarget = Number(targetData?.daily_target) || 0;
      const targetAchieved = salesTotal >= dailyTarget && dailyTarget > 0;

      // Insert history record
      const { error: insertError } = await supabase
        .from('daily_sales_history')
        .insert({
          business_id: business.id,
          date: yesterday,
          sales_total: salesTotal,
          daily_target: dailyTarget,
          target_achieved: targetAchieved
        });

      if (insertError) {
        console.error(`[RESET] Error inserting history for ${business.id}:`, insertError);
        errors++;
        continue;
      }

      console.log(`[RESET] ✅ Processed ${business.id}: ${salesTotal} / ${dailyTarget} (${targetAchieved ? 'Met' : 'Not Met'})`);
      processed++;

    } catch (error) {
      console.error(`[RESET] Error processing business ${business.id}:`, error);
      errors++;
    }
  }

  return { processed, errors, total: businesses.length };
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[RESET] Daily target reset cron job started');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const results: Record<string, any> = {};

    // Process each timezone
    for (const [countryCode, timezone] of Object.entries(COUNTRY_TIMEZONES)) {
      const result = await processTimezone(supabase, timezone, countryCode);
      results[countryCode] = result;
    }

    const totalProcessed = Object.values(results).reduce((sum: number, r: any) => sum + (r.processed || 0), 0);
    const totalErrors = Object.values(results).reduce((sum: number, r: any) => sum + (r.errors || 0), 0);

    console.log(`[RESET] Completed. Processed: ${totalProcessed}, Errors: ${totalErrors}`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        results,
        summary: {
          totalProcessed,
          totalErrors
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[RESET] Fatal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
