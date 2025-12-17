# 🚨 FINAL FIX - Run This Migration

## The Problem

You're still getting: **"new row violates row-level security policy for table 'notification_preferences'"**

This is because:
1. The trigger might still exist
2. RLS policies on `notification_preferences` are blocking inserts

## The Complete Fix

This migration removes **EVERYTHING** related to automatic notification preferences and fixes all RLS policies.

### Step 1: Run the Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the **ENTIRE** contents of `beezee/supabase/migrations/20241213000013_complete_rls_fix.sql`
4. Paste it in the SQL Editor
5. Click **"Run"**
6. Wait for "Success" message

### Step 2: Verify Triggers Are Removed

After running, verify:

1. Go to **Database** → **Tables** → **users**
2. Click **"Triggers"** tab
3. **There should be NO triggers** related to notification preferences

If you see `create_notification_prefs_trigger`, the migration didn't work. Let me know!

### Step 3: Test

1. **Clear browser cache**: `Ctrl+Shift+Delete`
2. **Try signup again** - it should work now!

## What This Migration Does

1. ✅ **Removes the trigger completely** - no automatic creation
2. ✅ **Removes the function** - no trigger code
3. ✅ **Allows public inserts to users** - signup works
4. ✅ **Allows public inserts to notification_preferences** - can create manually
5. ✅ **Allows public selects/updates** - can read and update preferences

## How It Works Now

1. User submits profile → **User is created** (no trigger fires!)
2. User opts into WhatsApp → **Notification preferences created manually** (in code)
3. **No RLS errors!**

This is the simplest solution - no triggers, just manual creation when needed.

