// Simple test of the plans API endpoint
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testPlansAPI() {
  console.log('=== Testing Plans API Endpoint ===\n');
  
  try {
    // Test the plans endpoint directly
    console.log('Testing /api/subscription/plans?country=KE...');
    const response = await fetch(`${BASE_URL}/api/subscription/plans?country=KE`);
    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`\nSuccess: Found ${data.count} plans for Kenya`);
      if (data.plans.length > 0) {
        console.log('Plans:');
        data.plans.forEach((plan, index) => {
          console.log(`${index + 1}. ${plan.name} (${plan.planCode})`);
          console.log(`   Amount: ${plan.amount} ${plan.currency}`);
          console.log(`   Country: ${plan.country}`);
          console.log(`   Interval: ${plan.interval}`);
          console.log(`   Active: ${plan.isActive}`);
          console.log('');
        });
      }
    } else {
      console.log('Failed to get plans');
    }
    
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

testPlansAPI();
