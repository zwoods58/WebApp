// Script to create Kyshi plans for all countries
const fetch = require('node-fetch');

const KYSHI_API = 'https://api.kyshi.co';
const KYSHI_SECRET_KEY = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';

// Plan configurations for each country
const PLANS = [
  {
    name: 'Kenya Weekly Plan',
    description: 'Weekly subscription for Kenya customers with M-Pesa payment',
    interval: 'weekly',
    amount: 20000, // 200 KES in cents
    localCurrency: 'KES',
    country: 'Kenya'
  },
  {
    name: 'Nigeria Weekly Plan',
    description: 'Weekly subscription for Nigeria customers with bank transfer payment',
    interval: 'weekly',
    amount: 50000, // 500 NGN in cents
    localCurrency: 'NGN',
    country: 'Nigeria'
  },
  {
    name: 'Ghana Weekly Plan',
    description: 'Weekly subscription for Ghana customers with mobile money payment',
    interval: 'weekly',
    amount: 2000, // 20 GHS in cents
    localCurrency: 'GHS',
    country: 'Ghana'
  },
  {
    name: 'Côte d\'Ivoire Weekly Plan',
    description: 'Weekly subscription for Côte d\'Ivoire customers with mobile money payment',
    interval: 'weekly',
    amount: 100000, // 1000 XOF in cents
    localCurrency: 'XOF',
    country: 'Côte d\'Ivoire'
  }
];

async function createPlan(planData) {
  try {
    console.log(`Creating plan for ${planData.country}: ${planData.name}`);
    
    const response = await fetch(`${KYSHI_API}/v1/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KYSHI_SECRET_KEY
      },
      body: JSON.stringify(planData)
    });

    const data = await response.json();
    
    if (data.status && data.code === 201) {
      console.log(`SUCCESS: Plan created for ${planData.country}`);
      console.log(`Plan Code: ${data.data.code}`);
      console.log(`Plan ID: ${data.data.id}`);
      console.log(`Amount: ${data.data.amount} ${data.data.localCurrency}`);
      return { success: true, data: data.data };
    } else {
      console.error(`FAILED: Could not create plan for ${planData.country}`);
      console.error('Response:', data);
      return { success: false, error: data.message || 'Unknown error' };
    }
  } catch (error) {
    console.error(`ERROR: Failed to create plan for ${planData.country}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function listPlans() {
  try {
    console.log('Listing existing plans...');
    
    const response = await fetch(`${KYSHI_API}/v1/plans`, {
      headers: {
        'x-api-key': KYSHI_SECRET_KEY
      }
    });

    const data = await response.json();
    
    if (data.status && data.code === 200) {
      console.log(`SUCCESS: Found ${data.data.total} existing plans`);
      console.log('Plans:');
      data.data.data.forEach(plan => {
        console.log(`  - ${plan.name} (${plan.code}) - ${plan.amount} ${plan.localCurrency} - ${plan.interval}`);
      });
      return { success: true, data: data.data };
    } else {
      console.error('FAILED: Could not list plans');
      console.error('Response:', data);
      return { success: false, error: data.message || 'Unknown error' };
    }
  } catch (error) {
    console.error('ERROR: Failed to list plans:', error.message);
    return { success: false, error: error.message };
  }
}

async function getPlan(planCode) {
  try {
    console.log(`Getting plan details for: ${planCode}`);
    
    const response = await fetch(`${KYSHI_API}/v1/plans`, {
      headers: {
        'x-api-key': KYSHI_SECRET_KEY
      }
    });

    const data = await response.json();
    
    if (data.status && data.code === 200) {
      const plan = data.data.data.find(p => p.code === planCode);
      if (plan) {
        console.log(`SUCCESS: Found plan ${planCode}`);
        console.log(`Name: ${plan.name}`);
        console.log(`Amount: ${plan.amount} ${plan.localCurrency}`);
        console.log(`Interval: ${plan.interval}`);
        console.log(`Active: ${plan.isActive}`);
        console.log(`Subscriptions: ${plan.subscriptions ? plan.subscriptions.length : 0}`);
        return { success: true, data: plan };
      } else {
        console.log(`NOT FOUND: Plan ${planCode} not found`);
        return { success: false, error: 'Plan not found' };
      }
    } else {
      console.error('FAILED: Could not get plan');
      console.error('Response:', data);
      return { success: false, error: data.message || 'Unknown error' };
    }
  } catch (error) {
    console.error('ERROR: Failed to get plan:', error.message);
    return { success: false, error: error.message };
  }
}

async function createAllPlans() {
  console.log('=== Creating Kyshi Plans ===\n');
  
  // List existing plans first
  await listPlans();
  
  console.log('\n=== Creating New Plans ===\n');
  
  // Create plans for each country
  const results = [];
  for (const plan of PLANS) {
    const result = await createPlan(plan);
    results.push({ country: plan.country, ...result });
    
    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== Plan Creation Results ===\n');
  results.forEach(result => {
    if (result.success) {
      console.log(`SUCCESS: ${result.country} - Plan Code: ${result.data.code}`);
    } else {
      console.log(`FAILED: ${result.country} - Error: ${result.error}`);
    }
  });
  
  console.log('\n=== Verifying Created Plans ===\n');
  
  // Verify plans were created by listing them again
  await listPlans();
  
  console.log('\n=== Plan Creation Complete ===');
  return results;
}

async function main() {
  try {
    const results = await createAllPlans();
    
    // Create a summary of created plans
    const successfulPlans = results.filter(r => r.success);
    const failedPlans = results.filter(r => !r.success);
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total Plans: ${PLANS.length}`);
    console.log(`Successful: ${successfulPlans.length}`);
    console.log(`Failed: ${failedPlans.length}`);
    
    if (successfulPlans.length > 0) {
      console.log('\n=== SUCCESSFUL PLANS ===');
      successfulPlans.forEach(plan => {
        console.log(`${plan.country}: ${plan.data.code} (${plan.data.amount} ${plan.data.localCurrency})`);
      });
    }
    
    if (failedPlans.length > 0) {
      console.log('\n=== FAILED PLANS ===');
      failedPlans.forEach(plan => {
        console.log(`${plan.country}: ${plan.error}`);
      });
    }
    
  } catch (error) {
    console.error('FATAL ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
} else {
  module.exports = {
    createPlan,
    listPlans,
    getPlan,
    createAllPlans
  };
}
