-- Add missing columns to kyshi_subscriptions table

-- Add email column
ALTER TABLE kyshi_subscriptions 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add country_code column  
ALTER TABLE kyshi_subscriptions 
ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Add plan_code column
ALTER TABLE kyshi_subscriptions 
ADD COLUMN IF NOT EXISTS plan_code TEXT;

-- Update existing subscriptions with data from related tables
UPDATE kyshi_subscriptions 
SET email = c.email,
    country_code = c.country_code
FROM kyshi_customers c
WHERE kyshi_subscriptions.customer_id = c.id
AND kyshi_subscriptions.email IS NULL;

UPDATE kyshi_subscriptions 
SET plan_code = p.kyshi_plan_code
FROM kyshi_plans p
WHERE kyshi_subscriptions.plan_id = p.id
AND kyshi_subscriptions.plan_code IS NULL;
