# OTP Verification Debugging Guide

## Common Issues

### 1. "Invalid or expired code" Error

**Possible Causes:**
- Phone number format mismatch between send and verify
- OTP already used
- OTP expired (10 minutes)
- Database function `verify_otp_code` not created

**Solutions:**

#### Check Database Function
Run this in Supabase SQL Editor:
```sql
-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'verify_otp_code';

-- If not found, run the migration:
-- supabase/migrations/20241213000007_custom_otp.sql
```

#### Check Phone Number Format
The code now normalizes phone numbers (removes spaces), but ensure:
- When sending: `+14693065247` or `+1 469 306 5247` (both work)
- When verifying: Same format (normalized automatically)

#### Check OTP Status
Run this query to see OTP status:
```sql
SELECT 
  whatsapp_number,
  code,
  used,
  expires_at,
  created_at,
  NOW() as current_time,
  expires_at > NOW() as is_valid
FROM otp_codes
WHERE whatsapp_number = '+14693065247'
ORDER BY created_at DESC
LIMIT 5;
```

### 2. Database Function Not Found

**Error:** `function verify_otp_code does not exist`

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration: `supabase/migrations/20241213000007_custom_otp.sql`
3. Verify function exists:
```sql
SELECT proname FROM pg_proc WHERE proname = 'verify_otp_code';
```

### 3. Phone Number Format Issues

**Problem:** Phone numbers stored with different formats

**Solution:** The code now normalizes phone numbers automatically:
- Removes all spaces
- Trims whitespace
- Uses consistent format for storage and verification

### 4. OTP Already Used

**Error:** "This code has already been used"

**Solution:** Request a new OTP code. Each code can only be used once.

### 5. OTP Expired

**Error:** "This code has expired"

**Solution:** OTPs expire after 10 minutes. Request a new code.

## Testing Steps

1. **Check Database:**
   ```sql
   -- See all recent OTPs
   SELECT * FROM otp_codes 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

2. **Check Function:**
   ```sql
   -- Test function directly
   SELECT verify_otp_code('+14693065247', '417101');
   ```

3. **Check Logs:**
   - Supabase Dashboard → Edge Functions → `verify-otp-custom` → Logs
   - Look for console.log output showing normalized numbers

## Updated Code

The Edge Functions now:
- ✅ Normalize phone numbers automatically
- ✅ Provide better error messages
- ✅ Log normalized numbers for debugging
- ✅ Check if OTP is used or expired

## Next Steps

1. **Redeploy Edge Functions:**
   ```bash
   # Deploy updated functions
   supabase functions deploy send-otp-whatsapp
   supabase functions deploy verify-otp-custom
   ```

2. **Test Again:**
   - Request new OTP
   - Enter code immediately
   - Check browser console for errors
   - Check Supabase Edge Function logs

3. **If Still Failing:**
   - Check Supabase Dashboard → Edge Functions → Logs
   - Look for the console.log output showing normalized numbers
   - Compare the normalized number in send vs verify


