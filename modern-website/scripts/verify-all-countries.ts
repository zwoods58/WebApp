#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyAllCountries() {
  console.log('🌍 Verifying All Country Plans\n');

  const { data: plans, error } = await supabase
    .from('kyshi_plans')
    .select('*')
    .eq('is_active', true)
    .order('country_code');

  if (error || !plans) {
    console.error('❌ Failed to fetch plans:', error);
    return;
  }

  const results = [];

  for (const plan of plans) {
    if (plan.country_code === 'TEST') continue; // Skip test plan

    console.log(`\n📍 ${plan.country_code}: ${plan.name}`);
    console.log(`   Database: ${plan.amount} ${plan.currency}`);
    console.log(`   Code: ${plan.kyshi_plan_code}`);

    // Check if this looks like a real Kyshi plan code
    const isRealKyshiCode = plan.kyshi_plan_code.startsWith('PLN_');
    
    if (!isRealKyshiCode) {
      console.log(`   ⚠️  PLACEHOLDER CODE - Not a real Kyshi plan`);
      results.push({
        country: plan.country_code,
        status: 'placeholder',
        code: plan.kyshi_plan_code,
        amount: plan.amount,
        currency: plan.currency
      });
      continue;
    }

    // Verify with Kyshi API
    try {
      const response = await fetch(`https://api.kyshi.co/v1/plans/${plan.kyshi_plan_code}`, {
        headers: { 'x-api-key': KYSHI_SECRET_KEY },
      });

      if (!response.ok) {
        console.log(`   ❌ NOT FOUND in Kyshi (${response.status})`);
        results.push({
          country: plan.country_code,
          status: 'not_found',
          code: plan.kyshi_plan_code,
          amount: plan.amount,
          currency: plan.currency
        });
        continue;
      }

      const data = await response.json();
      const kyshiAmount = data.data.amount;
      
      if (kyshiAmount === plan.amount) {
        console.log(`   ✅ VERIFIED in Kyshi (${kyshiAmount} ${plan.currency})`);
        results.push({
          country: plan.country_code,
          status: 'verified',
          code: plan.kyshi_plan_code,
          amount: plan.amount,
          currency: plan.currency
        });
      } else {
        console.log(`   ⚠️  AMOUNT MISMATCH: DB=${plan.amount}, Kyshi=${kyshiAmount}`);
        results.push({
          country: plan.country_code,
          status: 'mismatch',
          code: plan.kyshi_plan_code,
          dbAmount: plan.amount,
          kyshiAmount: kyshiAmount,
          currency: plan.currency
        });
      }
    } catch (err) {
      console.log(`   ❌ ERROR checking Kyshi:`, err);
      results.push({
        country: plan.country_code,
        status: 'error',
        code: plan.kyshi_plan_code,
        amount: plan.amount,
        currency: plan.currency
      });
    }
  }

  // Summary
  console.log('\n\n📊 SUMMARY\n');
  console.log('═'.repeat(60));
  
  const verified = results.filter(r => r.status === 'verified');
  const placeholder = results.filter(r => r.status === 'placeholder');
  const notFound = results.filter(r => r.status === 'not_found');
  const mismatch = results.filter(r => r.status === 'mismatch');
  const errors = results.filter(r => r.status === 'error');

  console.log(`✅ Verified in Kyshi: ${verified.length}`);
  verified.forEach(r => console.log(`   - ${r.country}: ${r.amount} ${r.currency}`));

  if (placeholder.length > 0) {
    console.log(`\n⚠️  Placeholder codes (need creation): ${placeholder.length}`);
    placeholder.forEach(r => console.log(`   - ${r.country}: ${r.code} (${r.amount} ${r.currency})`));
  }

  if (notFound.length > 0) {
    console.log(`\n❌ Not found in Kyshi: ${notFound.length}`);
    notFound.forEach(r => console.log(`   - ${r.country}: ${r.code}`));
  }

  if (mismatch.length > 0) {
    console.log(`\n⚠️  Amount mismatches: ${mismatch.length}`);
    mismatch.forEach(r => console.log(`   - ${r.country}: DB=${r.dbAmount}, Kyshi=${r.kyshiAmount}`));
  }

  if (errors.length > 0) {
    console.log(`\n❌ Errors: ${errors.length}`);
    errors.forEach(r => console.log(`   - ${r.country}`));
  }

  console.log('\n' + '═'.repeat(60));
  
  if (placeholder.length > 0 || notFound.length > 0) {
    console.log('\n⚠️  ACTION REQUIRED:');
    console.log('Some countries need plans created in Kyshi.');
    console.log('Run: npx ts-node scripts/seed-beezee-plans.ts');
  } else if (verified.length === results.length) {
    console.log('\n✅ ALL COUNTRIES VERIFIED!');
  }
}

verifyAllCountries().catch(console.error);
