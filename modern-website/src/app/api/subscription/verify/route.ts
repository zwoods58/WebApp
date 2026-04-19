import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import kyshiAPI from '@/lib/kyshi'; // Assuming this gives us access to Kyshi API or we can fetch directly

export async function POST(request: Request) {
  try {
    const { reference, user_email, country } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing required field: reference' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    console.log(`Verifying Kyshi transaction via server: ${reference}`);
    
    // Call Kyshi API directly using the secret key
    // We fetch directly so we control the env vars on the server side
    const kyshiSecretKey = process.env.KYSHI_SECRET_KEY || 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    const kyshiApiUrl = process.env.KYSHI_API_URL || 'https://api.kyshi.co';
    
    const response = await fetch(`${kyshiApiUrl}/v1/transactions/${reference}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${kyshiSecretKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Kyshi verification failed with status: ${response.status}`);
      // Fallback: If verification request failed but we don't know the status, we shouldn't approve it
      // but maybe it's a network error.
      return NextResponse.json({ success: false, error: 'Verification request failed' });
    }
    
    const kyshiData = await response.json();
    console.log('Kyshi transaction verification result:', kyshiData);
    
    const isSuccess = kyshiData?.status === true && kyshiData?.data?.status === 'successful';
    const isPending = kyshiData?.data?.status === 'pending';
    const isCancelledOrFailed = kyshiData?.data?.status === 'failed' || kyshiData?.data?.status === 'cancelled' || kyshiData?.data?.status === 'abandoned';
    
    // Find the subscription to update
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', user_email || '') // Updated from user_email to email
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!subscription) {
       // fallback search by last reference if needed
    } else {
      if (isSuccess) {
        // Only update if it really is successful
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            is_active: true,
            retry_index: 0, // Reset retry index on success
            last_charge_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);
          
        // Additionally log the transaction
        await supabase
          .from('transactions')
          .insert({
            kyshi_transaction_id: kyshiData.data.id || reference,
            kyshi_reference: reference,
            subscription_id: subscription.id,
            amount: kyshiData.data.amount,
            currency: kyshiData.data.currency,
            status: 'success',
            payment_method: 'kyshi_checkout',
            processed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
      } else if (isCancelledOrFailed) {
         // Mark as cancelled/failed
         await supabase
          .from('subscriptions')
          .update({
            status: 'failed', // Consistent with billing engine
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);
          
         await supabase
          .from('transactions')
          .insert({
            kyshi_transaction_id: kyshiData.data?.id || reference,
            kyshi_reference: reference,
            subscription_id: subscription.id,
            amount: kyshiData.data?.amount || 0,
            currency: kyshiData.data?.currency || '',
            status: 'failed',
            payment_method: 'kyshi_checkout',
            processed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
      }
    }

    return NextResponse.json({
      success: isSuccess,
      kyshiStatus: kyshiData?.data?.status,
      subscriptionId: subscription?.id,
      data: kyshiData.data
    });

  } catch (error) {
    console.error('Error verifying transaction:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to verify transaction',
        success: false 
      },
      { status: 500 }
    );
  }
}
