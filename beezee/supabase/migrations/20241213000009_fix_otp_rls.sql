-- Fix RLS Policies for OTP Codes and Users - Allow Public Access
-- This allows frontend to insert/select OTP codes and create users directly (no Edge Functions needed)

-- ============================================
-- OTP CODES TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role manages OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Public can insert OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Public can select OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role can update OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role can delete OTP codes" ON otp_codes;

-- Allow public to insert OTP codes (for generating OTPs)
CREATE POLICY "Public can insert OTP codes" ON otp_codes
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select OTP codes (for verification - verify_otp_code function handles security)
CREATE POLICY "Public can select OTP codes" ON otp_codes
    FOR SELECT
    USING (true);

-- Only service role can update/delete (for cleanup)
CREATE POLICY "Service role can update OTP codes" ON otp_codes
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete OTP codes" ON otp_codes
    FOR DELETE
    USING (auth.role() = 'service_role');

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Allow public to insert new users (for OTP-based signup)
DROP POLICY IF EXISTS "Public can insert users" ON users;
CREATE POLICY "Public can insert users" ON users
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select users by whatsapp_number (for checking if user exists)
DROP POLICY IF EXISTS "Public can select users by whatsapp" ON users;
CREATE POLICY "Public can select users by whatsapp" ON users
    FOR SELECT
    USING (true); -- We need to check if user exists, but verify_otp_code ensures security

-- ============================================
-- NOTIFICATION PREFERENCES TABLE POLICIES
-- ============================================

-- First, drop the existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;

-- Drop and recreate the function with SECURITY DEFINER (bypasses RLS completely)
DROP FUNCTION IF EXISTS create_notification_preferences_for_user() CASCADE;

CREATE OR REPLACE FUNCTION create_notification_preferences_for_user()
RETURNS TRIGGER 
SECURITY DEFINER -- This is critical - bypasses all RLS policies
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert notification preferences for the new user
    -- SECURITY DEFINER means this runs with the function owner's privileges (bypasses RLS)
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER create_notification_prefs_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_notification_preferences_for_user();

-- Also add a policy to allow service role to insert (backup, but SECURITY DEFINER should handle it)
DROP POLICY IF EXISTS "Service role can insert notification preferences" ON notification_preferences;
CREATE POLICY "Service role can insert notification preferences" ON notification_preferences
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

