# Better Solution - Remove Automatic Trigger

## The Problem

The automatic trigger that creates notification preferences when a user is created is causing RLS errors. This is because:
- User is created (public insert works)
- Trigger fires automatically
- Trigger tries to insert into `notification_preferences` 
- RLS blocks it (no policy allows it)

## The Better Solution

**Remove the automatic trigger** and create notification preferences **only when needed** (lazy creation).

### Benefits:
- ✅ No RLS issues during user creation
- ✅ Simpler - no complex trigger functions
- ✅ More control - create preferences when user actually needs them
- ✅ Better performance - don't create unused records

## What to Do

### Step 1: Remove the Trigger

Run this migration in Supabase Dashboard → SQL Editor:

```sql
-- Remove Automatic Notification Preferences Trigger
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;
DROP FUNCTION IF EXISTS create_notification_preferences_for_user() CASCADE;
```

Or use the file: `beezee/supabase/migrations/20241213000011_remove_notification_trigger.sql`

### Step 2: Create Preferences When Needed

The code now creates notification preferences:
- When user opts into WhatsApp notifications (in `handleWhatsAppSubmit`)
- Uses `upsert` so it creates if doesn't exist, updates if it does

### Step 3: Still Need RLS Fix for Users Table

You still need to allow public inserts to `users` table. Run:

```sql
-- Allow public to insert new users
DROP POLICY IF EXISTS "Public can insert users" ON users;
CREATE POLICY "Public can insert users" ON users
    FOR INSERT
    WITH CHECK (true);
```

## Complete Fix

Run both migrations:
1. `20241213000011_remove_notification_trigger.sql` (removes trigger)
2. `20241213000010_fix_otp_rls_simplified.sql` (allows public inserts to users)

This is a cleaner solution!

