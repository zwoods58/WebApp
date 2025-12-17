-- Fix RLS Policies for Reports Table - Support Custom Auth
-- This allows users to insert/select their own reports using custom auth (user_id from localStorage)

-- ============================================
-- REPORTS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own reports" ON reports;
DROP POLICY IF EXISTS "Users can create own reports" ON reports;
DROP POLICY IF EXISTS "Users can insert own reports" ON reports;
DROP POLICY IF EXISTS "Public can view own reports" ON reports;
DROP POLICY IF EXISTS "Public can insert own reports" ON reports;

-- Allow public to view reports where user_id exists in users table
-- This works with custom auth where user_id is sent from frontend
CREATE POLICY "Public can view own reports" ON reports
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = reports.user_id
        )
    );

-- Allow public to insert reports where user_id exists in users table
-- Frontend will send the correct user_id from localStorage
CREATE POLICY "Public can insert own reports" ON reports
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = reports.user_id
        )
    );

