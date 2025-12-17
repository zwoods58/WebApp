# Flutterwave Credentials Issue

## Problem
Getting `500 Internal Server Error` when clicking "Subscribe to Pro" button.

## Possible Causes

### 1. Credential Format Mismatch
The Flutterwave Node SDK (`flutterwave-node-v3`) may expect API keys in a specific format:
- **Expected**: `FLWPUBK-xxxxx` or `FLWSECK-xxxxx` format
- **Current**: UUID format (Client ID/Secret)

### 2. Where to Find Correct Credentials

**In Flutterwave Dashboard:**
1. Go to https://dashboard.flutterwave.com
2. Navigate to **Settings** → **API Keys**
3. Look for:
   - **Public Key** (starts with `FLWPUBK-` or `FLWPUBK_TEST-`)
   - **Secret Key** (starts with `FLWSECK-` or `FLWSECK_TEST-`)

**Note:** Client ID and Client Secret are different from API Keys!

### 3. Test Credentials Format

For **test mode**, you should see:
```
Public Key: FLWPUBK_TEST-xxxxxxxxxxxxx
Secret Key: FLWSECK_TEST-xxxxxxxxxxxxx
```

### 4. Check Server Logs

After clicking "Subscribe to Pro", check your terminal where `npm run dev` is running. You should see:
- Flutterwave credentials check
- Payment data being sent
- Flutterwave response
- Any error details

## Solution Steps

1. **Get correct API keys from Flutterwave dashboard**
2. **Update `.env.local`** with the correct format:
   ```env
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxx
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxx
   ```
3. **Restart dev server** (`npm run dev`)
4. **Try again**

## Alternative: Check Flutterwave SDK Documentation

The SDK might accept Client ID/Secret, but we need to verify:
- Check: https://github.com/Flutterwave/flutterwave-node-v3
- Or: https://www.npmjs.com/package/flutterwave-node-v3

## Debugging

The API route now logs:
- Credential presence check
- Payment data being sent
- Full Flutterwave response
- Detailed error messages

Check your server terminal for these logs!

