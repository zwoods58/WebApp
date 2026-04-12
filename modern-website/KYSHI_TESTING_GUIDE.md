# Kyshi Subscription Testing Guide

## ✅ Current Status

### Plans Successfully Created
- **Kenya (KE)**: 200 KES/week - `PLN_U24q-9CKbW-7DOl` ✅ **CORRECTED**
- **Ghana (GH)**: 20 GHS/week - `GH_WEEKLY_20`
- **Nigeria (NG)**: 500 NGN/week - `NG_WEEKLY_500`
- **South Africa (ZA)**: 30 ZAR/week - `ZA_WEEKLY_50`
- **Côte d'Ivoire (CI)**: 1000 XOF/week - `PLN_IVD0jEfuxAwh-Z-`

### Key Fix Applied
The Kenya plan now charges **200 KES** (not 20,000 KES). The old incorrect plan has been replaced.

---

## 🧪 Testing Steps

### 1. Start Development Server

```bash
cd modern-website
npm run dev
```

### 2. Open Test Page

Navigate to: **http://localhost:3000/test/kyshi**

### 3. Test Kenya Subscription (Primary Test)

#### Create Subscription
1. **Email**: `test.kenya@example.com`
2. **First Name**: `Test`
3. **Last Name**: `User`
4. **Phone**: `+254712345678`
5. **Country**: Select **Kenya (KES)**
6. **Plan**: Should show **"Beezee Weekly Kenya – 200 KES/week"** ✅
7. Click **"Create Subscription"**

#### Expected Result
- Success message appears
- Authorization URL opens in new tab
- You'll be redirected to Kyshi/Paystack payment page

#### Add Test Card
Use these **test credentials** on the payment page:
- **Card Number**: `4084 0840 8408 4081`
- **Expiry**: Any future date (e.g., `12/28`)
- **CVV**: `408`
- **OTP**: `123456` (if prompted)

#### Verify Amount
**CRITICAL**: The payment page should show **200 KES**, NOT 20,000 KES

---

### 4. Test Manual Charge

After authorization is complete:

1. Go to **"Status"** tab
2. Enter email: `test.kenya@example.com`
3. Click **"Load"**
4. You should see the active subscription
5. Click **"Charge Now"**
6. Verify the charge is for **200 KES**

---

### 5. Test Webhook Integration

#### Check Webhook Logs
1. Go to **"Webhooks"** tab
2. Click **"Refresh Logs"**
3. Verify webhook events appear after charging

#### Expected Webhook Events
- `successful` - Payment succeeded
- Transaction reference logged
- Subscription `next_billing_date` updated

---

### 6. Test Auto-Renewal Simulation

#### Simulate Time Advance
1. Go to **"Webhooks"** tab
2. Click **"⏩ Simulate Advance Time"**
   - This sets `current_period_end` to yesterday
3. Click **"⚙️ Trigger Cron Job (Charge Due)"**
4. Verify automatic charge for **200 KES**

---

## 📊 Database Verification

### Check Plans in Supabase

Run this SQL query in Supabase SQL Editor:

```sql
SELECT 
  country_code,
  name,
  amount,
  currency,
  kyshi_plan_code,
  is_active
FROM kyshi_plans
WHERE is_active = true
ORDER BY country_code;
```

**Expected Output:**
| country_code | name | amount | currency | kyshi_plan_code |
|--------------|------|--------|----------|-----------------|
| CI | Beezee Weekly Côte d'Ivoire | 1000 | XOF | PLN_IVD0jEfuxAwh-Z- |
| GH | Beezee Weekly Ghana | 20 | GHS | GH_WEEKLY_20 |
| KE | Beezee Weekly Kenya | **200** | KES | PLN_U24q-9CKbW-7DOl |
| NG | Beezee Weekly Nigeria | 500 | NGN | NG_WEEKLY_500 |
| ZA | Beezee Weekly South Africa | 30 | ZAR | ZA_WEEKLY_50 |

### Check Subscriptions

```sql
SELECT 
  s.id,
  c.email,
  p.name as plan_name,
  p.amount,
  p.currency,
  s.status,
  s.current_period_end,
  s.kyshi_subscription_id
FROM kyshi_subscriptions s
JOIN kyshi_customers c ON s.customer_id = c.id
JOIN kyshi_plans p ON s.plan_id = p.id
ORDER BY s.created_at DESC
LIMIT 10;
```

### Check Transactions

```sql
SELECT 
  t.kyshi_reference,
  c.email,
  t.amount,
  t.currency,
  t.status,
  t.created_at
FROM kyshi_transactions t
JOIN kyshi_customers c ON t.customer_id = c.id
ORDER BY t.created_at DESC
LIMIT 10;
```

---

## 🔍 Troubleshooting

### Issue: Plan shows 20,000 KES instead of 200 KES

**Solution**: The old plan may still be cached. 
1. Restart your dev server: `npm run dev`
2. Hard refresh the test page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Verify the plan dropdown shows **"200 KES/week"**

### Issue: "Plan not found" error

**Solution**: Run the verification script:
```bash
npx ts-node scripts/verify-plans.ts
```

Ensure Kenya plan shows:
- Amount: **200 KES**
- Code: `PLN_U24q-9CKbW-7DOl`
- Status: ✅ ACTIVE

### Issue: Webhook not receiving events

**Solution**: 
1. Ensure ngrok is running: `ngrok http 3000`
2. Update webhook URL in Kyshi dashboard:
   - URL: `https://your-ngrok-url.ngrok-free.app/api/webhooks/kyshi`
   - Secret: Check `.env.local` for `KYSHI_WEBHOOK_SECRET`
3. Test webhook manually using Kyshi dashboard's "Test Webhook" feature

### Issue: Payment page shows wrong amount

**Cause**: The subscription may be using an old plan code.

**Solution**:
1. Delete the test subscription from Supabase
2. Create a fresh subscription using the test page
3. Verify it uses plan code `PLN_U24q-9CKbW-7DOl`

---

## 🎯 Success Criteria Checklist

- [ ] Kenya plan shows **200 KES** (not 20,000)
- [ ] Subscription creation succeeds
- [ ] Authorization URL opens correctly
- [ ] Test card payment succeeds
- [ ] Paystack checkout shows **200 KES**
- [ ] Manual charge works for **200 KES**
- [ ] Webhook receives `successful` event
- [ ] Transaction logged in database
- [ ] `next_billing_date` updates after charge
- [ ] Auto-renewal simulation works
- [ ] Cron job charges due subscriptions

---

## 📝 API Endpoints Reference

### Create Subscription
```
POST /api/kyshi/create-subscription
Body: { email, firstName, lastName, phone, countryCode, planId }
```

### Get Subscription Status
```
GET /api/kyshi/subscription-status?email=test@example.com
```

### Manual Charge
```
POST /api/kyshi/charge-manual
Body: { subscriptionId }
```

### Cancel Subscription
```
POST /api/kyshi/cancel-subscription
Body: { subscriptionId }
```

### Webhook Handler
```
POST /api/webhooks/kyshi
Headers: { x-kyshi-signature }
Body: { event, data }
```

### Cron Job (Auto-Renewal)
```
POST /api/cron/charge-due-subscriptions
Headers: { Authorization: Bearer <CRON_SECRET> }
```

---

## 🔐 Environment Variables Required

Verify these are set in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zruprmhkcqhgzydjfhrk.supabase.co
SUPABASE_URL=https://zruprmhkcqhgzydjfhrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Kyshi
KYSHI_SECRET_KEY=sk_test_3dd6532c95634d1da5888520b9bf96c8
KYSHI_PUBLIC_KEY=pk_test_da16574203b943fd82c04964eeffa7d5
KYSHI_WEBHOOK_SECRET=c4accdbb6b2f49608ef729cd9afed411
KYSHI_API_URL=https://api.kyshi.co/v1
KYSHI_BASE_URL=https://api.kyshi.co/v1

# Cron
CRON_SECRET=kyshi_cron_secret_2025_change_me_in_production
```

---

## 🚀 Next Steps

1. **Test Kenya subscription end-to-end** ✅
2. **Verify other countries** (Ghana, Nigeria, South Africa, Côte d'Ivoire)
3. **Set up production webhook URL** (replace ngrok with permanent domain)
4. **Configure Vercel Cron** for auto-renewal (or use external cron service)
5. **Update production environment variables**
6. **Test in production** with small amounts first

---

## 📞 Support Resources

- **Kyshi Docs**: https://docs.kyshi.co
- **Kyshi Dashboard**: https://dashboard.kyshi.co
- **Paystack Test Cards**: https://paystack.com/docs/payments/test-payments
- **Supabase Dashboard**: https://supabase.com/dashboard

---

**Last Updated**: April 12, 2026  
**Status**: ✅ Kenya plan corrected and ready for testing
