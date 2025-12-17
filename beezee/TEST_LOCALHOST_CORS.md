# Test Localhost CORS Issue

## The Real Problem

Localhost **should work** - the CORS headers are set to `*` which allows any origin. The issue is that **Supabase's infrastructure is blocking the OPTIONS request** before it reaches your function code because JWT verification is still enabled.

## Quick Test: Is It Localhost or JWT Verification?

Run this in your browser console (on localhost:5173):

```javascript
// Test 1: OPTIONS request (preflight)
fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
  method: 'OPTIONS'
}).then(async r => {
  console.log('OPTIONS Status:', r.status);
  console.log('OPTIONS OK?', r.ok);
  if (r.status === 200) {
    console.log('✅ OPTIONS works! CORS is fixed.');
  } else {
    console.log('❌ OPTIONS failed. Status:', r.status);
    console.log('This means JWT verification is still enabled in Dashboard.');
  }
}).catch(e => console.error('Error:', e));
```

**Expected Result:**
- ✅ **Status 200** = CORS is working, localhost is fine
- ❌ **Status 401/403** = JWT verification is blocking it (needs to be disabled in Dashboard)
- ❌ **Status 404** = Function doesn't exist or wrong URL

## The Solution

**Localhost is NOT the problem.** The problem is **JWT verification in Supabase Dashboard**.

### Fix in Supabase Dashboard:

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`verify-otp-custom`**
3. Look for **"Settings"** or **"Details"** tab
4. Find **"Verify JWT"** or **"Require Authentication"** toggle
5. **Turn it OFF** (disable it)
6. **Save/Deploy**
7. Repeat for **`send-otp-whatsapp`**

## Alternative: If Dashboard Doesn't Show JWT Setting

If you can't find the JWT setting in the Dashboard:

1. **Check if function is deployed:**
   - Go to Edge Functions → `verify-otp-custom`
   - Click **"Code"** tab
   - Verify line 16-20 shows:
   ```typescript
   if (req.method === 'OPTIONS') {
     return new Response(null, { 
       status: 200,
       headers: corsHeaders 
     });
   }
   ```

2. **If code is wrong, redeploy:**
   - Copy entire code from `beezee/supabase/functions/verify-otp-custom/index.ts`
   - Paste in Dashboard → Code tab
   - Click **Deploy**

3. **Check function logs:**
   - Go to Edge Functions → `verify-otp-custom` → **Logs** tab
   - Try entering OTP code
   - **If you see NO OPTIONS requests** = Supabase is blocking it (JWT verification)
   - **If you see OPTIONS with status 200** = Function works, but frontend might have cache issue

## Why Localhost Should Work

- ✅ CORS headers: `Access-Control-Allow-Origin: *` (allows any origin)
- ✅ Your function code handles OPTIONS correctly
- ✅ The issue is Supabase's infrastructure blocking OPTIONS before your code runs

## Next Steps

1. **Run the test above** to confirm it's JWT verification
2. **Disable JWT verification in Dashboard** (most important!)
3. **Clear browser cache:** `Ctrl+Shift+Delete`
4. **Hard refresh:** `Ctrl+F5`
5. **Try OTP verification again**

The localhost origin is fine - the problem is JWT verification blocking OPTIONS requests!

