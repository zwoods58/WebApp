import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Creating businesses view...');
    
    // Create the businesses view using raw SQL
    const createViewSQL = `
      CREATE OR REPLACE VIEW businesses AS
      SELECT 
        id, 
        business_name, 
        country_code as country, 
        industry, 
        created_at,
        updated_at,
        phone_number,
        email,
        first_name,
        last_name
      FROM business_users;
    `;
    
    // Use the postgres client to execute raw SQL
    const { data, error } = await supabaseAdmin
      .rpc('postgres', { query: createViewSQL });
    
    if (error) {
      console.error('Failed to create businesses view:', error);
      return NextResponse.json({ 
        error: `Failed to create businesses view: ${error.message}` 
      }, { status: 500 });
    }
    
    console.log('✅ Businesses view created successfully');
    
    // Test that the view works
    const { data: testData, error: testError } = await supabaseAdmin
      .from('businesses')
      .select('id, business_name')
      .limit(1);
    
    if (testError) {
      console.error('View test failed:', testError);
      return NextResponse.json({ 
        error: `View test failed: ${testError.message}` 
      }, { status: 500 });
    }
    
    console.log('✅ View test passed:', testData);
    
    // Now test a transaction insert
    const { data: transactionData, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        type: 'money_in',
        industry: 'retail',
        amount: 100,
        currency: 'KES',
        transaction_date: '2026-04-21',
        description: 'Test after view creation',
        business_id: '83243bd1-2004-4086-a698-7cf59a26c691'
      })
      .select('id')
      .single();
    
    if (transactionError) {
      console.error('Transaction test failed:', transactionError);
      return NextResponse.json({ 
        error: `Transaction test failed: ${transactionError.message}` 
      }, { status: 500 });
    }
    
    console.log('🎉 SUCCESS! Transaction created:', transactionData);
    
    return NextResponse.json({
      message: 'Businesses view created and transaction test passed',
      viewData: testData,
      transactionData: transactionData
    });
    
  } catch (error: any) {
    console.error('Exception:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
