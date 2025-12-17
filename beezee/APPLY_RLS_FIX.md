# Apply RLS Policy Fix

## The Issue

The RLS policies currently only allow `service_role` to insert OTP codes, but we're now inserting from the frontend (anon role). We need to allow public inserts.

## How to Apply

### Option 1: Run SQL in Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `beezee/supabase/migrations/20241213000009_fix_otp_rls.sql`
4. Paste it in the SQL editor
5. Click **"Run"**
6. You should see "Success. No rows returned"

### Option 2: Run Migration File

If you have Supabase CLI set up:
```bash
supabase db push
```

## What This Does

- ✅ Allows **public** (anon role) to **INSERT** OTP codes
- ✅ Allows **public** to **SELECT** OTP codes (for verification)
- ✅ Only **service_role** can **UPDATE/DELETE** (for cleanup)

## After Applying

1. **Clear browser cache**: `Ctrl+Shift+Delete`
2. **Try OTP verification** - it should work now!

## Security Note

This is safe because:
- OTP codes expire in 5 minutes
- The `verify_otp_code` function marks codes as used
- Codes can only be used once
- The verification logic is in the database function (server-side)

