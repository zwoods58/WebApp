# Deploy Functions Manually - FIX CORS NOW

## The Problem
The updated code with permissive CORS headers is in your local files, but it's NOT deployed to Supabase Cloud. That's why you're still getting the CORS error.

## Solution: Deploy via Supabase Dashboard

### Step 1: Deploy `verify-otp-custom`

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions:**
   - Click "Edge Functions" in the left sidebar

3. **Open the function:**
   - Click on `verify-otp-custom`

4. **Go to Code tab:**
   - Click the "Code" tab

5. **Replace ALL code:**
   - Select all existing code (Ctrl+A)
   - Delete it
   - Copy the code from `beezee/supabase/functions/verify-otp-custom/index.ts`
   - Paste it in the editor

6. **Deploy:**
   - Click "Deploy" or "Save" button
   - Wait for "Deployed successfully" message

### Step 2: Deploy `send-otp-whatsapp`

1. **Go back to Edge Functions list**
2. **Click on `send-otp-whatsapp`**
3. **Repeat the same process:**
   - Code tab
   - Replace all code
   - Copy from `beezee/supabase/functions/send-otp-whatsapp/index.ts`
   - Paste
   - Deploy

### Step 3: Verify Deployment

1. **Check function logs:**
   - Go to Edge Functions → `verify-otp-custom` → "Logs" tab
   - Leave it open

2. **Try OTP verification:**
   - Go back to your app
   - Try entering the OTP code

3. **Check the logs:**
   - You should see OPTIONS requests with status 200
   - If you see 401/403, JWT verification is still enabled

### Step 4: Clear Everything

1. **Close your browser completely**
2. **Reopen and go to your app**
3. **Try OTP verification again**

## Key Changes in Updated Code

The OPTIONS handler now returns:
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': '*',
}
```

This is more permissive and should fix the CORS issue.

## If Still Not Working After Deployment

1. **Check JWT verification is OFF:**
   - Edge Functions → `verify-otp-custom` → Settings/Details
   - "Verify JWT" should be OFF

2. **Check function status:**
   - Should show as "Active" or "Deployed"

3. **Check logs for errors:**
   - Any error messages in the logs?

## Most Important
**YOU MUST DEPLOY via Dashboard** - local file changes don't automatically deploy to Supabase Cloud!

