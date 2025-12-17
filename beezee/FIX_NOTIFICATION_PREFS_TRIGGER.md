# Fix Notification Preferences Trigger

## The Problem

When a new user is created, a database trigger automatically creates notification preferences. However, the trigger function doesn't have `SECURITY DEFINER`, so it runs as the anon role and gets blocked by RLS.

## The Solution

The migration file `20241213000009_fix_otp_rls.sql` now includes a fix that:
1. Makes the trigger function `SECURITY DEFINER` (runs with elevated privileges, bypasses RLS)
2. Recreates the trigger

## How to Apply

### Step 1: Run the Updated SQL Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the **ENTIRE** contents of `beezee/supabase/migrations/20241213000009_fix_otp_rls.sql`
4. Paste it in the SQL editor
5. Click **"Run"**
6. You should see "Success. No rows returned"

### Step 2: Test

1. **Clear browser cache**: `Ctrl+Shift+Delete`
2. **Try OTP verification** - it should work now!

## What This Does

- ✅ The trigger function now runs with `SECURITY DEFINER`
- ✅ This means it bypasses RLS policies
- ✅ When a new user is created, notification preferences are automatically created
- ✅ No more RLS errors!

## Security Note

`SECURITY DEFINER` is safe here because:
- The function only inserts into `notification_preferences` with the user's own ID
- It can't be used to insert preferences for other users
- The trigger only fires on user creation (controlled by database)

