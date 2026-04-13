import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    console.log('=== PAYMENT STATUS CHECK START ===');
    
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    
    if (!reference) {
      console.error('Missing reference parameter');
      return NextResponse.json({ 
        error: 'Reference required',
        status: 'error'
      }, { status: 400 });
    }
    
    console.log(`Checking payment status for reference: ${reference}`);
    
    // Check local database first (webhook may have already updated)
    const { data: transaction, error } = await supabaseAdmin
      .from('payment_link_transactions')
      .select('*')
      .eq('reference', reference)
      .single();
    
    if (error) {
      console.error('Database error checking transaction:', error);
      
      // If transaction not found, check if it exists in the kyshi_transactions table
      const { data: kyshiTransaction, error: kyshiError } = await supabaseAdmin
        .from('kyshi_transactions')
        .select('*')
        .eq('kyshi_reference', reference)
        .single();
      
      if (!kyshiError && kyshiTransaction) {
        console.log('Found transaction in kyshi_transactions table');
        return NextResponse.json({
          status: kyshiTransaction.status === 'success' ? 'success' : 'pending',
          paid: kyshiTransaction.status === 'success',
          amount: kyshiTransaction.amount,
          currency: kyshiTransaction.currency,
          reference: reference,
          source: 'kyshi_transactions'
        });
      }
      
      return NextResponse.json({
        status: 'not_found',
        paid: false,
        reference,
        error: 'Transaction not found'
      });
    }
    
    console.log(`Transaction found with status: ${transaction.status}`);
    
    if (transaction.status === 'SUCCESSFUL') {
      return NextResponse.json({
        status: 'success',
        paid: true,
        amount: transaction.amount,
        localAmount: transaction.local_amount,
        currency: transaction.local_currency,
        reference: transaction.reference,
        paidAt: transaction.paid_at,
        customerName: transaction.customer_name,
        source: 'transactions'
      });
    }
    
    // Optionally call Kyshi API to check status if webhook hasn't updated yet
    // This would require implementing Kyshi's status check endpoint
    try {
      console.log('Checking Kyshi API for latest status...');
      const kyshiResponse = await fetch(`https://api.kyshi.co/v1/payments/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (kyshiResponse.ok) {
        const kyshiData = await kyshiResponse.json();
        console.log('Kyshi API response:', kyshiData);
        
        // Update local database with latest status
        if (kyshiData.status && kyshiData.status !== transaction.status) {
          await supabaseAdmin
            .from('transactions')
            .update({
              status: kyshiData.status === 'successful' ? 'SUCCESSFUL' : kyshiData.status.toUpperCase(),
              updated_at: new Date().toISOString()
            })
            .eq('reference', reference);
        }
        
        return NextResponse.json({
          status: kyshiData.status === 'successful' ? 'success' : kyshiData.status,
          paid: kyshiData.status === 'successful',
          amount: kyshiData.amount || transaction.amount,
          currency: kyshiData.currency || transaction.local_currency,
          reference,
          source: 'kyshi_api'
        });
      }
    } catch (apiError) {
      console.log('Kyshi API check failed, using local database status:', apiError);
    }
    
    // Return current status from database
    return NextResponse.json({
      status: transaction.status.toLowerCase(),
      paid: false,
      amount: transaction.amount,
      currency: transaction.local_currency,
      reference,
      createdAt: transaction.created_at,
      source: 'transactions'
    });
    
  } catch (error) {
    console.error('=== PAYMENT STATUS CHECK ERROR ===', error);
    return NextResponse.json({
      status: 'error',
      paid: false,
      error: 'Status check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST method for manual status updates (testing/admin)
export async function POST(request: Request) {
  try {
    const { reference, status, amount } = await request.json();
    
    if (!reference || !status) {
      return NextResponse.json({ 
        error: 'Reference and status required' 
      }, { status: 400 });
    }
    
    // Update transaction status
    const { data: transaction, error } = await supabaseAdmin
      .from('transactions')
      .update({
        status: status.toUpperCase(),
        amount: amount || undefined,
        updated_at: new Date().toISOString(),
        ...(status.toUpperCase() === 'SUCCESSFUL' && {
          paid_at: new Date().toISOString()
        })
      })
      .eq('reference', reference)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating transaction status:', error);
      return NextResponse.json({ 
        error: 'Database error',
        details: error.message 
      }, { status: 500 });
    }
    
    console.log(`Transaction ${reference} updated to status: ${status}`);
    
    return NextResponse.json({
      success: true,
      transaction,
      message: `Transaction status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Manual status update error:', error);
    return NextResponse.json({
      error: 'Update failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
