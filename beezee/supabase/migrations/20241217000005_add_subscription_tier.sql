-- Migration: add_subscription_tier_to_users
-- Description: Adds a subscription tier to the users table to differentiate between manual and AI features.

-- Add column if not exists
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'ai' CHECK (subscription_tier IN ('manual', 'ai'));

-- Default existing users to 'ai' (or you could default to 'manual' if you prefer)
UPDATE public.users SET subscription_tier = 'ai' WHERE subscription_tier IS NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS users_subscription_tier_idx ON public.users(subscription_tier);

