-- Check the most recently created account
SELECT 
  phone_number,
  business_name,
  security_question_1_id,
  CASE 
    WHEN security_answer_1_hash IS NOT NULL 
    THEN 'SET ✓ (hash: ' || LEFT(security_answer_1_hash, 15) || '...)'
    ELSE 'NULL ✗'
  END as answer_status,
  created_at
FROM businesses 
ORDER BY created_at DESC
LIMIT 1;
