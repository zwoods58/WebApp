-- =============================================
-- Migration: 002_user_accounts
-- Description: User accounts table with tier management
-- =============================================

-- User Accounts Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_accounts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  
  -- Account Tier
  account_tier account_tier NOT NULL DEFAULT 'default_draft',
  
  -- Pro Subscription Details
  subscription_status subscription_status,
  subscription_started_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  last_payment_at TIMESTAMP WITH TIME ZONE,
  next_payment_due_at TIMESTAMP WITH TIME ZONE,
  
  -- Buyout Details
  has_buyout BOOLEAN DEFAULT FALSE,
  buyout_purchased_at TIMESTAMP WITH TIME ZONE,
  buyout_code_delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.user_accounts IS 'User account information and subscription tiers';
COMMENT ON COLUMN public.user_accounts.account_tier IS 'default_draft (FREE), pro_subscription, or admin';
COMMENT ON COLUMN public.user_accounts.subscription_status IS 'Status of Pro subscription';
COMMENT ON COLUMN public.user_accounts.has_buyout IS 'Whether user has purchased any project buyout';

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'user_accounts table created successfully';
END $$;

