// Test Supabase Connection
// Check if Supabase is properly connected and accessible

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('=== Testing Supabase Connection ===\n');

// Test 1: Check Environment Variables
console.log('1. Checking Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('ERROR: NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set');
  process.exit(1);
}

console.log('Environment variables: OK\n');

// Test 2: Test Basic Connection
async function testSupabaseConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    // Create client with anon key (public access)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('2. Testing Basic Connection:');
    
    // Test simple query - check if we can connect
    const { data, error } = await supabase
      .from('businesses')
      .select('count')
      .limit(1);

    if (error) {
      console.log('Connection test failed:', error.message);
      return false;
    }

    console.log('Basic connection: OK');
    console.log('Businesses table accessible:', data ? 'YES' : 'NO');
    return true;
  } catch (error) {
    console.log('Connection test error:', error.message);
    return false;
  }
}

// Test 3: Test Admin Connection
async function testAdminConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );

    console.log('\n3. Testing Admin Connection:');
    
    // Test admin query - check if we can access all data
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Admin connection test failed:', error.message);
      return false;
    }

    console.log('Admin connection: OK');
    console.log('Can access businesses table:', data ? 'YES' : 'NO');
    return true;
  } catch (error) {
    console.log('Admin connection test error:', error.message);
    return false;
  }
}

// Test 4: Test Authentication Flow
async function testAuthFlow() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );

    console.log('\n4. Testing Authentication Flow:');
    
    // Test if we can find a business (simulating login lookup)
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('id, phone_number, email, business_name, country, industry')
      .limit(1);

    if (error) {
      console.log('Auth flow test failed:', error.message);
      return false;
    }

    console.log('Auth flow: OK');
    console.log('Business lookup works:', data ? 'YES' : 'NO');
    if (data && data.length > 0) {
      console.log('Sample business found:', {
        id: data[0].id,
        name: data[0].business_name,
        country: data[0].country
      });
    }
    return true;
  } catch (error) {
    console.log('Auth flow test error:', error.message);
    return false;
  }
}

// Test 5: Test Subscription Tables
async function testSubscriptionTables() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );

    console.log('\n5. Testing Subscription Tables:');
    
    // Test subscriptions table
    const { data: subData, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('count')
      .limit(1);

    if (subError) {
      console.log('Subscriptions table error:', subError.message);
    } else {
      console.log('Subscriptions table: OK');
    }

    // Test transactions table
    const { data: txnData, error: txnError } = await supabaseAdmin
      .from('transactions')
      .select('count')
      .limit(1);

    if (txnError) {
      console.log('Transactions table error:', txnError.message);
    } else {
      console.log('Transactions table: OK');
    }

    return !subError && !txnError;
  } catch (error) {
    console.log('Subscription tables test error:', error.message);
    return false;
  }
}

// Test 6: Test API Endpoint
async function testAPIEndpoint() {
  try {
    console.log('\n6. Testing API Endpoint:');
    
    // Test the verify-pin endpoint (this is what login uses)
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-pin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '1234567890', // Test phone number
        pin: '0000' // Test PIN
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API endpoint: OK');
      console.log('Response status:', response.status);
      console.log('API responds correctly:', data.success !== undefined ? 'YES' : 'NO');
    } else {
      console.log('API endpoint error:', response.status, response.statusText);
    }

    return response.ok;
  } catch (error) {
    console.log('API endpoint test error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const basicConn = await testSupabaseConnection();
  const adminConn = await testAdminConnection();
  const authFlow = await testAuthFlow();
  const subTables = await testSubscriptionTables();
  const apiEndpoint = await testAPIEndpoint();

  console.log('\n=== TEST RESULTS ===');
  console.log('Environment Variables: PASS');
  console.log('Basic Connection:', basicConn ? 'PASS' : 'FAIL');
  console.log('Admin Connection:', adminConn ? 'PASS' : 'FAIL');
  console.log('Auth Flow:', authFlow ? 'PASS' : 'FAIL');
  console.log('Subscription Tables:', subTables ? 'PASS' : 'FAIL');
  console.log('API Endpoint:', apiEndpoint ? 'PASS' : 'FAIL');

  const allPassed = basicConn && adminConn && authFlow && subTables && apiEndpoint;
  
  if (allPassed) {
    console.log('\nSUCCESS: Supabase is fully connected and working!');
  } else {
    console.log('\nISSUE: Some Supabase connections are failing.');
    console.log('Check your environment variables and Supabase project settings.');
  }
}

// Run the tests
runAllTests().catch(console.error);
