# Complete CORS Fix Guide

## ✅ Code Updated

The Edge Function now has:
- ✅ `null` body for OPTIONS (not "ok")
- ✅ Status 200 explicitly set
- ✅ More permissive CORS headers (`*` for headers and methods)
- ✅ `Access-Control-Max-Age` for caching

## 🚀 Deploy the Updated Function

1. **Go to Supabase Dashboard** → Edge Functions → `verify-otp-custom`
2. **Click Edit**
3. **Copy the entire code** from `beezee/supabase/functions/verify-otp-custom/index.ts`
4. **Paste and replace all**
5. **Click Deploy**
6. **Wait for "Successfully updated edge function"**

## 🔍 Additional Debugging Steps

### 1. Check Edge Function Logs

1. Go to **Supabase Dashboard** → **Edge Functions** → `verify-otp-custom`
2. Click **Logs** tab
3. Try entering an OTP code in your app
4. Look for:
   - OPTIONS requests (should show status 200)
   - Any errors
   - The actual request/response

**What to look for:**
- If you see OPTIONS requests with status 200 → CORS is working
- If you see no OPTIONS requests → Request is being blocked before reaching function
- If you see errors → Check the error message

### 2. Test OPTIONS Request Directly

After deploying, open browser console and run:

```javascript
fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
  method: 'OPTIONS',
  headers: {
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type, apikey, authorization',
  }
}).then(async r => {
  console.log('Status:', r.status);
  console.log('Headers:', [...r.headers.entries()]);
  if (r.status === 200) {
    console.log('✅ CORS FIXED!');
  } else {
    console.log('❌ Still broken');
  }
});
```

**Expected result:** `Status: 200` and `✅ CORS FIXED!`

### 3. Check Supabase Project Settings

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Look for any CORS configuration
3. Check if there's a whitelist for origins
4. For testing, make sure `http://localhost:5173` is allowed (or use `*`)

### 4. Verify Function is Public

1. Go to **Edge Functions** → `verify-otp-custom`
2. Check **Details** tab
3. Verify the function doesn't require authentication
4. If it does, you might need to make it public or adjust the JWT verification

### 5. Clear Everything and Retry

1. **Clear browser cache:** `Ctrl+Shift+Delete` → Clear cached files
2. **Hard refresh:** `Ctrl+F5`
3. **Close and reopen browser** (sometimes helps)
4. **Try OTP again**

### 6. Check Network Tab

1. Open **Browser DevTools** → **Network** tab
2. Try entering OTP code
3. Look for the OPTIONS request to `verify-otp-custom`
4. Click on it and check:
   - **Status Code:** Should be 200
   - **Response Headers:** Should include `Access-Control-Allow-Origin: *`
   - **Request Headers:** Check what's being sent

### 7. Alternative: Deploy via CLI (if available)

If you have Supabase CLI installed:

```bash
cd beezee
supabase functions deploy verify-otp-custom --no-verify-jwt
```

The `--no-verify-jwt` flag makes the function public and might help with CORS.

## 🎯 Most Likely Fix

After updating the code with more permissive CORS headers and deploying:

1. **Clear browser cache completely**
2. **Hard refresh** (`Ctrl+F5`)
3. **Test OPTIONS request** in console (see step 2 above)
4. **Try OTP verification again**

If it still doesn't work, check the **Logs** tab in Supabase Dashboard to see if the OPTIONS request is even reaching your function.

## 📝 Current Code Summary

The function now has:
- OPTIONS handler with `null` body and status 200
- Permissive CORS headers (`*` for everything)
- Proper error handling with CORS headers on all responses

The code is correct - if it still fails, it's likely a deployment or caching issue.

