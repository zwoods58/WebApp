-- ═══════════════════════════════════════════════════════════════
-- Security Questions Verification Queries
-- Use these to verify the fix is working
-- ═══════════════════════════════════════════════════════════════

-- 1. Check specific phone number for security questions
SELECT 
  phone_number,
  business_name,
  security_question_1_id,
  CASE 
    WHEN security_answer_1_hash IS NOT NULL THEN 'SET (hash: ' || LEFT(security_answer_1_hash, 10) || '...)'
    ELSE 'NOT SET'
  END as answer_status,
  created_at
FROM businesses 
WHERE phone_number = '+254232454676';

-- 2. Check all accounts with missing security questions
SELECT 
  phone_number,
  business_name,
  created_at,
  CASE 
    WHEN security_question_1_id IS NULL THEN 'MISSING'
    ELSE 'CONFIGURED'
  END as security_status
FROM businesses 
WHERE security_question_1_id IS NULL
ORDER BY created_at DESC;

-- 3. Check all accounts WITH security questions configured
SELECT 
  phone_number,
  business_name,
  sq.question_text,
  LEFT(b.security_answer_1_hash, 10) || '...' as answer_hash_preview,
  b.created_at
FROM businesses b
LEFT JOIN security_questions sq ON b.security_question_1_id = sq.id
WHERE b.security_question_1_id IS NOT NULL
ORDER BY b.created_at DESC;

-- 4. Verify security questions table has data
SELECT 
  id,
  question_text,
  category,
  is_active
FROM security_questions
WHERE is_active = TRUE
ORDER BY category, question_text;

-- 5. Test query for new account (replace phone number)
-- Use this after creating a new test account
SELECT 
  b.phone_number,
  b.business_name,
  sq.question_text as selected_question,
  sq.category,
  CASE 
    WHEN b.security_answer_1_hash IS NOT NULL 
    THEN 'Answer is hashed and stored ✓'
    ELSE 'Answer is MISSING ✗'
  END as answer_status,
  b.created_at
FROM businesses b
LEFT JOIN security_questions sq ON b.security_question_1_id = sq.id
WHERE b.phone_number = '+254700000001'  -- Replace with your test phone
ORDER BY b.created_at DESC
LIMIT 1;
