# Fix CORS Error - JWT Verification Issue

## The Root Cause

The CORS error is happening because Supabase Edge Functions **require JWT verification by default**, even for OPTIONS preflight requests. Since OPTIONS requests don't include JWT tokens, they fail before reaching your code.

## Solution: Disable JWT Verification for OTP Functions

I've updated `config.toml` to disable JWT verification for:
- `send-otp-whatsapp` 
- `verify-otp-custom`

These functions are public (no authentication needed) so JWT verification isn't required.

## What Changed

Added to `beezee/supabase/config.toml`:

```toml
[[edge_functions.definitions]]
name = "send-otp-whatsapp"
verify_jwt = false

[[edge_functions.definitions]]
name = "verify-otp-custom"
verify_jwt = false
```

## How to Apply This Fix

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → **Edge Functions** → **`verify-otp-custom`**
2. Click **Details** tab (or **Settings**)
3. Look for **"Verify JWT"** or **"Require Authentication"** toggle
4. **Turn it OFF** (disable JWT verification)
5. Do the same for **`send-otp-whatsapp`**

### Option 2: Deploy via CLI (if you install it)

```bash
# Install Supabase CLI first
npm install -g supabase

# Then deploy with --no-verify-jwt flag
cd beezee
supabase functions deploy verify-otp-custom --no-verify-jwt
supabase functions deploy send-otp-whatsapp --no-verify-jwt
```

### Option 3: Use Supabase Dashboard Settings

1. Go to **Settings** → **Edge Functions**
2. Look for function-specific settings
3. Find `verify-otp-custom` and disable JWT verification

## Why This Fixes It

- **Before:** OPTIONS request → Supabase checks for JWT → No JWT found → Request rejected → CORS error
- **After:** OPTIONS request → No JWT check → Reaches your code → Returns 200 with CORS headers → ✅ Works!

## Verify It Works

After disabling JWT verification:

1. **Clear browser cache:** `Ctrl+Shift+Delete`
2. **Hard refresh:** `Ctrl+F5`
3. **Test in console:**
   ```javascript
   fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
     method: 'OPTIONS'
   }).then(r => console.log('Status:', r.status));
   ```
4. Should show `Status: 200` ✅

## Important Note

These functions (`send-otp-whatsapp` and `verify-otp-custom`) are **public functions** - they don't need authentication because:
- They're used for login/signup (before user is authenticated)
- They have their own security (OTP codes, expiration, etc.)
- Making them public is safe and necessary

Other functions (like `voice-to-transaction`, `financial-coach`) should keep `verify_jwt = true` because they require authenticated users.

