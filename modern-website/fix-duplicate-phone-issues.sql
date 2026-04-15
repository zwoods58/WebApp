-- Fix Duplicate Phone Number Issues
-- Clean up and resolve phone number conflicts

-- 1. Create a unique index on phone numbers to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_phone_unique ON public.businesses(phone_number);

-- 2. Update existing businesses to have proper phone formatting
UPDATE public.businesses 
SET phone_number = CASE 
  WHEN phone_number LIKE '+254700000001' THEN '+254700000001'
  WHEN phone_number LIKE '+2547%' AND LENGTH(phone_number) = 12 THEN '+2547' || SUBSTRING(phone_number, 5)
  WHEN phone_number LIKE '+254%' AND LENGTH(phone_number) = 9 THEN '+254' || SUBSTRING(phone_number, 4)
  ELSE phone_number
END
WHERE phone_number LIKE '+254%' AND country = 'KE';

-- 3. Remove test businesses that were created during development
DELETE FROM public.businesses 
WHERE business_name IN ('Test Business for Beehive', 'test', 'times', 'tom') 
AND phone_number LIKE '+254%'
AND created_at < '2026-04-15';

-- 4. Add proper constraints to ensure data integrity
ALTER TABLE public.businesses 
ADD CONSTRAINT IF NOT EXISTS businesses_phone_format_check 
CHECK (
  phone_number ~ '^\+[1-9]\d{6,14}$' OR 
  phone_number IS NULL
);

-- 5. Create an audit log for phone number changes
CREATE TABLE IF NOT EXISTS public.business_phone_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  old_phone_number TEXT,
  new_phone_number TEXT,
  changed_by UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT
);

-- 6. Create index for audit tracking
CREATE INDEX IF NOT EXISTS idx_business_phone_audit_business_id ON public.business_phone_audit(business_id);
CREATE INDEX IF NOT EXISTS idx_business_phone_audit_changed_at ON public.business_phone_audit(changed_at);
