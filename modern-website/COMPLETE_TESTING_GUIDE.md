# Complete Testing Guide - All Features

**Date**: April 12, 2026  
**Status**: Ready for comprehensive testing

---

## Fixed Issue

The subscription creation API has been updated to save:
- Email address
- Country code  
- Plan code

New subscriptions will now have complete data for testing.

---

## Testing Workflow

### Step 1: Create New Subscription

**URL**: http://localhost:3000/test/kyshi

**Test Data**:
```
Email: test.complete@example.com
First Name: Test
Last Name: User
Phone: +254712345678
Country: Kenya
Plan: Beezee Weekly Kenya - 200 KES
```

**Actions**:
1. Fill form with above data
2. Click "Create Subscription"
3. Add test card: `4084 0840 8408 4081`, CVV `408`
4. Complete payment
5. Note the authorization URL

---

### Step 2: Test Status Check

**After Payment**:
1. Stay on test page
2. Email: `test.complete@example.com`
3. Click "Check Status"
4. **Expected**: Shows subscription details (status, plan, next charge)

---

### Step 3: Test Manual Charge

**Actions**:
1. Same email: `test.complete@example.com`
2. Click "Manual Charge"
3. **Expected**: 
   - Success message
   - Transaction appears in "Recent Transactions" section
   - Status updates to "charged"

---

### Step 4: Test Webhook Events

**Setup**:
1. Ensure ngrok is running
2. Check webhook URL in Kyshi dashboard: `https://your-ngrok-url.ngrok-free.app/api/webhooks/kyshi`

**Actions**:
1. Create another subscription with different email
2. Complete payment
3. Check "Webhook Events" section
4. **Expected**: See events like:
   - `subscription.created`
   - `payment.completed`
   - `invoice.paid`

---

### Step 5: Test Auto-Renewal

**Actions**:
1. Create subscription with test card
2. Complete payment
3. Use the "Test Webhook" button (if available) to simulate renewal
4. **Expected**: 
   - New transaction created
   - Subscription status remains active
   - Next charge date updated

---

## Testing All Countries

### Nigeria (NGN)
```
Email: test.nigeria@example.com
Phone: +2348012345678
Country: Nigeria
Plan: Beezee Weekly Nigeria - 500 NGN
```

### Ghana (GHS)
```
Email: test.ghana@example.com
Phone: +233201234567
Country: Ghana
Plan: Beezee Weekly Ghana - 20 GHS
```

### Côte d'Ivoire (XOF)
```
Email: test.civ@example.com
Phone: +22501234567
Country: Côte d'Ivoire
Plan: Beezee Weekly Côte d'Ivoire - 1000 XOF
```

---

## Verification Commands

### Check All Data
```bash
npx ts-node scripts/test-all-features.ts
```

### Quick Status Check
```bash
npx ts-node scripts/verify-all-countries.ts
```

### Debug Issues
```bash
npx ts-node scripts/debug-subscription-data.ts
```

---

## Expected Results

### After Creating Subscription

**Database Should Show**:
```sql
-- Subscription
email: test.complete@example.com
country_code: KE
plan_code: PLN__Lt82Xz0-p5-wD6
status: active

-- Customer
email: test.complete@example.com
kyshi_customer_code: [actual code from Kyshi]

-- Transaction
subscription_id: [subscription id]
transaction_type: subscription
amount: 200
currency: KES
status: success
```

### Webhook Events Should Include:
- `subscription.created`
- `payment.completed`
- `invoice.paid`

---

## Troubleshooting

### No Webhook Events?
1. Check ngrok is running
2. Verify webhook URL in Kyshi dashboard
3. Check webhook logs in database

### Manual Charge Fails?
1. Check subscription is active
2. Verify test card is valid
3. Check Kyshi API status

### Status Check Returns Nothing?
1. Verify email matches exactly
2. Check subscription is in database
3. Ensure status is not "cancelled"

---

## Test Card Details

**For all countries**:
- **Card Number**: 4084 0840 8408 4081
- **Expiry**: Any future date (12/28)
- **CVV**: 408
- **OTP** (if prompted): 123456

---

## Success Checklist

### For Each Country:
- [ ] Create subscription
- [ ] Verify payment amount is correct
- [ ] Status check works
- [ ] Manual charge works
- [ ] Webhook events received
- [ ] Transaction recorded
- [ ] Customer record created

### Overall:
- [ ] All 4 countries tested
- [ ] ngrok webhook working
- [ ] Database properly populated
- [ ] API endpoints responding
- [ ] UI displaying correct data

---

## Production Checklist

Before going live:
- [ ] Replace ngrok URL with real webhook URL
- [ ] Update environment variables
- [ ] Test with real cards (small amounts)
- [ ] Set up monitoring for failed payments
- [ ] Configure email notifications
- [ ] Set up Vercel Cron for auto-renewal

---

## Support

If issues occur:
1. Check browser console for errors
2. Check server logs in terminal
3. Run verification scripts
4. Check Kyshi dashboard
5. Verify ngrok tunnel status

---

**Status**: Ready for comprehensive testing  
**Next Action**: Test all features with new subscription  
**Blocker**: None - all systems operational
