-- ═══════════════════════════════════════════════════════════════
-- Security Questions System - Database Schema
-- Migration: Add security questions for PIN recovery
-- Date: 2026-03-23
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. SECURITY QUESTIONS TABLE
-- Stores predefined security questions
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS security_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE security_questions IS 'Predefined security questions for account recovery';
COMMENT ON COLUMN security_questions.category IS 'Question category: personal, childhood, education, favorites, family';

-- ═══════════════════════════════════════════════════════════════
-- 2. INSERT PREDEFINED SECURITY QUESTIONS
-- 12 questions across 5 categories
-- ═══════════════════════════════════════════════════════════════

INSERT INTO security_questions (question_text, category) VALUES
  -- Personal (2 questions)
  ('What is your mother''s maiden name?', 'personal'),
  ('In what city were you born?', 'personal'),
  
  -- Childhood (3 questions)
  ('What was the name of your first pet?', 'childhood'),
  ('What was your childhood nickname?', 'childhood'),
  ('What was the name of your first school?', 'childhood'),
  
  -- Education (2 questions)
  ('What was your favorite subject in school?', 'education'),
  ('What was the name of your elementary school teacher?', 'education'),
  
  -- Favorites (3 questions)
  ('What is your favorite food?', 'favorites'),
  ('What is your favorite color?', 'favorites'),
  ('What is your favorite book or movie?', 'favorites'),
  
  -- Family (2 questions)
  ('What is your father''s middle name?', 'family'),
  ('What is your oldest sibling''s name?', 'family')
ON CONFLICT (question_text) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 3. PERFORMANCE INDEXES
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_security_questions_active 
  ON security_questions(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_security_questions_category 
  ON security_questions(category);

-- ═══════════════════════════════════════════════════════════════
-- 4. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE security_questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active questions (needed for signup)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'security_questions' 
    AND policyname = 'Public can read active questions'
  ) THEN
    CREATE POLICY "Public can read active questions" ON security_questions
      FOR SELECT USING (is_active = TRUE);
  END IF;
END $$;

-- Service role has full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'security_questions' 
    AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access" ON security_questions
      FOR ALL TO service_role USING (true);
  END IF;
END $$;
