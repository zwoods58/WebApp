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
      'x-api-key': KYSHI_SECRET_KEY,
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

    console.log(`Cancelling subscription: ${subscriptionId}`);

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

    if (subscription.status === 'cancelled') {
      console.log('Subscription already cancelled');
      return NextResponse.json({
        success: false,
        message: 'Subscription is already cancelled',
        subscription
      }, { status: 409 });
    }

    // Cancel subscription in Kyshi
    console.log(`Cancelling Kyshi subscription: ${subscription.kyshi_subscription_id}`);
    const kyshiCancelData = {
      action: 'cancel'
    };

    const kyshiResponse = await callKyshiAPI(
      `/subscriptions/${subscription.kyshi_subscription_id}`,
      'PATCH',
      kyshiCancelData
    );

    console.log('Kyshi cancellation response:', kyshiResponse);

    // Update subscription in database
    const { data: updatedSubscription, error: updateError } = await supabase
      .from('kyshi_subscriptions')
      .update({
        status: 'cancelled',
        cancellation_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)
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
      .single();

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json({
        success: false,
        message: 'Database error updating subscription'
      }, { status: 500 });
    }

    console.log(`Successfully cancelled subscription: ${subscriptionId}`);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: updatedSubscription
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to cancel subscription',
      error: error
    }, { status: 500 });
  }
}
