# CRITICAL FIX - Apply This Migration NOW

## The Problem

The error "new row violates row-level security policy for table 'notification_preferences'" means the trigger function is still being blocked by RLS.

## The Solution

I've updated the migration to make the trigger function **definitely** `SECURITY DEFINER` with proper syntax.

## Step 1: Run the Updated Migration

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Click "New Query"**
3. **Copy the ENTIRE contents** of `beezee/supabase/migrations/20241213000009_fix_otp_rls.sql` (all 85 lines)
4. **Paste it** in the SQL editor
5. **Click "Run"**
6. **Check for errors** - if you see any, let me know

## Step 2: Verify the Function

After running, verify it worked:

1. **Go to Database** → **Functions**
2. **Find** `create_notification_preferences_for_user`
3. **Click on it** to view the definition
4. **Check that it says** `SECURITY DEFINER` in the function definition

If it doesn't say `SECURITY DEFINER`, the migration didn't work. Let me know.

## Step 3: Test

1. **Clear browser cache**: `Ctrl+Shift+Delete` → Select "All time" → Clear
2. **Close browser completely**
3. **Reopen browser**
4. **Try OTP verification** - it should work now!

## What Changed

The updated migration:
- ✅ Uses proper `SECURITY DEFINER` syntax
- ✅ Sets `search_path = public` for security
- ✅ Drops and recreates everything cleanly
- ✅ Adds a backup policy (though SECURITY DEFINER should handle it)

## If Still Not Working

If you still get the error after running this migration:

1. **Check the function definition** - does it show `SECURITY DEFINER`?
2. **Check the trigger** - go to Database → Tables → users → Triggers tab
3. **Try disabling the trigger temporarily** to test if that's the issue

Let me know what you see!

