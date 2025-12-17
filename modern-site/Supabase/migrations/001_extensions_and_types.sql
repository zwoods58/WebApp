-- =============================================
-- Migration: 001_extensions_and_types
-- Description: Enable PostgreSQL extensions and create custom types
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for additional crypto functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom enum types
DO $$ BEGIN
  CREATE TYPE account_tier AS ENUM (
    'default_draft',      -- FREE tier - 3 regenerations, 14-day preview
    'pro_subscription',   -- PRO tier - Unlimited, live deployment
    'admin'               -- Admin access
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM (
    'active',      -- Currently active
    'past_due',    -- Payment failed
    'canceled',    -- User canceled
    'expired'      -- Subscription ended
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending',     -- Payment initiated
    'completed',   -- Payment successful
    'failed',      -- Payment failed
    'refunded'     -- Payment refunded
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Extensions and types created successfully';
END $$;

