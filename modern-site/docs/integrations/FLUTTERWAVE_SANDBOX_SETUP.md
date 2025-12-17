# Flutterwave Sandbox Setup Guide

## Current Issue
You're using the **Flutterwave Sandbox** dashboard (`developersandbox.flutterwave.com`), but the API is rejecting your credentials with "Invalid authorization key".

## Root Cause
The sandbox dashboard shows **Client ID** and **Client Secret**, but Flutterwave's API requires **API Secret Key** (different from Client Secret).

## Solution: Get API Secret Key from Sandbox Dashboard

### Step 1: Check Sandbox Dashboard
1. Go to: https://developersandbox.flutterwave.com/dashboard/api-keys
2. Look for these fields:
   - **Client ID** ✅ (You have this)
   - **Client Secret** ✅ (You have this)
   - **Secret Key** ❓ (This is what you need!)

### Step 2: Find or Generate Secret Key
The Secret Key should:
- Start with `FLWSECK_TEST-` for sandbox/test mode
- Be different from Client Secret
- Look like: `FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxx`

**If you don't see "Secret Key":**
1. Look for a button like "Generate Secret Key" or "Create API Keys"
2. Click it and follow the prompts
3. You may need to verify your email

### Step 3: Update Environment Variables
Once you have the API Secret Key, update your `.env.local`:

```env
# Flutterwave Sandbox Credentials
FLUTTERWAVE_PUBLIC_KEY=14e67305-fa27-4750-a78e-ee1a2a0164ae  # Client ID (keep as is)
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxx  # API Secret Key (replace with actual)
FLUTTERWAVE_ENCRYPTION_KEY=YRQQAGJjy16Y88nV0DnpSoALm7SdGFD1mUX56X8Rvco=
```

### Step 4: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Important Notes

⚠️ **Client Secret ≠ API Secret Key**
- **Client Secret**: Used for OAuth authentication (UUID format)
- **API Secret Key**: Used for direct API calls (starts with `FLWSECK_TEST-`)

⚠️ **Sandbox vs Production**
- Sandbox: Use `FLWSECK_TEST-` keys
- Production: Use `FLWSECK-` keys (no `_TEST` suffix)

## Verification

After updating, check your server logs when clicking "Subscribe to Pro":
- Should see: `startsWithFLWSECK_TEST: true`
- Should NOT see: `WARNING: Secret Key does not look like Flutterwave API Secret Key!`

## Still Having Issues?

If you can't find the Secret Key in the sandbox dashboard:
1. Check if there's a "Switch to Live" or "Generate API Keys" button
2. Contact Flutterwave support for sandbox API keys
3. Or try using Flutterwave's test mode in the regular dashboard

