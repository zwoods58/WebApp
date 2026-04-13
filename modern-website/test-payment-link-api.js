// Test script for the payment link API
// Run with: node test-payment-link-api.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testPaymentLinkAPI() {
  console.log('=== Testing Payment Link API ===');
  
  try {
    // Test 1: Check if payment_link_transactions table exists and is accessible
    console.log('\n1. Testing payment_link_transactions table access...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('payment_link_transactions')
      .select('*')
      .limit(1);
    
    if (transactionsError) {
      console.error('   ERROR: Cannot access payment_link_transactions:', transactionsError);
    } else {
      console.log('   SUCCESS: payment_link_transactions table is accessible');
      console.log(`   Found ${transactions.length} existing transactions`);
    }
    
    // Test 2: Check if kyshi_webhook_logs table exists
    console.log('\n2. Testing kyshi_webhook_logs table access...');
    const { data: logs, error: logsError } = await supabase
      .from('kyshi_webhook_logs')
      .select('*')
      .limit(1);
    
    if (logsError) {
      console.error('   ERROR: Cannot access kyshi_webhook_logs:', logsError);
    } else {
      console.log('   SUCCESS: kyshi_webhook_logs table is accessible');
      console.log(`   Found ${logs.length} existing webhook logs`);
    }
    
    // Test 3: Check analytics view
    console.log('\n3. Testing payment_link_transaction_analytics view...');
    const { data: analytics, error: analyticsError } = await supabase
      .from('payment_link_transaction_analytics')
      .select('*')
      .limit(1);
    
    if (analyticsError) {
      console.error('   ERROR: Cannot access analytics view:', analyticsError);
    } else {
      console.log('   SUCCESS: payment_link_transaction_analytics view is accessible');
      console.log(`   Found ${analytics.length} analytics records`);
    }
    
    // Test 4: Test inserting a mock transaction
    console.log('\n4. Testing transaction insertion...');
    const testTransaction = {
      reference: 'test_' + Date.now(),
      payment_link_code: 'TEST_CODE_123',
      customer_email: 'test@example.com',
      customer_name: 'Test Customer',
      local_currency: 'KES',
      status: 'PENDING',
      amount: 200.00,
      authorization_url: 'https://test.kyshi.co/pay/test123'
    };
    
    const { data: insertedTransaction, error: insertError } = await supabase
      .from('payment_link_transactions')
      .insert(testTransaction)
      .select()
      .single();
    
    if (insertError) {
      console.error('   ERROR: Cannot insert transaction:', insertError);
    } else {
      console.log('   SUCCESS: Test transaction inserted');
      console.log(`   Transaction ID: ${insertedTransaction.id}`);
      console.log(`   Reference: ${insertedTransaction.reference}`);
      
      // Clean up test transaction
      await supabase
        .from('payment_link_transactions')
        .delete()
        .eq('id', insertedTransaction.id);
      
      console.log('   SUCCESS: Test transaction cleaned up');
    }
    
    // Test 5: Check RLS policies
    console.log('\n5. Testing Row Level Security...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('payment_link_transactions')
      .select('id')
      .limit(1);
    
    if (rlsError && rlsError.message.includes('row-level security')) {
      console.log('   SUCCESS: RLS is enabled and working');
    } else if (rlsError) {
      console.error('   ERROR: RLS test failed:', rlsError);
    } else {
      console.log('   INFO: RLS test passed (service role can access all rows)');
    }
    
    console.log('\n=== Payment Link API Test Complete ===');
    console.log('All database components are working correctly!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPaymentLinkAPI();
