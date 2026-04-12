#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

// Test different payload formats to see if any work for non-KES currencies
async function testPlanCreation() {
  console.log('🧪 Testing different plan creation methods for NGN...\n');

  const testCases = [
    {
      name: 'Standard format',
      payload: {
        name: 'Test NGN Plan 1',
        description: 'Test plan for Nigeria',
        interval: 'weekly',
        amount: 500,
        localCurrency: 'NGN'
      }
    },
    {
      name: 'With currency field',
      payload: {
        name: 'Test NGN Plan 2',
        description: 'Test plan for Nigeria',
        interval: 'weekly',
        amount: 500,
        currency: 'NGN',
        localCurrency: 'NGN'
      }
    },
    {
      name: 'With region code',
      payload: {
        name: 'Test NGN Plan 3',
        description: 'Test plan for Nigeria',
        interval: 'weekly',
        amount: 500,
        localCurrency: 'NGN',
        region: 'NG'
      }
    },
    {
      name: 'With country code',
      payload: {
        name: 'Test NGN Plan 4',
        description: 'Test plan for Nigeria',
        interval: 'weekly',
        amount: 500,
        localCurrency: 'NGN',
        countryCode: 'NG'
      }
    },
    {
      name: 'Amount as string',
      payload: {
        name: 'Test NGN Plan 5',
        description: 'Test plan for Nigeria',
        interval: 'weekly',
        amount: '500',
        localCurrency: 'NGN'
      }
    },
    {
      name: 'With integration field',
      payload: {
        name: 'Test NGN Plan 6',
        description: 'Test plan for Nigeria',
        interval: 'weekly',
        amount: 500,
        localCurrency: 'NGN',
        integration: 'default'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.name}`);
    console.log('Payload:', JSON.stringify(testCase.payload, null, 2));
    
    try {
      const response = await fetch(`${KYSHI_BASE_URL}/plans`, {
        method: 'POST',
        headers: {
          'x-api-key': KYSHI_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload)
      });

      console.log(`Status: ${response.status}`);
      const responseText = await response.text();
      
      if (response.ok) {
        console.log('✅ SUCCESS!');
        const data = JSON.parse(responseText);
        console.log('Response:', JSON.stringify(data, null, 2));
        console.log('\n🎉 Found working method! Use this format.');
        break;
      } else {
        console.log('❌ Failed');
        try {
          const errorData = JSON.parse(responseText);
          console.log('Error:', errorData);
        } catch {
          console.log('Error:', responseText);
        }
      }
    } catch (error) {
      console.log('❌ Error:', error);
    }
  }

  // Also test if we can get integration/account info
  console.log('\n\n🔍 Checking account/integration endpoints...\n');
  
  const infoEndpoints = [
    '/account',
    '/integration',
    '/integrations',
    '/me',
    '/profile',
    '/settings'
  ];

  for (const endpoint of infoEndpoints) {
    try {
      const response = await fetch(`${KYSHI_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'x-api-key': KYSHI_SECRET_KEY,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log(`✅ ${endpoint} - ${response.status}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(`❌ ${endpoint} - ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error`);
    }
  }
}

testPlanCreation();
