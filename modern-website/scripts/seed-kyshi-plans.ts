#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';

// Configuration - update these with your actual values
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zruprmhkcqhgzydjfhrk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTczMjg1MCwiZXhwIjoyMDg3MzA4ODUwfQ.GI-gSw_lna1O-O3Dad0M898_h0b9xgA2ILYQ_DcdVNo';
const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY || 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
const KYSHI_API_URL = process.env.KYSHI_BASE_URL || 'https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/api';

// Plan configurations for each country
const COUNTRY_PLANS = [
  {
    country_code: 'KE',
    name: 'Kenya Weekly Plan',
    amount: 200,
    currency: 'KES',
    description: 'Weekly subscription plan for Kenya customers'
  },
  {
    country_code: 'GH',
    name: 'Ghana Weekly Plan', 
    amount: 20,
    currency: 'GHS',
    description: 'Weekly subscription plan for Ghana customers'
  },
  {
    country_code: 'NG',
    name: 'Nigeria Weekly Plan',
    amount: 500,
    currency: 'NGN', 
    description: 'Weekly subscription plan for Nigeria customers'
  },
  {
    country_code: 'ZA',
    name: 'South Africa Weekly Plan',
    amount: 50,
    currency: 'ZAR',
    description: 'Weekly subscription plan for South Africa customers'
  },
  {
    country_code: 'CI',
    name: 'Côte d\'Ivoire Weekly Plan',
    amount: 500,
    currency: 'XOF',
    description: 'Weekly subscription plan for Côte d\'Ivoire customers'
  },
  {
    country_code: 'TEST',
    name: 'Test Plan',
    amount: 100,
    currency: 'USD',
    description: 'Test subscription plan for testing purposes'
  }
];

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper function to make Kyshi API calls
async function callKyshiAPI(endpoint: string, method: string = 'POST', data?: any) {
  const response = await fetch(`${KYSHI_API_URL}${endpoint}`, {
    method,
    headers: {
      'x-api-key': KYSHI_SECRET_KEY,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kyshi API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Create plans in Kyshi and store in database
async function seedPlans() {
  console.log('Starting Kyshi plans seeding...');

  try {
    for (const planConfig of COUNTRY_PLANS) {
      console.log(`Processing plan for ${planConfig.country_code}: ${planConfig.name}`);

      // For testing, create a mock plan code
      const kyshiPlanCode = `${planConfig.country_code.toUpperCase()}_WEEKLY_${planConfig.amount}`;
      console.log(`Using mock plan code: ${kyshiPlanCode}`);

      // Store plan in database
      const { data: existingPlan, error: fetchError } = await supabase
        .from('kyshi_plans')
        .select('id')
        .eq('country_code', planConfig.country_code)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error checking existing plan for ${planConfig.country_code}:`, fetchError);
        continue;
      }

      if (existingPlan) {
        // Update existing plan
        const { error: updateError } = await supabase
          .from('kyshi_plans')
          .update({
            name: planConfig.name,
            amount: planConfig.amount,
            currency: planConfig.currency,
            kyshi_plan_code: kyshiPlanCode,
            is_active: true,
          })
          .eq('country_code', planConfig.country_code);

        if (updateError) {
          console.error(`Error updating plan for ${planConfig.country_code}:`, updateError);
        } else {
          console.log(`Updated plan for ${planConfig.country_code}`);
        }
      } else {
        // Insert new plan
        const { error: insertError } = await supabase
          .from('kyshi_plans')
          .insert({
            country_code: planConfig.country_code,
            name: planConfig.name,
            amount: planConfig.amount,
            currency: planConfig.currency,
            interval: 'weekly',
            kyshi_plan_code: kyshiPlanCode,
            is_active: true,
          });

        if (insertError) {
          console.error(`Error inserting plan for ${planConfig.country_code}:`, insertError);
        } else {
          console.log(`Inserted new plan for ${planConfig.country_code}`);
        }
      }
    }

    console.log('Kyshi plans seeding completed successfully!');

    // Display summary
    const { data: allPlans, error: summaryError } = await supabase
      .from('kyshi_plans')
      .select('*')
      .order('country_code');

    if (summaryError) {
      console.error('Error fetching plan summary:', summaryError);
    } else {
      console.log('\n=== Plan Summary ===');
      allPlans?.forEach(plan => {
        console.log(`${plan.country_code}: ${plan.name} - ${plan.amount} ${plan.currency} (${plan.kyshi_plan_code})`);
      });
    }

  } catch (error) {
    console.error('Error during plan seeding:', error);
    process.exit(1);
  }
}

// Run the seeding script
// Check required environment variables
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

if (!KYSHI_SECRET_KEY) {
  console.error('Error: KYSHI_SECRET_KEY environment variable is required');
  process.exit(1);
}

seedPlans()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

export { seedPlans, COUNTRY_PLANS };
