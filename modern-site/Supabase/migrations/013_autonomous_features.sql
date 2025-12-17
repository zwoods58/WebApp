-- =============================================
-- Migration: 013_autonomous_features
-- Description: Database support for autonomous operation features (auto-save, runtime monitoring, etc.)
-- Date: 2025-01-XX
-- Dependencies: 003_draft_projects, 012_code_versions
-- =============================================

-- ========================================
-- Add auto-save tracking to draft_projects
-- ========================================

-- Add auto-save metadata fields (stored in metadata JSONB)
-- No schema changes needed - using existing metadata column

-- Add index for querying drafts with auto-save timestamps
-- Note: Indexing as text since timestamp cast is not immutable
-- Queries should cast when filtering: WHERE (metadata->>'last_auto_saved')::timestamp > ...
CREATE INDEX IF NOT EXISTS idx_draft_projects_last_auto_saved 
  ON public.draft_projects((metadata->>'last_auto_saved'))
  WHERE metadata->>'last_auto_saved' IS NOT NULL;

-- ========================================
-- Add runtime error tracking table
-- ========================================

-- Table for tracking runtime errors (for monitoring and analytics)
CREATE TABLE IF NOT EXISTS public.runtime_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES public.draft_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_accounts(id) ON DELETE CASCADE,
  
  -- Error Information
  error_type TEXT NOT NULL, -- 'console', 'network', 'unhandled', 'promise'
  error_message TEXT NOT NULL,
  error_stack TEXT,
  
  -- Context
  url TEXT,
  line_number INTEGER,
  column_number INTEGER,
  user_agent TEXT,
  
  -- Status
  fixed BOOLEAN DEFAULT FALSE,
  fixed_at TIMESTAMP WITH TIME ZONE,
  auto_fixed BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.runtime_errors IS 'Runtime error tracking for monitoring and auto-fixing';
COMMENT ON COLUMN public.runtime_errors.error_type IS 'Type of error: console, network, unhandled, promise';
COMMENT ON COLUMN public.runtime_errors.fixed IS 'Whether error has been fixed';
COMMENT ON COLUMN public.runtime_errors.auto_fixed IS 'Whether error was auto-fixed by AI';

-- ========================================
-- Indexes for runtime_errors
-- ========================================

-- Index for querying errors by draft
CREATE INDEX IF NOT EXISTS idx_runtime_errors_draft_id 
  ON public.runtime_errors(draft_id);

-- Index for querying unfixed errors
CREATE INDEX IF NOT EXISTS idx_runtime_errors_unfixed 
  ON public.runtime_errors(draft_id, created_at DESC)
  WHERE fixed = FALSE;

-- Index for querying by error type
CREATE INDEX IF NOT EXISTS idx_runtime_errors_type 
  ON public.runtime_errors(error_type, created_at DESC);

-- Index for analytics (error counts by type)
CREATE INDEX IF NOT EXISTS idx_runtime_errors_created_at 
  ON public.runtime_errors(created_at DESC);

-- ========================================
-- Helper Functions for Runtime Errors
-- ========================================

-- Function to log runtime error
CREATE OR REPLACE FUNCTION public.log_runtime_error(
  draft_uuid UUID,
  user_uuid UUID,
  error_type_param TEXT,
  error_message_param TEXT,
  error_stack_param TEXT DEFAULT NULL,
  url_param TEXT DEFAULT NULL,
  line_num INTEGER DEFAULT NULL,
  col_num INTEGER DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL,
  error_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  error_id UUID;
BEGIN
  INSERT INTO public.runtime_errors (
    draft_id,
    user_id,
    error_type,
    error_message,
    error_stack,
    url,
    line_number,
    column_number,
    user_agent,
    metadata
  ) VALUES (
    draft_uuid,
    user_uuid,
    error_type_param,
    error_message_param,
    error_stack_param,
    url_param,
    line_num,
    col_num,
    user_agent_param,
    error_metadata
  )
  RETURNING id INTO error_id;
  
  RETURN error_id;
END;
$$;

COMMENT ON FUNCTION public.log_runtime_error IS 'Logs a runtime error for monitoring';

-- Function to mark error as fixed
CREATE OR REPLACE FUNCTION public.mark_error_fixed(
  error_uuid UUID,
  auto_fixed_param BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.runtime_errors
  SET 
    fixed = TRUE,
    fixed_at = NOW(),
    auto_fixed = auto_fixed_param
  WHERE id = error_uuid;
  
  RETURN FOUND;
END;
$$;

COMMENT ON FUNCTION public.mark_error_fixed IS 'Marks a runtime error as fixed';

-- Function to get error statistics for a draft
CREATE OR REPLACE FUNCTION public.get_error_stats(draft_uuid UUID)
RETURNS TABLE (
  total_errors BIGINT,
  unfixed_errors BIGINT,
  auto_fixed_count BIGINT,
  errors_by_type JSONB
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT AS total_errors,
    COUNT(*) FILTER (WHERE fixed = FALSE)::BIGINT AS unfixed_errors,
    COUNT(*) FILTER (WHERE auto_fixed = TRUE)::BIGINT AS auto_fixed_count,
    jsonb_object_agg(error_type, error_count) AS errors_by_type
  FROM (
    SELECT 
      error_type,
      COUNT(*) AS error_count
    FROM public.runtime_errors
    WHERE draft_id = draft_uuid
    GROUP BY error_type
  ) type_counts
  CROSS JOIN (
    SELECT COUNT(*) FROM public.runtime_errors WHERE draft_id = draft_uuid
  ) total;
END;
$$;

COMMENT ON FUNCTION public.get_error_stats IS 'Returns error statistics for a draft project';

-- ========================================
-- Code Suggestions Tracking
-- ========================================

-- Table for tracking code suggestions and improvements
CREATE TABLE IF NOT EXISTS public.code_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES public.draft_projects(id) ON DELETE CASCADE,
  
  -- Suggestion Information
  suggestion_type TEXT NOT NULL, -- 'improvement', 'warning', 'error', 'best-practice'
  file_path TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  column_number INTEGER NOT NULL,
  message TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  priority TEXT NOT NULL, -- 'low', 'medium', 'high'
  category TEXT NOT NULL, -- 'performance', 'readability', 'security', 'maintainability', 'type-safety'
  
  -- Status
  applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMP WITH TIME ZONE,
  dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.code_suggestions IS 'Code quality suggestions and improvements';
COMMENT ON COLUMN public.code_suggestions.priority IS 'Priority level: low, medium, high';
COMMENT ON COLUMN public.code_suggestions.category IS 'Category: performance, readability, security, maintainability, type-safety';

-- ========================================
-- Indexes for code_suggestions
-- ========================================

-- Index for querying suggestions by draft
CREATE INDEX IF NOT EXISTS idx_code_suggestions_draft_id 
  ON public.code_suggestions(draft_id);

-- Index for querying unapplied suggestions
CREATE INDEX IF NOT EXISTS idx_code_suggestions_unapplied 
  ON public.code_suggestions(draft_id, priority DESC, created_at DESC)
  WHERE applied = FALSE AND dismissed = FALSE;

-- Index for querying by priority
CREATE INDEX IF NOT EXISTS idx_code_suggestions_priority 
  ON public.code_suggestions(priority, created_at DESC);

-- Index for querying by category
CREATE INDEX IF NOT EXISTS idx_code_suggestions_category 
  ON public.code_suggestions(category, created_at DESC);

-- ========================================
-- Helper Functions for Code Suggestions
-- ========================================

-- Function to save code suggestions
CREATE OR REPLACE FUNCTION public.save_code_suggestions(
  draft_uuid UUID,
  suggestions JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  suggestion JSONB;
  inserted_count INTEGER := 0;
BEGIN
  -- Insert each suggestion
  FOR suggestion IN SELECT * FROM jsonb_array_elements(suggestions)
  LOOP
    INSERT INTO public.code_suggestions (
      draft_id,
      suggestion_type,
      file_path,
      line_number,
      column_number,
      message,
      suggestion,
      priority,
      category,
      metadata
    ) VALUES (
      draft_uuid,
      suggestion->>'type',
      suggestion->>'file',
      (suggestion->>'line')::INTEGER,
      (suggestion->>'column')::INTEGER,
      suggestion->>'message',
      suggestion->>'suggestion',
      suggestion->>'priority',
      suggestion->>'category',
      COALESCE(suggestion->'metadata', '{}'::jsonb)
    )
    ON CONFLICT DO NOTHING; -- Avoid duplicates
    
    inserted_count := inserted_count + 1;
  END LOOP;
  
  RETURN inserted_count;
END;
$$;

COMMENT ON FUNCTION public.save_code_suggestions IS 'Saves code suggestions from analysis';

-- Function to mark suggestion as applied
CREATE OR REPLACE FUNCTION public.apply_suggestion(suggestion_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.code_suggestions
  SET 
    applied = TRUE,
    applied_at = NOW()
  WHERE id = suggestion_uuid;
  
  RETURN FOUND;
END;
$$;

COMMENT ON FUNCTION public.apply_suggestion IS 'Marks a code suggestion as applied';

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS on runtime_errors
ALTER TABLE public.runtime_errors ENABLE ROW LEVEL SECURITY;

-- Users can view errors for their own drafts
CREATE POLICY "Users can view own draft errors"
  ON public.runtime_errors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = runtime_errors.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- Users can create errors for their own drafts
CREATE POLICY "Users can create own draft errors"
  ON public.runtime_errors
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = runtime_errors.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- Users can update errors for their own drafts
CREATE POLICY "Users can update own draft errors"
  ON public.runtime_errors
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = runtime_errors.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- Enable RLS on code_suggestions
ALTER TABLE public.code_suggestions ENABLE ROW LEVEL SECURITY;

-- Users can view suggestions for their own drafts
CREATE POLICY "Users can view own draft suggestions"
  ON public.code_suggestions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = code_suggestions.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- Users can create suggestions for their own drafts
CREATE POLICY "Users can create own draft suggestions"
  ON public.code_suggestions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = code_suggestions.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- Users can update suggestions for their own drafts
CREATE POLICY "Users can update own draft suggestions"
  ON public.code_suggestions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = code_suggestions.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- ========================================
-- Grants
-- ========================================

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.log_runtime_error(UUID, UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_error_fixed(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_error_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_code_suggestions(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_suggestion(UUID) TO authenticated;

-- Grant table permissions (RLS policies handle access control)
GRANT SELECT, INSERT, UPDATE ON public.runtime_errors TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.code_suggestions TO authenticated;

-- ========================================
-- Success message
-- ========================================

DO $$ BEGIN
  RAISE NOTICE 'Autonomous features migration completed successfully';
  RAISE NOTICE 'Created runtime_errors table for error monitoring';
  RAISE NOTICE 'Created code_suggestions table for code quality tracking';
  RAISE NOTICE 'Added helper functions for error logging and suggestion management';
  RAISE NOTICE 'Added RLS policies for secure access';
END $$;
