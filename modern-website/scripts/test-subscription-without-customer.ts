#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';
const KENYA_PLAN_CODE = 'PLN_7fgRaAQBesq9iLu';

async function testDirectSubscription() {
  console.log('🧪 Testing Direct Subscription Creation (without customer creation)\n');

  const testEmail = `test-${Date.now()}@beezee.test`;

  console.log('Attempting to create subscription with just email and plan code...');
  console.log(`Email: ${testEmail}`);
  console.log(`Plan: ${KENYA_PLAN_CODE}\n`);

  try {
    const response = await fetch(`${KYSHI_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: testEmail,
        planCode: KENYA_PLAN_CODE
      })
    });

    console.log(`Status: ${response.status}`);
    const responseText = await response.text();

    if (response.ok) {
      console.log('✅ SUCCESS! Subscription created without pre-creating customer!');
      const data = JSON.parse(responseText);
      console.log('\nResponse:', JSON.stringify(data, null, 2));
      console.log('\n💡 This means we can skip customer creation entirely!');
    } else {
      console.log('❌ Failed');
      console.log('Error:', responseText);
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

testDirectSubscription();
