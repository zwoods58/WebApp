-- Fix Subscription Schema - Add Missing Columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS business_id UUID;

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS industry TEXT;

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS plan_name TEXT;

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS plan_interval TEXT;

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS customer_email TEXT;

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON public.subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_industry ON public.subscriptions(industry);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access to subscriptions" ON public.subscriptions;
CREATE POLICY "Service role full access to subscriptions" ON public.subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
GRANT SELECT ON public.subscriptions TO anon;
