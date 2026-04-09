-- Create credit_items table for tracking individual credit line items
-- This table stores individual items within a credit account

CREATE TABLE IF NOT EXISTS credit_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    credit_id UUID NOT NULL REFERENCES credits(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    industry VARCHAR(50) NOT NULL DEFAULT 'retail',
    
    -- Item details
    description TEXT,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'TZS',
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'outstanding' 
        CHECK (status IN ('outstanding', 'partial', 'paid', 'overdue')),
    
    -- Dates
    due_date DATE NOT NULL,
    date_given DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Metadata and timestamps
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_items_credit_id ON credit_items(credit_id);
CREATE INDEX IF NOT EXISTS idx_credit_items_business_id ON credit_items(business_id);
CREATE INDEX IF NOT EXISTS idx_credit_items_status ON credit_items(status);
CREATE INDEX IF NOT EXISTS idx_credit_items_due_date ON credit_items(due_date);
CREATE INDEX IF NOT EXISTS idx_credit_items_industry ON credit_items(industry);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_credit_items_updated_at 
    BEFORE UPDATE ON credit_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE credit_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow businesses to see their own credit items
CREATE POLICY "Businesses can view their own credit items" ON credit_items
    FOR SELECT USING (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Allow businesses to create their own credit items
CREATE POLICY "Businesses can create their own credit items" ON credit_items
    FOR INSERT WITH CHECK (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Allow businesses to update their own credit items
CREATE POLICY "Businesses can update their own credit items" ON credit_items
    FOR UPDATE USING (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Allow businesses to delete their own credit items
CREATE POLICY "Businesses can delete their own credit items" ON credit_items
    FOR DELETE USING (business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
    ));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON credit_items TO authenticated;
GRANT SELECT ON credit_items TO anon;
