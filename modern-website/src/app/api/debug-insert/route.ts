import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Debug Insert - Starting test');
    
    // Test 1: Simple business query (this works)
    console.log('Test 1: Business query');
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .limit(1);
    
    console.log('Business query result:', { success: !businessError, count: business?.length, error: businessError?.message });
    
    // Test 2: Simple transaction select (this works)
    console.log('Test 2: Transaction select');
    const { data: transactions, error: selectError } = await supabaseAdmin
      .from('business_transactions')
      .select('id')
      .limit(1);
    
    console.log('Transaction select result:', { success: !selectError, count: transactions?.length, error: selectError?.message });
    
    // Test 3: Transaction insert without foreign key (this should work)
    console.log('Test 3: Transaction insert without FK');
    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from('business_transactions')
      .insert({
        type: 'money_in',
        industry: 'retail',
        amount: 100,
        currency: 'KES',
        transaction_date: '2026-04-21',
        description: 'Debug test'
      })
      .select('id')
      .single();
    
    console.log('Transaction insert result:', { success: !insertError, id: insertResult?.id, error: insertError?.message, code: insertError?.code });
    
    if (insertError) {
      return NextResponse.json({ 
        success: false, 
        error: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Debug insert completed',
      transactionId: insertResult?.id
    });
    
  } catch (error: any) {
    console.error('Debug insert exception:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      type: 'exception'
    }, { status: 500 });
  }
}
