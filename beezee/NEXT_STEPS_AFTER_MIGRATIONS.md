# 🚀 Next Steps After Database Migrations

## ✅ Migrations Applied - What's Next?

---

## 1. ✅ Verify Migrations Were Applied Correctly

### Check Tables Exist

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Output (13 tables):**
```
categories
coaching_sessions
login_attempts
notification_analytics
notification_preferences
notifications
offline_queue
payment_methods
reports
subscription_payments
transactions
trusted_devices
users
```

### Check RLS is Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**All tables should show:** `rowsecurity = true`

### Check Functions Exist

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Expected Functions:**
- check_rate_limit
- check_subscription_status
- create_default_notification_preferences
- log_login_attempt
- update_updated_at_column

### Check Triggers Exist

```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Expected:** 7 triggers

### Test Sample Query

```sql
-- Insert a test user (will be cleaned up)
INSERT INTO users (phone_number, first_name, business_name)
VALUES ('+27812345678', 'Test User', 'Test Business')
RETURNING *;

-- Verify default notification preferences were created
SELECT * FROM notification_preferences 
WHERE user_id = (SELECT id FROM users WHERE phone_number = '+27812345678');

-- Clean up
DELETE FROM users WHERE phone_number = '+27812345678';
```

---

## 2. 📦 Create Storage Buckets

### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**

#### Create Receipts Bucket
- **Name:** `receipts`
- **Public:** ❌ No (private)
- **File size limit:** 5MB
- **Allowed MIME types:** `image/jpeg, image/png, image/webp`

#### Create Voice Signatures Bucket
- **Name:** `voice-signatures`
- **Public:** ❌ No (private)
- **File size limit:** 1MB
- **Allowed MIME types:** `audio/webm, audio/mp3, audio/wav`

### Option B: Via SQL

```sql
-- Create receipts bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts',
  'receipts',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create voice-signatures bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'voice-signatures',
  'voice-signatures',
  false,
  1048576, -- 1MB
  ARRAY['audio/webm', 'audio/mp3', 'audio/wav']
);
```

### Set Storage Policies

```sql
-- Receipts: Users can upload their own receipts
CREATE POLICY "Users can upload own receipts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'receipts' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own receipts"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'receipts' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own receipts"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'receipts' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Voice Signatures: Users can upload their own voice samples
CREATE POLICY "Users can upload own voice signatures"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'voice-signatures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own voice signatures"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'voice-signatures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own voice signatures"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'voice-signatures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 3. 🔐 Configure Environment Variables

### In Supabase Dashboard

1. Go to **Project Settings** → **Edge Functions** → **Secrets**

2. Add these secrets:

```bash
# Gemini API (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Service Role (Required for voice-login)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Twilio WhatsApp (Optional - only if using WhatsApp notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Get Your Keys

**Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create new API key
3. Copy and paste into Supabase secrets

**Supabase Service Role Key:**
1. Go to **Project Settings** → **API**
2. Copy **service_role** key (keep secret!)
3. Paste into Supabase secrets

**Twilio Credentials (Optional):**
1. Go to https://www.twilio.com/console
2. Copy Account SID and Auth Token
3. Add to Supabase secrets

---

## 4. 🚀 Deploy Edge Functions

### Install Supabase CLI (if not already installed)

```bash
# Windows (PowerShell)
winget install --id=Supabase.CLI

# Or via npm
npm install -g supabase
```

### Link to Your Project

```bash
cd beezee

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Your project ref is in your Supabase URL:
# https://YOUR_PROJECT_REF.supabase.co
```

### Deploy All Functions

```bash
# Deploy voice-to-transaction
supabase functions deploy voice-to-transaction

# Deploy receipt-to-transaction
supabase functions deploy receipt-to-transaction

# Deploy generate-report
supabase functions deploy generate-report

# Deploy financial-coach
supabase functions deploy financial-coach

# Deploy notification-trigger
supabase functions deploy notification-trigger

# Deploy voice-login
supabase functions deploy voice-login

# Verify all deployed
supabase functions list
```

### Test Each Function

```bash
# Test voice-to-transaction (replace with your anon key)
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/voice-to-transaction \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-id",
    "audio_base64": "test-audio-data"
  }'

# Check logs
supabase functions logs voice-to-transaction --tail
```

---

## 5. 📱 Configure Phone Authentication

### Enable Phone Auth in Supabase

1. Go to **Authentication** → **Providers** → **Phone**
2. Enable **Phone** provider
3. Configure SMS provider:
   - **Twilio** (recommended for production)
   - Or **MessageBird**
   - Or **Vonage**

### Set Up Twilio for SMS (Recommended)

1. Create Twilio account: https://www.twilio.com
2. Get Account SID and Auth Token
3. In Supabase: **Authentication** → **Providers** → **Phone**
4. Select **Twilio**
5. Enter Account SID and Auth Token
6. Save

**Note:** For testing, Supabase provides a test phone number that always returns OTP `123456`

---

## 6. ✅ Verify Everything Works

### Test Database Connection

```bash
# In Supabase SQL Editor
SELECT 
  COUNT(*) as table_count,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as policy_count,
  (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public') as function_count
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected:**
- table_count: 13
- policy_count: 25+
- function_count: 5

### Test Storage Buckets

```bash
# In Supabase Dashboard → Storage
# Try uploading a test file to each bucket
# Verify policies work correctly
```

### Test Edge Functions

```bash
# Test each function with a simple request
# Check logs for errors
supabase functions logs --all
```

### Test Authentication

1. Go to your app (or use Supabase Dashboard → Authentication)
2. Try signing up with a phone number
3. Verify OTP is received
4. Complete signup

---

## 7. 🎨 Set Up Frontend Environment

### Create `.env` File

```bash
# In beezee/ directory
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Get Your Keys

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Install Dependencies

```bash
cd beezee
npm install
```

### Test Build

```bash
# Build for production
npm run build

# Preview locally
npm run preview

# Or run dev server
npm run dev
```

---

## 8. 🧪 Run Initial Tests

### Test Database Queries

```sql
-- Test user creation
INSERT INTO users (phone_number, first_name, business_name)
VALUES ('+27812345678', 'Test', 'Test Business')
RETURNING *;

-- Test transaction creation
INSERT INTO transactions (user_id, amount, type, category, description)
VALUES (
  (SELECT id FROM users WHERE phone_number = '+27812345678'),
  150.00,
  'income',
  'Sales',
  'Test transaction'
)
RETURNING *;

-- Clean up
DELETE FROM transactions WHERE user_id = (SELECT id FROM users WHERE phone_number = '+27812345678');
DELETE FROM users WHERE phone_number = '+27812345678';
```

### Test Frontend Connection

1. Start dev server: `npm run dev`
2. Open browser: http://localhost:5173
3. Try logging in (use test phone number)
4. Verify connection to Supabase

---

## 9. 📋 Pre-Launch Checklist

### Database ✅
- [x] All 5 migrations applied
- [x] 13 tables created
- [x] 25+ RLS policies active
- [x] 5 functions created
- [x] 7 triggers active
- [x] Storage buckets created
- [x] Storage policies set

### Backend ✅
- [ ] All 6 Edge Functions deployed
- [ ] Environment variables set
- [ ] Functions tested
- [ ] Logs monitored

### Frontend ✅
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Build successful
- [ ] Dev server running

### Authentication ✅
- [ ] Phone auth enabled
- [ ] SMS provider configured
- [ ] Test signup works
- [ ] OTP received

### Testing ✅
- [ ] Database queries work
- [ ] Storage uploads work
- [ ] Edge Functions respond
- [ ] Frontend connects to Supabase

---

## 10. 🚀 Next Immediate Steps

### Priority 1: Get App Running Locally

1. ✅ Set up `.env` file
2. ✅ Install dependencies: `npm install`
3. ✅ Start dev server: `npm run dev`
4. ✅ Test onboarding flow
5. ✅ Test login flow

### Priority 2: Deploy Edge Functions

1. ✅ Link Supabase project
2. ✅ Set environment secrets
3. ✅ Deploy all 6 functions
4. ✅ Test each function
5. ✅ Monitor logs

### Priority 3: Test Complete Flow

1. ✅ Sign up new user
2. ✅ Record voice transaction
3. ✅ Scan receipt
4. ✅ Generate report
5. ✅ Ask AI coach
6. ✅ Test offline mode

---

## 🐛 Common Issues & Solutions

### Issue: "relation does not exist"

**Solution:**
```sql
-- Check if migrations were applied
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- If tables missing, re-run migrations
-- In Supabase Dashboard → SQL Editor → Run each migration file
```

### Issue: "permission denied" on storage

**Solution:**
```sql
-- Check storage policies
SELECT * FROM pg_policies 
WHERE schemaname = 'storage';

-- Re-run storage policy SQL from step 2
```

### Issue: Edge Function returns 401

**Solution:**
- Check if `GEMINI_API_KEY` is set in Supabase secrets
- Verify you're using the correct anon key in request
- Check function logs: `supabase functions logs FUNCTION_NAME`

### Issue: Phone auth not working

**Solution:**
- Verify phone provider is enabled in Supabase Dashboard
- Check SMS provider credentials
- For testing, use Supabase test number (always returns 123456)

---

## 📞 Quick Reference

### Supabase Dashboard Links

- **SQL Editor:** https://app.supabase.com/project/YOUR_PROJECT/sql
- **Storage:** https://app.supabase.com/project/YOUR_PROJECT/storage/buckets
- **Edge Functions:** https://app.supabase.com/project/YOUR_PROJECT/functions
- **Authentication:** https://app.supabase.com/project/YOUR_PROJECT/auth/providers
- **API Settings:** https://app.supabase.com/project/YOUR_PROJECT/settings/api

### Useful Commands

```bash
# Check Supabase CLI version
supabase --version

# View project info
supabase status

# View function logs
supabase functions logs FUNCTION_NAME --tail

# List all functions
supabase functions list

# Deploy single function
supabase functions deploy FUNCTION_NAME

# Deploy all functions
supabase functions deploy --all
```

---

## 🎯 Success Criteria

You're ready for the next phase when:

✅ All 13 tables exist  
✅ All RLS policies are active  
✅ Storage buckets are created  
✅ Edge Functions are deployed  
✅ Environment variables are set  
✅ Frontend connects to Supabase  
✅ Test signup/login works  
✅ No errors in logs  

---

## 🎊 Congratulations!

**Your database is set up!** Now you can:

1. Deploy Edge Functions
2. Test the complete app
3. Start building remaining components
4. Prepare for launch!

**Next:** Follow steps 2-10 above to get everything running! 🚀

---

**Built with 🐝 for South African entrepreneurs**

*Last Updated: December 13, 2024*


