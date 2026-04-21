/**
 * Test script to verify credit_items RLS policies are working correctly
 * This tests both success and failure scenarios
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCreditItemsRLS() {
  console.log('=== Testing Credit Items RLS Policies ===\n');

  // Test 1: Try to access credit_items without authentication
  console.log('Test 1: Access without authentication');
  try {
    const { data, error } = await supabase
      .from('credit_items')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Expected error (no auth):', error.message);
    } else {
      console.log('Unexpected success - should have failed without auth');
    }
  } catch (err) {
    console.log('Caught error:', err.message);
  }

  // Test 2: Try to insert credit_item without authentication
  console.log('\nTest 2: Insert without authentication');
  try {
    const testItem = {
      business_id: '00000000-0000-0000-0000-000000000000',
      credit_id: '00000000-0000-0000-0000-000000000000',
      industry: 'retail',
      description: 'Test item',
      amount: 100,
      currency: 'KES',
      due_date: '2024-12-31',
      date_given: '2024-01-01'
    };

    const { data, error } = await supabase
      .from('credit_items')
      .insert(testItem)
      .select();

    if (error) {
      console.log('Expected error (no auth):', error.message);
      if (error.code === '42501') {
        console.log('Correct RLS policy violation (code 42501)');
      }
    } else {
      console.log('Unexpected success - should have failed without auth');
    }
  } catch (err) {
    console.log('Caught error:', err.message);
  }

  console.log('\n=== RLS Policy Tests Complete ===');
  console.log('Note: To test authenticated access, you need to:');
  console.log('1. Sign in to get a JWT token');
  console.log('2. Use that token in the Authorization header');
  console.log('3. Verify you can only access your own business credit_items');
}

testCreditItemsRLS().catch(console.error);
