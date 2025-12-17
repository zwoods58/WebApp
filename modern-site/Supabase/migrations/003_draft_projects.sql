-- =============================================
-- Migration: 003_draft_projects
-- Description: AI builder draft projects table
-- =============================================

-- Draft Projects Table (for AI-generated websites)
CREATE TABLE IF NOT EXISTS public.draft_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_accounts(id) ON DELETE CASCADE,
  
  -- Business Information (Form Data)
  business_name TEXT NOT NULL,
  business_location TEXT NOT NULL,
  business_description TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  business_type TEXT,
  
  -- Marketing Info
  ideal_customer TEXT,
  key_differentiator TEXT,
  target_keywords TEXT,
  tone_of_voice TEXT,
  
  -- Design Preferences
  preferred_colors TEXT,
  aesthetic_style TEXT,
  must_have_pages TEXT[],
  existing_links TEXT,
  
  -- Assets
  logo_url TEXT,
  facebook_link TEXT,
  instagram_link TEXT,
  twitter_link TEXT,
  linkedin_link TEXT,
  
  -- Features
  needs_ecommerce BOOLEAN DEFAULT FALSE,
  needs_crm BOOLEAN DEFAULT FALSE,
  conversion_goal TEXT,
  
  -- AI Generation
  draft_url TEXT,                    -- Temporary preview URL
  draft_code_url TEXT,               -- Code download link for buyout
  generation_count INTEGER DEFAULT 0,
  max_generations INTEGER DEFAULT 3, -- FREE tier limit
  generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'draft',       -- 'draft', 'generated', 'upgraded', 'buyout_delivered'
  preview_expires_at TIMESTAMP WITH TIME ZONE, -- For FREE tier expiration
  
  -- Buyout Details
  has_buyout BOOLEAN DEFAULT FALSE,
  buyout_purchased_at TIMESTAMP WITH TIME ZONE,
  buyout_transaction_id TEXT,
  
  -- Metadata (stores HTML code, AI settings, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.draft_projects IS 'AI-generated website projects';
COMMENT ON COLUMN public.draft_projects.status IS 'draft, generated, upgraded, buyout_delivered';
COMMENT ON COLUMN public.draft_projects.generation_count IS 'Number of times AI regenerated this project';
COMMENT ON COLUMN public.draft_projects.max_generations IS 'Maximum regenerations (3 for FREE, 10 for PRO)';
COMMENT ON COLUMN public.draft_projects.metadata IS 'Stores HTML code, AI-generated content, user_prompt, uploaded_image_url';

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'draft_projects table created successfully';
END $$;

