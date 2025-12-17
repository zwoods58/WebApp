-- =============================================
-- Migration: 012_code_versions
-- Description: Code version history and undo/redo support for AI builder
-- Date: 2025-01-XX
-- Dependencies: 003_draft_projects
-- =============================================

-- ========================================
-- Code Versions Table
-- ========================================

-- Table for storing code version snapshots (undo/redo functionality)
CREATE TABLE IF NOT EXISTS public.code_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID NOT NULL REFERENCES public.draft_projects(id) ON DELETE CASCADE,
  
  -- Version Information
  version INTEGER NOT NULL,
  component_code TEXT NOT NULL,
  description TEXT,
  
  -- Metadata (stores file_tree, dependencies, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique version per draft
  UNIQUE(draft_id, version)
);

-- Add comments
COMMENT ON TABLE public.code_versions IS 'Code version history for draft projects (undo/redo support)';
COMMENT ON COLUMN public.code_versions.version IS 'Sequential version number (1, 2, 3, ...)';
COMMENT ON COLUMN public.code_versions.component_code IS 'Snapshot of component code at this version';
COMMENT ON COLUMN public.code_versions.description IS 'Optional description of changes in this version';
COMMENT ON COLUMN public.code_versions.metadata IS 'Stores file_tree, dependencies, and other version metadata';

-- ========================================
-- Indexes for Performance
-- ========================================

-- Index for querying versions by draft_id (most common query)
CREATE INDEX IF NOT EXISTS idx_code_versions_draft_id 
  ON public.code_versions(draft_id);

-- Index for querying latest version per draft
CREATE INDEX IF NOT EXISTS idx_code_versions_draft_version_desc 
  ON public.code_versions(draft_id, version DESC);

-- Index for querying by creation date (for cleanup/analytics)
CREATE INDEX IF NOT EXISTS idx_code_versions_created_at 
  ON public.code_versions(created_at DESC);

-- Index for metadata queries (file_tree, etc.)
CREATE INDEX IF NOT EXISTS idx_code_versions_metadata 
  ON public.code_versions USING GIN(metadata);

-- ========================================
-- Helper Functions
-- ========================================

-- Function to get latest version number for a draft
CREATE OR REPLACE FUNCTION public.get_latest_version(draft_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  latest_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version), 0) INTO latest_version
  FROM public.code_versions
  WHERE draft_id = draft_uuid;
  
  RETURN latest_version;
END;
$$;

COMMENT ON FUNCTION public.get_latest_version IS 'Returns the latest version number for a draft project';

-- Function to get version history for a draft
CREATE OR REPLACE FUNCTION public.get_version_history(draft_uuid UUID)
RETURNS TABLE (
  id UUID,
  version INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cv.id,
    cv.version,
    cv.description,
    cv.created_at,
    cv.metadata
  FROM public.code_versions cv
  WHERE cv.draft_id = draft_uuid
  ORDER BY cv.version DESC;
END;
$$;

COMMENT ON FUNCTION public.get_version_history IS 'Returns version history for a draft project (ordered by version DESC)';

-- Function to get specific version
CREATE OR REPLACE FUNCTION public.get_version(draft_uuid UUID, version_num INTEGER)
RETURNS TABLE (
  id UUID,
  component_code TEXT,
  version INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cv.id,
    cv.component_code,
    cv.version,
    cv.description,
    cv.created_at,
    cv.metadata
  FROM public.code_versions cv
  WHERE cv.draft_id = draft_uuid
    AND cv.version = version_num;
END;
$$;

COMMENT ON FUNCTION public.get_version IS 'Returns a specific version of a draft project';

-- Function to save new version (auto-increments version number)
CREATE OR REPLACE FUNCTION public.save_code_version(
  draft_uuid UUID,
  code TEXT,
  version_description TEXT DEFAULT NULL,
  version_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  next_version INTEGER;
  new_version_id UUID;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version), 0) + 1 INTO next_version
  FROM public.code_versions
  WHERE draft_id = draft_uuid;
  
  -- Insert new version
  INSERT INTO public.code_versions (
    draft_id,
    version,
    component_code,
    description,
    metadata
  ) VALUES (
    draft_uuid,
    next_version,
    code,
    version_description,
    version_metadata
  )
  RETURNING id INTO new_version_id;
  
  -- Update draft_projects metadata with current version
  UPDATE public.draft_projects
  SET 
    metadata = jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{current_version}',
      to_jsonb(next_version)
    ),
    updated_at = NOW()
  WHERE id = draft_uuid;
  
  RETURN new_version_id;
END;
$$;

COMMENT ON FUNCTION public.save_code_version IS 'Saves a new code version and auto-increments version number';

-- Function to restore version (updates draft_projects with restored code)
CREATE OR REPLACE FUNCTION public.restore_version(
  draft_uuid UUID,
  version_num INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  restored_code TEXT;
BEGIN
  -- Get code from version
  SELECT component_code INTO restored_code
  FROM public.code_versions
  WHERE draft_id = draft_uuid
    AND version = version_num;
  
  -- If version not found, return false
  IF restored_code IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update draft_projects with restored code
  UPDATE public.draft_projects
  SET 
    metadata = jsonb_set(
      jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{component_code}',
        to_jsonb(restored_code)
      ),
      '{current_version}',
      to_jsonb(version_num)
    ),
    metadata = jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{restored_at}',
      to_jsonb(NOW()::text)
    ),
    updated_at = NOW()
  WHERE id = draft_uuid;
  
  RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION public.restore_version IS 'Restores a specific version and updates draft_projects';

-- Function to cleanup old versions (keep only last N versions)
CREATE OR REPLACE FUNCTION public.cleanup_old_versions(
  draft_uuid UUID,
  keep_count INTEGER DEFAULT 50
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete versions older than keep_count
  WITH versions_to_delete AS (
    SELECT id
    FROM public.code_versions
    WHERE draft_id = draft_uuid
    ORDER BY version DESC
    OFFSET keep_count
  )
  DELETE FROM public.code_versions
  WHERE id IN (SELECT id FROM versions_to_delete);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION public.cleanup_old_versions IS 'Deletes old versions, keeping only the most recent N versions';

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS on code_versions table
ALTER TABLE public.code_versions ENABLE ROW LEVEL SECURITY;

-- Users can view versions for their own drafts
CREATE POLICY "Users can view own draft versions"
  ON public.code_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = code_versions.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- Users can create versions for their own drafts
CREATE POLICY "Users can create own draft versions"
  ON public.code_versions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = code_versions.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- Users can delete versions for their own drafts (for cleanup)
CREATE POLICY "Users can delete own draft versions"
  ON public.code_versions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.draft_projects dp
      WHERE dp.id = code_versions.draft_id
        AND dp.user_id = auth.uid()
    )
  );

-- ========================================
-- Grants
-- ========================================

-- Grant execute on functions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_latest_version(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_version_history(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_version(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_code_version(UUID, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_version(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_versions(UUID, INTEGER) TO authenticated;

-- Grant table permissions (RLS policies handle access control)
GRANT SELECT, INSERT, DELETE ON public.code_versions TO authenticated;

-- ========================================
-- Update draft_projects metadata comment
-- ========================================

-- Update metadata comment to include version tracking
COMMENT ON COLUMN public.draft_projects.metadata IS 
'JSONB object storing:
- file_tree: { [path: string]: content: string } - Complete file tree from agentic architecture
- component_code: string - Main React component (backward compatibility)
- react_code: string - Alias for component_code
- project_structure: { files: Array, totalFiles: number, totalSize: number } - Project metadata
- user_prompt: string - Original user prompt
- uploaded_image_url: string - User uploaded image
- seo: object - SEO metadata
- pages: object - Multi-page structure
- current_version: integer - Current version number (for version history)
- restored_at: timestamp - When version was restored (for version history)
- last_auto_saved: timestamp - Last auto-save timestamp';

-- ========================================
-- Success message
-- ========================================

DO $$ BEGIN
  RAISE NOTICE 'Code versions migration completed successfully';
  RAISE NOTICE 'Created code_versions table with version history support';
  RAISE NOTICE 'Added helper functions: get_latest_version, get_version_history, save_code_version, restore_version';
  RAISE NOTICE 'Added RLS policies for secure version access';
END $$;
