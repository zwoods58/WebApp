-- Supabase Authentication Verification Script
-- Run this in your Supabase SQL Editor to verify your setup

-- ========================================
-- 1. Check Email Confirmation Setup
-- ========================================
-- This query shows if email confirmation columns exist and are working
SELECT 
  'Email Confirmation Columns' as check_type,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Available'
    ELSE '❌ Missing'
  END as status,
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- ========================================
-- 2. Check Business Integration
-- ========================================
-- This query verifies businesses are linked to Supabase users
SELECT 
  'Business Integration' as check_type,
  COUNT(*) as total_businesses,
  COUNT(CASE WHEN supabase_user_id IS NOT NULL THEN 1 END) as businesses_with_supabase_auth,
  COUNT(CASE WHEN supabase_user_id IS NULL THEN 1 END) as businesses_needing_migration,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as businesses_with_email
FROM businesses;

-- ========================================
-- 3. Check RLS Policies
-- ========================================
-- This query shows all RLS policies on key tables
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual LIKE '%supabase_user_id%' THEN '✅ Uses Supabase Auth'
    WHEN qual LIKE '%auth.uid()%' THEN '✅ Uses Auth UID'
    ELSE '⚠️ Check Policy'
  END as auth_type
FROM pg_policies 
WHERE tablename IN ('businesses', 'transactions', 'services', 'inventory', 'expenses')
ORDER BY tablename, policyname;

-- ========================================
-- 4. Test User Creation
-- ========================================
-- Uncomment and run this to create a test user (for development only)
/*
INSERT INTO auth.users (
  id,
  email,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  NOW(),
  NOW()
);
*/

-- ========================================
-- 5. Cleanup Test Data
-- ========================================
-- Uncomment to remove test user
/*
DELETE FROM auth.users WHERE email = 'test@example.com';
*/

-- ========================================
-- Usage Instructions
-- ========================================
/*
1. Copy this entire script
2. Go to: https://zruprmhkcqhgzydjfhrk.supabase.co/project/_/sql
3. Paste and run the script
4. Review the results:
   - ✅ Email confirmation columns should exist
   - ✅ Businesses should show integration status
   - ✅ RLS policies should use supabase_user_id
5. Fix any issues found before testing the app
*/
