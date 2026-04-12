#!/usr/bin/env ts-node

/**
 * Debug Subscription Data - Check why email is missing
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function debugSubscriptions() {
  console.log('Debugging Subscription Data\n');
  console.log('='.repeat(70));

  // Check one recent subscription in detail
  const { data: subs, error } = await supabase
    .from('kyshi_subscriptions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.log('Error:', error);
    return;
  }

  if (subs && subs.length > 0) {
    const sub = subs[0];
    console.log('Latest Subscription:\n');
    console.log(JSON.stringify(sub, null, 2));
    
    console.log('\nColumn Analysis:\n');
    console.log('Email:', sub.email || 'MISSING');
    console.log('Country:', sub.country_code || 'MISSING');
    console.log('Plan Code:', sub.plan_code || 'MISSING');
    console.log('Customer ID:', sub.customer_id || 'MISSING');
  }

  // Check if there are any with emails
  const { data: withEmail } = await supabase
    .from('kyshi_subscriptions')
    .select('id, email, created_at')
    .not('email', 'is', null)
    .order('created_at', { ascending: false });

  console.log('\nSubscriptions with Email:', withEmail?.length || 0);
  withEmail?.forEach(s => {
    console.log(`- ${s.email} (${s.created_at})`);
  });
}

debugSubscriptions().catch(console.error);
