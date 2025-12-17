-- =============================================
-- Migration: 011_file_tree_support
-- Description: Enhanced support for file tree storage in agentic architecture
-- Date: 2025-01-XX
-- =============================================

-- ========================================
-- Update draft_projects metadata structure
-- ========================================

-- Add comment documenting file_tree structure in metadata
COMMENT ON COLUMN public.draft_projects.metadata IS 
'JSONB object storing:
- file_tree: { [path: string]: content: string } - Complete file tree from agentic architecture
- component_code: string - Main React component (backward compatibility)
- react_code: string - Alias for component_code
- project_structure: { files: Array, totalFiles: number, totalSize: number } - Project metadata
- user_prompt: string - Original user prompt
- uploaded_image_url: string - User uploaded image
- seo: object - SEO metadata
- pages: object - Multi-page structure';

-- ========================================
-- Update project_versions to support file trees
-- ========================================

-- Add comment documenting files structure
COMMENT ON COLUMN public.project_versions.files IS 
'JSONB object storing file tree: { [path: string]: content: string }
Used for version history with agentic architecture file trees';

-- ========================================
-- Add indexes for file_tree queries
-- ========================================

-- Index for querying projects with file trees (agentic architecture)
CREATE INDEX IF NOT EXISTS idx_draft_projects_has_file_tree 
  ON public.draft_projects((metadata->'file_tree'))
  WHERE metadata->'file_tree' IS NOT NULL;

-- Index for querying by project structure metadata
CREATE INDEX IF NOT EXISTS idx_draft_projects_project_structure 
  ON public.draft_projects((metadata->'project_structure'))
  WHERE metadata->'project_structure' IS NOT NULL;

-- Index for file count queries (useful for analytics)
CREATE INDEX IF NOT EXISTS idx_draft_projects_file_count 
  ON public.draft_projects(((metadata->'project_structure'->>'totalFiles')::int))
  WHERE metadata->'project_structure'->>'totalFiles' IS NOT NULL;

-- ========================================
-- Add helper function to extract file tree
-- ========================================

CREATE OR REPLACE FUNCTION public.get_file_tree(project_metadata JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Extract file_tree from metadata, fallback to empty object
  RETURN COALESCE(project_metadata->'file_tree', '{}'::jsonb);
END;
$$;

COMMENT ON FUNCTION public.get_file_tree IS 'Extracts file_tree from project metadata';

-- ========================================
-- Add helper function to get main component
-- ========================================

CREATE OR REPLACE FUNCTION public.get_main_component(project_metadata JSONB)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  file_tree JSONB;
  component_paths TEXT[] := ARRAY[
    'src/components/LandingPage.tsx',
    'src/App.tsx',
    'src/pages/index.tsx',
    'src/index.tsx'
  ];
  path TEXT;
BEGIN
  -- Try to get from file_tree first
  file_tree := project_metadata->'file_tree';
  
  IF file_tree IS NOT NULL THEN
    -- Check priority paths
    FOREACH path IN ARRAY component_paths
    LOOP
      IF file_tree ? path THEN
        RETURN file_tree->>path;
      END IF;
    END LOOP;
    
    -- Fallback: find first .tsx or .jsx file
    FOR path IN SELECT jsonb_object_keys(file_tree)
    LOOP
      IF path ~ '\.(tsx|jsx)$' THEN
        RETURN file_tree->>path;
      END IF;
    END LOOP;
  END IF;
  
  -- Fallback to component_code or react_code
  RETURN COALESCE(
    project_metadata->>'component_code',
    project_metadata->>'react_code',
    ''
  );
END;
$$;

COMMENT ON FUNCTION public.get_main_component IS 'Extracts main component code from metadata (checks file_tree first, then component_code)';

-- ========================================
-- Add helper function to count files in file tree
-- ========================================

CREATE OR REPLACE FUNCTION public.count_files_in_tree(project_metadata JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  file_tree JSONB;
  file_count INTEGER := 0;
BEGIN
  file_tree := project_metadata->'file_tree';
  
  IF file_tree IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Count keys in file_tree object
  SELECT COUNT(*) INTO file_count
  FROM jsonb_object_keys(file_tree);
  
  RETURN file_count;
END;
$$;

COMMENT ON FUNCTION public.count_files_in_tree IS 'Counts number of files in file_tree';

-- ========================================
-- Add view for projects with file trees
-- ========================================

CREATE OR REPLACE VIEW public.projects_with_file_trees AS
SELECT 
  id,
  user_id,
  business_name,
  status,
  generated_at,
  metadata->'file_tree' AS file_tree,
  public.get_main_component(metadata) AS main_component,
  public.count_files_in_tree(metadata) AS file_count,
  (metadata->'project_structure'->>'totalFiles')::int AS total_files,
  (metadata->'project_structure'->>'totalSize')::bigint AS total_size,
  created_at,
  updated_at
FROM public.draft_projects
WHERE metadata->'file_tree' IS NOT NULL;

COMMENT ON VIEW public.projects_with_file_trees IS 'View of projects using agentic architecture with file trees';

-- ========================================
-- Grant permissions
-- ========================================

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.get_file_tree(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_main_component(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_files_in_tree(JSONB) TO authenticated;

-- Grant select on view
GRANT SELECT ON public.projects_with_file_trees TO authenticated;

-- ========================================
-- Success message
-- ========================================

DO $$ BEGIN
  RAISE NOTICE 'File tree support migration completed successfully';
  RAISE NOTICE 'Added indexes, helper functions, and view for agentic architecture';
END $$;

