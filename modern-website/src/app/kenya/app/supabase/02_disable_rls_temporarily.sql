-- Temporary Fix: Disable RLS for Users Table
-- This allows signup during development

-- ========================================
-- 1. Disable RLS for Users Table
-- ========================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. Keep RLS for Other Tables
-- ========================================

ALTER TABLE user_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. Create Simple Policies for Other Tables
-- ========================================

-- User countries policies
DROP POLICY IF EXISTS "Users can only access their own country data" ON user_countries;
CREATE POLICY "Users can only access their own country data" 
ON user_countries 
FOR ALL 
USING (auth.uid() = user_id);

-- Login attempts policies
DROP POLICY IF EXISTS "Users can only access their own login attempts" ON login_attempts;
CREATE POLICY "Users can only access their own login attempts" 
ON login_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

-- ========================================
-- 4. Complete
-- ========================================
-- Users table: No RLS (allows signup)
-- Other tables: RLS enabled (maintains security)
-- This is a temporary fix for development
