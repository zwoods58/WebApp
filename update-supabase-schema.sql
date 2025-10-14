-- Add missing columns to Supabase schema
-- Run this in your Supabase SQL Editor

-- Add unsubscribed column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN DEFAULT FALSE;

-- Add last_contact column to leads table (if missing)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contact TIMESTAMP WITH TIME ZONE;

-- Update the leads table to ensure all required columns exist
-- This is safe to run multiple times
DO $$
BEGIN
    -- Add unsubscribed column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'leads' AND column_name = 'unsubscribed') THEN
        ALTER TABLE leads ADD COLUMN unsubscribed BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add last_contact column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'leads' AND column_name = 'last_contact') THEN
        ALTER TABLE leads ADD COLUMN last_contact TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Verify the schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
