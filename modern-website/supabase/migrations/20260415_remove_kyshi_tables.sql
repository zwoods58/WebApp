-- Migration: Complete Kyshi Tables Removal
-- Created: 2025-04-15
-- Purpose: Remove all Kyshi-related tables, views, and functions

-- Drop Kyshi-specific tables (if they exist)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.kyshi_webhook_logs CASCADE;

-- Drop Kyshi-specific views (if they exist)
DROP VIEW IF EXISTS public.transaction_analytics CASCADE;

-- Drop any Kyshi-specific functions (if they exist)
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Remove any remaining indexes that might be orphaned
DROP INDEX IF EXISTS idx_transactions_reference;
DROP INDEX IF EXISTS idx_transactions_customer_email;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_local_currency;
DROP INDEX IF EXISTS idx_kyshi_webhook_logs_event_type;
DROP INDEX IF EXISTS idx_kyshi_webhook_logs_reference;
DROP INDEX IF EXISTS idx_kyshi_webhook_logs_created_at;
DROP INDEX IF EXISTS idx_kyshi_webhook_logs_processed;

-- Remove any Kyshi-related RLS policies (if they exist)
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Service role full access to webhook logs" ON public.kyshi_webhook_logs;

-- Remove any Kyshi-related triggers (if they exist)
DROP TRIGGER IF EXISTS handle_transactions_updated_at ON public.transactions;

-- Remove any Kyshi-related permissions (if tables existed)
DO $$
BEGIN
    -- Check if tables exist before trying to revoke permissions
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions') THEN
        REVOKE ALL ON public.transactions FROM authenticated;
        REVOKE ALL ON public.transactions FROM service_role;
        REVOKE SELECT ON public.transactions FROM anon;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'kyshi_webhook_logs') THEN
        REVOKE ALL ON public.kyshi_webhook_logs FROM service_role;
        REVOKE SELECT ON public.kyshi_webhook_logs FROM authenticated;
    END IF;
    
    -- Check if view exists before trying to revoke permissions
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'transaction_analytics') THEN
        REVOKE SELECT ON public.transaction_analytics FROM authenticated;
        REVOKE SELECT ON public.transaction_analytics FROM service_role;
    END IF;
END $$;

-- Clean up any remaining Kyshi references in other tables
-- This is a safety measure to ensure no orphaned data remains

-- Check for any Kyshi-related columns in businesses table and remove if they exist
DO $$
BEGIN
    -- Remove any Kyshi-specific columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name LIKE '%kyshi%') THEN
        -- This would need to be adjusted based on actual column names
        -- ALTER TABLE public.businesses DROP COLUMN IF EXISTS kyshi_customer_id;
        -- ALTER TABLE public.businesses DROP COLUMN IF EXISTS kyshi_subscription_code;
        NULL;
    END IF;
END $$;

-- Log the cleanup for audit purposes
DO $$
BEGIN
    RAISE NOTICE 'Kyshi tables and related objects have been removed successfully';
    RAISE NOTICE 'Migration completed at: %', NOW();
END $$;
