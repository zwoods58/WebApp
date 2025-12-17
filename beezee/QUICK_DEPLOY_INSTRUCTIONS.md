# Quick Deploy Instructions - Fix CORS Error

## The Problem
The CORS error is happening because the updated `verify-otp-custom` function hasn't been deployed yet.

## Solution: Deploy via Supabase Dashboard

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Sign in and select your project: `rtfzksajhriwhulnwaks`

### Step 2: Navigate to Edge Functions
1. Click **Edge Functions** in the left sidebar
2. Find **`verify-otp-custom`** in the list

### Step 3: Update the Function
1. Click on **`verify-otp-custom`** to open it
2. Click **Edit** button (or the code editor icon)
3. **Delete all the existing code**
4. **Copy the entire contents** of this file:
   - `beezee/supabase/functions/verify-otp-custom/index.ts`
5. **Paste it** into the editor
6. Click **Deploy** or **Save & Deploy**

### Step 4: Verify Deployment
1. Wait for deployment to complete (you'll see a success message)
2. Go back to your app
3. **Refresh the browser** (Ctrl+R or F5)
4. Try entering the OTP code again

## Alternative: Install Supabase CLI

If you want to deploy via command line in the future:

```powershell
# Install Supabase CLI
npm install -g supabase

# Then deploy
cd beezee
supabase functions deploy verify-otp-custom
```

## What Was Fixed

The updated code now:
- ✅ Returns proper `204` status for OPTIONS preflight requests
- ✅ Includes all required CORS headers
- ✅ Handles errors correctly

After deployment, the CORS error should be completely resolved!

