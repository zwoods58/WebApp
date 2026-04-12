#!/usr/bin/env ts-node

/**
 * Test Plan Loading - Verify test page will load correct plans
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use anon key like the test page does
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPlanLoading() {
  console.log('🧪 Testing Plan Loading (Same as Test Page)\n');
  console.log('═'.repeat(70));

  // This is the exact query the test page uses
  const { data, error } = await supabase
    .from('kyshi_plans')
    .select('*')
    .eq('is_active', true)
    .order('country_code');

  if (error) {
    console.error('❌ Error loading plans:', error);
    return;
  }

  console.log(`\n✅ Found ${data?.length || 0} active plans\n`);

  const supportedCountries = ['KE', 'NG', 'GH', 'CI'];
  
  data?.forEach(plan => {
    const isSupported = supportedCountries.includes(plan.country_code);
    const icon = isSupported ? '✅' : '⚠️';
    
    console.log(`${icon} ${plan.country_code}: ${plan.name}`);
    console.log(`   Amount: ${plan.amount} ${plan.currency}/week`);
    console.log(`   Plan Code: ${plan.kyshi_plan_code}`);
    console.log(`   ID: ${plan.id}`);
    console.log('');
  });

  // Show what will appear in dropdowns
  console.log('═'.repeat(70));
  console.log('\n📋 Test Page Dropdowns Preview\n');

  const countries = [
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'CI', name: 'Côte d\'Ivoire', currency: 'XOF' },
  ];

  countries.forEach(country => {
    const countryPlans = data?.filter(p => p.country_code === country.code) || [];
    console.log(`${country.name} (${country.currency}):`);
    
    if (countryPlans.length === 0) {
      console.log('   ⚠️  No plans available');
    } else {
      countryPlans.forEach(plan => {
        console.log(`   ✅ ${plan.name} – ${plan.amount} ${plan.currency}/week`);
      });
    }
    console.log('');
  });

  console.log('═'.repeat(70));
  console.log('\n🎯 Next Steps:\n');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Open: http://localhost:3000/test/kyshi');
  console.log('3. Select a country from dropdown');
  console.log('4. Verify plan shows correct amount');
  console.log('5. Create subscription and test!\n');
}

testPlanLoading().catch(console.error);
