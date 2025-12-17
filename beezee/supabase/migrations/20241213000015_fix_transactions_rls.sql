-- Fix RLS Policies for Transactions Table - Support Custom Auth
-- This allows users to insert/select/update/delete their own transactions using custom auth (user_id from localStorage)

-- ============================================
-- TRANSACTIONS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Public can delete own transactions" ON transactions;

-- Allow public to view transactions where user_id exists in users table
-- This works with custom auth where user_id is sent from frontend
CREATE POLICY "Public can view own transactions" ON transactions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = transactions.user_id
        )
    );

-- Allow public to insert transactions where user_id exists in users table
-- Frontend will send the correct user_id from localStorage
CREATE POLICY "Public can insert own transactions" ON transactions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = transactions.user_id
        )
    );

-- Allow public to update transactions where user_id exists in users table
CREATE POLICY "Public can update own transactions" ON transactions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = transactions.user_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = transactions.user_id
        )
    );

-- Allow public to delete transactions where user_id exists in users table
CREATE POLICY "Public can delete own transactions" ON transactions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = transactions.user_id
        )
    );

