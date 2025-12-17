-- Simplified Fix for RLS Policies - Step by Step
-- Run each section separately if you get errors

-- ============================================
-- STEP 1: Fix OTP Codes Table
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role manages OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Public can insert OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Public can select OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role can update OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role can delete OTP codes" ON otp_codes;

-- Allow public to insert OTP codes
CREATE POLICY "Public can insert OTP codes" ON otp_codes
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select OTP codes
CREATE POLICY "Public can select OTP codes" ON otp_codes
    FOR SELECT
    USING (true);

-- Service role can update/delete
CREATE POLICY "Service role can update OTP codes" ON otp_codes
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete OTP codes" ON otp_codes
    FOR DELETE
    USING (auth.role() = 'service_role');

-- ============================================
-- STEP 2: Fix Users Table
-- ============================================

-- Allow public to insert new users
DROP POLICY IF EXISTS "Public can insert users" ON users;
CREATE POLICY "Public can insert users" ON users
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select users
DROP POLICY IF EXISTS "Public can select users by whatsapp" ON users;
CREATE POLICY "Public can select users by whatsapp" ON users
    FOR SELECT
    USING (true);

-- ============================================
-- STEP 3: Fix Notification Preferences Trigger
-- ============================================

-- First, drop the trigger
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;

-- Drop the function
DROP FUNCTION IF EXISTS create_notification_preferences_for_user() CASCADE;

-- Recreate function with SECURITY DEFINER
CREATE FUNCTION create_notification_preferences_for_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
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

