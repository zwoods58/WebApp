-- =====================================================
-- MIGRATION: 20260421_fix_businesses_schema
-- PURPOSE: Fix businesses table reference issue blocking transactions
-- AUTHOR: BeeZee Engineering  
-- DATE: 2026-04-21
-- =====================================================

BEGIN;

-- 1. Create SQL execution function for debugging
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS TABLE
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY EXECUTE sql;
END;
$$;

-- 2. Create businesses view from business_users table
-- This fixes the "relation businesses does not exist" error
CREATE OR REPLACE VIEW businesses AS
SELECT 
  id,
  business_name,
  country_code as country,
  industry,
  created_at,
  updated_at,
  -- Add any additional fields needed by transactions
  phone_number,
  email,
  first_name,
  last_name
FROM business_users;

-- 3. Grant proper permissions to service role
-- This ensures the service role can access everything needed
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;  
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 4. Create proper foreign key relationships if they don't exist
-- First, check if transactions table has business_id column
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'business_id'
    ) THEN
        -- Add foreign key constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'transactions_business_id_fkey'
        ) THEN
            EXECUTE 'ALTER TABLE transactions 
                     ADD CONSTRAINT transactions_business_id_fkey 
                     FOREIGN KEY (business_id) REFERENCES businesses(id) 
                     ON DELETE CASCADE';
        END IF;
    END IF;
END $$;

-- 5. Create helper functions for debugging
CREATE OR REPLACE FUNCTION get_table_definition(table_name text)
RETURNS TABLE
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
    FROM information_schema.columns 
    WHERE table_name = get_table_definition.table_name 
    AND table_schema = 'public'
    ORDER BY ordinal_position;
END;
$$;

CREATE OR REPLACE FUNCTION get_foreign_keys(table_name text)
RETURNS TABLE
LANGUAGE plpgsql  
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        tc.constraint_name,
        tc.table_name,
        ccu.table_name AS foreign_table_name,
        kcu.column_name,
        ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    JOIN information_schema.table_constraints AS tcu
        ON ccu.constraint_name = tcu.constraint_name
    WHERE tc.table_name = get_foreign_keys.table_name 
    AND tc.table_schema = 'public'
    AND tc.constraint_type = 'FOREIGN KEY';
END;
$$;

COMMIT;

-- Add comments for documentation
COMMENT ON FUNCTION exec_sql(text) IS 'Execute arbitrary SQL - for debugging and admin tasks';
COMMENT ON VIEW businesses IS 'Business view that maps business_users to expected businesses schema';
COMMENT ON FUNCTION get_table_definition(text) IS 'Get table column definitions for debugging';
COMMENT ON FUNCTION get_foreign_keys(text) IS 'Get foreign key constraints for debugging';

-- Log the migration completion
DO $$
BEGIN
    RAISE NOTICE 'Migration 20260421_fix_businesses_schema completed successfully';
END $$;
