-- Fix RLS policies for credit_items table
-- This addresses the RLS policy violation errors

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Businesses can view their own credit items" ON credit_items;
DROP POLICY IF EXISTS "Businesses can create their own credit items" ON credit_items;
DROP POLICY IF EXISTS "Businesses can update their own credit items" ON credit_items;
DROP POLICY IF EXISTS "Businesses can delete their own credit items" ON credit_items;

-- Create improved RLS policies with direct business ownership check
-- Allow businesses to view their own credit items
CREATE POLICY "Businesses can view their own credit items" ON credit_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = credit_items.business_id 
            AND user_id = auth.uid()
        )
    );

-- Allow businesses to create their own credit items
CREATE POLICY "Businesses can create their own credit items" ON credit_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = credit_items.business_id 
            AND user_id = auth.uid()
        )
    );

-- Allow businesses to update their own credit items
CREATE POLICY "Businesses can update their own credit items" ON credit_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = credit_items.business_id 
            AND user_id = auth.uid()
        )
    );

-- Allow businesses to delete their own credit items
CREATE POLICY "Businesses can delete their own credit items" ON credit_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE id = credit_items.business_id 
            AND user_id = auth.uid()
        )
    );

-- Ensure RLS is enabled
ALTER TABLE credit_items ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON credit_items TO authenticated;
GRANT SELECT ON credit_items TO anon;
