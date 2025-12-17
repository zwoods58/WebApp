# Verify Edge Function Deployment

## The Issue
The CORS error persists because the function might not be deployed correctly, or there's a caching issue.

## Step-by-Step Verification

### 1. Check Function is Deployed
1. Go to https://supabase.com/dashboard
2. Select your project: `rtfzksajhriwhulnwaks`
3. Go to **Edge Functions** → **`verify-otp-custom`**
4. Check the **"Last Updated"** timestamp - it should be recent
5. Check the **Status** - should show "Active" or "Deployed"

### 2. Verify the Code is Correct
1. Click on **`verify-otp-custom`**
2. Click **Edit** or the code editor icon
3. Scroll to line 15-19
4. **Verify it shows:**
   ```typescript
   if (req.method === "OPTIONS") {
     return new Response("ok", { 
       status: 200,
       headers: corsHeaders 
     });
   }
   ```
5. If it's different, **copy the entire file** from:
   - `beezee/supabase/functions/verify-otp-custom/index.ts`
6. **Paste and replace all code**
7. Click **Deploy** or **Save & Deploy**

### 3. Check Function Logs
1. In the function page, click **Logs** tab
2. Try entering an OTP code in your app
3. Check the logs for:
   - Any errors
   - OPTIONS requests
   - The actual request/response

### 4. Test the Function Directly
Open browser console and run:
```javascript
fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
  method: 'OPTIONS',
  headers: {
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type',
  }
}).then(r => {
  console.log('Status:', r.status);
  console.log('Headers:', [...r.headers.entries()]);
});
```

This should return status **200** with CORS headers.

### 5. Clear Browser Cache
1. Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. **Hard refresh** the page: **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac)

### 6. Check if Function Exists
In Supabase Dashboard → Edge Functions, verify:
- ✅ `verify-otp-custom` is in the list
- ✅ Status shows as "Active" or "Deployed"
- ✅ Last updated timestamp is recent

## If Still Not Working

### Option A: Delete and Redeploy
1. In Supabase Dashboard → Edge Functions
2. Find `verify-otp-custom`
3. Click **Delete** (or three dots menu → Delete)
4. Create a new function with the same name
5. Copy code from `beezee/supabase/functions/verify-otp-custom/index.ts`
6. Paste and deploy

### Option B: Check Supabase Project Settings
1. Go to **Settings** → **API**
2. Check if CORS is configured
3. Verify your localhost URL is allowed (if there's a CORS whitelist)

### Option C: Use Supabase CLI (if installed)
```bash
# Check if function exists
supabase functions list

# Redeploy
supabase functions deploy verify-otp-custom --no-verify-jwt
```

## Current Code (for reference)
The OPTIONS handler should be:
```typescript
if (req.method === "OPTIONS") {
  return new Response("ok", { 
    status: 200,
    headers: corsHeaders 
  });
}
```

Make sure this exact code is deployed!

