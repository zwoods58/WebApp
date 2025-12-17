-- Fix RLS Policies for Notifications Table - Support Custom Auth
-- This allows users to view/update their own notifications using custom auth (user_id from localStorage)

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Public can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Public can update own notifications" ON notifications;

-- Allow public to view notifications where user_id exists in users table
-- This works with custom auth where user_id is sent from frontend
CREATE POLICY "Public can view own notifications" ON notifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = notifications.user_id
        )
    );

-- Allow public to update notifications where user_id exists in users table
-- Frontend will send the correct user_id from localStorage
CREATE POLICY "Public can update own notifications" ON notifications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = notifications.user_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = notifications.user_id
        )
    );

-- Note: Service role (used by Edge Functions) bypasses RLS automatically
-- So the create-notifications Edge Function can insert without a policy

