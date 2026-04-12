#!/usr/bin/env ts-node

/**
 * Quick Fix - Temporarily remove email/country/plan from API insert
 */

import fs from 'fs';
import path from 'path';

async function quickFix() {
  console.log('Applying Quick Fix\n');
  console.log('='.repeat(70));

  const filePath = path.join(process.cwd(), 'src/app/api/kyshi/create-subscription/route.ts');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the problematic columns from the insert
    const oldInsert = `      .insert({
        customer_id: customer.id,
        plan_id: planId,
        kyshi_subscription_id: kyshiSubscriptionId,
        email: email,
        country_code: countryCode,
        plan_code: plan.kyshi_plan_code,
        status: authorizationUrl ? 'pending' : 'active',
        current_period_start: today.toISOString().split('T')[0],
        current_period_end: nextWeek.toISOString().split('T')[0],
      })`;
      
    const newInsert = `      .insert({
        customer_id: customer.id,
        plan_id: planId,
        kyshi_subscription_id: kyshiSubscriptionId,
        status: authorizationUrl ? 'pending' : 'active',
        current_period_start: today.toISOString().split('T')[0],
        current_period_end: nextWeek.toISOString().split('T')[0],
      })`;
    
    if (content.includes('email: email,')) {
      content = content.replace(oldInsert, newInsert);
      fs.writeFileSync(filePath, content);
      console.log('  - Removed email, country_code, plan_code from insert');
      console.log('  - Flow should work now (without these columns)');
    } else {
      console.log('  - API already fixed');
    }
    
  } catch (err) {
    console.log('  - Error:', err);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\nNext Steps:\n');
  console.log('1. Test the flow at: http://localhost:3000/test/kyshi');
  console.log('2. Create subscription with test.flow@example.com');
  console.log('3. Complete payment');
  console.log('4. Check status and transactions');
  console.log('\nNote: Email/country/plan columns are not saved yet');
  console.log('But the subscription flow will work for testing');
}

quickFix().catch(console.error);
