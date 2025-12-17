# Debug CORS Issue - JWT Already Disabled

## The Problem

Even though JWT verification is disabled, you're still getting the CORS error. This means the issue is something else.

## Possible Causes

1. **Function code not deployed correctly**
   - The OPTIONS handler might not be in the deployed version
   - Need to redeploy the function

2. **Function code has an error**
   - The OPTIONS handler might be throwing an error
   - Check function logs in Supabase Dashboard

3. **Browser cache**
   - Old CORS error might be cached
   - Need to clear cache completely

4. **Supabase infrastructure issue**
   - Even with JWT disabled, something else might be blocking OPTIONS
   - Need to check function logs

## Step 1: Verify Function is Deployed Correctly

1. Go to **Supabase Dashboard** → **Edge Functions** → **`verify-otp-custom`**
2. Click **"Code"** tab
3. Scroll to **line 15-21**
4. Verify it shows:
   ```typescript
   if (req.method === 'OPTIONS') {
     return new Response(null, { 
       status: 200,
       headers: corsHeaders 
     });
   }
   ```
5. **If it's different or missing**, the function needs to be redeployed:
   - Copy entire code from `beezee/supabase/functions/verify-otp-custom/index.ts`
   - Paste in Dashboard Code editor
   - Click **"Deploy"**

## Step 2: Check Function Logs

1. Go to **Supabase Dashboard** → **Edge Functions** → **`verify-otp-custom`**
2. Click **"Logs"** tab
3. Try entering an OTP code in your app
4. Look at the logs:
   - **Do you see ANY requests?** (OPTIONS or POST)
   - **What status codes do you see?**
   - **Any error messages?**

**What to look for:**
- ✅ **OPTIONS requests with status 200** = Function works, might be browser cache
- ❌ **No OPTIONS requests at all** = Supabase is blocking them (check JWT setting again)
- ❌ **OPTIONS with 401/403** = JWT verification is still enabled
- ❌ **OPTIONS with 500** = Function code has an error

## Step 3: Try Redeploying the Function

Even if the code looks correct, try redeploying:

1. In Dashboard → Edge Functions → `verify-otp-custom`
2. Click **"Code"** tab
3. Copy the entire code from `beezee/supabase/functions/verify-otp-custom/index.ts`
4. Paste it in the editor (replace everything)
5. Click **"Deploy"** or **"Save"**
6. Wait for deployment to complete
7. Clear browser cache: `Ctrl+Shift+Delete`
8. Hard refresh: `Ctrl+F5`
9. Try again

## Step 4: Check if Function is Actually Public

1. In Dashboard → Edge Functions → `verify-otp-custom`
2. Look for **"Settings"** or **"Details"** tab
3. Verify:
   - **"Verify JWT"** is OFF
   - **"Require Authentication"** is OFF
   - **"Public Function"** is ON (if this option exists)

## Step 5: Alternative - Try Without apikey Header

As a test, try temporarily removing the `apikey` header from the frontend to see if that helps (this might break the function, but it's a diagnostic test):

**In `beezee/src/utils/supabase.js`, temporarily change:**
```javascript
const response = await fetch(`${functionsUrl}/verify-otp-custom`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '', // Temporarily commented out
  },
  body: JSON.stringify({ 
    whatsapp_number: whatsappNumber, 
    code: code 
  }),
});
```

**If this works**, it means Supabase is checking the `apikey` header on OPTIONS requests. But this won't work for POST requests, so we need a different solution.

## Step 6: Check Supabase Project Settings

1. Go to **Settings** → **API**
2. Look for CORS settings
3. Check if there's a whitelist of allowed origins
4. Make sure `http://localhost:5173` is allowed (or `*` is allowed)

## Most Likely Fix

**Redeploy the function** - Even if the code looks correct in the Dashboard, the deployed version might be different. Copy the entire code from the file and redeploy it.

## If Nothing Works

If none of these work, the issue might be:
- Supabase infrastructure blocking OPTIONS requests for some other reason
- Need to contact Supabase support
- Or use a different approach (proxy server, different auth method, etc.)

