# Check OTP Verification - No Hardcoded Values

## How OTP Verification Works

The code is **NOT hardcoded**. Here's how it works:

### 1. OTP Generation (Random)
```javascript
// Line 138 in supabase.js
const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
```
- Generates a **random** 6-digit code (100000-999999)
- Each request gets a **different** code

### 2. OTP Storage
- Code is stored in `otp_codes` table with:
  - `whatsapp_number` (normalized)
  - `code` (the random 6-digit code)
  - `expires_at` (5 minutes from now)
  - `used` (false)

### 3. OTP Verification
```javascript
// Line 177-183 in supabase.js
const { data: isValid, error: verifyError } = await supabase.rpc(
  'verify_otp_code',
  {
    p_whatsapp_number: normalizedNumber,
    p_code: code.toString().trim(), // Uses the code user entered
  }
);
```

The verification:
- Takes the code the **user entered**
- Checks it against the database
- Looks for a matching code for that WhatsApp number
- Verifies it's not used and not expired

## What You Might Be Seeing

If you're seeing the same code every time, it could be:

1. **Browser cache** - The old code is cached
2. **RLS blocking storage** - The OTP isn't being stored, so verification always fails
3. **Console logs showing the same code** - If you're looking at network requests, you might see the same code being checked

## To Verify It's Working

1. **Check the database:**
   ```sql
   SELECT * FROM otp_codes 
   WHERE whatsapp_number = '+14693065247'
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
   - You should see **different codes** for each request

2. **Check console logs:**
   - Look for the code being sent in the request
   - It should match the code displayed on screen
   - Each new request should have a different code

3. **Try generating a new code:**
   - Click "Generate new code"
   - You should see a **different** 6-digit number

## The Real Issue

The current error is **RLS blocking the OTP from being stored**. That's why verification fails - the code never gets saved to the database!

**Fix:** Run the migration `20241213000010_fix_otp_rls_simplified.sql` to allow OTP storage.

