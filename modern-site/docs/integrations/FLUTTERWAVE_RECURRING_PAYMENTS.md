# Flutterwave Recurring Payments Setup

This guide explains how to set up automatic recurring payments for Pro subscriptions using Flutterwave.

## Current Implementation

Currently, the system uses **one-time payments** for subscriptions. Users must manually renew each month.

## Setting Up Recurring Payments

### Step 1: Create Subscription Plan in Flutterwave

1. Log in to your Flutterwave Dashboard
2. Navigate to **Settings > Subscriptions**
3. Click **Create Plan**
4. Fill in the plan details:
   - **Plan Name**: AtarWebb Pro Monthly
   - **Amount**: $20.00 USD
   - **Interval**: Monthly
   - **Duration**: Unlimited (or set a maximum duration)
5. Save the plan and note the **Plan ID**

### Step 2: Update Payment Initiation Code

Update `/app/api/ai-builder/payments/pro-subscription/route.ts`:

```typescript
// Replace one-time payment with subscription
const subscriptionData = {
  email: account.email,
  amount: 20,
  currency: 'USD',
  plan: 'FLWPUBK-xxxxxxxxxxxxx', // Your plan ID from Step 1
  tx_ref: `pro_sub_${user.id}_${Date.now()}`,
  redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/ai-builder/payment/success?type=pro&tx_ref=${encodeURIComponent(`pro_sub_${user.id}_${Date.now()}`)}`,
  customer: {
    email: account.email,
    name: account.full_name || account.email,
    phone_number: account.phone || ''
  },
  customizations: {
    title: 'AtarWebb Pro Subscription',
    description: 'Monthly Pro Plan - $20/month',
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicom.png`
  }
}

const response = await flw.Subscription.create(subscriptionData)
```

### Step 3: Configure Webhook Events

In Flutterwave Dashboard:

1. Go to **Settings > Webhooks**
2. Add webhook URL: `https://your-domain.com/api/ai-builder/payments/webhook`
3. Enable these events:
   - `charge.completed`
   - `subscription.charged` (for renewals)
   - `subscription.cancelled`
   - `charge.failed`
4. Set webhook secret hash (save this as `FLUTTERWAVE_SECRET_HASH`)

### Step 4: Handle Subscription Renewals

The webhook handler (`/app/api/ai-builder/payments/webhook/route.ts`) already includes:

- `handleSubscriptionRenewal()` - Processes monthly renewals
- `handleSubscriptionCancellation()` - Handles cancellations

These functions will automatically:
- Extend subscription by 30 days
- Log payment transactions
- Update user account status

### Step 5: Update Database Schema (if needed)

Ensure your `subscriptions` table includes:
- `payment_provider_subscription_id` - Flutterwave subscription ID
- `status` - Subscription status
- `current_period_start` - Current billing period start
- `current_period_end` - Current billing period end

### Step 6: Test Subscription Flow

1. **Test Subscription Creation:**
   - Use Flutterwave test cards
   - Verify subscription is created in Flutterwave dashboard
   - Check database records are updated

2. **Test Renewal:**
   - Wait for renewal date (or use Flutterwave test mode)
   - Verify webhook receives `subscription.charged` event
   - Check subscription is extended in database

3. **Test Cancellation:**
   - Cancel subscription in Flutterwave dashboard
   - Verify webhook receives `subscription.cancelled` event
   - Check user retains access until period ends

## Migration from One-Time to Recurring

If you're migrating existing users:

1. **Identify active subscriptions:**
   ```sql
   SELECT * FROM user_accounts 
   WHERE account_tier = 'pro_subscription' 
   AND subscription_status = 'active'
   ```

2. **Create Flutterwave subscriptions for each user:**
   - Use Flutterwave API to create subscriptions
   - Link subscription IDs to user accounts
   - Update `payment_provider_subscription_id` field

3. **Update payment flow:**
   - Switch from one-time to subscription payments
   - Update webhook handlers
   - Test thoroughly before going live

## Benefits of Recurring Payments

✅ **Automatic renewals** - No manual intervention needed
✅ **Better user experience** - Seamless subscription management
✅ **Reduced churn** - Users don't forget to renew
✅ **Accurate billing** - Flutterwave handles payment retries
✅ **Subscription management** - Users can cancel anytime

## Important Notes

⚠️ **Grace Period**: Failed payments get a 7-day grace period before downgrade
⚠️ **Cancellation**: Users retain access until current period ends
⚠️ **Refunds**: Process refunds through Flutterwave dashboard or API
⚠️ **Testing**: Always test with Flutterwave test mode first

## Support

For Flutterwave API documentation:
- https://developer.flutterwave.com/docs/recurring-payments

For issues with this implementation:
- Check webhook logs in Flutterwave dashboard
- Review server logs for webhook processing errors
- Verify environment variables are set correctly

