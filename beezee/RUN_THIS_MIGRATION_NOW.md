# 🚨 RUN THIS MIGRATION NOW - Fix RLS Error

## The Error

You're getting: **"new row violates row-level security policy for table 'notification_preferences'"**

This happens because when a new user is created, a database trigger tries to create notification preferences, but RLS is blocking it.

## The Fix

**You MUST run the migration** to fix this. Here's how:

### Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Run the Migration

1. Click **"New Query"** button
2. Open the file: `beezee/supabase/migrations/20241213000010_fix_otp_rls_simplified.sql`
3. **Copy the ENTIRE file** (all 82 lines)
4. **Paste it** into the SQL Editor
5. Click **"Run"** button (or press Ctrl+Enter)
6. Wait for "Success" message

### Step 3: Verify It Worked

After running, check:

1. Go to **Database** → **Functions**
2. Find `create_notification_preferences_for_user`
3. Click on it
4. Check the definition - it should say **`SECURITY DEFINER`**

If it doesn't say `SECURITY DEFINER`, the migration didn't work. Let me know!

### Step 4: Test

1. **Clear browser cache**: `Ctrl+Shift+Delete`
2. **Try signup again** - it should work now!

## What the Migration Does

- ✅ Allows public to insert into `otp_codes` table
- ✅ Allows public to insert into `users` table  
- ✅ Makes the trigger function `SECURITY DEFINER` (bypasses RLS)
- ✅ Recreates the trigger to create notification preferences

## If You Get Errors Running the Migration

Tell me:
1. What error message did you see?
2. Which line failed (if shown)?

I'll help you fix it!

