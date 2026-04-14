// Script to setup subscription plans for all countries in the database
// This ensures all country plans work correctly with the webhook

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Subscription plans for all countries
const subscriptionPlans = [
  // Kenya Plans
  {
    country_code: 'KE',
    name: 'Kenya Weekly Subscription',
    description: 'Weekly subscription for Kenya users',
    amount: 200, // KES 200
    currency: 'KES',
    interval: 'weekly',
    kyshi_plan_code: 'PLN__Lt82Xz0-p5-wD6',
    is_active: true
  },
  
  // Ghana Plans
  {
    country_code: 'GH',
    name: 'Ghana Weekly Subscription',
    description: 'Weekly subscription for Ghana users',
    amount: 20, // GHS 20
    currency: 'GHS',
    interval: 'weekly',
    kyshi_plan_code: 'PLN_X3UucIk9yPbkOZ1',
    is_active: true
  },
  
  // Nigeria Plans
  {
    country_code: 'NG',
    name: 'Nigeria Weekly Subscription',
    description: 'Weekly subscription for Nigeria users',
    amount: 500, // NGN 500
    currency: 'NGN',
    interval: 'weekly',
    kyshi_plan_code: 'PLN_NG_WEEKLY_001',
    is_active: true
  },
  
  // Côte d'Ivoire Plans
  {
    country_code: 'CI',
    name: 'Côte d\'Ivoire Weekly Subscription',
    description: 'Weekly subscription for Côte d\'Ivoire users',
    amount: 1000, // XOF 1000
    currency: 'XOF',
    interval: 'weekly',
    kyshi_plan_code: 'PLN_I8yasoStOrABeQc',
    is_active: true
  }
];

async function setupSubscriptionPlans() {
  console.log('Setting up subscription plans for all countries...');
  
  try {
    // Check existing plans
    const { data: existingPlans, error: fetchError } = await supabase
      .from('kyshi_plans')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching existing plans:', fetchError);
      return;
    }
    
    console.log(`Found ${existingPlans?.length || 0} existing plans`);
    
    // Insert or update plans
    for (const plan of subscriptionPlans) {
      console.log(`Processing plan for ${plan.country_code}: ${plan.name}`);
      
      // Check if plan already exists
      const existingPlan = existingPlans?.find(p => 
        p.country_code === plan.country_code && p.currency === plan.currency
      );
      
      if (existingPlan) {
        // Update existing plan
        const { data, error } = await supabase
          .from('kyshi_plans')
          .update({
            name: plan.name,
            description: plan.description,
            amount: plan.amount,
            interval: plan.interval,
            kyshi_plan_code: plan.kyshi_plan_code,
            is_active: plan.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPlan.id)
          .select();
        
        if (error) {
          console.error(`Error updating plan for ${plan.country_code}:`, error);
        } else {
          console.log(`Updated plan for ${plan.country_code}:`, data[0]);
        }
      } else {
        // Insert new plan
        const { data, error } = await supabase
          .from('kyshi_plans')
          .insert({
            country_code: plan.country_code,
            name: plan.name,
            description: plan.description,
            amount: plan.amount,
            currency: plan.currency,
            interval: plan.interval,
            kyshi_plan_code: plan.kyshi_plan_code,
            is_active: plan.is_active
          })
          .select();
        
        if (error) {
          console.error(`Error inserting plan for ${plan.country_code}:`, error);
        } else {
          console.log(`Inserted plan for ${plan.country_code}:`, data[0]);
        }
      }
    }
    
    // Verify all plans are set up correctly
    const { data: finalPlans, error: verifyError } = await supabase
      .from('kyshi_plans')
      .select('*')
      .eq('is_active', true)
      .order('country_code');
    
    if (verifyError) {
      console.error('Error verifying plans:', verifyError);
    } else {
      console.log('\n=== Final Plan Configuration ===');
      finalPlans.forEach(plan => {
        console.log(`${plan.country_code}: ${plan.name} - ${plan.amount} ${plan.currency} (${plan.interval})`);
        console.log(`  Plan Code: ${plan.kyshi_plan_code}`);
        console.log(`  Status: ${plan.is_active ? 'Active' : 'Inactive'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

async function testPlansAPI() {
  console.log('\n=== Testing Plans API ===');
  
  const countries = ['KE', 'GH', 'NG', 'CI'];
  
  for (const country of countries) {
    try {
      const response = await fetch(`http://localhost:3000/api/kyshi/plans?country=${country}`);
      const data = await response.json();
      
      console.log(`${country}: ${data.success ? 'SUCCESS' : 'FAILED'} - ${data.plans?.length || 0} plans`);
      
      if (data.success && data.plans?.length > 0) {
        data.plans.forEach(plan => {
          console.log(`  - ${plan.name}: ${plan.amount} ${plan.localCurrency}`);
        });
      }
    } catch (error) {
      console.log(`${country}: ERROR - ${error.message}`);
    }
  }
}

// Run the setup
async function main() {
  await setupSubscriptionPlans();
  await testPlansAPI();
  console.log('\nSubscription plans setup complete!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupSubscriptionPlans, testPlansAPI };
