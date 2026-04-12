#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Configuration

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_API_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

// Plan configurations for each country
const COUNTRY_PLANS = [
  {
    country_code: 'KE',
    name: 'Beezee Weekly Kenya',
    amount: 200,
    currency: 'KES',
    description: 'Weekly subscription for Beezee - Kenya',
    interval: 'weekly' as const
  },
  {
    country_code: 'GH',
    name: 'Beezee Weekly Ghana',
    amount: 20,
    currency: 'GHS',
    description: 'Weekly subscription for Beezee - Ghana',
    interval: 'weekly' as const
  },
  {
    country_code: 'NG',
    name: 'Beezee Weekly Nigeria',
    amount: 500,
    currency: 'NGN',
    description: 'Weekly subscription for Beezee - Nigeria',
    interval: 'weekly' as const
  },
  {
    country_code: 'ZA',
    name: 'Beezee Weekly South Africa',
    amount: 30,
    currency: 'ZAR',
    description: 'Weekly subscription for Beezee - South Africa',
    interval: 'weekly' as const
  },
  {
    country_code: 'CI',
    name: 'Beezee Weekly Côte d\'Ivoire',
    amount: 1000,
    currency: 'XOF',
    description: 'Weekly subscription for Beezee - Côte d\'Ivoire',
    interval: 'weekly' as const
  }
];

// Types for Kyshi API responses
interface KyshiPlan {
  id: string;
  name: string;
  description: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually';
  amount: number;
  localCurrency: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KyshiApiResponse<T> {
  status: boolean;
  message: string;
  code: number;
  data: T;
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper function to make Kyshi API calls
async function callKyshiAPI<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any
): Promise<KyshiApiResponse<T>> {
  const url = `${KYSHI_API_URL}${endpoint}`;
  
  console.log(`Making ${method} request to: ${url}`);
  
  const response = await fetch(url, {
    method,
    headers: {
      'x-api-key': KYSHI_SECRET_KEY,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kyshi API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  console.log(`API Response: ${JSON.stringify(result, null, 2)}`);
  return result;
}

// List all plans from Kyshi
async function listKyshiPlans(): Promise<KyshiPlan[]> {
  try {
    const response = await callKyshiAPI<any>('/plans', 'GET');
    // Handle the nested response structure: { data: { data: [...] } }
    return response.data?.data || [];
  } catch (error) {
    console.error('Error listing Kyshi plans:', error);
    return [];
  }
}

// Get specific plan details
async function getKyshiPlan(planIdOrCode: string): Promise<KyshiPlan | null> {
  try {
    const response = await callKyshiAPI<KyshiPlan>(`/plans/${planIdOrCode}`, 'GET');
    return response.data;
  } catch (error) {
    console.error(`Error getting Kyshi plan ${planIdOrCode}:`, error);
    return null;
  }
}

// Create a new plan in Kyshi
async function createKyshiPlan(planData: {
  name: string;
  description: string;
  interval: string;
  amount: number;
  localCurrency: string;
}): Promise<KyshiPlan | null> {
  try {
    console.log('Creating plan with data:', JSON.stringify(planData, null, 2));
    const response = await callKyshiAPI<KyshiPlan>('/plans', 'POST', planData);
    return response.data;
  } catch (error) {
    console.error('Error creating Kyshi plan:', error);
    console.error('Plan data that failed:', JSON.stringify(planData, null, 2));
    return null;
  }
}

// Check if a plan already exists and matches our requirements
async function findMatchingPlan(
  existingPlans: KyshiPlan[],
  targetPlan: typeof COUNTRY_PLANS[0]
): Promise<KyshiPlan | null> {
  // First, try to find exact match by name
  const exactMatch = existingPlans.find(plan => 
    plan.name === targetPlan.name &&
    plan.amount === targetPlan.amount &&
    plan.localCurrency === targetPlan.currency &&
    plan.interval === targetPlan.interval
  );
  
  if (exactMatch) {
    console.log(`Found exact match for ${targetPlan.country_code}: ${exactMatch.name} (${exactMatch.code})`);
    return exactMatch;
  }

  // If no exact match, look for partial matches by name
  const partialMatches = existingPlans.filter(plan => 
    plan.name.toLowerCase().includes(targetPlan.name.toLowerCase()) ||
    plan.name.toLowerCase().includes('beezee') ||
    plan.name.toLowerCase().includes(targetPlan.country_code.toLowerCase())
  );

  if (partialMatches.length > 0) {
    console.log(`Found ${partialMatches.length} partial matches for ${targetPlan.country_code}`);
    
    // Check each partial match for details
    for (const match of partialMatches) {
      const detailedPlan = await getKyshiPlan(match.id);
      if (detailedPlan && 
          detailedPlan.amount === targetPlan.amount &&
          detailedPlan.localCurrency === targetPlan.currency &&
          detailedPlan.interval === targetPlan.interval) {
        console.log(`Found matching partial match for ${targetPlan.country_code}: ${detailedPlan.name} (${detailedPlan.code})`);
        return detailedPlan;
      }
    }
  }

  return null;
}

// Upsert plan into Supabase
async function upsertPlanToSupabase(
  plan: typeof COUNTRY_PLANS[0],
  kyshiPlanCode: string
): Promise<boolean> {
  try {
    // First try to update by country_code, then insert if not exists
    const { data: existing, error: fetchError } = await supabase
      .from('kyshi_plans')
      .select('id')
      .eq('country_code', plan.country_code)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(`Error checking existing plan for ${plan.country_code}:`, fetchError);
      return false;
    }

    if (existing) {
      // Update existing plan
      const { error } = await supabase
        .from('kyshi_plans')
        .update({
          name: plan.name,
          amount: plan.amount,
          currency: plan.currency,
          interval: plan.interval,
          kyshi_plan_code: kyshiPlanCode,
          is_active: true,
        })
        .eq('country_code', plan.country_code);

      if (error) {
        console.error(`Error updating plan for ${plan.country_code}:`, error);
        return false;
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
          interval: plan.interval,
          kyshi_plan_code: kyshiPlanCode,
          is_active: true,
        });

      if (error) {
        console.error(`Error inserting plan for ${plan.country_code}:`, error);
        return false;
      }
    }

    console.log(`Successfully upserted plan for ${plan.country_code} with code ${kyshiPlanCode}`);
    return true;
  } catch (error) {
    console.error(`Error upserting plan for ${plan.country_code}:`, error);
    return false;
  }
}

// Main seeding function
async function seedPlans() {
  console.log('Starting Beezee Kyshi plans seeding...');
  console.log(`API URL: ${KYSHI_API_URL}`);
  
  const results = {
    existing: 0,
    created: 0,
    errors: 0,
    details: [] as string[]
  };

  try {
    // Step 1: List all existing plans from Kyshi
    console.log('\n=== Step 1: Fetching existing plans from Kyshi ===');
    const existingPlans = await listKyshiPlans();
    console.log(`Found ${existingPlans.length} existing plans in Kyshi`);

    // Step 2: Process each country
    console.log('\n=== Step 2: Processing country plans ===');
    
    for (const planConfig of COUNTRY_PLANS) {
      console.log(`\nProcessing ${planConfig.country_code}: ${planConfig.name}`);
      
      try {
        // Step 3: Check if plan already exists
        const matchingPlan = await findMatchingPlan(existingPlans, planConfig);
        
        if (matchingPlan) {
          // Plan exists, use it
          console.log(`Using existing plan: ${matchingPlan.name} (${matchingPlan.code})`);
          
          const success = await upsertPlanToSupabase(planConfig, matchingPlan.code);
          if (success) {
            results.existing++;
            results.details.push(`${planConfig.country_code}: Used existing plan ${matchingPlan.code}`);
          } else {
            results.errors++;
            results.details.push(`${planConfig.country_code}: Failed to upsert existing plan`);
          }
        } else {
          // Plan doesn't exist, create it
          console.log(`Creating new plan: ${planConfig.name}`);
          
          const newPlan = await createKyshiPlan({
            name: planConfig.name,
            description: planConfig.description,
            interval: planConfig.interval,
            amount: planConfig.amount,
            localCurrency: planConfig.currency,
          });
          
          if (newPlan) {
            console.log(`Successfully created plan: ${newPlan.name} (${newPlan.code})`);
            
            const success = await upsertPlanToSupabase(planConfig, newPlan.code);
            if (success) {
              results.created++;
              results.details.push(`${planConfig.country_code}: Created new plan ${newPlan.code}`);
            } else {
              results.errors++;
              results.details.push(`${planConfig.country_code}: Created plan but failed to upsert to database`);
            }
          } else {
            results.errors++;
            results.details.push(`${planConfig.country_code}: Failed to create plan`);
          }
        }
      } catch (error) {
        console.error(`Error processing ${planConfig.country_code}:`, error);
        results.errors++;
        results.details.push(`${planConfig.country_code}: Error - ${error}`);
      }
    }

    // Step 4: Display final summary
    console.log('\n=== Final Summary ===');
    console.log(`Plans already existed: ${results.existing}`);
    console.log(`Plans newly created: ${results.created}`);
    console.log(`Errors encountered: ${results.errors}`);
    console.log('\nDetailed Results:');
    results.details.forEach(detail => console.log(`  - ${detail}`));

    // Step 5: Verify database contents
    console.log('\n=== Database Verification ===');
    const { data: dbPlans, error: dbError } = await supabase
      .from('kyshi_plans')
      .select('*')
      .eq('is_active', true)
      .order('country_code');

    if (dbError) {
      console.error('Error fetching database plans:', dbError);
    } else {
      console.log('Current plans in database:');
      dbPlans?.forEach(plan => {
        console.log(`  ${plan.country_code}: ${plan.name} - ${plan.amount} ${plan.currency} (${plan.kyshi_plan_code})`);
      });
    }

    console.log('\n=== Seeding completed ===');
    return results;

  } catch (error) {
    console.error('Fatal error during plan seeding:', error);
    results.errors++;
    results.details.push(`Fatal error: ${error}`);
    return results;
  }
}

// Validate environment variables
function validateEnvironment(): boolean {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'KYSHI_SECRET_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\nPlease set these environment variables and run again.');
    return false;
  }
  
  return true;
}

// Run the seeding script
async function main() {
  console.log('Beezee Kyshi Plans Seeding Script');
  console.log('=====================================');
  
  if (!validateEnvironment()) {
    process.exit(1);
  }

  const results = await seedPlans();
  
  if (results.errors > 0) {
    console.log('\nScript completed with errors');
    process.exit(1);
  } else {
    console.log('\nScript completed successfully');
    process.exit(0);
  }
}

// Run if called directly
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

export { seedPlans, COUNTRY_PLANS };
