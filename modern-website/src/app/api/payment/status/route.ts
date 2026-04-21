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
    const { data: transaction, error: dbError } = await supabaseAdmin
      .from('payment_link_transactions')
      .select('*')
      .eq('reference', reference)
      .single();
    
    if (dbError) {
      console.error('Database error checking transaction:', dbError);
      
      // Note: Kyshi functionality has been removed
      // Transaction lookup in main transactions table only
      const { data: transaction, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('reference', reference)
        .single();
      
      if (!error && transaction) {
        console.log('Found transaction in main transactions table');
        return NextResponse.json({
          status: transaction.status === 'success' ? 'success' : transaction.status,
          paid: transaction.status === 'success',
          amount: transaction.amount,
          currency: transaction.currency,
          reference: reference,
          source: 'transactions'
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
    
    // Note: Kyshi payment processing has been removed
    
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

