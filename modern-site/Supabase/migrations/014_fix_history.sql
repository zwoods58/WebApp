/**
 * Fix History Table Migration
 * P2 Feature 17: Fix History Tracking
 */

-- Create fix_history table
CREATE TABLE IF NOT EXISTS fix_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES draft_projects(id) ON DELETE CASCADE,
  error_id TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_type TEXT NOT NULL,
  fix_type TEXT NOT NULL,
  target_file TEXT NOT NULL,
  old_code TEXT,
  new_code TEXT NOT NULL,
  explanation TEXT NOT NULL,
  confidence DECIMAL(3, 2) NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 1,
  applied_fix_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fix_history_project_id ON fix_history(project_id);
CREATE INDEX IF NOT EXISTS idx_fix_history_error_type ON fix_history(error_type);
CREATE INDEX IF NOT EXISTS idx_fix_history_success ON fix_history(success);
CREATE INDEX IF NOT EXISTS idx_fix_history_created_at ON fix_history(created_at DESC);

-- Create fix_feedback table
CREATE TABLE IF NOT EXISTS fix_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fix_id UUID NOT NULL REFERENCES fix_history(id) ON DELETE CASCADE,
  accepted BOOLEAN NOT NULL,
  worked BOOLEAN NOT NULL,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_comments TEXT,
  time_to_decision INTEGER, -- milliseconds
  modified_before_accepting BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for feedback queries
CREATE INDEX IF NOT EXISTS idx_fix_feedback_fix_id ON fix_feedback(fix_id);
CREATE INDEX IF NOT EXISTS idx_fix_feedback_accepted ON fix_feedback(accepted);
CREATE INDEX IF NOT EXISTS idx_fix_feedback_worked ON fix_feedback(worked);

-- Enable RLS
ALTER TABLE fix_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fix_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fix_history
CREATE POLICY "Users can view their own fix history"
  ON fix_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fix history"
  ON fix_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for fix_feedback
CREATE POLICY "Users can view their own feedback"
  ON fix_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON fix_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);
