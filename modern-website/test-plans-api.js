// Test script to verify the plans API works correctly
// Run this in browser console or as a Node.js script

async function testPlansAPI() {
  console.log('=== Testing Plans API ===');
  
  // Use localhost URL for testing
  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Get all plans
    console.log('\n1. Testing GET /api/kyshi/plans');
    const allPlansResponse = await fetch(`${baseUrl}/api/kyshi/plans`);
    const allPlansData = await allPlansResponse.json();
    
    console.log('Status:', allPlansResponse.status);
    console.log('Response:', allPlansData);
    
    if (allPlansData.success && Array.isArray(allPlansData.plans)) {
      console.log(`SUCCESS: Retrieved ${allPlansData.plans.length} plans`);
    } else {
      console.error('FAILED: Unexpected response format');
    }
    
    // Test 2: Get Kenya plans only
    console.log('\n2. Testing GET /api/kyshi/plans?country=KE');
    const kenyaPlansResponse = await fetch(`${baseUrl}/api/kyshi/plans?country=KE`);
    const kenyaPlansData = await kenyaPlansResponse.json();
    
    console.log('Status:', kenyaPlansResponse.status);
    console.log('Response:', kenyaPlansData);
    
    if (kenyaPlansData.success && Array.isArray(kenyaPlansData.plans)) {
      console.log(`SUCCESS: Retrieved ${kenyaPlansData.plans.length} Kenya plans`);
      console.log('Kenya plan details:', kenyaPlansData.plans[0]);
    } else {
      console.error('FAILED: Unexpected response format');
    }
    
    // Test 3: Test the SubscriptionAPI class
    console.log('\n3. Testing SubscriptionAPI.getPlans()');
    
    // Import the SubscriptionAPI class (this would need to be adapted based on your module system)
    // For now, let's simulate what it does:
    class TestSubscriptionAPI {
      static baseUrl = `${baseUrl}/api/kyshi`;
      
      static async getPlans(countryCode) {
        const url = countryCode 
          ? `${this.baseUrl}/plans?country=${countryCode}` 
          : `${this.baseUrl}/plans`;
          
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('Plans API response:', data);
        
        let plansArray = [];
        
        if (data.success && Array.isArray(data.plans)) {
          plansArray = data.plans;
          console.log(`Retrieved ${plansArray.length} plans from success.plans format`);
        } else if (Array.isArray(data)) {
          plansArray = data;
          console.log(`Retrieved ${plansArray.length} plans from direct array format`);
        } else if (data.data && Array.isArray(data.data)) {
          plansArray = data.data;
          console.log(`Retrieved ${plansArray.length} plans from data.data format`);
        } else if (data.plans && Array.isArray(data.plans)) {
          plansArray = data.plans;
          console.log(`Retrieved ${plansArray.length} plans from plans field`);
        } else {
          console.error('Unexpected plans response format:', data);
          throw new Error('Invalid plans response format');
        }
        
        return plansArray;
      }
    }
    
    const kenyaPlans = await TestSubscriptionAPI.getPlans('KE');
    console.log(`SUCCESS: SubscriptionAPI.getPlans('KE') returned ${kenyaPlans.length} plans`);
    
    // Test 4: Test plan ID lookup
    console.log('\n4. Testing plan ID lookup');
    const kenyaPlan = kenyaPlans.find(p => p.country_code === 'KE');
    if (kenyaPlan) {
      console.log(`SUCCESS: Found Kenya plan with ID: ${kenyaPlan.id}`);
      console.log('Plan details:', {
        id: kenyaPlan.id,
        name: kenyaPlan.name,
        amount: kenyaPlan.amount,
        currency: kenyaPlan.localCurrency,
        country_code: kenyaPlan.country_code
      });
    } else {
      console.error('FAILED: No Kenya plan found');
    }
    
    console.log('\n=== All Tests Completed ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testPlansAPI();
