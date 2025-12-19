-- Fix Transactions RLS Policies to Support Custom Auth
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can delete own transactions" ON transactions;

-- Create RLS Policies that work with both Supabase Auth and custom auth
-- These policies check if user_id exists in users table OR matches auth.uid()

-- SELECT policy - users can view their own transactions
CREATE POLICY "Users can view own transactions"
ON transactions
FOR SELECT
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = transactions.user_id
  )
);

-- INSERT policy - users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
ON transactions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = user_id
  )
);

-- UPDATE policy - users can update their own transactions
CREATE POLICY "Users can update own transactions"
ON transactions
FOR UPDATE
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = transactions.user_id
  )
)
WITH CHECK (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = user_id
  )
);

-- DELETE policy - users can delete their own transactions
CREATE POLICY "Users can delete own transactions"
ON transactions
FOR DELETE
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = transactions.user_id
  )
);

