#!/usr/bin/env ts-node

/**
 * Kyshi Workaround Plans Creator
 * 
 * This script creates subscription plans with multiplied amounts to fix 
 * the Paystack display issue where wrong amounts are shown to customers.
 * 
 * Problem: Kyshi sends correct amounts to Paystack, but Paystack shows
 * wrong amounts on the payment page.
 * 
 * Solution: Send multiplied amounts to Kyshi so Paystack displays the
 * correct real amount to customers.
 * 
 * Country | Real Amount | Paystack Shows | Ratio | Kyshi Amount
 * --------|-------------|----------------|-------|-------------
 * Kenya   | 200 KES     | 5 KES          | 40×   | 8,000 KES
 * Ghana   | 20 GHS      | 5 GHS          | 4×    | 80 GHS
 * Nigeria | 500 NGN     | 100 NGN        | 5×    | 2,500 NGN
 * Côte d'Ivoire | 1,000 XOF | 5 XOF   | 200×  | 200,000 XOF
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configuration
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables
if (!KYSHI_SECRET_KEY) {
  console.error('ERROR: KYSHI_SECRET_KEY environment variable is required');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are required');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Workaround plans configuration with multiplied amounts
const workaroundPlans = [
  {
    country: 'KE',
    name: 'Beezee Weekly Kenya (Workaround)',
    description: 'Weekly subscription for Beezee - Kenya (Paystack display workaround)',
    realAmount: 200,
    realCurrency: 'KES',
    kyshiAmount: 8000,  // 200 × 40
    currency: 'KES',
    ratio: 40,
    interval: 'weekly',
  },
  {
    country: 'GH',
    name: 'Beezee Weekly Ghana (Workaround)',
    description: 'Weekly subscription for Beezee - Ghana (Paystack display workaround)',
    realAmount: 20,
    realCurrency: 'GHS',
    kyshiAmount: 80,    // 20 × 4
    currency: 'GHS',
    ratio: 4,
    interval: 'weekly',
  },
  {
    country: 'NG',
    name: 'Beezee Weekly Nigeria (Workaround)',
    description: 'Weekly subscription for Beezee - Nigeria (Paystack display workaround)',
    realAmount: 500,
    realCurrency: 'NGN',
    kyshiAmount: 2500,  // 500 × 5
    currency: 'NGN',
    ratio: 5,
    interval: 'weekly',
  },
  {
    country: 'CI',
    name: 'Beezee Weekly Côte d\'Ivoire (Workaround)',
    description: 'Weekly subscription for Beezee - Côte d\'Ivoire (Paystack display workaround)',
    realAmount: 1000,
    realCurrency: 'XOF',
    kyshiAmount: 200000, // 1000 × 200
    currency: 'XOF',
    ratio: 200,
    interval: 'weekly',
  },
];

/**
 * Create a plan in Kyshi API
 */
async function createKyshiPlan(plan: typeof workaroundPlans[0]) {
  console.log(`\n=== Creating ${plan.country} plan in Kyshi ===`);
  console.log(`Plan: ${plan.name}`);
  console.log(`Real amount: ${plan.realAmount} ${plan.realCurrency}`);
  console.log(`Kyshi amount: ${plan.kyshiAmount} ${plan.currency} (${plan.ratio}x multiplier)`);
  
  try {
    const response = await fetch('https://api.kyshi.co/v1/plans', {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: plan.name,
        description: plan.description,
        interval: plan.interval,
        amount: plan.kyshiAmount,  // Send multiplied amount
        localCurrency: plan.currency,
        sendInvoices: false,
        sendSms: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`\n=== KYSHI API ERROR for ${plan.country} ===`);
      console.error(`Status: ${response.status} ${response.statusText}`);
      console.error('Response:', JSON.stringify(data, null, 2));
      throw new Error(`Kyshi API error: ${data.message || response.statusText}`);
    }

    const kyshiPlanCode = data.data?.code;
    
    if (!kyshiPlanCode) {
      console.error(`\n=== INVALID RESPONSE for ${plan.country} ===`);
      console.error('Missing plan code in response:', JSON.stringify(data, null, 2));
      throw new Error('Missing plan code in Kyshi response');
    }

    console.log(`\n=== SUCCESS for ${plan.country} ===`);
    console.log(`Kyshi Plan Code: ${kyshiPlanCode}`);
    console.log(`Plan created with multiplied amount: ${plan.kyshiAmount} ${plan.currency}`);
    
    return kyshiPlanCode;

  } catch (error) {
    console.error(`\n=== FAILED for ${plan.country} ===`);
    console.error('Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Save plan to Supabase database
 */
async function savePlanToDatabase(plan: typeof workaroundPlans[0], kyshiPlanCode: string) {
  console.log(`\n=== Saving ${plan.country} plan to database ===`);
  
  try {
    const { data, error } = await supabase
      .from('kyshi_plans')
      .upsert({
        country_code: plan.country,
        name: plan.name,
        description: plan.description,
        amount: plan.kyshiAmount,        // Store Kyshi amount in amount field
        currency: plan.currency,
        interval: plan.interval,
        kyshi_plan_code: kyshiPlanCode,
        is_active: true,
        real_amount: plan.realAmount,    // Real amount for display
        real_currency: plan.realCurrency,
        kyshi_amount: plan.kyshiAmount,
        conversion_ratio: plan.ratio,
      }, {
        onConflict: 'kyshi_plan_code',
      })
      .select()
      .single();

    if (error) {
      console.error(`Database error for ${plan.country}:`, error);
      throw error;
    }

    console.log(`\n=== DATABASE SUCCESS for ${plan.country} ===`);
    console.log(`Plan ID: ${data.id}`);
    console.log(`Stored real amount: ${plan.realAmount} ${plan.realCurrency}`);
    console.log(`Stored Kyshi amount: ${plan.kyshiAmount} ${plan.currency}`);
    console.log(`Conversion ratio: ${plan.ratio}x`);
    
    return data;

  } catch (error) {
    console.error(`\n=== DATABASE FAILED for ${plan.country} ===`);
    console.error('Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Main function to create all workaround plans
 */
async function createWorkaroundPlans() {
  console.log('='.repeat(80));
  console.log('KYSHI WORKAROUND PLANS CREATOR');
  console.log('='.repeat(80));
  console.log('\nThis script creates plans with multiplied amounts to fix Paystack display issue.\n');
  
  console.log('WORKAROUND SUMMARY:');
  console.log('- Kenya: 200 KES (real) -> 8,000 KES (Kyshi) - 40x multiplier');
  console.log('- Ghana: 20 GHS (real) -> 80 GHS (Kyshi) - 4x multiplier');
  console.log('- Nigeria: 500 NGN (real) -> 2,500 NGN (Kyshi) - 5x multiplier');
  console.log('- Côte d\'Ivoire: 1,000 XOF (real) -> 200,000 XOF (Kyshi) - 200x multiplier');
  console.log('\nCustomers will see the real amounts, but Kyshi receives multiplied amounts.\n');

  const results: {
    country: string;
    success: boolean;
    kyshiPlanCode?: string;
    planId?: string;
    error?: string;
  }[] = [];

  for (const plan of workaroundPlans) {
    try {
      // Create plan in Kyshi
      const kyshiPlanCode = await createKyshiPlan(plan);
      
      // Save to database
      const dbPlan = await savePlanToDatabase(plan, kyshiPlanCode);
      
      results.push({
        country: plan.country,
        success: true,
        kyshiPlanCode,
        planId: dbPlan.id,
      });
      
      console.log(`\n=== ${plan.country} COMPLETED ===`);
      
    } catch (error) {
      results.push({
        country: plan.country,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      console.log(`\n=== ${plan.country} FAILED ===`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\nSuccessful: ${successful.length}/${results.length}`);
  console.log(`Failed: ${failed.length}/${results.length}\n`);
  
  if (successful.length > 0) {
    console.log('SUCCESSFUL PLANS:');
    successful.forEach(result => {
      console.log(`  ${result.country}: ${result.kyshiPlanCode} (DB: ${result.planId})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\nFAILED PLANS:');
    failed.forEach(result => {
      console.log(`  ${result.country}: ${result.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  
  if (successful.length === results.length) {
    console.log('SUCCESS: All workaround plans created successfully!');
    console.log('\nNEXT STEPS:');
    console.log('1. Test the Kenya plan (KE) - should show 200 KES on Paystack');
    console.log('2. Update webhook handler to convert amounts back');
    console.log('3. Update subscription creation to use real amounts');
    console.log('4. Update test page to display real amounts');
  } else {
    console.log('PARTIAL SUCCESS: Some plans failed. Check errors above.');
    console.log('\nTROUBLESHOOTING:');
    console.log('1. Verify KYSHI_SECRET_KEY is correct');
    console.log('2. Check Kyshi API status');
    console.log('3. Verify Supabase connection');
  }
  
  console.log('='.repeat(80));
  
  return successful.length === results.length;
}

/**
 * Verify database connection
 */
async function verifyDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('kyshi_plans')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('Database connection: OK');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Run the script
 */
async function main() {
  console.log('Starting Kyshi workaround plans creation...\n');
  
  // Verify database connection
  const dbConnected = await verifyDatabaseConnection();
  if (!dbConnected) {
    console.error('Database connection failed. Please check your Supabase credentials.');
    process.exit(1);
  }
  
  // Create plans
  const success = await createWorkaroundPlans();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('\nFATAL ERROR:', error);
    process.exit(1);
  });
}

export { createWorkaroundPlans, workaroundPlans };
