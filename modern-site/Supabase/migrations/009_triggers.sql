-- =============================================
-- Migration: 009_triggers
-- Description: Database triggers for automation
-- =============================================

-- ========================================
-- Trigger: Create user_account on signup
-- NOTE: Cannot create trigger on auth.users via SQL
-- Must be set up via Supabase Dashboard instead
-- ========================================

-- IMPORTANT: After running all migrations, set up this trigger manually:
-- 
-- Option 1: Via SQL Editor with superuser permissions (if available):
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW 
--   EXECUTE FUNCTION public.handle_new_user();
--
-- Option 2: Via Database Webhooks (Recommended):
-- Go to: Database → Webhooks → Create a new webhook
-- Table: auth.users
-- Events: INSERT
-- Type: PostgreSQL Function
-- Function: public.handle_new_user()
--
-- The function handle_new_user() is already created in migration 008.
-- It will auto-create user_accounts when users sign up.

DO $$ BEGIN
  RAISE NOTICE 'Skipping auth.users trigger - must be set up via Supabase Dashboard';
  RAISE NOTICE 'See migration file comments for instructions';
END $$;

-- ========================================
-- Triggers: Auto-update updated_at timestamp
-- ========================================

-- user_accounts
DROP TRIGGER IF EXISTS update_user_accounts_updated_at ON public.user_accounts;
CREATE TRIGGER update_user_accounts_updated_at
  BEFORE UPDATE ON public.user_accounts
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- draft_projects
DROP TRIGGER IF EXISTS update_draft_projects_updated_at ON public.draft_projects;
CREATE TRIGGER update_draft_projects_updated_at
  BEFORE UPDATE ON public.draft_projects
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- subscriptions
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- payments
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- buyouts
DROP TRIGGER IF EXISTS update_buyouts_updated_at ON public.buyouts;
CREATE TRIGGER update_buyouts_updated_at
  BEFORE UPDATE ON public.buyouts
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- project_assets
DROP TRIGGER IF EXISTS update_project_assets_updated_at ON public.project_assets;
CREATE TRIGGER update_project_assets_updated_at
  BEFORE UPDATE ON public.project_assets
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Triggers created successfully';
END $$;

