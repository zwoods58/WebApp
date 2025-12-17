-- Complete RLS Fix - Remove ALL Notification Preferences Triggers
-- This removes everything related to automatic notification preferences creation

-- ============================================
-- STEP 1: Remove ALL Triggers and Functions
-- ============================================

-- Drop the trigger
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;

-- Drop the function (completely remove it)
DROP FUNCTION IF EXISTS create_notification_preferences_for_user() CASCADE;

-- ============================================
-- STEP 2: Fix Users Table RLS
-- ============================================

-- Allow public to insert new users (for signup)
DROP POLICY IF EXISTS "Public can insert users" ON users;
CREATE POLICY "Public can insert users" ON users
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select users (to check if user exists)
DROP POLICY IF EXISTS "Public can select users by whatsapp" ON users;
CREATE POLICY "Public can select users by whatsapp" ON users
    FOR SELECT
    USING (true);

-- ============================================
-- STEP 3: Fix Notification Preferences RLS - Allow Public Inserts
-- ============================================

-- Drop ALL existing policies on notification_preferences
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Service role can insert notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Public can insert notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Public can select notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Public can update notification preferences" ON notification_preferences;

-- Allow public to insert notification preferences (for manual creation)
CREATE POLICY "Public can insert notification preferences" ON notification_preferences
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select notification preferences (to check if exists)
CREATE POLICY "Public can select notification preferences" ON notification_preferences
    FOR SELECT
    USING (true);

-- Allow public to update notification preferences (for updating preferences)
CREATE POLICY "Public can update notification preferences" ON notification_preferences
    FOR UPDATE
    USING (true);
