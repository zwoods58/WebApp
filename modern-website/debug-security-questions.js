// Debug Security Questions API Issue
// Test the security questions API with more detailed debugging

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Debugging Security Questions API ===\n');

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

async function testDirectSupabaseCall() {
  console.log('\n1. Testing direct Supabase call...');
  
  try {
    const { data, error } = await supabaseAdmin
      .from('security_questions')
      .select('id, question_text, category')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('question_text', { ascending: true });

    if (error) {
      console.log('   ❌ Direct Supabase error:', error.message);
      console.log('   Error details:', {
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    console.log('   ✅ Direct Supabase success - found', data?.length || 0, 'questions');
    if (data && data.length > 0) {
      console.log('   Sample questions:');
      data.slice(0, 3).forEach((q, index) => {
        console.log(`     ${index + 1}. [${q.category}] ${q.question_text}`);
      });
    }

    return true;
  } catch (error) {
    console.log('   💥 Direct test failed:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n2. Checking environment variables...');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  let allVarsPresent = true;
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`   ❌ Missing: ${varName}`);
      allVarsPresent = false;
    } else {
      console.log(`   ✅ Found: ${varName} = ${value.substring(0, 10)}...`);
    }
  });

  return allVarsPresent;
}

async function testApiEndpointWithoutAuth() {
  console.log('\n3. Testing API endpoint without authentication...');
  
  try {
    const response = await fetch('https://www.atarwebb.com/api/auth/security-questions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('   Raw response:', responseText);
    console.log('   Response status:', response.status);
    
    return response.ok;
  } catch (error) {
    console.log('   💥 API test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runDebugTests() {
  console.log('Starting comprehensive debugging...\n');
  
  // Test 1: Environment variables
  const envOk = await testEnvironmentVariables();
  
  // Test 2: Direct Supabase connection
  const directCallOk = await testDirectSupabaseCall();
  
  // Test 3: API endpoint without auth
  const apiOk = await testApiEndpointWithoutAuth();
  
  console.log('\n=== DEBUG RESULTS ===');
  console.log('Environment Variables:', envOk ? 'OK' : 'MISSING');
  console.log('Direct Supabase Call:', directCallOk ? 'OK' : 'FAILED');
  console.log('API Endpoint:', apiOk ? 'OK' : 'FAILED');
  
  if (envOk && directCallOk && !apiOk) {
    console.log('\n🔍 DIAGNOSIS: Supabase works but API endpoint fails');
    console.log('   This suggests a Vercel deployment or Next.js routing issue');
    console.log('   The FUNCTION_INVOCATION_FAILED error indicates the function cannot be found or executed');
  } else if (!envOk) {
    console.log('\n❌ CRITICAL: Environment variables are missing');
  } else {
    console.log('\n❌ UNKNOWN: Multiple components failing');
  }
  
  console.log('\n=== RECOMMENDATIONS ===');
  if (!envOk) {
    console.log('1. Check environment variables in .env.local');
    console.log('2. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  }
  
  if (envOk && directCallOk && !apiOk) {
    console.log('1. Check Vercel deployment status');
    console.log('2. Verify API routes are properly deployed');
    console.log('3. Check Next.js build and deployment logs');
    console.log('4. Try accessing the API directly with curl or Postman');
  }
}

// Run the tests
runDebugTests().catch(console.error);
