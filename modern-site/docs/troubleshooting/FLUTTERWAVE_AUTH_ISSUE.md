# Flutterwave Authentication Issue

## Problem
Getting "Invalid authorization key" error when trying to initiate payments.

## Current Situation
- Using Client ID and Client Secret from Flutterwave dashboard
- Error: "Invalid authorization key" from Flutterwave API

## Possible Solutions

### Option 1: Get Actual Secret Key
Flutterwave's API might require a separate **Secret Key** (not Client Secret):
1. Go to Flutterwave Dashboard
2. Navigate to **Settings** → **API Keys** → **Developers**
3. Look for **"Secret Key"** (separate from Client Secret)
4. If not visible, click **"Generate Secret Key"**
5. Use this Secret Key as Bearer token

### Option 2: Use Flutterwave SDK
The `flutterwave-node-v3` SDK might handle authentication differently:
- SDK might convert Client ID/Secret to proper format
- SDK might use different authentication method
- Try using SDK instead of direct REST API calls

### Option 3: Check Test vs Live Environment
- Ensure you're using **test credentials** for test environment
- Test Secret Keys usually have `_TEST` prefix
- Verify you're hitting the correct API endpoint

## Current Code
Currently using:
```javascript
Authorization: Bearer ${FLUTTERWAVE_SECRET_KEY}
```

Where `FLUTTERWAVE_SECRET_KEY` = Client Secret from dashboard.

## Next Steps
1. Check Flutterwave dashboard for separate "Secret Key"
2. If found, update `.env.local` with actual Secret Key
3. If not found, try using Flutterwave SDK instead
4. Check server logs for detailed error messages

## Debugging
Check server terminal for:
- "Flutterwave response" logs
- "Flutterwave response status" logs
- Any error details from Flutterwave API

