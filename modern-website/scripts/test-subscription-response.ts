#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';
const KENYA_PLAN_CODE = 'PLN_7fgRaAQBesq9iLu';

async function testSubscriptionResponse() {
  console.log('🧪 Testing Kyshi Subscription Response\n');

  const testEmail = `test-${Date.now()}@beezee.test`;

  console.log('Creating subscription...');
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS!\n');
      console.log('Full Response:');
      console.log(JSON.stringify(data, null, 2));
      
      console.log('\n📋 Key Fields:');
      console.log(`Subscription ID: ${data.data?.id}`);
      console.log(`Subscription Code: ${data.data?.code}`);
      console.log(`Authorization URL: ${data.data?.authorizationUrl || 'NOT PROVIDED'}`);
      console.log(`Access Code: ${data.data?.accessCode || 'NOT PROVIDED'}`);
      console.log(`Reference: ${data.data?.reference || 'NOT PROVIDED'}`);
      console.log(`Is Active: ${data.data?.isActive}`);
      
      if (data.data?.authorizationUrl) {
        console.log('\n🔗 Payment URL Details:');
        const url = new URL(data.data.authorizationUrl);
        console.log(`Domain: ${url.hostname}`);
        console.log(`Full URL: ${data.data.authorizationUrl}`);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Failed');
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

testSubscriptionResponse();
