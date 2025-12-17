# Better Solution - Run This Migration

## The Problem

The automatic trigger that creates notification preferences is causing RLS errors. 

## The Better Solution

**Remove the automatic trigger** and create notification preferences **only when needed**.

### Benefits:
- ✅ No RLS issues during user creation
- ✅ Simpler - no complex trigger functions  
- ✅ More control - create preferences when user actually needs them
- ✅ Better performance - don't create unused records

## How to Apply

### Step 1: Run the Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the **ENTIRE** contents of `beezee/supabase/migrations/20241213000012_fix_signup_rls.sql`
4. Paste it in the SQL Editor
5. Click **"Run"**
6. Wait for "Success" message

### Step 2: Test

1. **Clear browser cache**: `Ctrl+Shift+Delete`
2. **Try signup again** - it should work now!

## What This Does

1. ✅ **Removes the automatic trigger** - no more RLS errors during user creation
2. ✅ **Allows public inserts to users** - signup works
3. ✅ **Allows public inserts to notification_preferences** - can create manually when needed
4. ✅ **Notification preferences created manually** - only when user opts into WhatsApp

## How It Works Now

1. User enters WhatsApp number → Profile
2. User submits profile → **User is created** (no trigger fires!)
3. User completes onboarding → **Notification preferences created** (if opted in)

Much cleaner and no RLS issues!

