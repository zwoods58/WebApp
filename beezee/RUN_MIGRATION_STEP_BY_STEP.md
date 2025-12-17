# Run Migration Step by Step (If You Got Errors)

## If the Full Migration Failed

If you got errors when running the full migration, try running it in smaller pieces:

### Option 1: Run Simplified Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the **ENTIRE** contents of `beezee/supabase/migrations/20241213000010_fix_otp_rls_simplified.sql`
4. Paste it
5. Click **"Run"**
6. If you get errors, note which section failed

### Option 2: Run Each Section Separately

If the simplified version still fails, run each section one at a time:

#### Section 1: Fix OTP Codes (Copy and run this first)
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role manages OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Public can insert OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Public can select OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role can update OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Service role can delete OTP codes" ON otp_codes;

-- Allow public to insert OTP codes
CREATE POLICY "Public can insert OTP codes" ON otp_codes
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select OTP codes
CREATE POLICY "Public can select OTP codes" ON otp_codes
    FOR SELECT
    USING (true);

-- Service role can update/delete
CREATE POLICY "Service role can update OTP codes" ON otp_codes
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete OTP codes" ON otp_codes
    FOR DELETE
    USING (auth.role() = 'service_role');
```

#### Section 2: Fix Users Table (Run this second)
```sql
-- Allow public to insert new users
DROP POLICY IF EXISTS "Public can insert users" ON users;
CREATE POLICY "Public can insert users" ON users
    FOR INSERT
    WITH CHECK (true);

-- Allow public to select users
DROP POLICY IF EXISTS "Public can select users by whatsapp" ON users;
CREATE POLICY "Public can select users by whatsapp" ON users
    FOR SELECT
    USING (true);
```

#### Section 3: Fix Trigger (Run this third)
```sql
-- Drop the trigger
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;

-- Drop the function
DROP FUNCTION IF EXISTS create_notification_preferences_for_user() CASCADE;

-- Recreate function with SECURITY DEFINER
CREATE FUNCTION create_notification_preferences_for_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER create_notification_prefs_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_notification_preferences_for_user();
```

## What Errors Did You Get?

Please tell me:
1. **What error message did you see?** (copy/paste it)
2. **Which section failed?** (OTP codes, Users, or Trigger)
3. **Did any section succeed?**

This will help me fix the exact issue!

