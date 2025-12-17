-- =============================================
-- Migration: 005_project_versions_and_assets
-- Description: Version history and asset management
-- =============================================

-- ========================================
-- Project Versions Table (version history)
-- ========================================
CREATE TABLE IF NOT EXISTS public.project_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.draft_projects(id) ON DELETE CASCADE,
  
  -- Version Data
  html_code TEXT,
  files JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  version_number INTEGER,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.project_versions IS 'Version history for draft projects';
COMMENT ON COLUMN public.project_versions.files IS 'JSON object storing file contents';

-- ========================================
-- Project Assets Table (file uploads)
-- ========================================
CREATE TABLE IF NOT EXISTS public.project_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.draft_projects(id) ON DELETE CASCADE,
  
  -- Asset Details
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  
  -- Storage
  storage_bucket TEXT DEFAULT 'project-assets',
  storage_path TEXT,
  public_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.project_assets IS 'Uploaded assets (images, logos, etc.)';
COMMENT ON COLUMN public.project_assets.storage_bucket IS 'Supabase storage bucket name';

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'project_versions and project_assets tables created successfully';
END $$;

