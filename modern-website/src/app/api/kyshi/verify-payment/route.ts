import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { kyshiApi } from '@/lib/kyshi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();
    
    if (!reference) {
      console.error('Verification failed: Missing reference parameter');
      return NextResponse.json({ success: false, message: 'Missing reference' }, { status: 400 });
    }
    
    console.log('🔍 Starting payment verification for reference:', reference);
    
    // Find transaction by reference in kyishi_transactions table
    const { data: transactionData, error } = await supabase
      .from('kyshi_transactions')
      .select(`
        *,
        kyshi_subscriptions(
          id,
          status,
          customer_id,
          plan_id,
          kyshi_subscription_id
        )
      `)
      .eq('kyshi_reference', reference)
      .single();
    
    if (error) {
      // PGRST116 means no rows found, which is expected for new transactions
      if (error.code === 'PGRST116') {
        console.log('Transaction not found in database, checking Kyshi API directly...');
        // transactionData is null, continue to Kyshi API fallback
      } else {
        console.error('Database error finding transaction:', error);
        return NextResponse.json({ 
          success: false, 
          message: 'Database error: ' + error.message,
          error: error 
        }, { status: 500 });
      }
    }
    
    if (!transactionData) {
      console.log('Transaction not found in database, checking Kyshi API directly...');
      
      // Fallback: Check transaction status directly with Kyshi API
      try {
        const kyshiStatus = await kyshiApi().getTransactionStatus(reference);
        console.log('Kyshi API response:', kyshiStatus);
        
        if (kyshiStatus.paid) {
          console.log('Payment verified via Kyshi API, creating transaction record...');
          
          // Create transaction record in database
          const { data: newTransaction, error: insertError } = await supabase
            .from('kyshi_transactions')
            .insert({
              kyshi_reference: reference,
              amount: kyshiStatus.data?.amount || 0,
              currency: kyshiStatus.data?.currency || 'USD',
              customer_email: kyshiStatus.data?.customer?.email || '',
              status: 'success',
              authorization_code: kyshiStatus.data?.authorizationCode || null,
              gateway_response: kyshiStatus.data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (insertError) {
            console.error('Error creating transaction from Kyshi API:', insertError);
            return NextResponse.json({
              success: false,
              message: 'Payment verified but failed to create transaction record',
              kyshiStatus,
              error: insertError
            }, { status: 500 });
          }
          
          console.log('Transaction created from Kyshi API verification:', newTransaction.id);
          
          return NextResponse.json({
            success: true,
            transaction: newTransaction,
            message: 'Payment verified via Kyshi API',
            source: 'kyshi_api'
          });
        } else {
          console.log('Payment not successful according to Kyshi API');
          return NextResponse.json({
            success: false,
            message: 'Payment not completed',
            kyshiStatus,
            requiresRetry: true
          });
        }
        
      } catch (apiError) {
        console.error('Kyshi API verification failed:', apiError);
        return NextResponse.json({
          success: false,
          message: `Transaction with reference ${reference} not found and Kyshi API verification failed`,
          error: apiError
        }, { status: 404 });
      }
    }
    
    console.log('📋 Transaction found:', {
      id: transactionData.id,
      status: transactionData.status,
      amount: transactionData.amount,
      currency: transactionData.currency,
      subscription_id: transactionData.subscription_id
    });
    
    // Check if payment was successful
    const isSuccess = transactionData.status === 'success';
    const isPending = transactionData.status === 'pending';
    const isFailed = transactionData.status === 'failed';
    
    console.log('🎯 Payment status analysis:', { 
      isSuccess, 
      isPending, 
      isFailed, 
      currentStatus: transactionData.status 
    });
    
    if (isSuccess) {
      console.log('✅ Payment verification successful - updating subscription status');
      
      // Update subscription status to active if needed
      if (transactionData.kyshi_subscriptions) {
        const subscriptionId = transactionData.kyshi_subscriptions.id;
        const currentStatus = transactionData.kyshi_subscriptions.status;
        
        console.log('🔄 Updating subscription:', {
          subscriptionId,
          currentStatus,
          newStatus: 'active'
        });
        
        const { error: updateError } = await supabase
          .from('kyshi_subscriptions')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);
          
        if (updateError) {
          console.error('❌ Failed to update subscription status:', updateError);
          return NextResponse.json({ 
            success: false, 
            message: 'Payment verified but failed to update subscription status',
            error: updateError 
          }, { status: 500 });
        }
        
        console.log('✅ Subscription status updated to active successfully');
      } else {
        console.warn('⚠️ Transaction found but no associated subscription');
      }
    } else if (isPending) {
      console.log('⏳ Payment still pending - asking user to wait');
      return NextResponse.json({
        success: false,
        message: 'Payment is still being processed. Please wait a few moments and try again.',
        transaction: transactionData,
        requiresRetry: true
      });
    } else if (isFailed) {
      console.log('❌ Payment failed');
      return NextResponse.json({
        success: false,
        message: 'Payment failed. Please try again or contact support.',
        transaction: transactionData
      });
    }
    
    const response = {
      success: isSuccess,
      transaction: transactionData,
      message: isSuccess ? 'Payment verified successfully' : 'Payment not completed'
    };
    
    console.log('📤 Returning verification response:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('💥 Unexpected verification error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unexpected verification error',
      error: error 
    }, { status: 500 });
  }
}
