# Missing Components Checklist

## ✅ Already Implemented

1. **Payment Initiation**
   - ✅ Pro subscription payment route (`/api/ai-builder/payments/pro-subscription`)
   - ✅ Buyout payment route (`/api/ai-builder/payments/buyout`)
   - ✅ Payment verification route (`/api/ai-builder/payments/verify`)
   - ✅ Webhook handler (`/api/ai-builder/payments/webhook`)
   - ✅ Payment success page (`/ai-builder/payment/success`)

2. **Database**
   - ✅ Buyout fields migration (`20250108000000_add_buyout_fields.sql`)
   - ✅ Subscription schema (`20250102000000_account_tiers_schema.sql`)
   - ✅ Database functions for subscription management

3. **UI Components**
   - ✅ Upgrade page (`/ai-builder/upgrade`)
   - ✅ Upgrade modal component
   - ✅ Pro dashboard with billing tab

---

## ❌ Missing Components

### 1. **Subscription Cancellation**
   - **Missing**: API endpoint to cancel subscriptions
   - **Location**: `/app/api/ai-builder/payments/cancel-subscription/route.ts`
   - **Purpose**: Allow users to cancel their Pro subscription
   - **Required**: 
     - Update `user_accounts.subscription_status` to 'canceled'
     - Set `subscription_ends_at` to end of current period
     - Optionally cancel Flutterwave subscription if using recurring payments

### 2. **Subscription Renewal Handling**
   - **Missing**: Automatic renewal logic for monthly subscriptions
   - **Options**:
     - **Option A**: Flutterwave Recurring Payments (requires setup)
       - Create subscription plan in Flutterwave dashboard
       - Use Flutterwave subscription API
       - Handle renewal webhooks
     - **Option B**: Manual renewal (current approach)
       - Cron job to check `subscription_ends_at`
       - Send renewal reminders
       - Auto-downgrade expired subscriptions
   - **Required**: 
     - Scheduled task/cron job to check expiring subscriptions
     - Renewal reminder emails
     - Auto-downgrade expired subscriptions

### 3. **Payment Failure Handling**
   - **Missing**: Page/component for failed payments
   - **Location**: `/app/ai-builder/payment/failed/page.tsx`
   - **Purpose**: Show error message when payment fails
   - **Required**: 
     - Error display
     - Retry payment button
     - Support contact information

### 4. **Subscription Management UI**
   - **Missing**: Cancel subscription button in Pro dashboard
   - **Location**: `app/ai-builder/pro-dashboard/page.tsx` (Billing tab)
   - **Purpose**: Allow users to cancel their subscription
   - **Required**: 
     - "Cancel Subscription" button
     - Confirmation modal
     - Call to cancellation API endpoint

### 5. **Subscription Expiry Check**
   - **Missing**: Automatic check on login/dashboard load
   - **Location**: `src/lib/account-tiers.ts` or middleware
   - **Purpose**: Check if subscription has expired and downgrade user
   - **Required**: 
     - Check `subscription_ends_at` vs current date
     - Auto-downgrade if expired
     - Show warning banner if expiring soon

### 6. **Flutterwave Recurring Payments Setup**
   - **Missing**: Configuration for automatic monthly billing
   - **Required**: 
     - Create subscription plan in Flutterwave dashboard
     - Update payment initiation to use subscription API instead of one-time payment
     - Handle `subscription.charged` webhook events
   - **Note**: Currently using one-time payments - users need to manually renew each month

### 7. **Webhook Event Handling**
   - **Partially Missing**: Additional webhook events
   - **Current**: Only handles `charge.completed`
   - **Missing**: 
     - `subscription.charged` (for renewals)
     - `charge.failed` (for failed payments)
     - `subscription.cancelled` (for cancellations)
   - **Location**: `/app/api/ai-builder/payments/webhook/route.ts`

### 8. **Environment Variables Documentation**
   - **Missing**: Complete list of required environment variables
   - **Required Variables**:
     ```
     # Flutterwave
     FLUTTERWAVE_PUBLIC_KEY=your_public_key
     FLUTTERWAVE_SECRET_KEY=your_secret_key
     FLUTTERWAVE_SECRET_HASH=your_secret_hash
     
     # Supabase
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     
     # App
     NEXT_PUBLIC_APP_URL=https://your-domain.com
     
     # AI/OpenRouter (if using)
     OPENROUTER_API_KEY=your_openrouter_key
     CLAUDE_API_KEY=your_claude_key
     ```

### 9. **Scheduled Tasks/Cron Jobs**
   - **Missing**: Background jobs for subscription management
   - **Required**:
     - Check expiring subscriptions (daily)
     - Send renewal reminders (7 days before expiry)
     - Auto-downgrade expired subscriptions (daily)
   - **Options**:
     - Vercel Cron Jobs (`vercel.json`)
     - Supabase Edge Functions + pg_cron
     - External cron service (cron-job.org, etc.)

### 10. **Error Logging & Monitoring**
   - **Missing**: Payment error tracking
   - **Required**: 
     - Log failed payments
     - Track webhook failures
     - Monitor subscription renewal failures
   - **Options**: 
     - Sentry
     - Logtail
     - Custom logging to database

### 11. **Payment History**
   - **Missing**: Display payment history in Pro dashboard
   - **Location**: `app/ai-builder/pro-dashboard/page.tsx` (Billing tab)
   - **Required**: 
     - Query `payments` table
     - Display transaction history
     - Show invoices/receipts

### 12. **Flutterwave Webhook URL Configuration**
   - **Missing**: Webhook URL setup in Flutterwave dashboard
   - **Required**: 
     - Set webhook URL: `https://your-domain.com/api/ai-builder/payments/webhook`
     - Configure webhook events to listen for
     - Set webhook secret hash

### 13. **Subscription Status Badge**
   - **Missing**: Visual indicator of subscription status
   - **Location**: Pro dashboard header/sidebar
   - **Required**: 
     - Show "Active", "Expiring Soon", "Expired" status
     - Color-coded badges
     - Link to billing page

### 14. **Grace Period Handling**
   - **Missing**: Grace period for failed payments
   - **Required**: 
     - Allow access for X days after failed payment
     - Send payment reminders
     - Final downgrade after grace period

### 15. **Refund Handling** (Optional)
   - **Missing**: Refund processing
   - **Required**: 
     - API endpoint to process refunds
     - Admin interface to issue refunds
     - Update subscription status after refund

---

## Priority Order

### **High Priority** (Required for MVP)
1. Subscription cancellation endpoint
2. Subscription expiry check on login
3. Payment failure page
4. Cancel subscription button in UI
5. Environment variables documentation

### **Medium Priority** (Required for production)
6. Subscription renewal handling (cron job)
7. Webhook event handling (all events)
8. Flutterwave webhook URL configuration
9. Payment history display
10. Subscription status badge

### **Low Priority** (Nice to have)
11. Grace period handling
12. Refund handling
13. Error logging & monitoring
14. Flutterwave recurring payments setup

---

## Next Steps

1. **Immediate**: Create cancellation endpoint and UI
2. **Short-term**: Implement subscription expiry checks
3. **Medium-term**: Set up cron jobs for renewals
4. **Long-term**: Migrate to Flutterwave recurring payments

