#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

const PLAN_CODE = 'PLN_7fgRaAQBesq9iLu'; // Kenya plan

async function verifyPlanAmount() {
  console.log('🔍 Checking plan amount in Kyshi...\n');

  try {
    const response = await fetch(`${KYSHI_BASE_URL}/plans/${PLAN_CODE}`, {
      method: 'GET',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Plan Details:');
      console.log(`Name: ${data.data.name}`);
      console.log(`Amount (raw): ${data.data.amount}`);
      console.log(`Amount (in major units): ${data.data.amount / 100}`);
      console.log(`Currency: ${data.data.localCurrency || 'Not specified'}`);
      console.log(`Interval: ${data.data.interval}`);
      console.log(`Code: ${data.data.code}`);
      console.log(`Is Active: ${data.data.isActive}`);
      
      console.log('\n💡 Analysis:');
      if (data.data.amount === 20000) {
        console.log('✅ Amount is correct: 20000 cents = 200 KES');
      } else if (data.data.amount === 500) {
        console.log('❌ Amount is WRONG: 500 cents = 5 KES (should be 20000)');
      } else {
        console.log(`⚠️  Amount is ${data.data.amount} cents = ${data.data.amount / 100} KES`);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to fetch plan');
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

verifyPlanAmount();
