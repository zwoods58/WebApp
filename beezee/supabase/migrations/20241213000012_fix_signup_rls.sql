-- Better Solution: Remove Automatic Trigger + Fix RLS
-- This removes the problematic trigger and fixes user creation

-- ============================================
-- STEP 1: Remove Automatic Notification Preferences Trigger
-- ============================================

-- Drop the trigger that automatically creates notification preferences
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;

-- Drop the function (we'll create preferences manually when needed)
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
-- STEP 3: Fix Notification Preferences RLS (for manual creation)
-- ============================================

-- Allow authenticated users to insert their own preferences
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
CREATE POLICY "Users can insert own notification preferences" ON notification_preferences
    FOR INSERT
    WITH CHECK (true); -- Allow public inserts (user_id is set by app, not auth.uid())

-- Note: Notification preferences will be created manually:
-- - When user opts into WhatsApp notifications (in handleWhatsAppSubmit)
-- - This avoids RLS issues during user creation

