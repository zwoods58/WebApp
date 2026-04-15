// Test create subscription endpoint with mobile money validation
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testCreateSubscription() {
  console.log('=== Testing Create Subscription Mobile Money Validation ===\n');
  
  // Test Kenya (should work - has mobile money provider)
  console.log('\n1. Testing Kenya (M-Pesa - should work):');
  try {
    const kenyaRequest = {
      user_id: 'test-user',
      user_email: 'test@kenya.com',
      user_phone: '+254712345678',
      country: 'Kenya',
      full_name: 'Test User'
    };
    
    const kenyaResponse = await fetch(`${BASE_URL}/api/subscription/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kenyaRequest)
    });
    
    const kenyaData = await kenyaResponse.json();
    console.log('Kenya Response:', kenyaData);
    
    if (kenyaData.error) {
      console.log('❌ Kenya validation failed:', kenyaData.error);
    } else {
      console.log('✅ Kenya validation passed - subscription created');
    }
  } catch (error) {
    console.error('Kenya test error:', error.message);
  }
  
  // Test Ghana (should work - has mobile money provider)
  console.log('\n2. Testing Ghana (MTN - should work):');
  try {
    const ghanaRequest = {
      user_id: 'test-user',
      user_email: 'test@ghana.com',
      user_phone: '+233123456789',
      country: 'Ghana',
      full_name: 'Test User'
    };
    
    const ghanaResponse = await fetch(`${BASE_URL}/api/subscription/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ghanaRequest)
    });
    
    const ghanaData = await ghanaResponse.json();
    console.log('Ghana Response:', ghanaData);
    
    if (ghanaData.error) {
      console.log('❌ Ghana validation failed:', ghanaData.error);
    } else {
      console.log('✅ Ghana validation passed - subscription created');
    }
  } catch (error) {
    console.error('Ghana test error:', error.message);
  }
  
  // Test Côte d'Ivoire (should work - has mobile money provider)
  console.log('\n3. Testing Côte d\'Ivoire (Orange Money - should work):');
  try {
    const coteDIvoireRequest = {
      user_id: 'test-user',
      user_email: 'test@cotedivoire.com',
      user_phone: '+225123456789',
      country: 'Côte d\'Ivoire',
      full_name: 'Test User'
    };
    
    const coteDIvoireResponse = await fetch(`${BASE_URL}/api/subscription/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(coteDIvoireRequest)
    });
    
    const coteDIvoireData = await coteDIvoireResponse.json();
    console.log('Côte d\'Ivoire Response:', coteDIvoireData);
    
    if (coteDIvoireData.error) {
      console.log('❌ Côte d\'Ivoire validation failed:', coteDIvoireData.error);
    } else {
      console.log('✅ Côte d\'Ivoire validation passed - subscription created');
    }
  } catch (error) {
    console.error('Côte d\'Ivoire test error:', error.message);
  }
  
  // Test Nigeria (should fail - bank transfer, no mobile money provider)
  console.log('\n4. Testing Nigeria (Bank Transfer - should fail validation):');
  try {
    const nigeriaRequest = {
      user_id: 'test-user',
      user_email: 'test@nigeria.com',
      user_phone: '+234123456789',
      country: 'Nigeria',
      full_name: 'Test User'
    };
    
    const nigeriaResponse = await fetch(`${BASE_URL}/api/subscription/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nigeriaRequest)
    });
    
    const nigeriaData = await nigeriaResponse.json();
    console.log('Nigeria Response:', nigeriaData);
    
    if (nigeriaData.error) {
      console.log('Expected: Nigeria should fail mobile money validation (uses bank transfer)');
      if (nigeriaData.error.includes('Mobile money provider is required')) {
        console.log('✅ Nigeria validation correctly failed (mobile money required but uses bank transfer)');
      } else {
        console.log('❌ Nigeria validation failed for wrong reason:', nigeriaData.error);
      }
    } else {
      console.log('❌ Nigeria validation unexpectedly passed (should require bank transfer)');
    }
  } catch (error) {
    console.error('Nigeria test error:', error.message);
  }
}

testCreateSubscription();
