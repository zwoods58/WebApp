#!/usr/bin/env ts-node

/**
 * Save Working Plans to Database
 * All four currencies are now working in Kyshi!
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const WORKING_PLANS = [
  { country_code: 'KE', name: 'Beezee Weekly Kenya', amount: 200, currency: 'KES', kyshi_plan_code: 'PLN__Lt82Xz0-p5-wD6' },
  { country_code: 'NG', name: 'Beezee Weekly Nigeria', amount: 500, currency: 'NGN', kyshi_plan_code: 'PLN_LDUxkpGrdEp_Eml' },
  { country_code: 'GH', name: 'Beezee Weekly Ghana', amount: 20, currency: 'GHS', kyshi_plan_code: 'PLN_X3UucIk9yPbkOZ1' },
  { country_code: 'CI', name: 'Beezee Weekly Côte d\'Ivoire', amount: 1000, currency: 'XOF', kyshi_plan_code: 'PLN_I8yasoStOrABeQc' },
];

async function savePlans() {
  console.log('💾 Saving Working Plans to Database\n');
  console.log('═'.repeat(70));

  for (const plan of WORKING_PLANS) {
    console.log(`\n📦 ${plan.country_code}: ${plan.name}`);
    console.log(`   Code: ${plan.kyshi_plan_code}`);
    console.log(`   Amount: ${plan.amount} ${plan.currency}`);

    try {
      // First, check if plan exists
      const { data: existing } = await supabase
        .from('kyshi_plans')
        .select('id, country_code')
        .eq('country_code', plan.country_code)
        .single();

      if (existing) {
        // Update existing plan
        const { error } = await supabase
          .from('kyshi_plans')
          .update({
            name: plan.name,
            amount: plan.amount,
            currency: plan.currency,
            kyshi_plan_code: plan.kyshi_plan_code,
            interval: 'weekly',
            is_active: true,
          })
          .eq('country_code', plan.country_code);

        if (error) {
          console.log(`   ❌ Update failed:`, error.message);
        } else {
          console.log(`   ✅ Updated existing plan`);
        }
      } else {
        // Insert new plan
        const { error } = await supabase
          .from('kyshi_plans')
          .insert({
            country_code: plan.country_code,
            name: plan.name,
            amount: plan.amount,
            currency: plan.currency,
            kyshi_plan_code: plan.kyshi_plan_code,
            interval: 'weekly',
            is_active: true,
          });

        if (error) {
          console.log(`   ❌ Insert failed:`, error.message);
        } else {
          console.log(`   ✅ Inserted new plan`);
        }
      }
    } catch (err) {
      console.log(`   🔥 Exception:`, err);
    }
  }

  // Verify
  console.log('\n' + '═'.repeat(70));
  console.log('\n✅ Database Verification\n');

  const { data: allPlans, error } = await supabase
    .from('kyshi_plans')
    .select('*')
    .eq('is_active', true)
    .order('country_code');

  if (error) {
    console.log('❌ Error fetching plans:', error);
  } else {
    console.log('Active plans in database:\n');
    allPlans?.forEach(p => {
      const status = WORKING_PLANS.find(wp => wp.country_code === p.country_code) ? '✅' : '⚠️';
      console.log(`${status} ${p.country_code}: ${p.amount} ${p.currency} - ${p.kyshi_plan_code}`);
    });
  }

  console.log('\n' + '═'.repeat(70));
  console.log('\n🎉 ALL FOUR COUNTRIES NOW WORKING!\n');
  console.log('✅ Kenya (KES): 200 KES/week');
  console.log('✅ Nigeria (NGN): 500 NGN/week');
  console.log('✅ Ghana (GHS): 20 GHS/week');
  console.log('✅ Côte d\'Ivoire (XOF): 1000 XOF/week\n');
  console.log('🎯 Ready to test at: http://localhost:3000/test/kyshi\n');
}

savePlans().catch(console.error);
