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
      return NextResponse.json({ success: false, message: 'Missing reference' }, { status: 400 });
    }
    
    console.log('Verifying payment with reference:', reference);
    
    // Find transaction by reference in kyishi_transactions table
    const { data: transaction, error } = await supabase
      .from('kyshi_transactions')
      .select('*, kyshi_subscriptions(*)')
      .eq('kyshi_reference', reference)
      .single();
    
    if (error || !transaction) {
      console.log('Transaction not found:', error);
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }
    
    // Check if payment was successful
    const isSuccess = transaction.status === 'success';
    
    if (isSuccess) {
      console.log('Payment verification successful:', transaction);
      
      // Update subscription status to active if needed
      if (transaction.kyshi_subscriptions) {
        await supabase
          .from('kyshi_subscriptions')
          .update({ status: 'active' })
          .eq('id', transaction.kyshi_subscriptions.id);
      }
    }
    
    return NextResponse.json({
      success: isSuccess,
      transaction,
      message: isSuccess ? 'Payment verified' : 'Payment not completed'
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
