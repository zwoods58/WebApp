#!/usr/bin/env ts-node

/**
 * Check Kyshi Response - Verify Paystack URL format
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkKyshiResponse() {
  console.log('Checking Kyshi Response for Paystack URL\n');
  console.log('='.repeat(70));

  // Get Kenya plan
  const { data: plans } = await supabase
    .from('kyshi_plans')
    .select('*')
    .eq('country_code', 'KE')
    .eq('is_active', true)
    .limit(1);

  if (!plans || plans.length === 0) {
    console.log('No Kenya plan found');
    return;
  }

  const kenyaPlan = plans[0];
  console.log('Plan:', kenyaPlan.name, '-', kenyaPlan.amount, kenyaPlan.currency);

  // Call Kyshi API directly
  const kyshiResponse = await fetch('https://api.kyshi.co/v1/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.KYSHI_SECRET_KEY!,
    },
    body: JSON.stringify({
      customer: 'test.auto@example.com',
      planCode: kenyaPlan.kyshi_plan_code,
    }),
  });

  const data = await kyshiResponse.json();
  
  console.log('\nKyshi API Response:');
  console.log('Status:', kyshiResponse.status);
  console.log('Success:', data.status);
  console.log('Data:', JSON.stringify(data.data, null, 2));

  if (data.data && data.data.authorizationUrl) {
    const url = data.data.authorizationUrl;
    console.log('\nAuthorization URL Analysis:');
    console.log('URL:', url);
    console.log('Domain:', new URL(url).hostname);
    console.log('Protocol:', new URL(url).protocol);
    
    // Check if it's a valid Paystack URL
    if (url.includes('paystack.co')) {
      console.log('  - Valid Paystack URL');
    } else {
      console.log('  - Not a Paystack URL - might be Kyshi hosted page');
    }
  }

  // Check our API response
  console.log('\nOur API Response:');
  const apiResponse = await fetch('http://localhost:3000/api/kyshi/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test.auto2@example.com',
      firstName: 'Auto',
      lastName: 'Test',
      phone: '+254712345678',
      countryCode: 'KE',
      planId: kenyaPlan.id
    }),
  });

  const apiData = await apiResponse.json();
  console.log('Status:', apiResponse.status);
  console.log('Success:', apiData.success);
  console.log('Auth URL:', apiData.authorizationUrl || 'MISSING');

  if (apiData.authorizationUrl) {
    console.log('\nURL Comparison:');
    console.log('Kyshi Direct:', data.data?.authorizationUrl || 'MISSING');
    console.log('Our API:', apiData.authorizationUrl);
    console.log('Match:', data.data?.authorizationUrl === apiData.authorizationUrl ? 'YES' : 'NO');
  }
}

checkKyshiResponse().catch(console.error);
