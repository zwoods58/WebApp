-- Create Inventory Table
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(12, 2) DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'units',
    cost_price DECIMAL(12, 2) DEFAULT 0,
    selling_price DECIMAL(12, 2) DEFAULT 0,
    category VARCHAR(100),
    min_stock_level DECIMAL(12, 2) DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can manage their own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can view their own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can insert their own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can update their own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can delete their own inventory" ON public.inventory;

-- Create separate RLS Policies that work with both Supabase Auth and custom auth
-- These policies check if user_id exists in the users table OR matches auth.uid()

-- SELECT policy - users can view their own inventory
CREATE POLICY "Users can view their own inventory"
ON public.inventory
FOR SELECT
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = inventory.user_id
  )
);

-- INSERT policy - users can insert their own inventory
CREATE POLICY "Users can insert their own inventory"
ON public.inventory
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = user_id
  )
);

-- UPDATE policy - users can update their own inventory
CREATE POLICY "Users can update their own inventory"
ON public.inventory
FOR UPDATE
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = inventory.user_id
  )
)
WITH CHECK (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = user_id
  )
);

-- DELETE policy - users can delete their own inventory
CREATE POLICY "Users can delete their own inventory"
ON public.inventory
FOR DELETE
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = inventory.user_id
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON public.inventory(category);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_inventory_updated_at_trigger ON public.inventory;

CREATE TRIGGER update_inventory_updated_at_trigger
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();

