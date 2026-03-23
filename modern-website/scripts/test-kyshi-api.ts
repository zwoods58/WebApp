/**
 * Kyshi API Test Script
 * Tests creating a subscription plan for Kenya
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env.local manually
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    });
  } catch (error) {
    console.error('Warning: Could not load .env.local file');
  }
}

loadEnvFile();

const KYSHI_PUBLIC_KEY = process.env.KYSHI_PUBLIC_KEY;
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co';

async function testKyshiAPI() {
  console.log('🧪 Testing Kyshi API for Subscription Plans\n');

  if (!KYSHI_SECRET_KEY) {
    console.error('❌ Error: KYSHI_SECRET_KEY not found in .env.local\n');
    process.exit(1);
  }

  console.log('📋 Test Configuration:');
  console.log(`   Base URL: ${KYSHI_BASE_URL}`);
  console.log(`   Public Key: ${KYSHI_PUBLIC_KEY?.substring(0, 15)}...`);
  console.log(`   Secret Key: ${KYSHI_SECRET_KEY.substring(0, 15)}...`);
  console.log('');

  // Test data for initializing a subscription
  // Note: This requires an existing plan code and customer
  const subscriptionData = {
    customer: 'test@beezee.app', // or customer ID
    plan: 'PLN_test_plan_code' // You'll need a real plan code from your dashboard
  };

  console.log('📤 Testing subscription initialization...');
  console.log('   Request Body:', JSON.stringify(subscriptionData, null, 2));
  console.log('');
  console.log('⚠️  Note: This requires an existing plan code.');
  console.log('   You may need to create a plan in your dashboard first.\n');

  // Try different endpoint variations
  const endpointVariations = [
    { url: `${KYSHI_BASE_URL}/v1/subscription/initialize`, key: KYSHI_SECRET_KEY, name: '/v1/subscription/initialize (secret)', data: subscriptionData },
    { url: `${KYSHI_BASE_URL}/v1/plans`, key: KYSHI_SECRET_KEY, name: '/v1/plans (create plan)', data: {
      name: 'Beezee Weekly Plan',
      description: 'Weekly subscription for Kenya',
      interval: 'weekly',
      amount: 500,
      localCurrency: 'KES'
    }},
  ];

  console.log('🔍 Testing endpoint variations...\n');

  for (const { url, key, name, data } of endpointVariations) {
    console.log(`   Testing: ${name}`);
    console.log(`   URL: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key || ''
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      
      console.log(`   Status: ${response.status}`);
      
      if (response.status !== 404) {
        console.log(`   ✅ Found working endpoint!\n`);
        console.log('📥 Response:', JSON.stringify(responseData, null, 2));
        console.log('');
        
        if (response.ok && responseData.status === true) {
          console.log('✅ SUCCESS! Subscription initialized\n');
          console.log('📊 Details:');
          console.log(`   Code: ${responseData.data?.code || 'N/A'}`);
          console.log(`   ID: ${responseData.data?.id || 'N/A'}`);
          console.log(`   Authorization URL: ${responseData.data?.authorizationUrl || 'N/A'}`);
          console.log('');
          process.exit(0);
        } else {
          console.log('⚠️  Endpoint found but returned error');
          console.log(`   Message: ${responseData.message || 'Unknown'}\n`);
        }
      } else {
        console.log(`   ❌ 404 Not Found\n`);
      }
    } catch (error) {
      console.log(`   ❌ Network error: ${error}\n`);
    }
  }

  console.log('❌ All endpoint variations failed\n');
  console.log('💡 Recommendations:');
  console.log('   1. Contact Kyshi support for correct API endpoints');
  console.log('   2. Check if your account has API access enabled');
  console.log('   3. Verify API keys are active in dashboard');
  console.log('   4. Try creating a plan manually in dashboard first\n');
  
  process.exit(1);
}

testKyshiAPI();
