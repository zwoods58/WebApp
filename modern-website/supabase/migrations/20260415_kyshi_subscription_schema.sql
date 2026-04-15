-- Migration: Kyshi Subscription System Schema
-- Created: 2025-04-15
-- Purpose: Add tables for Kyshi subscription management

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    user_name TEXT,
    country VARCHAR(2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    kyshi_subscription_id VARCHAR(255) UNIQUE,
    kyshi_subscription_code VARCHAR(255) UNIQUE,
    kyshi_plan_code VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'failed')),
    is_active BOOLEAN DEFAULT false,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    last_charge_date TIMESTAMP WITH TIME ZONE,
    next_charge_date TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kyshi_transaction_id VARCHAR(255) UNIQUE,
    kyshi_reference VARCHAR(255) UNIQUE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
    payment_method VARCHAR(50),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhook logs table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_email ON public.subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_country ON public.subscriptions(country);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON public.subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_charge_date ON public.subscriptions(next_charge_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_kyshi_subscription_id ON public.subscriptions(kyshi_subscription_id);

CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON public.transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_kyshi_reference ON public.transactions(kyshi_reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_event_type ON public.kyshi_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_processed ON public.kyshi_webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_created_at ON public.kyshi_webhook_logs(created_at);

-- Create RLS policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyshi_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Subscriptions RLS policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to subscriptions" ON public.subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Transactions RLS policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.subscriptions 
            WHERE subscriptions.id = transactions.subscription_id 
            AND subscriptions.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role full access to transactions" ON public.transactions
    FOR ALL USING (auth.role() = 'service_role');

-- Webhook logs RLS policies
CREATE POLICY "Service role full access to webhook logs" ON public.kyshi_webhook_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER handle_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add comments
COMMENT ON TABLE public.subscriptions IS 'Kyshi subscription management table';
COMMENT ON TABLE public.transactions IS 'Kyshi transaction records';
COMMENT ON TABLE public.kyshi_webhook_logs IS 'Kyshi webhook event logs';

-- Grant permissions
GRANT ALL ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
GRANT SELECT ON public.subscriptions TO anon;

GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
GRANT SELECT ON public.transactions TO anon;

GRANT ALL ON public.kyshi_webhook_logs TO service_role;
