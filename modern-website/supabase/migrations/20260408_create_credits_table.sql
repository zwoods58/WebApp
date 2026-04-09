-- Create credits table for managing customer credit accounts
-- This table stores overall credit account information

CREATE TABLE IF NOT EXISTS credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    industry VARCHAR(50) NOT NULL DEFAULT 'retail',
    
    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    
    -- Credit details
    total_credit DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance DECIMAL(12,) GENERATED ALWAYS AS (total_credit - total_paid) STORED,
    currency VARCHAR(3) NOT NULL DEFAULT 'TZS',
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'outstanding' 
        CHECK (status IN ('outstanding', 'partial', 'paid', 'overdue')),
    
    -- Dates
    credit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    last_payment_date DATE,
    
    -- Metadata and timestamps
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_credits_business_id ON credits(business_id);
CREATE INDEX IF NOT EXISTS idx_credits_customer_name ON credits(customer_name);
CREATE INDEX IF NOT EXISTS idx_credits_status ON credits(status);
CREATE INDEX IF NOT EXISTS idx_credits_due_date ON credits(due_date);
CREATE INDEX IF NOT EXISTS idx_credits_industry ON credits(industry);

-- Create updated_at trigger
CREATE TRIGGER update_credits_updated_at 
    BEFORE UPDATE ON credits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow businesses to see their own credits
CREATE POLICY "Businesses can view their own credits" ON credits
    FOR SELECT USING (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Allow businesses to create their own credits
CREATE POLICY "Businesses can create their own credits" ON credits
    FOR INSERT WITH CHECK (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Allow businesses to update their own credits
CREATE POLICY "Businesses can update their own credits" ON credits
    FOR UPDATE USING (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Allow businesses to delete their own credits
CREATE POLICY "Businesses can delete their own credits" ON credits
    FOR DELETE USING (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON credits TO authenticated;
GRANT SELECT ON credits TO anon;
