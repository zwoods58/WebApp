// Quick test script to verify Kyshi API connection
const { kyshiApi, testKyshiConnection } = require('./src/lib/kyshi');

async function quickTest() {
  console.log('Testing Kyshi API connection...');
  
  try {
    const result = await testKyshiConnection();
    console.log('Connection test result:', result);
    
    if (result.success) {
      console.log('✓ API connection successful!');
      
      // Try to list plans
      const plans = await kyshiApi.listPlans();
      console.log('✓ Retrieved plans:', plans.length, 'plans found');
      
      // Check if Kenya weekly plan exists
      const kenyaPlan = plans.find(p => p.localCurrency === 'KES' && p.interval === 'weekly' && p.amount === '200.00');
      if (kenyaPlan) {
        console.log('✓ Kenya weekly plan already exists:', kenyaPlan.name);
      } else {
        console.log('ℹ Kenya weekly plan not found - ready to create');
      }
    }
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

quickTest();
