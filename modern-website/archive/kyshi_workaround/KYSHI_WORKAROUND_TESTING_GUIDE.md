# Kyshi Workaround Testing Guide

## Overview

This guide covers testing the **Kyshi Paystack amount display workaround** that fixes the issue where Paystack shows wrong amounts to customers.

## Problem Summary

- **Issue**: Kyshi sends correct amounts to Paystack, but Paystack displays wrong amounts on payment page
- **Solution**: Send multiplied amounts to Kyshi so Paystack displays the correct real amount
- **Implementation**: Store both real and Kyshi amounts, convert webhook amounts back to real amounts

## Workaround Details

| Country | Real Amount | Paystack Shows | Ratio | Kyshi Amount |
|---------|-------------|----------------|-------|-------------|
| Kenya | 200 KES | 5 KES | 40× | **8,000 KES** |
| Ghana | 20 GHS | 5 GHS | 4× | **80 GHS** |
| Nigeria | 500 NGN | 100 NGN | 5× | **2,500 NGN** |
| Côte d'Ivoire | 1,000 XOF | 5 XOF | 200× | **200,000 XOF** |

## Files Created/Modified

### Database Schema
- `supabase/migrations/20260412_kyshi_workaround_schema.sql` - Complete Kyshi schema with workaround fields

### Scripts
- `scripts/create-workaround-plans.ts` - Creates workaround plans in Kyshi and database

### API Routes
- `src/app/api/kyshi/create-subscription/route.ts` - Updated to store real amounts
- `src/app/api/webhooks/kyshi/route.ts` - Updated to convert amounts back to real amounts

### Test Page
- `src/app/test/kyshi/page.tsx` - Updated to display real amounts to customers

## Testing Steps

### Phase 1: Database Setup

1. **Run the migration:**
   ```bash
   # Apply the database schema
   supabase db push
   ```

2. **Verify tables exist:**
   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'kyshi_%';
   
   -- Check sample data
   SELECT * FROM kyshi_plans WHERE name LIKE '%Workaround%';
   ```

### Phase 2: Create Workaround Plans

1. **Set environment variables:**
   ```bash
   # Verify required environment variables
   echo $KYSHI_SECRET_KEY
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Run the workaround plans script:**
   ```bash
   npx ts-node scripts/create-workaround-plans.ts
   ```

3. **Expected output:**
   ```
   KYSHI WORKAROUND PLANS CREATOR
   ================================
   
   WORKAROUND SUMMARY:
   - Kenya: 200 KES (real) -> 8,000 KES (Kyshi) - 40x multiplier
   - Ghana: 20 GHS (real) -> 80 GHS (Kyshi) - 4x multiplier
   - Nigeria: 500 NGN (real) -> 2,500 NGN (Kyshi) - 5x multiplier
   - Côte d'Ivoire: 1,000 XOF (real) -> 200,000 XOF (Kyshi) - 200x multiplier
   
   SUMMARY
   ========
   Successful: 4/4
   Failed: 0/4
   
   SUCCESSFUL PLANS:
     KE: plan_xxx (DB: xxx)
     GH: plan_yyy (DB: yyy)
     NG: plan_zzz (DB: zzz)
     CI: plan_www (DB: www)
   ```

### Phase 3: Test Kenya (Priority)

1. **Open test page:**
   ```
   http://localhost:3000/test/kyshi
   ```

2. **Select Kenya:**
   - Country: Kenya (KES)
   - Email: test.kenya@example.com
   - First Name: Test
   - Plan: "Beezee Weekly Kenya (Workaround) - 200 KES/week"

3. **Verify plan display:**
   - Should show: "200 KES/week" (real amount)
   - Should show workaround info: "(Workaround: 8000 KES)"

4. **Create subscription:**
   - Click "Create Subscription"
   - Should redirect to Paystack
   - **CRITICAL**: Paystack should show **200 KES** (not 8,000 KES)

5. **Complete payment:**
   - Use test card: 4084 0840 8408 4081
   - CVV: 408
   - Any future expiry date

6. **Verify webhook processing:**
   - Check webhook logs: `/test/kyshi` -> Webhooks tab
   - Should see "successful" event processed
   - Transaction amount should be **200 KES** (real amount)

### Phase 4: Verify Database Records

1. **Check subscription record:**
   ```sql
   SELECT 
     id,
     email,
     country_code,
     status,
     real_amount,
     real_currency,
     kyshi_amount,
     current_period_end
   FROM kyshi_subscriptions 
   WHERE email = 'test.kenya@example.com';
   ```

2. **Expected subscription values:**
   - `real_amount`: 200
   - `real_currency`: 'KES'
   - `kyshi_amount`: 8000

3. **Check transaction record:**
   ```sql
   SELECT 
     kyshi_reference,
     amount,
     currency,
     status,
     created_at
   FROM kyshi_transactions 
   WHERE customer_email = 'test.kenya@example.com';
   ```

4. **Expected transaction values:**
   - `amount`: 200 (REAL amount, not 8000)
   - `currency`: 'KES'
   - `status`: 'success'

### Phase 5: Test Other Countries (Optional)

Repeat Phase 3 for other countries to verify the workaround works:

1. **Ghana:** Should show 20 GHS on Paystack
2. **Nigeria:** Should show 500 NGN on Paystack  
3. **Côte d'Ivoire:** Should show 1,000 XOF on Paystack

## Troubleshooting

### Common Issues

1. **Paystack still shows wrong amount:**
   - Check if workaround plan was created correctly
   - Verify `kyshi_plan_code` in database matches Kyshi
   - Check subscription creation logs for amount details

2. **Webhook conversion fails:**
   - Check webhook logs for processing errors
   - Verify subscription has `real_amount` and `conversion_ratio`
   - Check webhook handler logs for conversion calculations

3. **Database errors:**
   - Run migration: `supabase db push`
   - Check table schema: `\d kyshi_plans`
   - Verify RLS policies allow access

### Debug Commands

1. **Check plan details:**
   ```sql
   SELECT 
     name,
     real_amount,
     kyshi_amount,
     conversion_ratio,
     kyshi_plan_code
   FROM kyshi_plans 
   WHERE country_code = 'KE';
   ```

2. **Check webhook processing:**
   ```sql
   SELECT 
     event_type,
     reference,
     processed,
     error_message,
     created_at
   FROM kyshi_webhook_logs 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

3. **Check amount conversion:**
   ```sql
   SELECT 
     s.email,
     s.real_amount,
     s.kyshi_amount,
     t.amount as transaction_amount,
     t.currency,
     t.status
   FROM kyshi_subscriptions s
   LEFT JOIN kyshi_transactions t ON s.id = t.subscription_id
   WHERE s.email = 'test.kenya@example.com';
   ```

## Success Criteria

### Must Pass

1. **Paystack displays correct amount:** 200 KES for Kenya plan
2. **Database stores both amounts:** real_amount=200, kyshi_amount=8000
3. **Webhook converts correctly:** transaction.amount=200 (not 8000)
4. **Test page shows real amount:** "200 KES/week" to customer

### Should Pass

1. **Other countries work:** Ghana (20 GHS), Nigeria (500 NGN), Côte d'Ivoire (1,000 XOF)
2. **Webhook processing:** No errors in webhook logs
3. **Subscription lifecycle:** Active -> Charge -> Renew works correctly

## Rollback Plan

If the workaround doesn't work:

1. **Mark workaround plans inactive:**
   ```sql
   UPDATE kyshi_plans SET is_active = false WHERE name LIKE '%Workaround%';
   ```

2. **Create new plans with real amounts** (when Kyshi fixes the issue)

3. **Remove conversion logic** from webhook handler

4. **Update test page** to show normal amounts

## Next Steps After Testing

1. **Deploy to production** if Kenya test passes
2. **Monitor webhook logs** for amount conversion errors
3. **Contact Kyshi support** about the root cause
4. **Plan rollback** when Kyshi fixes the issue

---

**Remember:** The goal is that customers see the **real amount** (200 KES) on Paystack, while Kyshi receives the **multiplied amount** (8,000 KES) internally.
