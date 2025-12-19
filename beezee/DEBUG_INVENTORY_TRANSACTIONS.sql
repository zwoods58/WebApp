-- Debug Script: Check if Inventory Transactions Exist
-- Run this in your Supabase SQL Editor to verify transactions are being created

-- 1. Check all transactions for today
SELECT 
  id,
  user_id,
  amount,
  type,
  category,
  description,
  date,
  created_at,
  metadata->>'transaction_type' as transaction_type,
  metadata->>'inventory_item_name' as inventory_item
FROM transactions
WHERE date = CURRENT_DATE
ORDER BY created_at DESC
LIMIT 20;

-- 2. Check transactions with inventory metadata
SELECT 
  id,
  user_id,
  amount,
  type,
  category,
  description,
  date,
  metadata->>'transaction_type' as transaction_type,
  metadata->>'inventory_item_name' as inventory_item
FROM transactions
WHERE metadata->>'transaction_type' IN ('inventory_purchase', 'inventory_sale')
ORDER BY created_at DESC;

-- 3. Check if user_id exists in users table (for RLS)
SELECT 
  t.id,
  t.user_id,
  t.amount,
  t.type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM users WHERE id = t.user_id) THEN 'User exists ✅'
    ELSE 'User NOT found ❌'
  END as user_check
FROM transactions t
WHERE t.date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY t.created_at DESC
LIMIT 10;

-- 4. Count transactions by type for current month
SELECT 
  type,
  COUNT(*) as count,
  SUM(amount) as total
FROM transactions
WHERE date >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY type;

