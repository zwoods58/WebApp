import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { data: transaction, error } = await supabase
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
      console.error('❌ Database error finding transaction:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Database error: ' + error.message,
        error: error 
      }, { status: 500 });
    }
    
    if (!transaction) {
      console.error('❌ Transaction not found for reference:', reference);
      return NextResponse.json({ 
        success: false, 
        message: `Transaction with reference ${reference} not found` 
      }, { status: 404 });
    }
    
    console.log('📋 Transaction found:', {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      subscription_id: transaction.subscription_id
    });
    
    // Check if payment was successful
    const isSuccess = transaction.status === 'success';
    const isPending = transaction.status === 'pending';
    const isFailed = transaction.status === 'failed';
    
    console.log('🎯 Payment status analysis:', { 
      isSuccess, 
      isPending, 
      isFailed, 
      currentStatus: transaction.status 
    });
    
    if (isSuccess) {
      console.log('✅ Payment verification successful - updating subscription status');
      
      // Update subscription status to active if needed
      if (transaction.kyshi_subscriptions) {
        const subscriptionId = transaction.kyshi_subscriptions.id;
        const currentStatus = transaction.kyshi_subscriptions.status;
        
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
        transaction,
        requiresRetry: true
      });
    } else if (isFailed) {
      console.log('❌ Payment failed');
      return NextResponse.json({
        success: false,
        message: 'Payment failed. Please try again or contact support.',
        transaction
      });
    }
    
    const response = {
      success: isSuccess,
      transaction,
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
