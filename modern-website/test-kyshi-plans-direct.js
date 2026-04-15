// Direct test of Kyshi plans API
const fetch = require('node-fetch');

const KYSHI_API = 'https://api.kyshi.co';
const KYSHI_SECRET_KEY = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';

async function testPlansDirectly() {
  console.log('=== Testing Kyshi Plans Directly ===\n');
  
  try {
    // Test list plans
    console.log('1. Testing list plans...');
    const listResponse = await fetch(`${KYSHI_API}/v1/plans`, {
      headers: {
        'x-api-key': KYSHI_SECRET_KEY
      }
    });
    
    const listData = await listResponse.json();
    console.log('List Plans Status:', listData.status);
    console.log('Total Plans:', listData.data?.total || 0);
    
    if (listData.status && listData.data) {
      console.log('\nAll Plans:');
      listData.data.data.forEach((plan, index) => {
        console.log(`${index + 1}. ${plan.name} (${plan.code})`);
        console.log(`   Amount: ${plan.amount} ${plan.localCurrency}`);
        console.log(`   Interval: ${plan.interval}`);
        console.log(`   Active: ${plan.isActive}`);
        console.log('');
      });
      
      // Find our specific plans
      const kenyaPlan = listData.data.data.find(p => p.code === 'PLN_MVyWThBVJ1Np0IB');
      const nigeriaPlan = listData.data.data.find(p => p.code === 'PLN_iiRmmGJcnQy5paj');
      const ghanaPlan = listData.data.data.find(p => p.code === 'PLN_WQN3ZhV2AX-knWQ');
      const coteDIvoirePlan = listData.data.data.find(p => p.code === 'PLN_XdMwJ8jf8qeHhi0');
      
      console.log('=== Our Created Plans ===');
      console.log('Kenya Plan:', kenyaPlan ? 'FOUND' : 'NOT FOUND');
      if (kenyaPlan) {
        console.log(`  - Code: ${kenyaPlan.code}`);
        console.log(`  - Amount: ${kenyaPlan.amount} ${kenyaPlan.localCurrency}`);
        console.log(`  - Active: ${kenyaPlan.isActive}`);
      }
      
      console.log('Nigeria Plan:', nigeriaPlan ? 'FOUND' : 'NOT FOUND');
      if (nigeriaPlan) {
        console.log(`  - Code: ${nigeriaPlan.code}`);
        console.log(`  - Amount: ${nigeriaPlan.amount} ${nigeriaPlan.localCurrency}`);
        console.log(`  - Active: ${nigeriaPlan.isActive}`);
      }
      
      console.log('Ghana Plan:', ghanaPlan ? 'FOUND' : 'NOT FOUND');
      if (ghanaPlan) {
        console.log(`  - Code: ${ghanaPlan.code}`);
        console.log(`  - Amount: ${ghanaPlan.amount} ${ghanaPlan.localCurrency}`);
        console.log(`  - Active: ${ghanaPlan.isActive}`);
      }
      
      console.log('Côte d\'Ivoire Plan:', coteDIvoirePlan ? 'FOUND' : 'NOT FOUND');
      if (coteDIvoirePlan) {
        console.log(`  - Code: ${coteDIvoirePlan.code}`);
        console.log(`  - Amount: ${coteDIvoirePlan.amount} ${coteDIvoirePlan.localCurrency}`);
        console.log(`  - Active: ${coteDIvoirePlan.isActive}`);
      }
      
      // Test get specific plan
      console.log('\n2. Testing get specific plan...');
      if (kenyaPlan) {
        const getResponse = await fetch(`${KYSHI_API}/v1/plans`, {
          headers: {
            'x-api-key': KYSHI_SECRET_KEY
          }
        });
        
        const getData = await getResponse.json();
        const specificPlan = getData.data.data.find(p => p.code === 'PLN_MVyWThBVJ1Np0IB');
        
        if (specificPlan) {
          console.log('SUCCESS: Can retrieve specific plan');
          console.log('Plan Details:');
          console.log(`  - ID: ${specificPlan.id}`);
          console.log(`  - Name: ${specificPlan.name}`);
          console.log(`  - Description: ${specificPlan.description}`);
          console.log(`  - Amount: ${specificPlan.amount} ${specificPlan.localCurrency}`);
          console.log(`  - Interval: ${specificPlan.interval}`);
          console.log(`  - Code: ${specificPlan.code}`);
          console.log(`  - Active: ${specificPlan.isActive}`);
          console.log(`  - Created: ${specificPlan.createdAt}`);
        }
      }
      
    } else {
      console.log('FAILED: Could not list plans');
      console.log('Response:', listData);
    }
    
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

async function testPlanCreation() {
  console.log('\n=== Testing Plan Creation ===\n');
  
  // Test creating a new plan to verify the API is working
  const testPlan = {
    name: 'Test Plan Verification',
    description: 'Test plan to verify API is working',
    interval: 'weekly',
    amount: 10000, // 100 KES
    localCurrency: 'KES'
  };
  
  try {
    console.log('Creating test plan...');
    const response = await fetch(`${KYSHI_API}/v1/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KYSHI_SECRET_KEY
      },
      body: JSON.stringify(testPlan)
    });
    
    const data = await response.json();
    
    if (data.status && data.code === 201) {
      console.log('SUCCESS: Test plan created');
      console.log('Plan Code:', data.data.code);
      console.log('Plan ID:', data.data.id);
      console.log('Amount:', data.data.amount, data.data.localCurrency);
      
      // Clean up - delete the test plan (if API supports it)
      console.log('Note: Test plan created successfully - you may want to delete it manually');
      
    } else {
      console.log('FAILED: Could not create test plan');
      console.log('Response:', data);
    }
    
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

async function main() {
  await testPlansDirectly();
  await testPlanCreation();
  
  console.log('\n=== Test Complete ===');
}

main();
