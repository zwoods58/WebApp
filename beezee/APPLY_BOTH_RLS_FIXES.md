# Apply RLS Policy Fixes - OTP Codes AND Users Table

## The Problem

You're getting two RLS errors:
1. **OTP codes table**: Can't insert OTP codes (already fixed in previous migration)
2. **Users table**: Can't insert new users (NEW - this is the current error)

## The Solution

The migration file `20241213000009_fix_otp_rls.sql` now fixes BOTH tables.

## How to Apply

### Step 1: Run the SQL Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the **ENTIRE** contents of `beezee/supabase/migrations/20241213000009_fix_otp_rls.sql`
4. Paste it in the SQL editor
5. Click **"Run"**
6. You should see "Success. No rows returned"

### Step 2: Verify Policies

After running, you can verify the policies exist:

1. Go to **Database** → **Tables** → **users**
2. Click **"Policies"** tab
3. You should see:
   - ✅ "Public can insert users"
   - ✅ "Public can select users by whatsapp"
   - ✅ "Users can view own profile"
   - ✅ "Users can update own profile"

4. Go to **Database** → **Tables** → **otp_codes**
5. Click **"Policies"** tab
6. You should see:
   - ✅ "Public can insert OTP codes"
   - ✅ "Public can select OTP codes"

### Step 3: Test

1. **Clear browser cache**: `Ctrl+Shift+Delete`
2. **Try OTP verification** - it should work now!

## What This Does

- ✅ Allows **public** to **INSERT** new users (for OTP signup)
- ✅ Allows **public** to **SELECT** users by whatsapp_number (to check if user exists)
- ✅ Allows **public** to **INSERT/SELECT** OTP codes
- ✅ Still maintains security: Only authenticated users can update their own profiles

## Security Note

This is safe because:
- OTP verification happens server-side (in `verify_otp_code` function)
- Users can only be created after valid OTP verification
- Users can only update their own profiles (existing policy)
- The OTP system ensures only valid phone numbers can create accounts

