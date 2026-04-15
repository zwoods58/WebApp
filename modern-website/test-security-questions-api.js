// Test Security Questions API
// Test if the security questions API is working properly

require('dotenv').config({ path: '.env.local' });

console.log('=== Testing Security Questions API ===\n');

async function testSecurityQuestionsAPI() {
  try {
    console.log('1. Testing GET /api/auth/security-questions...');
    
    const response = await fetch('https://www.atarwebb.com/api/auth/security-questions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      }
    });

    console.log('   Response status:', response.status);
    console.log('   Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('   Response data:', JSON.stringify(data, null, 2));
      
      if (data.success && data.questions) {
        console.log('   ✅ API working - found', data.questions.length, 'questions');
        console.log('   Sample questions:');
        data.questions.forEach((q, index) => {
          console.log(`     ${index + 1}. [${q.category}] ${q.question_text}`);
        });
      } else {
        console.log('   ❌ API returned success but no questions');
      }
    } else {
      console.log('   ❌ API failed with status:', response.status);
      console.log('   Response text:', await response.text());
    }
    
    return response.ok;
  } catch (error) {
    console.log('   💥 Test failed:', error.message);
    return false;
  }
}

// Run the test
testSecurityQuestionsAPI().then(success => {
  console.log('\n=== TEST RESULTS ===');
  if (success) {
    console.log('✅ Security Questions API: WORKING');
  } else {
    console.log('❌ Security Questions API: FAILED');
    console.log('   Check if the server is running and accessible');
  }
});
