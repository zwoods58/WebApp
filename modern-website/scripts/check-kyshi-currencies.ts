#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

async function checkSupportedCurrencies() {
  console.log('🔍 Checking Kyshi supported currencies...\n');

  const endpoints = [
    '/regions',
    '/currencies',
    '/countries'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Trying ${endpoint}...`);
      const url = `${KYSHI_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': KYSHI_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        console.log('Error:', errorText);
      }
    } catch (error) {
      console.log('Failed:', error);
    }
  }

  // Try creating a test plan with different currencies
  console.log('\n\n🧪 Testing plan creation with different currencies...\n');
  
  const testCurrencies = ['NGN', 'GHS', 'ZAR', 'XOF', 'KES'];
  
  for (const currency of testCurrencies) {
    try {
      console.log(`\nTesting ${currency}...`);
      const url = `${KYSHI_BASE_URL}/plans`;
      
      const planData = {
        name: `Test ${currency} Plan`,
        description: `Test plan for ${currency}`,
        interval: 'weekly',
        amount: 100,
        localCurrency: currency
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': KYSHI_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData)
      });

      console.log(`Status: ${response.status}`);
      const responseText = await response.text();
      
      if (response.ok) {
        console.log(`✅ ${currency} is supported!`);
        const data = JSON.parse(responseText);
        console.log(`Created plan code: ${data.data?.code}`);
      } else {
        console.log(`❌ ${currency} failed`);
        console.log('Error:', responseText);
      }
    } catch (error) {
      console.log(`❌ ${currency} error:`, error);
    }
  }
}

checkSupportedCurrencies();
