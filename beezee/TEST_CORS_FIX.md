# Test CORS Fix - Step by Step

## The Problem
The CORS error persists even after deployment. Let's verify the function is correctly deployed.

## Step 1: Verify Function Code in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Edge Functions** → **`verify-otp-custom`**
2. Click **Code** tab
3. Scroll to **line 15-21** and verify it shows:

```typescript
if (req.method === "OPTIONS") {
  return new Response(null, { 
    status: 200,
    headers: corsHeaders 
  });
}
```

**If it's different**, the function wasn't deployed correctly. Copy the entire code from `beezee/supabase/functions/verify-otp-custom/index.ts` and redeploy.

## Step 2: Test OPTIONS Request Directly

Open browser console and run this (type it, don't paste):

```javascript
fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
  method: 'OPTIONS',
  headers: {
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type, apikey, authorization'
  }
}).then(async r => {
  console.log('Status:', r.status);
  console.log('Status Text:', r.statusText);
  const headers = {};
  r.headers.forEach((v, k) => headers[k] = v);
  console.log('Headers:', headers);
  if (r.status === 200) {
    console.log('✅ CORS FIXED!');
  } else {
    console.log('❌ Still broken - Status:', r.status);
  }
}).catch(e => console.error('Error:', e));
```

**Expected:** `Status: 200` and `✅ CORS FIXED!`

**If you get a different status**, the function isn't deployed correctly.

## Step 3: Check Function Logs

1. Go to **Supabase Dashboard** → **Edge Functions** → **`verify-otp-custom`**
2. Click **Logs** tab
3. Try entering an OTP code in your app
4. Look for:
   - **OPTIONS requests** (should show status 200)
   - Any errors

**If you see NO OPTIONS requests**, the request is being blocked before reaching your function (Supabase infrastructure issue).

**If you see OPTIONS requests with status other than 200**, the function code is wrong.

## Step 4: Alternative - Check if Function Exists

In Supabase Dashboard → Edge Functions, verify:
- ✅ `verify-otp-custom` is listed
- ✅ Status shows "Active" or "Deployed"
- ✅ Last updated timestamp is recent (within last few minutes)

## Step 5: Nuclear Option - Delete and Recreate

If nothing works:

1. **Delete the function:**
   - Go to Edge Functions → `verify-otp-custom`
   - Click three dots menu → Delete

2. **Create new function:**
   - Click "Create Function"
   - Name: `verify-otp-custom`
   - Copy entire code from `beezee/supabase/functions/verify-otp-custom/index.ts`
   - Paste and Deploy

## Current Code (for reference)

The OPTIONS handler MUST be:
```typescript
if (req.method === "OPTIONS") {
  return new Response(null, { 
    status: 200,
    headers: corsHeaders 
  });
}
```

With corsHeaders:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Credentials": "false",
};
```

## What to Report Back

After testing, tell me:
1. What status code does the OPTIONS test return?
2. Do you see OPTIONS requests in the Logs tab?
3. What does the function code show in the Dashboard (lines 15-21)?

