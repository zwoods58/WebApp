-- Migration: Create unified business_transactions table and remove expenses tables
-- This migration consolidates transactions and expenses into a single table for money in/out

-- Step 1: Remove old expenses tables
DROP TABLE IF EXISTS expenses_cold CASCADE;
DROP TABLE IF EXISTS expenses_hot CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;

-- Step 2: Create new unified business_transactions table
CREATE TABLE IF NOT EXISTS business_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('money_in', 'money_out')),
    industry TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    category TEXT,
    description TEXT,
    customer_name TEXT, -- For money_in transactions
    vendor_name TEXT,  -- For money_out transactions (from expenses)
    supplier_phone TEXT, -- For money_out transactions (from expenses)
    payment_method VARCHAR(50),
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_transactions_business_id ON business_transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_business_transactions_type ON business_transactions(type);
CREATE INDEX IF NOT EXISTS idx_business_transactions_date ON business_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_business_transactions_industry ON business_transactions(industry);
CREATE INDEX IF NOT EXISTS idx_business_transactions_category ON business_transactions(category);

-- Step 4: Enable RLS
ALTER TABLE business_transactions ENABLE ROW LEVEL SECURITY;

-- Step 5: Add RLS policies
CREATE POLICY "Users can view their own business transactions" ON business_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_transactions.business_id 
            AND businesses.supabase_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own business transactions" ON business_transactions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_transactions.business_id 
            AND businesses.supabase_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own business transactions" ON business_transactions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_transactions.business_id 
            AND businesses.supabase_user_id = auth.uid()
        )
    );

-- Step 6: Add comments for clarity
COMMENT ON TABLE business_transactions IS 'Unified table for all business money in/out transactions';
COMMENT ON COLUMN business_transactions.type IS 'Transaction type: money_in (sales) or money_out (expenses)';
COMMENT ON COLUMN business_transactions.customer_name IS 'Customer name for money_in transactions';
COMMENT ON COLUMN business_transactions.vendor_name IS 'Vendor/supplier name for money_out transactions';
COMMENT ON COLUMN business_transactions.supplier_phone IS 'Supplier phone number for money_out transactions';
