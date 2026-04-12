#!/usr/bin/env ts-node

/**
 * Seed Kyshi Plans - Supported Countries Only
 * 
 * Based on Kyshi documentation: https://docs.kyshi.co/docs/getting-started
 * Supported currencies: KES, NGN, GHS, XOF
 * NOT supported: ZAR (South Africa)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Only countries supported by Kyshi (based on official documentation)
const SUPPORTED_PLANS = [
  { country: 'KE', name: 'Beezee Weekly Kenya', amount: 200, currency: 'KES' },
  { country: 'NG', name: 'Beezee Weekly Nigeria', amount: 500, currency: 'NGN' },
  { country: 'GH', name: 'Beezee Weekly Ghana', amount: 20, currency: 'GHS' },
  { country: 'CI', name: 'Beezee Weekly Côte d\'Ivoire', amount: 1000, currency: 'XOF' },
];

async function createPlans() {
  console.log('🚀 Creating Kyshi Plans for Supported Countries');
  console.log('📖 Based on: https://docs.kyshi.co/docs/getting-started');
  console.log('✅ Supported: KES, NGN, GHS, XOF');
  console.log('❌ Not supported: ZAR (South Africa)\n');
  console.log('═'.repeat(60));

  const results = {
    success: 0,
    failed: 0,
    details: [] as string[]
  };

  for (const plan of SUPPORTED_PLANS) {
    console.log(`\n📦 Processing ${plan.country}: ${plan.name}`);
    console.log(`   Amount: ${plan.amount} ${plan.currency} (major units)`);

    try {
      // Create plan in Kyshi
      const response = await fetch('https://api.kyshi.co/v1/plans', {
        method: 'POST',
        headers: {
          'x-api-key': KYSHI_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: plan.name,
          description: `Weekly subscription for Beezee - ${plan.country}`,
          interval: 'weekly',
          amount: plan.amount,
          localCurrency: plan.currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`   ❌ Kyshi API Error (${response.status}):`, JSON.stringify(data, null, 2));
        results.failed++;
        results.details.push(`${plan.country}: Failed - ${data.message || 'Unknown error'}`);
        continue;
      }

      const kyshiPlanCode = data.data.code;
      console.log(`   ✅ Created in Kyshi: ${kyshiPlanCode}`);

      // Save to Supabase
      const { error } = await supabase
        .from('kyshi_plans')
        .upsert({
          country_code: plan.country,
          name: plan.name,
          amount: plan.amount,
          currency: plan.currency,
          interval: 'weekly',
          kyshi_plan_code: kyshiPlanCode,
          is_active: true,
        }, {
          onConflict: 'country_code',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(`   ❌ Supabase Error:`, error.message);
        results.failed++;
        results.details.push(`${plan.country}: Created in Kyshi but failed to save to DB`);
      } else {
        console.log(`   💾 Saved to Supabase`);
        results.success++;
        results.details.push(`${plan.country}: ✅ Success - ${kyshiPlanCode}`);
      }

    } catch (err) {
      console.error(`   🔥 Unexpected Error:`, err);
      results.failed++;
      results.details.push(`${plan.country}: Exception - ${err}`);
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 FINAL SUMMARY\n');
  console.log(`✅ Successfully created: ${results.success}/${SUPPORTED_PLANS.length}`);
  console.log(`❌ Failed: ${results.failed}/${SUPPORTED_PLANS.length}\n`);

  console.log('Details:');
  results.details.forEach(detail => console.log(`  ${detail}`));

  // Verify in database
  console.log('\n' + '═'.repeat(60));
  console.log('\n💾 Database Verification\n');

  const { data: dbPlans, error: dbError } = await supabase
    .from('kyshi_plans')
    .select('*')
    .in('country_code', ['KE', 'NG', 'GH', 'CI'])
    .eq('is_active', true)
    .order('country_code');

  if (dbError) {
    console.error('❌ Database query error:', dbError);
  } else {
    console.log('Active plans in database:');
    dbPlans?.forEach(p => {
      console.log(`  ${p.country_code}: ${p.amount} ${p.currency} - ${p.kyshi_plan_code}`);
    });
  }

  // Note about South Africa
  console.log('\n' + '═'.repeat(60));
  console.log('\n⚠️  IMPORTANT: South Africa (ZAR) Not Supported');
  console.log('   Kyshi does not support ZAR currency.');
  console.log('   South Africa has been excluded from subscription plans.');
  console.log('   Contact Kyshi support if ZAR support is needed.\n');

  if (results.success === SUPPORTED_PLANS.length) {
    console.log('✅ All supported countries configured successfully!');
    console.log('🎯 Ready to test at: http://localhost:3000/test/kyshi\n');
  } else {
    console.log('⚠️  Some plans failed. Review errors above.\n');
  }
}

createPlans().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
