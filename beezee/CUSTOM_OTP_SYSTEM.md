# Custom OTP System with wa.me Links

## Overview

This app uses a **custom OTP system** that sends verification codes via WhatsApp using `wa.me` Click-to-Chat links. No Twilio, MessageBird, or WhatsApp Business API required!

## How It Works

1. **User enters WhatsApp number** → App normalizes it (e.g., `+14693065247`)
2. **App calls `send-otp-whatsapp` Edge Function** → Generates 6-digit OTP code
3. **OTP stored in database** → `otp_codes` table with 10-minute expiry
4. **wa.me link generated** → Opens WhatsApp with pre-filled message containing OTP
5. **User clicks link** → Receives code on WhatsApp
6. **User enters code** → App verifies via `verify-otp-custom` Edge Function
7. **User authenticated** → Session stored in localStorage

## Database Schema

```sql
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY,
    whatsapp_number VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    attempts INTEGER DEFAULT 0
);
```

## Edge Functions

### `send-otp-whatsapp`
- **Input**: `{ whatsapp_number: string }`
- **Output**: `{ success: true, wa_me_link: string, expires_in: 600 }`
- **Action**: Generates OTP, stores in DB, returns wa.me link

### `verify-otp-custom`
- **Input**: `{ whatsapp_number: string, code: string }`
- **Output**: `{ success: true, user_id: string, whatsapp_number: string }`
- **Action**: Verifies OTP, creates/updates user, returns user info

## Setup Instructions

### 1. Run Database Migration

```bash
# In Supabase SQL Editor or via CLI
psql -f supabase/migrations/20241213000007_custom_otp.sql
```

Or run the SQL file in Supabase Dashboard → SQL Editor.

### 2. Deploy Edge Functions

```bash
# Deploy send-otp-whatsapp
supabase functions deploy send-otp-whatsapp

# Deploy verify-otp-custom
supabase functions deploy verify-otp-custom
```

### 3. Configure Environment Variables

In Supabase Dashboard → Edge Functions → Settings:

- `WHATSAPP_BUSINESS_NUMBER` (optional): Your WhatsApp Business number for direct links
  - If not set, uses generic share link (user chooses recipient)
  - Format: `27123456789` (no +, no spaces)

### 4. Test the System

1. Enter a WhatsApp number in the app
2. Click "Next"
3. WhatsApp should open with a message like:
   ```
   Your BeeZee verification code is: 123456
   
   This code expires in 10 minutes.
   ```
4. Enter the code in the app
5. You're logged in! ✅

## Security Features

- **10-minute expiry** for OTP codes
- **One-time use** - codes are marked as used after verification
- **Rate limiting** via attempt counter
- **Automatic cleanup** of expired OTPs
- **Database-level verification** (server-side)

## Benefits

✅ **No SMS costs** - Free WhatsApp links  
✅ **No API setup** - No Twilio/MessageBird configuration needed  
✅ **Works globally** - Any WhatsApp number, any country  
✅ **Simple UX** - User clicks link, gets code instantly  
✅ **Cost-effective** - Zero per-message costs  

## Troubleshooting

### OTP not received
- Check that WhatsApp link opened correctly
- Verify the number format is correct
- Check browser console for errors

### "Invalid code" error
- Code may have expired (10 minutes)
- Code may have been used already
- Check database for OTP status

### Edge Function errors
- Verify functions are deployed
- Check Supabase logs: Dashboard → Edge Functions → Logs
- Ensure database migration ran successfully

## Migration from Supabase Auth

This system replaces Supabase's built-in phone authentication. The app now:
- ✅ Uses custom OTP system
- ✅ Stores sessions in localStorage
- ✅ No dependency on Supabase Auth phone provider
- ✅ Works with any country code

## Next Steps

1. Deploy the migration
2. Deploy the Edge Functions
3. Test with your WhatsApp number
4. Remove any Twilio/SMS provider configurations from Supabase

---

**Note**: This is a custom authentication system. Users are authenticated via OTP codes sent via WhatsApp links, not through Supabase Auth's phone provider.


