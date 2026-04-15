// Debug Login Issue
// Test the verify-pin API endpoint directly to isolate the 500 error

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Debugging Login Issue ===\n');

// Create admin client
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

// Test 1: Check if we can find a business
async function testBusinessLookup() {
  console.log('1. Testing business lookup...');
  
  try {
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('id, phone_number, business_name, pin_hash')
      .eq('phone_number', '+254712345678') // Test with known phone
      .single();

    if (error) {
      console.log('   Business lookup error:', error.message);
      return false;
    }

    console.log('   Business found:', data ? 'YES' : 'NO');
    if (data) {
      console.log('   Business ID:', data.id);
      console.log('   Has PIN hash:', data.pin_hash ? 'YES' : 'NO');
    }
    
    return data;
  } catch (error) {
    console.log('   Unexpected error:', error.message);
    return false;
  }
}

// Test 2: Test PIN verification directly
async function testPinVerification(business) {
  console.log('\n2. Testing PIN verification...');
  
  if (!business || !business.pin_hash) {
    console.log('   No PIN hash to test against');
    return false;
  }

  try {
    // Test with a known PIN (this will fail, but should not 500)
    const testPin = '123456';
    
    // Import bcrypt
    const bcrypt = require('bcrypt');
    
    console.log('   Comparing test PIN against stored hash...');
    const isValid = await bcrypt.compare(testPin, business.pin_hash);
    
    console.log('   PIN comparison result:', isValid);
    console.log('   PIN comparison completed without error');
    
    return isValid;
  } catch (bcryptError) {
    console.log('   Bcrypt comparison error:', bcryptError.message);
    return false;
  }
}

// Test 3: Test rate limiter
async function testRateLimiter() {
  console.log('\n3. Testing rate limiter...');
  
  try {
    const { rateLimiter } = require('./src/lib/rate-limit/phone-limiter');
    
    const result = await rateLimiter.checkLimit('+254712345678', 'pin_verify');
    
    console.log('   Rate limit result:', result);
    return result;
  } catch (rateLimitError) {
    console.log('   Rate limiter error:', rateLimitError.message);
    return false;
  }
}

// Test 4: Test the actual API endpoint
async function testApiEndpoint() {
  console.log('\n4. Testing API endpoint...');
  
  try {
    const response = await fetch('https://www.atarwebb.com/api/auth/verify-pin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'User-Agent': 'Debug-Script/1.0'
      },
      body: JSON.stringify({
        phoneNumber: '+254712345678',
        pin: '123456' // Test PIN
      })
    });

    console.log('   Response status:', response.status);
    console.log('   Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('   Response body:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('   Parsed response:', data);
      } catch (parseError) {
        console.log('   JSON parse error:', parseError.message);
      }
    } else {
      console.log('   HTTP Error:', response.statusText);
    }
    
    return response.status === 200;
  } catch (apiError) {
    console.log('   API test error:', apiError.message);
    return false;
  }
}

// Run all tests
async function runDebugTests() {
  console.log('Starting debug tests...\n');
  
  // Test 1: Business lookup
  const business = await testBusinessLookup();
  
  if (!business) {
    console.log('\n❌ Cannot proceed - business lookup failed');
    return;
  }
  
  // Test 2: PIN verification
  const pinValid = await testPinVerification(business);
  
  // Test 3: Rate limiter
  const rateLimitResult = await testRateLimiter();
  
  // Test 4: API endpoint
  const apiWorks = await testApiEndpoint();
  
  console.log('\n=== DEBUG RESULTS ===');
  console.log('Business lookup:', business ? 'PASS' : 'FAIL');
  console.log('PIN verification:', pinValid !== undefined ? 'PASS' : 'FAIL');
  console.log('Rate limiter:', rateLimitResult ? 'PASS' : 'FAIL');
  console.log('API endpoint:', apiWorks ? 'PASS' : 'FAIL');
  
  if (business && pinValid !== undefined && rateLimitResult && apiWorks) {
    console.log('\n✅ All components working - issue likely in production environment');
  } else {
    console.log('\n❌ Some components failing - check above errors');
  }
}

// Run the tests
runDebugTests().catch(console.error);
