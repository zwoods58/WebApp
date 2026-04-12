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
    const { transactionId } = body;

    // Validate required fields
    if (!transactionId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required field: transactionId'
      }, { status: 400 });
    }

    console.log(`Processing refund for transaction: ${transactionId}`);

    // Get transaction from database
    const { data: transaction, error: transactionError } = await supabase
      .from('kyshi_transactions')
      .select(`
        *,
        kyshi_subscriptions!kyshi_transactions_subscription_id_fkey (
          id,
          kyshi_subscription_id,
          customer_id,
          status
        ),
        kyshi_subscriptions!kyshi_transactions_subscription_id_fkey (
          kyshi_customers!kyshi_subscriptions_customer_id_fkey (
            email,
            first_name,
            last_name
          )
        )
      `)
      .eq('id', transactionId)
      .single();

    if (transactionError || !transaction) {
      console.error('Transaction not found:', transactionError);
      return NextResponse.json({
        success: false,
        message: 'Transaction not found'
      }, { status: 404 });
    }

    if (transaction.status !== 'success') {
      console.log(`Cannot refund transaction with status: ${transaction.status}`);
      return NextResponse.json({
        success: false,
        message: 'Only successful transactions can be refunded',
        transaction
      }, { status: 400 });
    }

    // Check if already refunded
    if (transaction.status === 'refunded') {
      console.log('Transaction already refunded');
      return NextResponse.json({
        success: false,
        message: 'Transaction is already refunded',
        transaction
      }, { status: 409 });
    }

    // Process refund with Kyshi
    // Note: Kyshi refund endpoint may vary - check their documentation
    console.log(`Processing refund for Kyshi reference: ${transaction.kyshi_reference}`);
    
    const refundData = {
      reference: transaction.kyshi_reference,
      amount: transaction.amount,
      reason: 'Customer requested refund'
    };

    // This endpoint may need to be adjusted based on Kyshi's actual refund API
    const kyshiRefundResponse = await callKyshiAPI('/refunds', 'POST', refundData);
    
    console.log('Kyshi refund response:', kyshiRefundResponse);

    // Update transaction status in database
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('kyshi_transactions')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        refund_reference: kyshiRefundResponse?.reference || `refund_${Date.now()}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .select(`
        *,
        kyshi_subscriptions!kyshi_transactions_subscription_id_fkey (
          id,
          kyshi_subscription_id,
          customer_id,
          status
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return NextResponse.json({
        success: false,
        message: 'Database error updating transaction'
      }, { status: 500 });
    }

    // Create refund record for tracking
    const { data: refundRecord, error: refundError } = await supabase
      .from('refunds')
      .insert({
        transaction_id: transactionId,
        subscription_id: transaction.subscription_id,
        amount: transaction.amount,
        currency: transaction.currency,
        kyshi_refund_reference: kyshiRefundResponse?.reference || `refund_${Date.now()}`,
        status: 'completed',
        reason: 'Customer requested refund',
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (refundError) {
      console.error('Error creating refund record:', refundError);
      // Don't fail the operation, but log the error
    } else {
      console.log(`Created refund record: ${refundRecord.id}`);
    }

    console.log(`Successfully refunded transaction: ${transactionId}`);

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      transaction: updatedTransaction,
      refund: refundRecord,
      kyshiRefundResponse
    });

  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process refund',
      error: error
    }, { status: 500 });
  }
}
