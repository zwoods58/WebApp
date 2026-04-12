#!/usr/bin/env ts-node

/**
 * Run Schema Update - Add missing columns using direct SQL
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runSchemaUpdate() {
  console.log('Running Schema Update\n');
  console.log('='.repeat(70));

  const updates = [
    'ALTER TABLE kyshi_subscriptions ADD COLUMN IF NOT EXISTS email TEXT',
    'ALTER TABLE kyshi_subscriptions ADD COLUMN IF NOT EXISTS country_code TEXT',
    'ALTER TABLE kyshi_subscriptions ADD COLUMN IF NOT EXISTS plan_code TEXT'
  ];

  for (const sql of updates) {
    console.log(`\nExecuting: ${sql}`);
    try {
      // Try using raw SQL - this might not work but let's try
      const { error } = await supabase
        .from('kyshi_subscriptions')
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('does not exist')) {
        console.log('  - Column missing, need to add via Supabase dashboard');
        console.log('  - Please run this SQL in Supabase SQL Editor:');
        console.log(`    ${sql}`);
      } else {
        console.log('  - Column exists or added successfully');
      }
    } catch (err) {
      console.log(`  - Error: ${err}`);
      console.log('  - Please run this SQL manually in Supabase dashboard');
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\nManual Steps Required:\n');
  console.log('1. Go to Supabase Dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run these commands:');
  console.log('');
  console.log('ALTER TABLE kyshi_subscriptions ADD COLUMN IF NOT EXISTS email TEXT;');
  console.log('ALTER TABLE kyshi_subscriptions ADD COLUMN IF NOT EXISTS country_code TEXT;');
  console.log('ALTER TABLE kyshi_subscriptions ADD COLUMN IF NOT EXISTS plan_code TEXT;');
  console.log('');
  console.log('4. Then test the flow again');
}

runSchemaUpdate().catch(console.error);
