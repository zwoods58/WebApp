// Test the Kyshi API client directly
const { kyshiAPI } = require('./src/lib/kyshi.ts');

async function testKyshiClient() {
  console.log('=== Testing Kyshi API Client ===\n');
  
  try {
    // Test list plans for Kenya
    console.log('1. Testing list plans for Kenya...');
    const kenyaPlans = await kyshiAPI.listPlans('KE');
    console.log('Kenya Plans:', kenyaPlans.length);
    kenyaPlans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} (${plan.planCode})`);
      console.log(`   Amount: ${plan.amount} ${plan.currency}`);
      console.log(`   Country: ${plan.country}`);
      console.log(`   Interval: ${plan.interval}`);
      console.log(`   Active: ${plan.isActive}`);
      console.log('');
    });
    
    // Test list plans for all countries
    console.log('2. Testing list plans for all countries...');
    const allPlans = await kyshiAPI.listPlans();
    console.log('All Plans:', allPlans.length);
    
    // Find our specific plans
    const kenyaPlan = allPlans.find(p => p.planCode === 'PLN_MVyWThBVJ1Np0IB');
    const nigeriaPlan = allPlans.find(p => p.planCode === 'PLN_iiRmmGJcnQy5paj');
    const ghanaPlan = allPlans.find(p => p.planCode === 'PLN_WQN3ZhV2AX-knWQ');
    const coteDIvoirePlan = allPlans.find(p => p.planCode === 'PLN_XdMwJ8jf8qeHhi0');
    
    console.log('=== Our Created Plans ===');
    console.log('Kenya Plan:', kenyaPlan ? 'FOUND' : 'NOT FOUND');
    if (kenyaPlan) {
      console.log(`  - Code: ${kenyaPlan.planCode}`);
      console.log(`  - Name: ${kenyaPlan.name}`);
      console.log(`  - Amount: ${kenyaPlan.amount} ${kenyaPlan.currency}`);
      console.log(`  - Country: ${kenyaPlan.country}`);
      console.log(`  - Active: ${kenyaPlan.isActive}`);
    }
    
    console.log('Nigeria Plan:', nigeriaPlan ? 'FOUND' : 'NOT FOUND');
    if (nigeriaPlan) {
      console.log(`  - Code: ${nigeriaPlan.planCode}`);
      console.log(`  - Name: ${nigeriaPlan.name}`);
      console.log(`  - Amount: ${nigeriaPlan.amount} ${nigeriaPlan.currency}`);
      console.log(`  - Country: ${nigeriaPlan.country}`);
      console.log(`  - Active: ${nigeriaPlan.isActive}`);
    }
    
    console.log('Ghana Plan:', ghanaPlan ? 'FOUND' : 'NOT FOUND');
    if (ghanaPlan) {
      console.log(`  - Code: ${ghanaPlan.planCode}`);
      console.log(`  - Name: ${ghanaPlan.name}`);
      console.log(`  - Amount: ${ghanaPlan.amount} ${ghanaPlan.currency}`);
      console.log(`  - Country: ${ghanaPlan.country}`);
      console.log(`  - Active: ${ghanaPlan.isActive}`);
    }
    
    console.log('Côte d\'Ivoire Plan:', coteDIvoirePlan ? 'FOUND' : 'NOT FOUND');
    if (coteDIvoirePlan) {
      console.log(`  - Code: ${coteDIvoirePlan.planCode}`);
      console.log(`  - Name: ${coteDIvoirePlan.name}`);
      console.log(`  - Amount: ${coteDIvoirePlan.amount} ${coteDIvoirePlan.currency}`);
      console.log(`  - Country: ${coteDIvoirePlan.country}`);
      console.log(`  - Active: ${coteDIvoirePlan.isActive}`);
    }
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Stack:', error.stack);
  }
}

testKyshiClient();
