#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = 'https://api.kyshi.co/v1';
const NEW_PLAN_CODE = 'PLN_VDMjfGKQKEAhqgL';

async function testNewPlanSubscription() {
  console.log('🧪 Creating subscription with NEW plan code...\n');
  
  const testEmail = 'real.test@example.com'; // Use a more realistic email
  
  console.log(`Email: ${testEmail}`);
  console.log(`Plan Code: ${NEW_PLAN_CODE}\n`);

  try {
    const response = await fetch(`${KYSHI_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: testEmail,
        planCode: NEW_PLAN_CODE
      })
    });

    console.log(`Status: ${response.status}\n`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Subscription created!\n');
      console.log('Subscription Details:');
      console.log(`ID: ${data.data.id}`);
      console.log(`Code: ${data.data.code}`);
      console.log(`Authorization URL: ${data.data.authorizationUrl}`);
      
      console.log('\nPlan in Response:');
      console.log(`Plan Name: ${data.data.plan?.name}`);
      console.log(`Plan Amount: ${data.data.plan?.amount} cents = ${data.data.plan?.amount / 100} KES`);
      console.log(`Plan Code: ${data.data.plan?.code}`);
      
      if (data.data.authorizationUrl) {
        console.log('\n🔗 Check the authorization URL:');
        console.log(data.data.authorizationUrl);
        console.log('\nOpen this URL in a browser to see if it shows 200 KES');
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

testNewPlanSubscription();
