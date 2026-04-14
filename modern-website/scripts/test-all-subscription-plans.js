// Comprehensive test for all subscription plans with webhook
// Tests Kenya, Ghana, Nigeria, and Côte d'Ivoire plans

require('dotenv').config({ path: '.env.local' });

const countries = [
  { code: 'KE', name: 'Kenya', currency: 'KES', amount: 200, email: 'kenya@test.com' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', amount: 20, email: 'ghana@test.com' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', amount: 500, email: 'nigeria@test.com' },
  { code: 'CI', name: 'Côte d\'Ivoire', currency: 'XOF', amount: 1000, email: 'ci@test.com' }
];

const webhookUrl = 'https://jonathon-precognizable-contestably.ngrok-free.dev/api/webhooks/kyshi';
const webhookSecret = 'c4accdbb6b2f49608ef729cd9afed411';
const plansApiUrl = 'http://localhost:3000/api/kyshi/plans';

const crypto = require('crypto');

function generateSignature(payload, secret) {
  const body = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return `sha256=${signature}`;
}

async function testPlansAPI(country) {
  console.log(`\n=== Testing ${country.name} Plans API ===`);
  
  try {
    const response = await fetch(`${plansApiUrl}?country=${country.code}`);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Plans count: ${data.plans?.length || 0}`);
    
    if (data.success && data.plans?.length > 0) {
      data.plans.forEach(plan => {
        console.log(`Plan: ${plan.name}`);
        console.log(`  Amount: ${plan.amount} ${plan.localCurrency}`);
        console.log(`  Code: ${plan.code}`);
        console.log(`  Country: ${plan.country_code}`);
        console.log(`  Active: ${plan.isActive}`);
      });
      return true;
    } else {
      console.error('No plans found');
      return false;
    }
  } catch (error) {
    console.error('API test failed:', error.message);
    return false;
  }
}

async function testWebhookForCountry(country) {
  console.log(`\n=== Testing ${country.name} Webhook ===`);
  
  const payload = {
    event: 'successful',
    data: {
      reference: `${country.code.toLowerCase()}_test_${Date.now()}`,
      amount: country.amount * 100, // Convert to cents/currency units
      customer: {
        email: country.email,
        firstName: country.name,
        lastName: 'Test User'
      },
      meta: {
        localCurrency: country.currency,
        localAmount: country.amount * 100,
        feeBreakdown: {
          totalFees: Math.floor(country.amount * 0.05) // 5% fee
        }
      },
      paidAt: new Date().toISOString()
    }
  };
  
  try {
    const body = JSON.stringify(payload);
    const signature = generateSignature(payload, webhookSecret);
    
    console.log(`Sending webhook for ${country.code}...`);
    console.log(`Reference: ${payload.data.reference}`);
    console.log(`Amount: ${country.amount} ${country.currency}`);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kyshi-signature': signature
      },
      body: body
    });
    
    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    console.log(`Response: ${responseText}`);
    
    if (response.ok) {
      console.log(`Webhook test successful for ${country.name}`);
      return true;
    } else {
      console.error(`Webhook test failed for ${country.name}`);
      return false;
    }
  } catch (error) {
    console.error(`Webhook test error for ${country.name}:`, error.message);
    return false;
  }
}

async function testSubscriptionModalIntegration(country) {
  console.log(`\n=== Testing ${country.name} Subscription Modal Integration ===`);
  
  // Test that the subscription modal can retrieve plans
  try {
    const response = await fetch(`${plansApiUrl}?country=${country.code}`);
    const data = await response.json();
    
    if (data.success && data.plans?.length > 0) {
      const plan = data.plans[0];
      
      // Verify plan matches expected configuration
      const expectedAmounts = {
        'KE': 200,
        'GH': 20,
        'NG': 500,
        'CI': 1000
      };
      
      const expectedCurrencies = {
        'KE': 'KES',
        'GH': 'GHS',
        'NG': 'NGN',
        'CI': 'XOF'
      };
      
      if (plan.amount === expectedAmounts[country.code] && 
          plan.localCurrency === expectedCurrencies[country.code]) {
        console.log(`Plan configuration correct for ${country.name}`);
        console.log(`Amount: ${plan.amount} ${plan.localCurrency} (expected: ${expectedAmounts[country.code]} ${expectedCurrencies[country.code]})`);
        return true;
      } else {
        console.error(`Plan configuration mismatch for ${country.name}`);
        console.log(`Expected: ${expectedAmounts[country.code]} ${expectedCurrencies[country.code]}`);
        console.log(`Actual: ${plan.amount} ${plan.localCurrency}`);
        return false;
      }
    } else {
      console.error(`No plans available for ${country.name}`);
      return false;
    }
  } catch (error) {
    console.error(`Integration test failed for ${country.name}:`, error.message);
    return false;
  }
}

async function runComprehensiveTests() {
  console.log('=== COMPREHENSIVE SUBSCRIPTION PLAN TESTS ===');
  console.log('Testing all countries: Kenya, Ghana, Nigeria, Côte d\'Ivoire');
  
  let results = {
    plansAPI: {},
    webhook: {},
    integration: {},
    overall: true
  };
  
  for (const country of countries) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing ${country.name} (${country.code})`);
    console.log(`${'='.repeat(60)}`);
    
    // Test 1: Plans API
    results.plansAPI[country.code] = await testPlansAPI(country);
    
    // Test 2: Webhook
    results.webhook[country.code] = await testWebhookForCountry(country);
    
    // Test 3: Integration
    results.integration[country.code] = await testSubscriptionModalIntegration(country);
    
    // Update overall result
    const countrySuccess = results.plansAPI[country.code] && 
                          results.webhook[country.code] && 
                          results.integration[country.code];
    
    console.log(`\n${country.name} Results:`);
    console.log(`Plans API: ${results.plansAPI[country.code] ? 'PASS' : 'FAIL'}`);
    console.log(`Webhook: ${results.webhook[country.code] ? 'PASS' : 'FAIL'}`);
    console.log(`Integration: ${results.integration[country.code] ? 'PASS' : 'FAIL'}`);
    console.log(`Overall: ${countrySuccess ? 'PASS' : 'FAIL'}`);
    
    results.overall = results.overall && countrySuccess;
  }
  
  // Final summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('FINAL TEST RESULTS');
  console.log(`${'='.repeat(60)}`);
  
  const totalTests = countries.length * 3;
  const passedTests = Object.values(results.plansAPI).filter(Boolean).length +
                     Object.values(results.webhook).filter(Boolean).length +
                     Object.values(results.integration).filter(Boolean).length;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (results.overall) {
    console.log('\nAll subscription plans are working correctly! ');
    console.log('Ready for production use across all countries.');
  } else {
    console.log('\nSome tests failed. Check the detailed results above.');
  }
  
  return results;
}

// Run the comprehensive tests
if (require.main === module) {
  runComprehensiveTests().catch(console.error);
}

module.exports = { runComprehensiveTests, testPlansAPI, testWebhookForCountry };
