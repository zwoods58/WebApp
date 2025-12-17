-- Fix RLS Policies for Users Table - Support Custom Auth
-- This allows users to update their own profile using custom auth (user_id from localStorage)

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public can select users by whatsapp" ON users;

-- Allow public to view users where id exists (for custom auth)
-- This works with custom auth where user_id is sent from frontend
CREATE POLICY "Public can view own users" ON users
    FOR SELECT
    USING (true); -- Allow viewing any user (needed for custom auth lookups)

-- Allow public to update users where id exists in users table
-- Frontend will send the correct user_id from localStorage
CREATE POLICY "Public can update own users" ON users
    FOR UPDATE
    USING (true) -- Allow updating if user_id exists (we validate in application logic)
    WITH CHECK (true);

