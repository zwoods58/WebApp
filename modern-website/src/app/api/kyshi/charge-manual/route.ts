import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_API_URL = process.env.KYSHI_API_URL || 'https://api.kyshi.co/v1';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId } = body;

    // Validate required fields
    if (!subscriptionId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required field: subscriptionId'
      }, { status: 400 });
    }

    console.log(`Manual charge for subscription: ${subscriptionId}`);

    // Get subscription from database
    const { data: subscription, error: subError } = await supabase
      .from('kyshi_subscriptions')
      .select(`
        *,
        kyshi_customers!kyshi_subscriptions_customer_id_fkey (
          email,
          first_name,
          last_name
        ),
        kyshi_plans!kyshi_subscriptions_plan_id_fkey (
          name,
          amount,
          currency
        )
      `)
      .eq('id', subscriptionId)
      .single();

    if (subError || !subscription) {
      console.error('Subscription not found:', subError);
      return NextResponse.json({
        success: false,
        message: 'Subscription not found'
      }, { status: 404 });
    }

    if (subscription.status !== 'active') {
      console.log(`Cannot charge subscription with status: ${subscription.status}`);
      return NextResponse.json({
        success: false,
        message: 'Only active subscriptions can be charged',
        subscription
      }, { status: 400 });
    }

    // Check if there's already a pending transaction for this subscription
    const { data: pendingTransaction, error: pendingError } = await supabase
      .from('kyshi_transactions')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .eq('status', 'pending')
      .single();

    if (pendingError && pendingError.code !== 'PGRST116') {
      console.error('Error checking pending transaction:', pendingError);
    }

    if (pendingTransaction) {
      console.log('There is already a pending transaction for this subscription');
      return NextResponse.json({
        success: false,
        message: 'There is already a pending transaction for this subscription',
        pendingTransaction
      }, { status: 409 });
    }

    // Create a pending transaction record first
    const reference = `manual_${Date.now()}_${subscriptionId}`;
    const { data: transaction, error: transactionError } = await supabase
      .from('kyshi_transactions')
      .insert({
        subscription_id: subscriptionId,
        kyshi_reference: reference,
        amount: subscription.kyshi_plans.amount,
        currency: subscription.kyshi_plans.currency,
        customer_email: subscription.kyshi_customers.email,
        status: 'pending',
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return NextResponse.json({
        success: false,
        message: 'Database error creating transaction'
      }, { status: 500 });
    }

    console.log(`Created pending transaction: ${transaction.id}`);

    // Call Kyshi charge endpoint
    console.log(`Charging Kyshi subscription: ${subscription.kyshi_subscription_id}`);
    
    const chargeData = {
      subscriptionId: subscription.kyshi_subscription_id,
      amount: subscription.kyshi_plans.amount,
      reference: reference
    };

    // This endpoint may need to be adjusted based on Kyshi's actual charge API
    const kyshiChargeResponse = await callKyshiAPI('/subscriptions/charge', 'POST', chargeData);
    
    console.log('Kyshi charge response:', kyshiChargeResponse);

    // Update transaction status based on Kyshi response
    let transactionStatus = 'success';
    let errorMessage = null;

    if (kyshiChargeResponse.success === false || kyshiChargeResponse.status === 'failed') {
      transactionStatus = 'failed';
      errorMessage = kyshiChargeResponse.message || 'Charge failed';
      
      // Update subscription status to past_due if charge failed
      const { error: subUpdateError } = await supabase
        .from('kyshi_subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      if (subUpdateError) {
        console.error('Error updating subscription to past_due:', subUpdateError);
      }
    }

    // Update transaction record
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('kyshi_transactions')
      .update({
        status: transactionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return NextResponse.json({
        success: false,
        message: 'Database error updating transaction'
      }, { status: 500 });
    }

    console.log(`Manual charge completed: ${transactionStatus}`);

    return NextResponse.json({
      success: true,
      message: `Charge ${transactionStatus === 'success' ? 'completed' : 'failed'} successfully`,
      transaction: updatedTransaction,
      subscription,
      kyshiChargeResponse,
      errorMessage
    });

  } catch (error) {
    console.error('Manual charge error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process manual charge',
      error: error
    }, { status: 500 });
  }
}
