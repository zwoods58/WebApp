-- =====================================================
-- Kyshi Payment Integration - Workaround Schema
-- Migration: Creates Kyshi tables with amount workaround fields
-- Date: 2026-04-12
-- Purpose: Fix Paystack amount display issue with multiplied amounts
-- =====================================================

-- =====================================================
-- 1. KYSHI PLANS TABLE
-- Stores subscription plans with workaround amount fields
-- =====================================================

CREATE TABLE IF NOT EXISTS kyshi_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Plan identification
  country_code VARCHAR(2) NOT NULL,              -- 'KE', 'GH', 'NG', 'CI'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Original amount fields (for compatibility)
  amount INTEGER NOT NULL,                       -- Amount sent to Kyshi (multiplied)
  currency VARCHAR(3) NOT NULL,                  -- 'KES', 'GHS', 'NGN', 'XOF'
  interval VARCHAR(20) DEFAULT 'weekly',         -- 'weekly', 'monthly'
  
  -- Kyshi integration
  kyshi_plan_code VARCHAR(100) UNIQUE,           -- Plan code from Kyshi API
  is_active BOOLEAN DEFAULT true,
  
  -- WORKAROUND FIELDS (NEW)
  real_amount INTEGER,                           -- Real amount customers pay
  real_currency VARCHAR(3),                      -- Real currency (same as currency)
  kyshi_amount INTEGER,                           -- Amount sent to Kyshi (multiplied)
  conversion_ratio INTEGER,                       -- Multiplier (40, 4, 5, 200)
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT kyshi_plans_country_code_check CHECK (country_code IN ('KE', 'GH', 'NG', 'CI')),
  CONSTRAINT kyshi_plans_interval_check CHECK (interval IN ('weekly', 'monthly')),
  CONSTRAINT kyshi_plans_conversion_ratio_check CHECK (conversion_ratio > 0)
);

COMMENT ON TABLE kyshi_plans IS 'Subscription plans for Kyshi payment integration with amount workaround';
COMMENT ON COLUMN kyshi_plans.amount IS 'Amount sent to Kyshi API (may be multiplied for workaround)';
COMMENT ON COLUMN kyshi_plans.real_amount IS 'Real amount customers actually pay';
COMMENT ON COLUMN kyshi_plans.kyshi_amount IS 'Multiplied amount sent to Kyshi for Paystack display fix';
COMMENT ON COLUMN kyshi_plans.conversion_ratio IS 'Multiplier used for workaround (real_amount * ratio = kyshi_amount)';

-- =====================================================
-- 2. KYSHI CUSTOMERS TABLE
-- Stores customer information synced with Kyshi
-- =====================================================

CREATE TABLE IF NOT EXISTS kyshi_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Customer information
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  phone VARCHAR(20),
  country_code VARCHAR(2) NOT NULL,
  
  -- Kyshi integration
  kyshi_customer_id VARCHAR(100),                -- Customer ID from Kyshi API
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT kyshi_customers_country_code_check CHECK (country_code IN ('KE', 'GH', 'NG', 'CI'))
);

COMMENT ON TABLE kyshi_customers IS 'Customer records for Kyshi payment integration';

-- =====================================================
-- 3. KYSHI SUBSCRIPTIONS TABLE
-- Stores subscription records with workaround amount fields
-- =====================================================

CREATE TABLE IF NOT EXISTS kyshi_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Subscription relationships
  customer_id UUID REFERENCES kyshi_customers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES kyshi_plans(id) ON DELETE CASCADE,
  
  -- Kyshi integration
  kyshi_subscription_id VARCHAR(100) UNIQUE,     -- Subscription ID from Kyshi API
  email VARCHAR(255) NOT NULL,                   -- Customer email (denormalized for webhooks)
  country_code VARCHAR(2) NOT NULL,               -- Customer country (denormalized)
  plan_code VARCHAR(100) NOT NULL,                -- Plan code (denormalized)
  
  -- Subscription status
  status VARCHAR(20) DEFAULT 'pending',           -- 'pending', 'active', 'cancelled', 'past_due'
  
  -- Billing period
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  
  -- WORKAROUND FIELDS (NEW)
  real_amount INTEGER,                           -- Real amount per billing cycle
  real_currency VARCHAR(3),                      -- Real currency
  kyshi_amount INTEGER,                           -- Multiplied amount for Kyshi
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT kyshi_subscriptions_status_check CHECK (status IN ('pending', 'active', 'cancelled', 'past_due'))
);

COMMENT ON TABLE kyshi_subscriptions IS 'Customer subscriptions with workaround amount tracking';
COMMENT ON COLUMN kyshi_subscriptions.real_amount IS 'Real amount charged per billing cycle';
COMMENT ON COLUMN kyshi_subscriptions.kyshi_amount IS 'Multiplied amount sent to Kyshi';

-- =====================================================
-- 4. KYSHI TRANSACTIONS TABLE
-- Stores payment transactions with real amounts
-- =====================================================

CREATE TABLE IF NOT EXISTS kyshi_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Transaction relationships
  subscription_id UUID REFERENCES kyshi_subscriptions(id) ON DELETE CASCADE,
  kyshi_reference VARCHAR(100) UNIQUE NOT NULL,   -- Transaction reference from Kyshi
  
  -- Transaction details
  amount INTEGER NOT NULL,                        -- REAL amount (what customer paid)
  currency VARCHAR(3) NOT NULL,                   -- Real currency
  customer_email VARCHAR(255) NOT NULL,           -- Customer email (denormalized)
  
  -- Transaction status
  status VARCHAR(20) DEFAULT 'pending',           -- 'pending', 'success', 'failed', 'refunded'
  
  -- Additional data
  authorization_code VARCHAR(100),                -- Payment authorization
  gateway_response JSONB,                         -- Full response from Kyshi/Paystack
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT kyshi_transactions_status_check CHECK (status IN ('pending', 'success', 'failed', 'refunded'))
);

COMMENT ON TABLE kyshi_transactions IS 'Payment transactions with real amounts (after workaround conversion)';
COMMENT ON COLUMN kyshi_transactions.amount IS 'REAL amount paid by customer (after conversion from Kyshi amount)';

-- =====================================================
-- 5. KYSHI WEBHOOK LOGS TABLE
-- Logs all webhook events for debugging
-- =====================================================

CREATE TABLE IF NOT EXISTS kyshi_webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Webhook event
  event_type VARCHAR(50) NOT NULL,               -- 'successful', 'failed', 'subscription.created', etc.
  reference VARCHAR(100),                        -- Transaction reference (if applicable)
  
  -- Processing status
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  
  -- Payload
  payload JSONB NOT NULL,                        -- Full webhook payload
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE kyshi_webhook_logs IS 'Webhook event logs for debugging and monitoring';

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

-- kyshi_plans indexes
CREATE INDEX IF NOT EXISTS idx_kyshi_plans_country_code ON kyshi_plans(country_code);
CREATE INDEX IF NOT EXISTS idx_kyshi_plans_is_active ON kyshi_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_kyshi_plans_kyshi_plan_code ON kyshi_plans(kyshi_plan_code);

-- kyshi_customers indexes
CREATE INDEX IF NOT EXISTS idx_kyshi_customers_email ON kyshi_customers(email);
CREATE INDEX IF NOT EXISTS idx_kyshi_customers_kyshi_customer_id ON kyshi_customers(kyshi_customer_id);
CREATE INDEX IF NOT EXISTS idx_kyshi_customers_country_code ON kyshi_customers(country_code);

-- kyshi_subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_kyshi_subscriptions_customer_id ON kyshi_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_kyshi_subscriptions_plan_id ON kyshi_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_kyshi_subscriptions_kyshi_subscription_id ON kyshi_subscriptions(kyshi_subscription_id);
CREATE INDEX IF NOT EXISTS idx_kyshi_subscriptions_email ON kyshi_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_kyshi_subscriptions_status ON kyshi_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_kyshi_subscriptions_current_period_end ON kyshi_subscriptions(current_period_end);

-- kyshi_transactions indexes
CREATE INDEX IF NOT EXISTS idx_kyshi_transactions_subscription_id ON kyshi_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_kyshi_transactions_kyshi_reference ON kyshi_transactions(kyshi_reference);
CREATE INDEX IF NOT EXISTS idx_kyshi_transactions_customer_email ON kyshi_transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_kyshi_transactions_status ON kyshi_transactions(status);
CREATE INDEX IF NOT EXISTS idx_kyshi_transactions_created_at ON kyshi_transactions(created_at);

-- kyshi_webhook_logs indexes
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_event_type ON kyshi_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_reference ON kyshi_webhook_logs(reference);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_created_at ON kyshi_webhook_logs(created_at);

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE kyshi_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyshi_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyshi_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyshi_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyshi_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Plans: Read-only for authenticated users
CREATE POLICY "Plans are viewable by authenticated users" ON kyshi_plans
  FOR SELECT USING (auth.role() = 'authenticated');

-- Customers: Users can only see their own records
CREATE POLICY "Users can view own customer records" ON kyshi_customers
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can insert own customer records" ON kyshi_customers
  FOR INSERT WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update own customer records" ON kyshi_customers
  FOR UPDATE USING (auth.email() = email);

-- Subscriptions: Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON kyshi_subscriptions
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Service role can manage subscriptions" ON kyshi_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Transactions: Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON kyshi_transactions
  FOR SELECT USING (auth.email() = customer_email);

CREATE POLICY "Service role can manage transactions" ON kyshi_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Webhook logs: Service role only
CREATE POLICY "Service role full access to webhook logs" ON kyshi_webhook_logs
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 8. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_kyshi_plans_updated_at BEFORE UPDATE ON kyshi_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyshi_customers_updated_at BEFORE UPDATE ON kyshi_customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyshi_subscriptions_updated_at BEFORE UPDATE ON kyshi_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyshi_transactions_updated_at BEFORE UPDATE ON kyshi_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. SAMPLE WORKAROUND PLANS (for testing)
-- These will be replaced by the script
-- =====================================================

-- Kenya: 200 KES real -> 8,000 KES Kyshi (40x multiplier)
INSERT INTO kyshi_plans (country_code, name, amount, currency, interval, real_amount, real_currency, kyshi_amount, conversion_ratio)
VALUES (
  'KE',
  'Beezee Weekly Kenya (Workaround)',
  8000,
  'KES',
  'weekly',
  200,
  'KES',
  8000,
  40
) ON CONFLICT (kyshi_plan_code) DO NOTHING;

-- Ghana: 20 GHS real -> 80 GHS Kyshi (4x multiplier)
INSERT INTO kyshi_plans (country_code, name, amount, currency, interval, real_amount, real_currency, kyshi_amount, conversion_ratio)
VALUES (
  'GH',
  'Beezee Weekly Ghana (Workaround)',
  80,
  'GHS',
  'weekly',
  20,
  'GHS',
  80,
  4
) ON CONFLICT (kyshi_plan_code) DO NOTHING;

-- Nigeria: 500 NGN real -> 2,500 NGN Kyshi (5x multiplier)
INSERT INTO kyshi_plans (country_code, name, amount, currency, interval, real_amount, real_currency, kyshi_amount, conversion_ratio)
VALUES (
  'NG',
  'Beezee Weekly Nigeria (Workaround)',
  2500,
  'NGN',
  'weekly',
  500,
  'NGN',
  2500,
  5
) ON CONFLICT (kyshi_plan_code) DO NOTHING;

-- Côte d'Ivoire: 1,000 XOF real -> 200,000 XOF Kyshi (200x multiplier)
INSERT INTO kyshi_plans (country_code, name, amount, currency, interval, real_amount, real_currency, kyshi_amount, conversion_ratio)
VALUES (
  'CI',
  'Beezee Weekly Côte d''Ivoire (Workaround)',
  200000,
  'XOF',
  'weekly',
  1000,
  'XOF',
  200000,
  200
) ON CONFLICT (kyshi_plan_code) DO NOTHING;

COMMENT ON SCRIPT IS 'Kyshi payment integration schema with amount workaround for Paystack display issue';
