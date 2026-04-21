import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    console.log('🔧 Debug Schema - Checking table definitions');
    
    // Check businesses table structure
    const { data: businessesStruct, error: businessesError } = await supabaseAdmin
      .rpc('get_table_definition', { table_name: 'businesses' });
    
    console.log('Businesses structure:', businessesStruct, businessesError?.message);
    
    // Check transactions table structure  
    const { data: transactionsStruct, error: transactionsError } = await supabaseAdmin
      .rpc('get_table_definition', { table_name: 'transactions' });
    
    console.log('Transactions structure:', transactionsStruct, transactionsError?.message);
    
    // Check foreign key constraints
    const { data: constraints, error: constraintsError } = await supabaseAdmin
      .rpc('get_foreign_keys', { table_name: 'transactions' });
    
    console.log('Transaction constraints:', constraints, constraintsError?.message);
    
    // Simple test: What happens if we bypass the business_id?
    console.log('Testing insert without business_id...');
    const { data: testInsert, error: testError } = await supabaseAdmin
      .from('transactions')
      .insert({
        type: 'money_in',
        industry: 'retail',
        amount: 100,
        currency: 'KES',
        transaction_date: '2026-04-21',
        description: 'Test without FK'
      })
      .select('id')
      .single();
    
    console.log('Test insert result:', { id: testInsert?.id, error: testError?.message, code: testError?.code });
    
    return NextResponse.json({
      businesses: businessesStruct,
      transactions: transactionsStruct,
      constraints: constraints,
      testInsert: { id: testInsert?.id, error: testError?.message }
    });
    
  } catch (error: any) {
    console.error('Debug schema exception:', error);
    return NextResponse.json({ 
      error: error.message,
      type: 'exception'
    }, { status: 500 });
  }
}
