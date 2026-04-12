#!/usr/bin/env ts-node

/**
 * Quick Test Script - Verify Subscription Flow
 * 
 * This script tests the subscription creation flow without opening a browser.
 * Use this to verify the API is working correctly before manual testing.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function quickTest() {
  console.log('🧪 Quick Subscription Flow Test\n');

  // Step 1: Get Kenya plan
  console.log('1️⃣ Fetching Kenya plan...');
  const { data: kenyaPlan, error: planError } = await supabase
    .from('kyshi_plans')
    .select('*')
    .eq('country_code', 'KE')
    .eq('is_active', true)
    .single();

  if (planError || !kenyaPlan) {
    console.error('❌ Failed to fetch Kenya plan:', planError);
    return;
  }

  console.log(`✅ Found plan: ${kenyaPlan.name}`);
  console.log(`   Amount: ${kenyaPlan.amount} ${kenyaPlan.currency}`);
  console.log(`   Code: ${kenyaPlan.kyshi_plan_code}`);

  if (kenyaPlan.amount !== 200) {
    console.error(`❌ WRONG AMOUNT: Expected 200, got ${kenyaPlan.amount}`);
    return;
  }
  console.log('✅ Amount is correct (200 KES)\n');

  // Step 2: Verify Kyshi API connectivity
  console.log('2️⃣ Testing Kyshi API connectivity...');
  try {
    const response = await fetch(`https://api.kyshi.co/v1/plans/${kenyaPlan.kyshi_plan_code}`, {
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
      },
    });

    if (!response.ok) {
      console.error(`❌ Kyshi API error: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log(`✅ Kyshi API connected`);
    console.log(`   Plan in Kyshi: ${data.data.name}`);
    console.log(`   Amount in Kyshi: ${data.data.amount} (should be 200)`);

    if (data.data.amount !== 200) {
      console.error(`❌ MISMATCH: Kyshi has ${data.data.amount}, expected 200`);
      return;
    }
    console.log('✅ Kyshi plan amount matches database\n');

  } catch (err) {
    console.error('❌ Failed to connect to Kyshi API:', err);
    return;
  }

  // Step 3: Check for existing test subscriptions
  console.log('3️⃣ Checking for existing test subscriptions...');
  const { data: existingSubs } = await supabase
    .from('kyshi_subscriptions')
    .select(`
      *,
      customer:kyshi_customers(email),
      plan:kyshi_plans(name, amount, currency)
    `)
    .eq('plan_id', kenyaPlan.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (existingSubs && existingSubs.length > 0) {
    console.log(`✅ Found ${existingSubs.length} existing subscription(s):`);
    existingSubs.forEach((sub: any, i: number) => {
      console.log(`   ${i + 1}. ${sub.customer.email} - ${sub.status} - ${sub.plan.amount} ${sub.plan.currency}`);
    });
  } else {
    console.log('ℹ️  No existing subscriptions found');
  }
  console.log('');

  // Step 4: Summary
  console.log('📋 Test Summary:');
  console.log('✅ Kenya plan exists in database');
  console.log('✅ Plan amount is correct (200 KES)');
  console.log('✅ Kyshi API is accessible');
  console.log('✅ Plan exists in Kyshi with correct amount');
  console.log('');
  console.log('🎯 Ready for manual testing at: http://localhost:3000/test/kyshi');
  console.log('');
  console.log('Next steps:');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Open test page: http://localhost:3000/test/kyshi');
  console.log('3. Select Kenya, create subscription');
  console.log('4. Verify payment page shows 200 KES (not 20,000)');
}

quickTest().catch(console.error);
