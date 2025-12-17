# Deploy Edge Function - Fix CORS Error

## Quick Fix for CORS Error

The `verify-otp-custom` Edge Function needs to be redeployed with the updated CORS headers.

## Option 1: Deploy via Supabase CLI (Recommended)

```bash
# Navigate to your project directory
cd beezee

# Deploy the verify-otp-custom function
supabase functions deploy verify-otp-custom
```

## Option 2: Deploy via Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Edge Functions** in the left sidebar
4. Find `verify-otp-custom`
5. Click **Deploy** or **Redeploy**
6. Or click **Edit** and copy-paste the updated code from:
   - `beezee/supabase/functions/verify-otp-custom/index.ts`

## What Was Fixed

- ✅ Changed OPTIONS response to status `204` (proper for preflight)
- ✅ Added `Access-Control-Max-Age` header
- ✅ Ensured all responses include CORS headers

## Verify Deployment

After deploying, try entering the OTP code again. The CORS error should be resolved.

## If Still Getting CORS Error

1. **Check function is deployed:**
   - Go to Supabase Dashboard → Edge Functions
   - Verify `verify-otp-custom` shows as "Active"

2. **Check function logs:**
   - Click on `verify-otp-custom` function
   - Go to "Logs" tab
   - Look for any errors

3. **Test the function directly:**
   ```bash
   curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/verify-otp-custom \
     -H "Content-Type: application/json" \
     -H "apikey: YOUR_ANON_KEY" \
     -d '{"whatsapp_number": "+14693065247", "code": "123456"}'
   ```

