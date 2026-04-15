import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscriptionId' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get subscription details first
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Call Kyshi API to cancel subscription
    const KYSHI_API = 'https://api.kyshi.co';
    const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY;

    const kyshiResponse = await fetch(`${KYSHI_API}/v1/subscriptions`, {
      method: 'PATCH',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY!,
        'Content-Type': 'application/json'
      } as HeadersInit,
      body: JSON.stringify({
        subscriptionId: subscription.kyshi_subscription_id,
        action: 'cancel'
      })
    });

    const kyshiData = await kyshiResponse.json();

    if (!kyshiData.status) {
      return NextResponse.json(
        { error: kyshiData.message || 'Failed to cancel subscription with Kyshi' },
        { status: 400 }
      );
    }

    // Update local database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        is_active: false,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    if (updateError) {
      console.error('Error updating subscription in database:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
