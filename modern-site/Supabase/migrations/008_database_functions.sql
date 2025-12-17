-- =============================================
-- Migration: 008_database_functions
-- Description: Database functions for business logic
-- =============================================

-- ========================================
-- Function: handle_new_user
-- Called when a new user signs up via auth trigger
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user_account record
  INSERT INTO public.user_accounts (id, email, account_tier)
  VALUES (
    NEW.id,
    NEW.email,
    'default_draft'  -- Default to FREE tier
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates user_account when auth user is created';

-- ========================================
-- Function: upgrade_to_pro
-- Upgrades user to Pro subscription
-- ========================================
CREATE OR REPLACE FUNCTION public.upgrade_to_pro(
  p_user_id UUID,
  p_subscription_id UUID,
  p_payment_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update user account tier
  UPDATE public.user_accounts
  SET 
    account_tier = 'pro_subscription',
    subscription_status = 'active',
    subscription_started_at = NOW(),
    subscription_ends_at = NOW() + INTERVAL '1 month',
    last_payment_at = NOW(),
    next_payment_due_at = NOW() + INTERVAL '1 month',
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Update subscription status
  UPDATE public.subscriptions
  SET 
    status = 'active',
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '1 month',
    updated_at = NOW()
  WHERE id = p_subscription_id;
  
  -- Update payment status
  UPDATE public.payments
  SET 
    status = 'completed',
    paid_at = NOW(),
    updated_at = NOW()
  WHERE id = p_payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.upgrade_to_pro IS 'Upgrades user to Pro subscription';

-- ========================================
-- Function: downgrade_from_pro
-- Downgrades user from Pro (missed payment or cancellation)
-- ========================================
CREATE OR REPLACE FUNCTION public.downgrade_from_pro(
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update user account tier back to default
  UPDATE public.user_accounts
  SET 
    account_tier = 'default_draft',
    subscription_status = 'expired',
    subscription_ends_at = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Update subscription status
  UPDATE public.subscriptions
  SET 
    status = 'expired',
    ended_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.downgrade_from_pro IS 'Downgrades user from Pro subscription';

-- ========================================
-- Function: process_buyout
-- Processes one-time code buyout purchase
-- ========================================
CREATE OR REPLACE FUNCTION public.process_buyout(
  p_user_id UUID,
  p_draft_project_id UUID,
  p_buyout_id UUID,
  p_payment_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update buyout status
  UPDATE public.buyouts
  SET 
    status = 'completed',
    purchased_at = NOW(),
    code_delivered = TRUE,
    code_delivered_at = NOW(),
    updated_at = NOW()
  WHERE id = p_buyout_id;
  
  -- Update payment status
  UPDATE public.payments
  SET 
    status = 'completed',
    paid_at = NOW(),
    updated_at = NOW()
  WHERE id = p_payment_id;
  
  -- Update user account
  UPDATE public.user_accounts
  SET 
    has_buyout = TRUE,
    buyout_purchased_at = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Update draft project status
  UPDATE public.draft_projects
  SET 
    status = 'buyout_delivered',
    has_buyout = TRUE,
    buyout_purchased_at = NOW(),
    updated_at = NOW()
  WHERE id = p_draft_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.process_buyout IS 'Processes buyout purchase and marks code as delivered';

-- ========================================
-- Function: set_admin_tier
-- Sets user account tier to admin
-- ========================================
CREATE OR REPLACE FUNCTION public.set_admin_tier(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_accounts
  SET account_tier = 'admin',
      updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.set_admin_tier IS 'Promotes user to admin tier';

-- ========================================
-- Function: update_updated_at_column
-- Automatically updates updated_at timestamp
-- ========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at_column IS 'Trigger function to update updated_at timestamp';

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Database functions created successfully';
END $$;

