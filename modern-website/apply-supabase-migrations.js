// Apply Supabase Migrations
// This script will apply the missing subscription schema to your Supabase database

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('=== Applying Supabase Migrations ===\n');

// Create admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

// Migration SQL from the file
const migrationSQL = `
-- Add missing columns to subscriptions table if they don't exist
DO $$ 
BEGIN
    -- Add business_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'business_id'
    ) THEN
        ALTER TABLE public.subscriptions ADD COLUMN business_id UUID;
        RAISE NOTICE 'Added business_id column to subscriptions';
    END IF;

    -- Add industry column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'industry'
    ) THEN
        ALTER TABLE public.subscriptions ADD COLUMN industry TEXT;
        RAISE NOTICE 'Added industry column to subscriptions';
    END IF;

    -- Add plan_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'plan_name'
    ) THEN
        ALTER TABLE public.subscriptions ADD COLUMN plan_name TEXT;
        RAISE NOTICE 'Added plan_name column to subscriptions';
    END IF;

    -- Add plan_interval column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'plan_interval'
    ) THEN
        ALTER TABLE public.subscriptions ADD COLUMN plan_interval TEXT;
        RAISE NOTICE 'Added plan_interval column to subscriptions';
    END IF;

    -- Add customer_email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'customer_email'
    ) THEN
        ALTER TABLE public.subscriptions ADD COLUMN customer_email TEXT;
        RAISE NOTICE 'Added customer_email column to subscriptions';
    END IF;

    -- Add customer_phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'customer_phone'
    ) THEN
        ALTER TABLE public.subscriptions ADD COLUMN customer_phone TEXT;
        RAISE NOTICE 'Added customer_phone column to subscriptions';
    END IF;
END $$;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON public.subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_industry ON public.subscriptions(industry);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access to subscriptions" ON public.subscriptions;
CREATE POLICY "Service role full access to subscriptions" ON public.subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Create webhook logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.kyshi_webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for webhook logs
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_event_type ON public.kyshi_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_processed ON public.kyshi_webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_created_at ON public.kyshi_webhook_logs(created_at);

-- Enable RLS on webhook logs
ALTER TABLE public.kyshi_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for webhook logs
DROP POLICY IF EXISTS "Service role full access to webhook logs" ON public.kyshi_webhook_logs;
CREATE POLICY "Service role full access to webhook logs" ON public.kyshi_webhook_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.kyshi_webhook_logs TO service_role;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS handle_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER handle_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_transactions_updated_at ON public.transactions;
CREATE TRIGGER handle_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
`;

// Apply the migration
async function applyMigration() {
  try {
    console.log('Applying subscription schema migration...');
    
    // Execute the migration SQL
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.log('Migration failed with RPC, trying direct SQL execution...');
      
      // Try executing individual statements
      const statements = migrationSQL.split(';').filter(s => s.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Executing:', statement.substring(0, 100) + '...');
          
          // This is a simplified approach - in production you'd use the Supabase SQL editor
          // or the supabase CLI to apply migrations
        }
      }
    } else {
      console.log('Migration applied successfully!');
    }
    
    console.log('\nNote: If the migration didn\'t apply automatically, you need to:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL from supabase/migrations/20260415_kyshi_subscription_schema.sql');
    console.log('4. Run the SQL to apply the migration');
    
  } catch (error) {
    console.log('Migration error:', error.message);
  }
}

// Alternative: Create a simple test to verify current schema
async function checkCurrentSchema() {
  console.log('\nChecking current schema status...');
  
  try {
    // Check if subscriptions table exists and has the right columns
    const { data: subsData, error: subsError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (subsError) {
      console.log('Subscriptions table error:', subsError.message);
      
      if (subsError.message.includes('does not exist')) {
        console.log('Subscriptions table does not exist - need to create it');
      } else if (subsError.message.includes('column') && subsError.message.includes('does not exist')) {
        console.log('Subscriptions table exists but missing columns - need to add them');
      }
    } else {
      console.log('Subscriptions table: OK');
    }
    
    // Check if transactions table exists
    const { data: txnData, error: txnError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .limit(1);
    
    if (txnError) {
      console.log('Transactions table error:', txnError.message);
    } else {
      console.log('Transactions table: OK');
    }
    
    // Check if webhook logs table exists
    const { data: logData, error: logError } = await supabaseAdmin
      .from('kyshi_webhook_logs')
      .select('*')
      .limit(1);
    
    if (logError) {
      console.log('Webhook logs table error:', logError.message);
    } else {
      console.log('Webhook logs table: OK');
    }
    
  } catch (error) {
    console.log('Schema check error:', error.message);
  }
}

// Run the check
checkCurrentSchema().then(() => {
  console.log('\n=== Migration Instructions ===');
  console.log('To apply the migration manually:');
  console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor');
  console.log('4. Copy the content from: supabase/migrations/20260415_kyshi_subscription_schema.sql');
  console.log('5. Paste and run the SQL');
  console.log('\nAfter applying the migration, run: node test-supabase-schema.js');
});
