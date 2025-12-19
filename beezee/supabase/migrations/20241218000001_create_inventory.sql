-- Create Inventory Table
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

-- Policies
CREATE POLICY "Users can manage their own inventory"
ON public.inventory
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_inventory_category ON public.inventory(category);

-- Add inventory categories to the categories table if not already present
-- (Optional, using the existing categories table for consistency)

