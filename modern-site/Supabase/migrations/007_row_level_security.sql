-- =============================================
-- Migration: 007_row_level_security
-- Description: Enable RLS and create security policies
-- =============================================

-- ========================================
-- Enable RLS on all tables
-- ========================================
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ========================================
-- USER_ACCOUNTS Policies
-- ========================================

-- Users can view their own account
CREATE POLICY "Users can view own account"
  ON public.user_accounts
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own account
CREATE POLICY "Users can update own account"
  ON public.user_accounts
  FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- DRAFT_PROJECTS Policies
-- ========================================

-- Users can view their own drafts
CREATE POLICY "Users can view own drafts"
  ON public.draft_projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own drafts
CREATE POLICY "Users can create own drafts"
  ON public.draft_projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own drafts
CREATE POLICY "Users can update own drafts"
  ON public.draft_projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own drafts
CREATE POLICY "Users can delete own drafts"
  ON public.draft_projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- SUBSCRIPTIONS Policies
-- ========================================

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- PAYMENTS Policies
-- ========================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- BUYOUTS Policies
-- ========================================

-- Users can view their own buyouts
CREATE POLICY "Users can view own buyouts"
  ON public.buyouts
  FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- PROJECT_VERSIONS Policies
-- ========================================

-- Users can view versions of their own projects
CREATE POLICY "Users can view own project versions"
  ON public.project_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.draft_projects 
      WHERE draft_projects.id = project_versions.project_id 
      AND draft_projects.user_id = auth.uid()
    )
  );

-- Users can create versions for their own projects
CREATE POLICY "Users can create own project versions"
  ON public.project_versions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.draft_projects 
      WHERE draft_projects.id = project_versions.project_id 
      AND draft_projects.user_id = auth.uid()
    )
  );

-- ========================================
-- PROJECT_ASSETS Policies
-- ========================================

-- Users can view assets of their own projects
CREATE POLICY "Users can view own project assets"
  ON public.project_assets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.draft_projects 
      WHERE draft_projects.id = project_assets.project_id 
      AND draft_projects.user_id = auth.uid()
    )
  );

-- Users can create assets for their own projects
CREATE POLICY "Users can create own project assets"
  ON public.project_assets
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.draft_projects 
      WHERE draft_projects.id = project_assets.project_id 
      AND draft_projects.user_id = auth.uid()
    )
  );

-- Users can update assets of their own projects
CREATE POLICY "Users can update own project assets"
  ON public.project_assets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.draft_projects 
      WHERE draft_projects.id = project_assets.project_id 
      AND draft_projects.user_id = auth.uid()
    )
  );

-- Users can delete assets of their own projects
CREATE POLICY "Users can delete own project assets"
  ON public.project_assets
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.draft_projects 
      WHERE draft_projects.id = project_assets.project_id 
      AND draft_projects.user_id = auth.uid()
    )
  );

-- ========================================
-- ORDERS Policies
-- ========================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true); -- Anyone can create an order

-- ========================================
-- ORDER_ITEMS Policies
-- ========================================

-- Users can view items in their own orders
CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (
        orders.user_id = auth.uid() 
        OR orders.customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

-- ========================================
-- IMPORTANT NOTE:
-- Admin access is handled via service role key in API routes
-- Service role key bypasses RLS, so admins have full access
-- ========================================

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Row Level Security policies created successfully';
END $$;

