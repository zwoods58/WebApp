#!/usr/bin/env ts-node

/**
 * Cleanup script for expired PIN reset tokens
 * Run this periodically (e.g., via cron job) to remove expired tokens
 * 
 * Usage: npx ts-node scripts/cleanup-expired-tokens.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function cleanupExpiredTokens() {
  console.log('🧹 Starting cleanup of expired PIN reset tokens...');
  
  try {
    // Delete tokens that have expired
    const { data, error, count } = await supabaseAdmin
      .from('pin_reset_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      console.error('❌ Error cleaning up tokens:', error);
      process.exit(1);
    }

    const expiredCount = data?.length || 0;
    console.log(`✅ Cleaned up ${expiredCount} expired tokens`);

    // Also delete used tokens older than 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: usedData, error: usedError } = await supabaseAdmin
      .from('pin_reset_tokens')
      .delete()
      .not('used_at', 'is', null)
      .lt('used_at', oneDayAgo)
      .select('id');
    
    const usedCount = usedData?.length || 0;

    if (usedError) {
      console.error('❌ Error cleaning up used tokens:', usedError);
      process.exit(1);
    }

    console.log(`✅ Cleaned up ${usedCount || 0} old used tokens`);
    console.log('🎉 Cleanup completed successfully');
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
  }
}

// Run cleanup
cleanupExpiredTokens();
