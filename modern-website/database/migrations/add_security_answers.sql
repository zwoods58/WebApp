-- ═══════════════════════════════════════════════════════════════
-- Add Security Answer Columns to Businesses Table
-- Migration: Store user's security questions and hashed answers
-- Date: 2026-03-23
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. ADD SECURITY QUESTION AND ANSWER COLUMNS
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS security_question_1_id UUID REFERENCES security_questions(id),
ADD COLUMN IF NOT EXISTS security_answer_1_hash TEXT,
ADD COLUMN IF NOT EXISTS security_question_2_id UUID REFERENCES security_questions(id),
ADD COLUMN IF NOT EXISTS security_answer_2_hash TEXT,
ADD COLUMN IF NOT EXISTS security_question_3_id UUID REFERENCES security_questions(id),
ADD COLUMN IF NOT EXISTS security_answer_3_hash TEXT,
ADD COLUMN IF NOT EXISTS recovery_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS recovery_locked_until BIGINT DEFAULT NULL;

-- ═══════════════════════════════════════════════════════════════
-- 2. ADD COLUMN COMMENTS
-- ═══════════════════════════════════════════════════════════════

COMMENT ON COLUMN businesses.security_question_1_id IS 'Reference to first security question';
COMMENT ON COLUMN businesses.security_answer_1_hash IS 'Bcrypt hash of normalized answer to question 1';
COMMENT ON COLUMN businesses.security_question_2_id IS 'Reference to second security question';
COMMENT ON COLUMN businesses.security_answer_2_hash IS 'Bcrypt hash of normalized answer to question 2';
COMMENT ON COLUMN businesses.security_question_3_id IS 'Reference to third security question';
COMMENT ON COLUMN businesses.security_answer_3_hash IS 'Bcrypt hash of normalized answer to question 3';
COMMENT ON COLUMN businesses.recovery_attempts IS 'Number of failed security question verification attempts';
COMMENT ON COLUMN businesses.recovery_locked_until IS 'Unix timestamp when recovery lockout expires';

-- ═══════════════════════════════════════════════════════════════
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_businesses_recovery_locked 
  ON businesses(recovery_locked_until) 
  WHERE recovery_locked_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_businesses_security_questions 
  ON businesses(security_question_1_id, security_question_2_id, security_question_3_id);

-- ═══════════════════════════════════════════════════════════════
-- 4. UPDATE EXISTING RECORDS
-- ═══════════════════════════════════════════════════════════════

-- Set default values for existing businesses
UPDATE businesses 
SET recovery_attempts = 0 
WHERE recovery_attempts IS NULL;
