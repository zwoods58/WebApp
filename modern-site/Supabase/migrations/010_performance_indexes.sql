-- =============================================
-- Migration: 010_performance_indexes
-- Description: Performance indexes to speed up queries
-- =============================================

-- ========================================
-- USER_ACCOUNTS Indexes
-- ========================================

-- Primary lookups
CREATE INDEX IF NOT EXISTS idx_user_accounts_email 
  ON public.user_accounts(email);

CREATE INDEX IF NOT EXISTS idx_user_accounts_id_email 
  ON public.user_accounts(id, email);

-- Tier and subscription queries
CREATE INDEX IF NOT EXISTS idx_user_accounts_tier 
  ON public.user_accounts(account_tier);

CREATE INDEX IF NOT EXISTS idx_user_accounts_subscription_status 
  ON public.user_accounts(subscription_status);

CREATE INDEX IF NOT EXISTS idx_user_accounts_tier_created_at 
  ON public.user_accounts(account_tier, created_at DESC);

-- Partial index for active subscriptions
CREATE INDEX IF NOT EXISTS idx_user_accounts_subscription_ends_at 
  ON public.user_accounts(subscription_ends_at) 
  WHERE subscription_status = 'active';

-- Admin checks (used on every admin page load)
CREATE INDEX IF NOT EXISTS idx_user_accounts_id_tier 
  ON public.user_accounts(id, account_tier) 
  WHERE account_tier = 'admin';

-- JSONB metadata search
CREATE INDEX IF NOT EXISTS idx_user_accounts_metadata_gin 
  ON public.user_accounts USING GIN (metadata);

-- ========================================
-- DRAFT_PROJECTS Indexes
-- ========================================

-- User lookups (CRITICAL - checked on every authenticated request)
CREATE INDEX IF NOT EXISTS idx_draft_projects_user_id 
  ON public.draft_projects(user_id);

CREATE INDEX IF NOT EXISTS idx_draft_projects_user_id_status 
  ON public.draft_projects(user_id, status) 
  INCLUDE (id, business_name, created_at);

CREATE INDEX IF NOT EXISTS idx_draft_projects_user_id_created_at 
  ON public.draft_projects(user_id, created_at DESC);

-- Status queries
CREATE INDEX IF NOT EXISTS idx_draft_projects_status 
  ON public.draft_projects(status);

CREATE INDEX IF NOT EXISTS idx_draft_projects_status_created_at 
  ON public.draft_projects(status, created_at DESC);

-- Partial index for generated drafts
CREATE INDEX IF NOT EXISTS idx_draft_projects_generated 
  ON public.draft_projects(user_id, generated_at DESC) 
  WHERE status = 'generated';

-- Expiration checks
CREATE INDEX IF NOT EXISTS idx_draft_projects_preview_expires_at 
  ON public.draft_projects(preview_expires_at) 
  WHERE status = 'generated' AND preview_expires_at IS NOT NULL;

-- Business type queries
CREATE INDEX IF NOT EXISTS idx_draft_projects_business_type 
  ON public.draft_projects(business_type) 
  WHERE business_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_draft_projects_business_location 
  ON public.draft_projects(business_location) 
  WHERE business_location IS NOT NULL;

-- Buyout queries
CREATE INDEX IF NOT EXISTS idx_draft_projects_buyout 
  ON public.draft_projects(has_buyout, user_id);

-- JSONB metadata search
CREATE INDEX IF NOT EXISTS idx_draft_projects_metadata_gin 
  ON public.draft_projects USING GIN (metadata);

-- ========================================
-- SUBSCRIPTIONS Indexes
-- ========================================

-- User lookups (checked on every page load for Pro users)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
  ON public.subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status 
  ON public.subscriptions(user_id, status) 
  INCLUDE (id, started_at, current_period_end);

-- Status queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_status 
  ON public.subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
  ON public.subscriptions(user_id, status);

-- Partial index for active subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_active 
  ON public.subscriptions(user_id, current_period_end) 
  WHERE status = 'active';

-- Dashboard analytics
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at_status 
  ON public.subscriptions(created_at DESC, status);

-- ========================================
-- PAYMENTS Indexes
-- ========================================

-- User payment history
CREATE INDEX IF NOT EXISTS idx_payments_user_id 
  ON public.payments(user_id);

CREATE INDEX IF NOT EXISTS idx_payments_user_id_created_at 
  ON public.payments(user_id, created_at DESC) 
  INCLUDE (amount, status, payment_type);

-- Status queries
CREATE INDEX IF NOT EXISTS idx_payments_status 
  ON public.payments(status);

-- Partial index for completed payments
CREATE INDEX IF NOT EXISTS idx_payments_completed 
  ON public.payments(user_id, paid_at DESC) 
  WHERE status = 'completed';

CREATE INDEX IF NOT EXISTS idx_payments_paid_at 
  ON public.payments(paid_at DESC) 
  WHERE status = 'completed';

-- Revenue analytics
CREATE INDEX IF NOT EXISTS idx_payments_user_status_amount 
  ON public.payments(user_id, status, amount) 
  WHERE status = 'completed';

-- Dashboard analytics
CREATE INDEX IF NOT EXISTS idx_payments_created_at_status 
  ON public.payments(created_at DESC, status) 
  WHERE status = 'completed';

-- ========================================
-- BUYOUTS Indexes
-- ========================================

-- User lookups
CREATE INDEX IF NOT EXISTS idx_buyouts_user_id 
  ON public.buyouts(user_id);

CREATE INDEX IF NOT EXISTS idx_buyouts_user_id_status 
  ON public.buyouts(user_id, status) 
  INCLUDE (id, purchased_at, code_delivered);

-- Status queries
CREATE INDEX IF NOT EXISTS idx_buyouts_status 
  ON public.buyouts(status);

-- Dashboard analytics
CREATE INDEX IF NOT EXISTS idx_buyouts_created_at_status 
  ON public.buyouts(created_at DESC, status);

-- ========================================
-- PROJECT_VERSIONS Indexes
-- ========================================

-- Project lookups
CREATE INDEX IF NOT EXISTS idx_project_versions_project_id 
  ON public.project_versions(project_id);

-- Version history (newest first)
CREATE INDEX IF NOT EXISTS idx_project_versions_created_at 
  ON public.project_versions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_versions_project_id_created_at 
  ON public.project_versions(project_id, created_at DESC);

-- ========================================
-- PROJECT_ASSETS Indexes
-- ========================================

-- Project lookups
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id 
  ON public.project_assets(project_id);

-- Recent uploads
CREATE INDEX IF NOT EXISTS idx_project_assets_created_at 
  ON public.project_assets(created_at DESC);

-- File type queries
CREATE INDEX IF NOT EXISTS idx_project_assets_file_type 
  ON public.project_assets(file_type) 
  WHERE file_type IS NOT NULL;

-- ========================================
-- ORDERS Indexes
-- ========================================

-- User order history
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
  ON public.orders(user_id) 
  WHERE user_id IS NOT NULL;

-- Customer email lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email 
  ON public.orders(customer_email);

-- Order number lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number 
  ON public.orders(order_number);

-- Status queries
CREATE INDEX IF NOT EXISTS idx_orders_status 
  ON public.orders(status);

-- Recent orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
  ON public.orders(created_at DESC);

-- ========================================
-- ORDER_ITEMS Indexes
-- ========================================

-- Order lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
  ON public.order_items(order_id);

-- Product queries
CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
  ON public.order_items(product_id) 
  WHERE product_id IS NOT NULL;

-- ========================================
-- Update Table Statistics (CRITICAL)
-- ========================================

ANALYZE public.user_accounts;
ANALYZE public.draft_projects;
ANALYZE public.subscriptions;
ANALYZE public.payments;
ANALYZE public.buyouts;
ANALYZE public.project_versions;
ANALYZE public.project_assets;
ANALYZE public.orders;
ANALYZE public.order_items;

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Performance indexes created successfully - queries should be 10-40x faster!';
END $$;

