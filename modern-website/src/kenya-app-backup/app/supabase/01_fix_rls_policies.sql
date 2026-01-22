-- Fix RLS Policies for Signup Flow
-- Allow public signup while maintaining security

-- ========================================
-- 1. Drop Existing Policies
-- ========================================

DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;
DROP POLICY IF EXISTS "Users can only access their own country data" ON user_countries;
DROP POLICY IF EXISTS "Users can only access their own login attempts" ON login_attempts;

-- ========================================
-- 2. Create New RLS Policies
-- ========================================

-- Users table policies
CREATE POLICY "Allow public signup" 
ON users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view own data" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
ON users 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can delete own data" 
ON users 
FOR DELETE 
USING (auth.uid() = id);

-- User countries table policies
CREATE POLICY "Users can only access their own country data" 
ON user_countries 
FOR ALL 
USING (auth.uid() = user_id);

-- Login attempts table policies
CREATE POLICY "Users can only access their own login attempts" 
ON login_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

-- ========================================
-- 3. Ensure RLS is Enabled
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. Complete
-- ========================================
-- RLS policies now allow public signup while maintaining security
-- Authenticated users can only access their own data
