import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_API_URL = process.env.KYSHI_API_URL || 'https://api.kyshi.co/v1';
const CRON_SECRET = process.env.CRON_SECRET || 'your_cron_secret';

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper function to make Kyshi API calls
async function callKyshiAPI(endpoint: string, method: string = 'POST', data?: any) {
  const response = await fetch(`${KYSHI_API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${KYSHI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kyshi API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Helper function to log cron job execution
async function logCronExecution(action: string, subscriptionId: string, success: boolean, details?: any) {
  try {
    await supabase
      .from('kyshi_webhook_logs')
      .insert({
        event_type: `cron_${action}`,
        reference: subscriptionId,
        payload: details,
        processed: success,
        error_message: success ? null : details?.error,
      });
  } catch (error) {
    console.error('Error logging cron execution:', error);
  }
}

export async function GET(request: NextRequest) {
  return handleCronRequest(request);
}

export async function POST(request: NextRequest) {
  return handleCronRequest(request);
}

async function handleCronRequest(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    if (!providedSecret || providedSecret !== CRON_SECRET) {
      console.error('Unauthorized cron job attempt');
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('Starting scheduled charge job for due subscriptions');

    // Find subscriptions that are due for charging
    const today = new Date().toISOString().split('T')[0];
    
    const { data: dueSubscriptions, error: fetchError } = await supabase
      .from('kyshi_subscriptions')
      .select(`
        *,
        kyshi_customers!kyshi_subscriptions_customer_id_fkey (
          email,
          first_name,
          last_name,
          phone
        ),
        kyshi_plans!kyshi_subscriptions_plan_id_fkey (
          name,
          amount,
          currency,
          interval
        )
      `)
      .eq('status', 'active')
      .lte('current_period_end', today);

    if (fetchError) {
      console.error('Error fetching due subscriptions:', fetchError);
      return NextResponse.json({
        success: false,
        message: 'Database error fetching due subscriptions'
      }, { status: 500 });
    }

    if (!dueSubscriptions || dueSubscriptions.length === 0) {
      console.log('No subscriptions due for charging today');
      return NextResponse.json({
        success: true,
        message: 'No subscriptions due for charging',
        processed: 0,
        processingTime: Date.now() - startTime
      });
    }

    console.log(`Found ${dueSubscriptions.length} subscriptions due for charging`);

    const results = {
      total: dueSubscriptions.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      details: [] as any[]
    };

    // Process each due subscription
    for (const subscription of dueSubscriptions) {
      try {
        console.log(`Processing subscription ${subscription.id} for ${subscription.kyshi_customers.email}`);

        // Check if there's already a pending transaction for this subscription
        const { data: pendingTransaction, error: pendingError } = await supabase
          .from('kyshi_transactions')
          .select('*')
          .eq('subscription_id', subscription.id)
          .eq('status', 'pending')
          .single();

        if (pendingError && pendingError.code !== 'PGRST116') {
          console.error(`Error checking pending transaction for ${subscription.id}:`, pendingError);
          results.skipped++;
          results.details.push({
            subscriptionId: subscription.id,
            email: subscription.kyshi_customers.email,
            status: 'skipped',
            reason: 'Database error checking pending transactions'
          });
          continue;
        }

        if (pendingTransaction) {
          console.log(`Skipping ${subscription.id} - pending transaction exists: ${pendingTransaction.id}`);
          results.skipped++;
          results.details.push({
            subscriptionId: subscription.id,
            email: subscription.kyshi_customers.email,
            status: 'skipped',
            reason: 'Pending transaction already exists',
            pendingTransactionId: pendingTransaction.id
          });
          continue;
        }

        // Create a pending transaction record first
        const reference = `cron_${Date.now()}_${subscription.id}`;
        const { data: transaction, error: transactionError } = await supabase
          .from('kyshi_transactions')
          .insert({
            subscription_id: subscription.id,
            kyshi_reference: reference,
            amount: subscription.kyshi_plans.amount,
            currency: subscription.kyshi_plans.currency,
            customer_email: subscription.kyshi_customers.email,
            status: 'pending',
          })
          .select()
          .single();

        if (transactionError) {
          console.error(`Error creating transaction for ${subscription.id}:`, transactionError);
          results.failed++;
          results.details.push({
            subscriptionId: subscription.id,
            email: subscription.kyshi_customers.email,
            status: 'failed',
            reason: 'Failed to create transaction',
            error: transactionError.message
          });
          await logCronExecution('charge_failed', subscription.id, false, { error: transactionError.message });
          continue;
        }

        console.log(`Created pending transaction: ${transaction.id}`);

        // Call Kyshi charge endpoint
        const chargeData = {
          subscriptionId: subscription.kyshi_subscription_id,
          amount: subscription.kyshi_plans.amount,
          reference: reference
        };

        const kyshiChargeResponse = await callKyshiAPI('/subscriptions/charge', 'POST', chargeData);
        
        console.log(`Kyshi charge response for ${subscription.id}:`, kyshiChargeResponse);

        // The actual processing will be handled by the webhook when Kyshi sends the success/failure event
        // So we just log that the charge was initiated
        results.successful++;
        results.details.push({
          subscriptionId: subscription.id,
          email: subscription.kyshi_customers.email,
          status: 'initiated',
          transactionId: transaction.id,
          kyshiReference: reference,
          kyshiResponse: kyshiChargeResponse
        });

        await logCronExecution('charge_initiated', subscription.id, true, { 
          transactionId: transaction.id,
          kyshiReference: reference 
        });

      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        results.failed++;
        results.details.push({
          subscriptionId: subscription.id,
          email: subscription.kyshi_customers.email,
          status: 'failed',
          reason: 'Exception during processing',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        await logCronExecution('charge_failed', subscription.id, false, { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const processingTime = Date.now() - startTime;
    
    console.log(`Cron job completed: ${results.successful} successful, ${results.failed} failed, ${results.skipped} skipped in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      message: 'Cron job completed successfully',
      processingTime,
      ...results
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Cron job error:', error);
    
    await logCronExecution('cron_error', 'system', false, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime 
    });

    return NextResponse.json({
      success: false,
      message: 'Cron job failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime
    }, { status: 500 });
  }
}
