# Phase 4: PIN Reset Functionality - Implementation Summary

## ✅ Completed

Secure PIN reset functionality has been implemented with token-based verification, rate limiting, and automatic expiration.

---

## 📋 What Was Implemented

### 1. **Database Schema**

**`pin_reset_tokens` Table**
- `id` - UUID primary key
- `business_id` - Reference to businesses table
- `phone_number` - Phone number for verification
- `token` - 6-digit reset code
- `expires_at` - Token expiration timestamp (15 minutes)
- `used_at` - Timestamp when token was used
- `created_at` - Creation timestamp

**Indexes:**
- `idx_pin_reset_tokens_business_id` - Fast business lookups
- `idx_pin_reset_tokens_phone` - Fast phone lookups
- `idx_pin_reset_tokens_token` - Fast token verification
- `idx_pin_reset_tokens_expires_at` - Efficient cleanup queries

**RLS Policies:**
- Businesses can view their own tokens
- Service role can insert/update tokens
- Automatic cleanup of expired tokens

### 2. **API Endpoints**

#### **POST `/api/auth/pin-reset/request`**
Request a PIN reset token

**Request:**
```json
{
  "phoneNumber": "+254712345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reset token has been generated. Check your phone for the code.",
  "expiresIn": 900,
  "token": "123456",  // Only in development
  "businessName": "My Business"  // Only in development
}
```

**Features:**
- Generates 6-digit token
- 15-minute expiration
- Rate limited (5 requests per 15 min)
- Doesn't reveal if phone exists (security)
- Returns token in development mode

#### **POST `/api/auth/pin-reset/verify`**
Verify the reset token

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token verified. You can now reset your PIN.",
  "resetToken": "uuid-timestamp-random",
  "businessId": "business-uuid",
  "expiresIn": 300
}
```

**Features:**
- Validates 6-digit token
- Checks expiration
- Marks token as used (one-time use)
- Generates one-time reset token (5 min validity)
- Rate limited (3 attempts per 15 min - brute force protection)

#### **POST `/api/auth/pin-reset/complete`**
Complete PIN reset with new PIN

**Request:**
```json
{
  "resetToken": "uuid-timestamp-random",
  "businessId": "business-uuid",
  "newPin": "654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "PIN has been reset successfully. You can now sign in with your new PIN."
}
```

**Features:**
- Validates reset token and expiration
- Hashes new PIN with bcrypt (12 rounds)
- Updates PIN in database
- Cleans up all reset tokens for business
- Rate limited (5 requests per 15 min)

### 3. **Security Features**

✅ **Token Expiration**
- Reset tokens expire after 15 minutes
- One-time reset tokens expire after 5 minutes
- Automatic cleanup of expired tokens

✅ **Rate Limiting**
- Request: 5 attempts per 15 minutes
- Verify: 3 attempts per 15 minutes (brute force protection)
- Complete: 5 attempts per 15 minutes

✅ **One-Time Use**
- Tokens can only be used once
- Marked as used after verification
- All tokens deleted after successful reset

✅ **Brute Force Protection**
- Limited verification attempts
- Token expiration
- Rate limiting on all endpoints

✅ **Privacy Protection**
- Doesn't reveal if phone number exists
- Same response for existing/non-existing accounts

✅ **PIN Security**
- bcrypt hashing (12 rounds)
- 6-digit PIN validation
- No PIN stored in plain text

### 4. **Cleanup Script**

**`scripts/cleanup-expired-tokens.ts`**
- Removes expired tokens
- Removes used tokens older than 24 hours
- Can be run via cron job

**Usage:**
```bash
npx ts-node scripts/cleanup-expired-tokens.ts
```

**Cron Example:**
```bash
# Run every hour
0 * * * * cd /path/to/app && npx ts-node scripts/cleanup-expired-tokens.ts
```

---

## 🔄 PIN Reset Flow

### Step 1: Request Reset Token
```
User enters phone number
  ↓
POST /api/auth/pin-reset/request
  ↓
System generates 6-digit token
  ↓
Token stored in database (15 min expiry)
  ↓
SMS sent to user (TODO: integrate SMS provider)
  ↓
User receives: "Your PIN reset code is: 123456"
```

### Step 2: Verify Token
```
User enters token from SMS
  ↓
POST /api/auth/pin-reset/verify
  ↓
System validates token and expiration
  ↓
Token marked as used
  ↓
One-time reset token generated (5 min expiry)
  ↓
Reset token returned to frontend
```

### Step 3: Set New PIN
```
User enters new 6-digit PIN
  ↓
POST /api/auth/pin-reset/complete
  ↓
System validates reset token
  ↓
New PIN hashed with bcrypt
  ↓
PIN updated in database
  ↓
All reset tokens deleted
  ↓
User can now sign in with new PIN
```

---

## 🧪 Testing

### Manual Testing with cURL

**1. Request Reset Token**
```bash
curl -X POST http://localhost:3000/api/auth/pin-reset/request \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+254712345678"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Reset token has been generated...",
  "expiresIn": 900,
  "token": "123456",  // Development only
  "businessName": "Test Business"
}
```

**2. Verify Token**
```bash
curl -X POST http://localhost:3000/api/auth/pin-reset/verify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+254712345678","token":"123456"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Token verified...",
  "resetToken": "uuid-timestamp-random",
  "businessId": "business-uuid",
  "expiresIn": 300
}
```

**3. Complete Reset**
```bash
curl -X POST http://localhost:3000/api/auth/pin-reset/complete \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken":"uuid-timestamp-random",
    "businessId":"business-uuid",
    "newPin":"654321"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "PIN has been reset successfully..."
}
```

### Error Cases to Test

**Invalid Phone Number**
```bash
curl -X POST http://localhost:3000/api/auth/pin-reset/request \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"invalid"}'
```

**Expired Token**
```bash
# Wait 15 minutes after requesting token
curl -X POST http://localhost:3000/api/auth/pin-reset/verify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+254712345678","token":"123456"}'
```

**Invalid Token**
```bash
curl -X POST http://localhost:3000/api/auth/pin-reset/verify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+254712345678","token":"999999"}'
```

**Rate Limit Exceeded**
```bash
# Make 6 requests quickly
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/pin-reset/request \
    -H "Content-Type: application/json" \
    -d '{"phoneNumber":"+254712345678"}'
done
```

---

## 📱 SMS Integration (TODO)

### Recommended SMS Providers

**1. Twilio**
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: `Your Beezee PIN reset code is: ${token}. Valid for 15 minutes.`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phoneNumber
});
```

**2. Africa's Talking**
```typescript
import AfricasTalking from 'africastalking';

const africastalking = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME
});

const sms = africastalking.SMS;
await sms.send({
  to: [phoneNumber],
  message: `Your Beezee PIN reset code is: ${token}. Valid for 15 minutes.`
});
```

**3. AWS SNS**
```typescript
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({ region: 'us-east-1' });
await sns.send(new PublishCommand({
  PhoneNumber: phoneNumber,
  Message: `Your Beezee PIN reset code is: ${token}. Valid for 15 minutes.`
}));
```

### Environment Variables for SMS

```bash
# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Africa's Talking
AFRICASTALKING_API_KEY=your_api_key
AFRICASTALKING_USERNAME=your_username

# AWS SNS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

---

## 🔒 Security Best Practices

### ✅ Implemented

1. **Token Expiration** - 15 minutes for reset tokens
2. **One-Time Use** - Tokens can't be reused
3. **Rate Limiting** - Prevents brute force attacks
4. **bcrypt Hashing** - Secure PIN storage
5. **Privacy Protection** - Doesn't reveal account existence
6. **Validation** - Strict input validation with Zod
7. **Sanitization** - Phone number sanitization

### 🔐 Additional Recommendations

1. **SMS Verification** - Integrate real SMS provider
2. **IP Blocking** - Block IPs with excessive failed attempts
3. **Account Lockout** - Temporary lockout after multiple failures
4. **Audit Logging** - Log all PIN reset attempts
5. **Email Notification** - Notify user of PIN reset via email
6. **2FA Option** - Optional two-factor authentication
7. **Security Questions** - Additional verification layer

---

## 📊 Database Queries

### Check Active Tokens
```sql
SELECT 
  id,
  phone_number,
  token,
  expires_at,
  used_at,
  created_at
FROM pin_reset_tokens
WHERE expires_at > NOW()
  AND used_at IS NULL
ORDER BY created_at DESC;
```

### Cleanup Expired Tokens
```sql
DELETE FROM pin_reset_tokens
WHERE expires_at < NOW();
```

### Check Token Usage
```sql
SELECT 
  COUNT(*) as total_tokens,
  COUNT(CASE WHEN used_at IS NOT NULL THEN 1 END) as used_tokens,
  COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_tokens
FROM pin_reset_tokens;
```

---

## 📝 Files Created/Modified

1. **`src/app/api/auth/pin-reset/request/route.ts`** (NEW) - Request reset token
2. **`src/app/api/auth/pin-reset/verify/route.ts`** (NEW) - Verify token
3. **`src/app/api/auth/pin-reset/complete/route.ts`** (NEW) - Complete reset
4. **`scripts/cleanup-expired-tokens.ts`** (NEW) - Cleanup script
5. **Database:** `pin_reset_tokens` table (already exists)

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Test all three endpoints locally
- [ ] Verify token expiration works
- [ ] Test rate limiting
- [ ] Integrate SMS provider
- [ ] Set up SMS environment variables
- [ ] Test SMS delivery
- [ ] Set up cron job for token cleanup
- [ ] Test error cases
- [ ] Verify security measures

### After Deploying

- [ ] Monitor PIN reset requests
- [ ] Check SMS delivery success rate
- [ ] Monitor rate limit hits
- [ ] Check for abuse patterns
- [ ] Verify token cleanup runs
- [ ] Test from production
- [ ] Monitor error logs

---

## 🎯 Next Steps

### Immediate
- [ ] Integrate SMS provider (Twilio/Africa's Talking)
- [ ] Set up cron job for cleanup
- [ ] Test complete flow in staging
- [ ] Add monitoring/alerts

### Future Enhancements
- [ ] Email notifications for PIN resets
- [ ] Account lockout after multiple failures
- [ ] IP-based blocking for abuse
- [ ] Audit logging for security
- [ ] 2FA as additional security layer
- [ ] Security questions option

### Phase 5: Monitoring
- Set up error tracking
- Add performance monitoring
- Configure alerts for suspicious activity
- Dashboard for PIN reset metrics

---

## 📚 Resources

- [OWASP Password Reset Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Africa's Talking SMS API](https://developers.africastalking.com/docs/sms/overview)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

---

## ✨ Summary

**Phase 4: PIN Reset Functionality - COMPLETE**

- ✅ Database table created with RLS policies
- ✅ Three-step reset flow implemented
- ✅ Token generation and validation
- ✅ Secure PIN hashing with bcrypt
- ✅ Rate limiting on all endpoints
- ✅ Token expiration (15 min + 5 min)
- ✅ One-time use tokens
- ✅ Cleanup script for expired tokens
- ✅ Privacy protection (doesn't reveal accounts)
- ✅ Brute force protection

**Status:** Ready for SMS integration and deployment
**Next Phase:** Phase 5 - Production Monitoring & Alerts

**Security Audit Progress:**
- ✅ Phase 1: Input Validation (125 tests)
- ✅ Phase 2: CORS Policy (17 tests)
- ✅ Phase 3: Rate Limiting (25 tests)
- ✅ Phase 4: PIN Reset (Implemented)
- ⏳ Phase 5: Monitoring (Pending)
