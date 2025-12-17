-- =============================================
-- Migration: 006_ecommerce_orders
-- Description: E-commerce order management
-- =============================================

-- ========================================
-- Orders Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_accounts(id) ON DELETE SET NULL,
  
  -- Customer Info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  
  -- Order Details
  order_number TEXT UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled'
  
  -- Shipping
  shipping_address JSONB,
  shipping_method TEXT,
  tracking_number TEXT,
  
  -- Payment
  payment_method TEXT,
  payment_status payment_status DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.orders IS 'E-commerce orders';
COMMENT ON COLUMN public.orders.status IS 'Order fulfillment status';

-- ========================================
-- Order Items Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  
  -- Product Details
  product_id TEXT,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  
  -- Pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.order_items IS 'Items in each order';

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'orders and order_items tables created successfully';
END $$;

