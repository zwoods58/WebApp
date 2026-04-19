-- Migration: Update Kyshi Subscription Schema for Transactions API and Grace Period
-- This migration renames existing columns to match user preference and adds grace period tracking.

-- 1. Rename existing columns to requested names
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'user_email') THEN
        ALTER TABLE public.subscriptions RENAME COLUMN user_email TO email;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'user_phone') THEN
        ALTER TABLE public.subscriptions RENAME COLUMN user_phone TO phone;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'country') THEN
        ALTER TABLE public.subscriptions RENAME COLUMN country TO country_code;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'next_charge_date') THEN
        ALTER TABLE public.subscriptions RENAME COLUMN next_charge_date TO next_billing_date;
    END IF;
END $$;

-- 2. Add grace period and transaction-related columns
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS retry_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS grace_period_ends TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS authorization_code VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_transaction_reference VARCHAR(255);

-- 3. Update the transactions table to support more metadata
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS external_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 4. Update the trigger (if column names changed, we might need to verify it still works)
-- The trigger handle_updated_at uses NEW.updated_at, which still exists.

-- 5. Add index for next_billing_date since we renamed it
DROP INDEX IF EXISTS idx_subscriptions_next_charge_date;
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON public.subscriptions(next_billing_date);

-- 6. Comments for clarity
COMMENT ON COLUMN public.subscriptions.retry_index IS 'How many consecutive billing failures have occurred';
COMMENT ON COLUMN public.subscriptions.grace_period_ends IS 'The date when the user will lose access if payment is not settled';
COMMENT ON COLUMN public.subscriptions.authorization_code IS 'Token for recurring card charges (if applicable)';
COMMENT ON COLUMN public.subscriptions.next_billing_date IS 'When the next automated charge attempt will happen';
