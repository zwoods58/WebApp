#!/usr/bin/env ts-node

/**
 * Final Currency Test - Verify API key and test one critical variation
 */

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_API_URL = 'https://api.kyshi.co/v1';

async function finalTest() {
  console.log('🔍 Final Currency Test\n');
  console.log('═'.repeat(70));

  // Step 1: Verify API key works by listing plans
  console.log('\n1️⃣ Verifying API Key (GET /plans)...');
  try {
    const response = await fetch(`${KYSHI_API_URL}/plans`, {
      headers: { 'x-api-key': KYSHI_SECRET_KEY },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ API Key Valid (${response.status})`);
      console.log(`   Found ${data.data?.data?.length || 0} existing plans`);
    } else {
      console.log(`   ❌ API Key Failed (${response.status})`);
      const data = await response.json();
      console.log(`   Error:`, data);
      return;
    }
  } catch (err) {
    console.log(`   🔥 Exception:`, err);
    return;
  }

  // Step 2: Test if we can create another Kenya plan (should work)
  console.log('\n2️⃣ Testing Kenya (KES) - Should Work...');
  try {
    const response = await fetch(`${KYSHI_API_URL}/plans`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Kenya Plan',
        description: 'Verification test',
        interval: 'weekly',
        amount: 100,
        localCurrency: 'KES',
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`   ✅ Kenya Works! Plan: ${data.data.code}`);
    } else {
      console.log(`   ❌ Kenya Failed (${response.status}):`, data.message);
    }
  } catch (err) {
    console.log(`   🔥 Exception:`, err);
  }

  // Step 3: Test Nigeria with sendInvoices/sendSms explicitly set
  console.log('\n3️⃣ Testing Nigeria (NGN) with explicit boolean fields...');
  try {
    const response = await fetch(`${KYSHI_API_URL}/plans`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Beezee Weekly Nigeria',
        description: 'Weekly subscription for Beezee - Nigeria',
        interval: 'weekly',
        amount: 500,
        localCurrency: 'NGN',
        sendInvoices: false,
        sendSms: false,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`   ✅ NIGERIA WORKS! Plan: ${data.data.code}`);
      console.log(`   🎉 Success! NGN is supported.`);
    } else {
      console.log(`   ❌ Nigeria Failed (${response.status}):`, data.message);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log(`   🔥 Exception:`, err);
  }

  // Step 4: Check if there's a specific error message
  console.log('\n4️⃣ Testing with minimal payload (NGN)...');
  try {
    const response = await fetch(`${KYSHI_API_URL}/plans`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Nigeria Minimal',
        interval: 'weekly',
        amount: 100,
        localCurrency: 'NGN',
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`   ✅ Minimal payload works! Plan: ${data.data.code}`);
    } else {
      console.log(`   ❌ Minimal Failed (${response.status})`);
      console.log(`   Full response:`, JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log(`   🔥 Exception:`, err);
  }

  console.log('\n' + '═'.repeat(70));
  console.log('\n📊 CONCLUSION\n');
  console.log('If Kenya works but NGN/GHS/XOF all fail with 422:');
  console.log('→ Your API key is valid');
  console.log('→ Your request format is correct');
  console.log('→ Your test account is limited to KES only');
  console.log('\n📧 Next step: Contact Kyshi support to enable multi-currency');
}

finalTest().catch(console.error);
