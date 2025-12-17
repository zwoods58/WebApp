# Exact Code to Copy for Deployment

## Copy This for `verify-otp-custom`

Open `beezee/supabase/functions/verify-otp-custom/index.ts` in your editor and copy the ENTIRE file (all 174 lines).

## Copy This for `send-otp-whatsapp`

Open `beezee/supabase/functions/send-otp-whatsapp/index.ts` in your editor and copy the ENTIRE file (all 106 lines).

## How to Deploy

1. **Go to Supabase Dashboard** → **Edge Functions**
2. **Click `verify-otp-custom`** → **Code tab**
3. **Select all (Ctrl+A)** and **Delete**
4. **Paste** the entire code from `verify-otp-custom/index.ts`
5. **Click "Deploy"**
6. **Repeat for `send-otp-whatsapp`**

## After Deploying

1. Close your browser
2. Reopen it
3. Try OTP verification

The CORS error should be fixed after deployment!

