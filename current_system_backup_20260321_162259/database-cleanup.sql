-- Database Cleanup Script
-- Clears all user and business data while preserving table structure
-- Executes in correct order to respect foreign key constraints
-- Removes all RLS policies for complete cleanup

-- Step 1: Drop all RLS policies
DROP POLICY IF EXISTS "Businesses strict access" ON businesses;
DROP POLICY IF EXISTS "Credit access policy" ON credit;
DROP POLICY IF EXISTS "Expenses access policy" ON expenses;
DROP POLICY IF EXISTS "Transactions access policy" ON transactions;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Appointments access policy" ON appointments;
DROP POLICY IF EXISTS "Users can manage own beehive comments" ON beehive_comments;
DROP POLICY IF EXISTS "Users can view relevant beehive comments" ON beehive_comments;
DROP POLICY IF EXISTS "Users can manage own beehive requests" ON beehive_requests;
DROP POLICY IF EXISTS "Users can view beehive requests in industry" ON beehive_requests;
DROP POLICY IF EXISTS "Users can manage own beehive votes" ON beehive_votes;
DROP POLICY IF EXISTS "Inventory access policy" ON inventory;
DROP POLICY IF EXISTS "Users can manage their own OTP verifications" ON otp_verifications;
DROP POLICY IF EXISTS "Users can manage own services" ON services;
DROP POLICY IF EXISTS "Users can manage own targets" ON targets;

-- Step 2: Disable RLS on all tables
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE beehive_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE beehive_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE beehive_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE targets DISABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes DISABLE ROW LEVEL SECURITY;

-- Step 3: Delete from tables that reference users and businesses first
DELETE FROM beehive_votes;
DELETE FROM beehive_comments;
DELETE FROM beehive_requests;
DELETE FROM appointments;
DELETE FROM services;
DELETE FROM targets;
DELETE FROM inventory;
DELETE FROM credit;
DELETE FROM expenses;
DELETE FROM transactions;

-- Step 4: Now delete from businesses and users (main tables)
DELETE FROM businesses;
DELETE FROM users;

-- Step 5: Clear OTP tables
DELETE FROM otp_verifications;
DELETE FROM otp_codes;

-- Step 6: Verify cleanup
SELECT 'users table count: ' || COUNT(*) FROM users;
SELECT 'businesses table count: ' || COUNT(*) FROM businesses;
SELECT 'transactions table count: ' || COUNT(*) FROM transactions;
SELECT 'expenses table count: ' || COUNT(*) FROM expenses;
SELECT 'credit table count: ' || COUNT(*) FROM credit;

-- Step 7: Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Table structures remain intact for new signup implementation
-- All foreign key constraints preserved
-- All RLS policies removed - complete clean slate
-- Ready for fresh user and business data
