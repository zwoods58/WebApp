-- =============================================
-- Migration: 004_subscriptions_and_payments
-- Description: Subscription and payment tracking tables
-- =============================================

-- ========================================
-- Subscriptions Table (Pro tier tracking)
-- ========================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_accounts(id) ON DELETE CASCADE,
  
  tier account_tier NOT NULL DEFAULT 'pro_subscription',
  status subscription_status NOT NULL DEFAULT 'active',
  
  -- Pricing
  monthly_price DECIMAL(10, 2) NOT NULL DEFAULT 20.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Dates
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment Provider
  payment_provider TEXT,  -- 'flutterwave', 'stripe', etc.
  payment_provider_subscription_id TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.subscriptions IS 'Pro subscription tracking';

-- ========================================
-- Payments Table (all payments)
-- ========================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_accounts(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  
  -- Payment Details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  payment_type TEXT NOT NULL,  -- 'subscription', 'buyout', 'one_time'
  
  -- Payment Provider
  payment_provider TEXT NOT NULL,  -- 'flutterwave', 'stripe', etc.
  provider_transaction_id TEXT,
  provider_reference TEXT,
  
  -- Dates
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'All payment transactions';
COMMENT ON COLUMN public.payments.payment_type IS 'subscription, buyout, or one_time';

-- ========================================
-- Buyouts Table (one-time code purchases)
-- ========================================
CREATE TABLE IF NOT EXISTS public.buyouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_accounts(id) ON DELETE CASCADE,
  draft_project_id UUID REFERENCES public.draft_projects(id) ON DELETE SET NULL,
  
  -- Buyout Details
  amount DECIMAL(10, 2) NOT NULL DEFAULT 150.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  
  -- Code Delivery
  code_delivered BOOLEAN DEFAULT FALSE,
  code_delivery_url TEXT,
  code_delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment Provider
  payment_provider TEXT NOT NULL,
  provider_transaction_id TEXT,
  provider_reference TEXT,
  
  -- Dates
  purchased_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.buyouts IS 'One-time code purchases ($150)';

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'subscriptions, payments, and buyouts tables created successfully';
END $$;

