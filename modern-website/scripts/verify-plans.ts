#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyPlans() {
  console.log('=== Verifying Kyshi Plans in Database ===\n');

  const { data: plans, error } = await supabase
    .from('kyshi_plans')
    .select('*')
    .order('country_code');

  if (error) {
    console.error('Error fetching plans:', error);
    return;
  }

  console.log(`Found ${plans?.length || 0} plans in database:\n`);

  plans?.forEach(plan => {
    const isActive = plan.is_active ? '✅ ACTIVE' : '❌ INACTIVE';
    console.log(`${plan.country_code}: ${plan.name}`);
    console.log(`  Amount: ${plan.amount} ${plan.currency}`);
    console.log(`  Kyshi Code: ${plan.kyshi_plan_code}`);
    console.log(`  Status: ${isActive}`);
    console.log(`  Interval: ${plan.interval}`);
    console.log('');
  });

  // Highlight the Kenya plan specifically
  const kenyaPlan = plans?.find(p => p.country_code === 'KE' && p.is_active);
  if (kenyaPlan) {
    console.log('=== ✅ Kenya Plan Ready for Testing ===');
    console.log(`Plan: ${kenyaPlan.name}`);
    console.log(`Amount: ${kenyaPlan.amount} ${kenyaPlan.currency} (CORRECT - not 20,000)`);
    console.log(`Code: ${kenyaPlan.kyshi_plan_code}`);
    console.log(`\nYou can now test at: http://localhost:3000/test/kyshi`);
  } else {
    console.log('⚠️ No active Kenya plan found');
  }
}

verifyPlans().catch(console.error);
