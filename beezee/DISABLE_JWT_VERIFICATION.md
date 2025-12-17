# Disable JWT Verification - Fix CORS Error

## The Root Cause

The CORS error happens because **Supabase requires JWT verification by default** for all Edge Function requests, including OPTIONS preflight requests. Since OPTIONS requests don't have JWT tokens, they're rejected before reaching your code.

## Solution: Disable JWT Verification in Supabase Dashboard

### Step-by-Step Instructions

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project: `rtfzksajhriwhulnwaks`

2. **Navigate to Edge Functions**
   - Click **Edge Functions** in the left sidebar
   - Find **`verify-otp-custom`** in the list

3. **Open Function Settings**
   - Click on **`verify-otp-custom`**
   - Look for **"Details"** tab or **"Settings"** tab
   - OR look for a gear icon ⚙️ or three dots menu ⋮

4. **Disable JWT Verification**
   - Find **"Verify JWT"** toggle/checkbox
   - **Turn it OFF** (uncheck it)
   - OR find **"Require Authentication"** and disable it
   - Click **Save** or **Deploy**

5. **Repeat for `send-otp-whatsapp`**
   - Do the same steps for `send-otp-whatsapp` function

### Alternative: If You Can't Find the Setting

If the Dashboard doesn't show JWT settings:

1. **Delete and Recreate the Function**
   - Delete `verify-otp-custom`
   - Create new function with same name
   - When creating, look for **"Public"** or **"No Auth Required"** option
   - Select that option
   - Paste your code and deploy

2. **Or Use Supabase CLI** (if installed):
   ```bash
   npm install -g supabase
   cd beezee
   supabase functions deploy verify-otp-custom --no-verify-jwt
   supabase functions deploy send-otp-whatsapp --no-verify-jwt
   ```

## Why This Fixes It

**Before (with JWT verification):**
```
Browser → OPTIONS request → Supabase checks for JWT → ❌ No JWT → Request rejected → CORS error
```

**After (without JWT verification):**
```
Browser → OPTIONS request → Supabase allows it → ✅ Reaches your code → Returns 200 → Works!
```

## Why It's Safe

These functions are **public functions** used for:
- Login/signup (before user is authenticated)
- OTP generation and verification

They have their own security:
- ✅ OTP codes expire (5 minutes)
- ✅ OTP codes can only be used once
- ✅ Rate limiting (you can add this)
- ✅ Phone number validation

**Other functions** (like `voice-to-transaction`, `financial-coach`) should **keep JWT verification enabled** because they require authenticated users.

## After Disabling JWT Verification

1. **Clear browser cache:** `Ctrl+Shift+Delete`
2. **Hard refresh:** `Ctrl+F5`
3. **Test OTP verification** - should work now!

## Verify It Worked

Test in browser console:
```javascript
fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
  method: 'OPTIONS'
}).then(r => {
  console.log('Status:', r.status);
  if (r.status === 200) {
    console.log('✅ CORS FIXED!');
  }
});
```

Should show `Status: 200` ✅

