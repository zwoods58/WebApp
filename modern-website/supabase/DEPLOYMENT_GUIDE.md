# V2 Authentication Deployment Guide

## Step 1: Run Database Migration

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `supabase/migrations/20260121_auth_v2_schema.sql`
4. Copy the entire contents
5. Paste into SQL Editor and click **Run**
6. Verify tables were created:
   - Go to **Database** → **Tables**
   - Confirm: `business_users`, `user_sessions`, `verification_codes`, `auth_audit_log`

## Step 2: Set Environment Secrets

### Option A: Using Supabase CLI (Recommended)

```bash
cd C:\Users\Wesley\WebApp\modern-website

# Generate JWT secret (copy output)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set secrets
supabase secrets set JWT_SECRET="<paste-jwt-secret-here>"
supabase secrets set AT_API_KEY="atsk_f787f6228dc32e6b94769cf0a053afc66ca927ac4a9004d9f536753974567a0082bd469e"
supabase secrets set AT_USERNAME="sandbox"
```

### Option B: Using Supabase Dashboard

1. Go to **Settings** → **Edge Functions** → **Secrets**
2. Add each secret:
   - `JWT_SECRET`: Generate using command above
   - `AT_API_KEY`: `atsk_f787f6228dc32e6b94769cf0a053afc66ca927ac4a9004d9f536753974567a0082bd469e`
   - `AT_USERNAME`: `sandbox`

## Step 3: Deploy Edge Functions

### Deploy all functions:

```bash
cd C:\Users\Wesley\WebApp\modern-website

# Deploy auth-unified (main endpoint)
supabase functions deploy auth-unified

# Deploy auth-refresh
supabase functions deploy auth-refresh

# Deploy auth-logout (kill switch)
supabase functions deploy auth-logout

# Deploy protected-example (demo)
supabase functions deploy protected-example
```

### Verify deployment:

```bash
supabase functions list
```

You should see all 4 functions with status "ACTIVE".

## Step 4: Get Function URLs

After deployment, get your function URLs:

```bash
# Get project URL
supabase status
```

Your functions will be available at:
- `https://<project-ref>.supabase.co/functions/v1/auth-unified`
- `https://<project-ref>.supabase.co/functions/v1/auth-refresh`
- `https://<project-ref>.supabase.co/functions/v1/auth-logout`
- `https://<project-ref>.supabase.co/functions/v1/protected-example`

## Step 5: Test with Postman/Insomnia

### Test 1: Request Verification Code

**POST** `https://<project-ref>.supabase.co/functions/v1/auth-unified`

```json
{
  "action": "request-verification",
  "phone": "254712345678",
  "countryCode": "KE",
  "purpose": "signup"
}
```

Expected: `{ "success": true, "message": "Verification code sent" }`

Check Africa's Talking dashboard for SMS delivery.

### Test 2: Signup

**POST** `https://<project-ref>.supabase.co/functions/v1/auth-unified`

```json
{
  "action": "signup",
  "phone": "254712345678",
  "countryCode": "KE",
  "smsCode": "123456",
  "pin": "147258",
  "pinConfirm": "147258",
  "businessName": "Test Shop",
  "backupEmail": "test@example.com"
}
```

Expected: `{ "success": true, "accessToken": "...", "refreshToken": "..." }`

### Test 3: Login

**POST** `https://<project-ref>.supabase.co/functions/v1/auth-unified`

```json
{
  "action": "login",
  "phone": "254712345678",
  "countryCode": "KE",
  "pin": "147258"
}
```

Expected: `{ "success": true, "accessToken": "...", "refreshToken": "..." }`

### Test 4: Protected Endpoint

**GET** `https://<project-ref>.supabase.co/functions/v1/protected-example`

Headers:
```
Authorization: Bearer <access-token-from-login>
```

Expected: User profile data with active sessions

### Test 5: Kill Switch

**POST** `https://<project-ref>.supabase.co/functions/v1/auth-logout`

Headers:
```
Authorization: Bearer <access-token>
```

Body:
```json
{
  "exceptCurrent": true
}
```

Expected: `{ "success": true, "message": "All other sessions revoked" }`

Verify: Try using old access token from another "device" → should get 401

## Troubleshooting

### "Invalid credentials" error
- Check that phone number matches exactly (with country code)
- Verify PIN is 6 digits
- Check database has the user record

### "Failed to send verification code"
- Verify AT_API_KEY is set correctly
- Check Africa's Talking dashboard for API errors
- Ensure phone number is in correct format for sandbox

### "Unauthorized" on protected endpoint
- Verify Authorization header: `Bearer <token>`
- Check token hasn't expired (15 min for access tokens)
- Verify session not revoked in database

### Database connection errors
- Verify SUPABASE_URL is set (auto-set by Supabase)
- Verify SUPABASE_SERVICE_ROLE_KEY is set (auto-set by Supabase)

## Next Steps

Once all tests pass:
1. Update frontend to use new endpoints
2. Test full user journey in Kenya PWA
3. Get production API keys (Termii, Twilio, Resend)
4. Deploy to Nigeria and South Africa
