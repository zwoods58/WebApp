import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    console.log('🔧 Debug Triggers - Checking for triggers and constraints');
    
    // Check triggers on transactions table
    const { data: triggers, error: triggersError } = await supabaseAdmin
      .from('information_schema.triggers')
      .select('trigger_name, event_manipulation_table, action_condition')
      .eq('event_object_table', 'transactions');
    
    console.log('Triggers on transactions:', triggers, triggersError?.message);
    
    // Check check constraints on transactions table
    const { data: constraints, error: constraintsError } = await supabaseAdmin
      .from('information_schema.check_constraints')
      .select('constraint_name, check_clause')
      .eq('constraint_table', 'transactions');
    
    console.log('Check constraints on transactions:', constraints, constraintsError?.message);
    
    // Try to disable RLS temporarily and test
    console.log('Testing with RLS disabled...');
    
    // Disable RLS on transactions
    await supabaseAdmin.rpc('exec_sql', { 
      sql: 'ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;' 
    });
    
    // Test insert
    const { data: testData, error: testError } = await supabaseAdmin
      .from('transactions')
      .insert({
        type: 'money_in',
        industry: 'retail',
        amount: 100,
        currency: 'KES',
        transaction_date: '2026-04-21',
        description: 'RLS disabled test'
      })
      .select('id')
      .single();
    
    console.log('RLS disabled test:', { id: testData?.id, error: testError?.message });
    
    // Re-enable RLS
    await supabaseAdmin.rpc('exec_sql', { 
      sql: 'ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;' 
    });
    
    return NextResponse.json({
      triggers,
      constraints,
      rlsTest: { id: testData?.id, error: testError?.message }
    });
    
  } catch (error: any) {
    console.error('Debug triggers exception:', error);
    return NextResponse.json({ 
      error: error.message,
      type: 'exception'
    }, { status: 500 });
  }
}
