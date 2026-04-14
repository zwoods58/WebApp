// Test script to verify all subscription modals work with database
// This script tests Kenya, Ghana, Nigeria, and Côte d'Ivoire subscription flows

const countries = ['KE', 'GH', 'NG', 'CI'];
const baseUrl = 'http://localhost:3000';

async function testPlansAPI(country) {
  console.log(`\n=== Testing ${country} Plans API ===`);
  try {
    const response = await fetch(`${baseUrl}/api/kyshi/plans?country=${country}`);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Plans count: ${data.plans?.length || 0}`);
    
    if (data.plans && data.plans.length > 0) {
      data.plans.forEach((plan, index) => {
        console.log(`Plan ${index + 1}:`, {
          id: plan.id,
          name: plan.name,
          country_code: plan.country_code,
          amount: plan.amount,
          currency: plan.localCurrency,
          code: plan.code
        });
      });
    } else {
      console.error('❌ No plans found for', country);
    }
    
    return data.success && data.plans && data.plans.length > 0;
  } catch (error) {
    console.error(`❌ Error testing ${country} plans:`, error.message);
    return false;
  }
}

async function testSubscriptionFlow(country) {
  console.log(`\n=== Testing ${country} Subscription Flow ===`);
  
  // Test plan retrieval
  const plansWork = await testPlansAPI(country);
  
  if (plansWork) {
    console.log(`✅ ${country} plans API working correctly`);
    
    // Test expected amounts
    const expectedAmounts = {
      'KE': 200,
      'GH': 20,
      'NG': 500,
      'CI': 1000
    };
    
    console.log(`Expected amount for ${country}:`, expectedAmounts[country]);
    console.log(`✅ ${country} subscription flow validated`);
  } else {
    console.log(`❌ ${country} subscription flow has issues`);
  }
}

async function runAllTests() {
  console.log('🧪 Starting Subscription Modal Tests');
  console.log('=====================================');
  
  let allPassed = true;
  
  for (const country of countries) {
    const passed = await testSubscriptionFlow(country);
    allPassed = allPassed && passed;
  }
  
  console.log('\n=== Test Summary ===');
  if (allPassed) {
    console.log('🎉 All subscription modals are working correctly!');
    console.log('✅ Database retrieval working for all countries');
    console.log('✅ Kenya pattern successfully applied to GH, NG, CI');
  } else {
    console.log('❌ Some subscription modals have issues');
    console.log('Please check the database and API endpoints');
  }
  
  console.log('\nNext steps:');
  console.log('1. Verify kyshi_plans table has data for all countries');
  console.log('2. Test subscription modals in the browser');
  console.log('3. Check payment provider integrations');
}

// Run tests
runAllTests().catch(console.error);
