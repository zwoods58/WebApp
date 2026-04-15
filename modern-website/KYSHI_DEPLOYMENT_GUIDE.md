# Kyshi Payment System Deployment Guide

## Overview
This guide covers the complete deployment of the Kyshi weekly subscription system with country-specific payment methods.

## API Keys
- **Public Key**: `pk_test_da16574203b943fd82c04964eeffa7d5`
- **Secret Key**: `sk_test_3dd6532c95634d1da5888520b9bf96c8`

## Environment Variables

Add these to your `.env.local` file:

```bash
# Kyshi Configuration
KYSHI_SECRET_KEY=sk_test_3dd6532c95634d1da5888520b9bf96c8
KYSHI_PUBLIC_KEY=pk_test_da16574203b943fd82c04964eeffa7d5
KYSHI_API_URL=https://api.kyshi.co
KYSHI_WEBHOOK_SECRET=your_webhook_secret_here

# Country-specific Plan Codes
KYSHI_PLAN_CODE_KENYA=PLN_KENYA_WEEKLY_200
KYSHI_PLAN_CODE_NIGERIA=PLN_NIGERIA_WEEKLY_500
KYSHI_PLAN_CODE_GHANA=PLN_GHANA_WEEKLY_20
KYSHI_PLAN_CODE_CIV=PLN_CIV_WEEKLY_1000

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourapp.com
APP_URL=https://yourapp.com
```

## Database Setup

### 1. Run Database Migration
```bash
# Apply the Kyshi database schema
supabase db push
```

The migration creates:
- `subscriptions` table - Stores subscription data
- `transactions` table - Stores payment transactions
- `kyshi_webhook_logs` table - Stores webhook event logs

### 2. Verify Tables
```sql
-- Check if tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'transactions', 'kyshi_webhook_logs');
```

## Supabase Edge Functions Deployment

### 1. Deploy Functions
```bash
# Deploy all Kyshi functions
supabase functions deploy create-subscription --no-verify-jwt
supabase functions deploy subscription-status --no-verify-jwt
supabase functions deploy kyshi-webhook --no-verify-jwt
supabase functions deploy process-weekly-charges --no-verify-jwt
```

### 2. Set Function Secrets
```bash
# Set Kyshi secrets for Edge Functions
supabase secrets set KYSHI_SECRET_KEY=sk_test_3dd6532c95634d1da5888520b9bf96c8
supabase secrets set KYSHI_WEBHOOK_SECRET=your_webhook_secret_here
supabase secrets set APP_URL=https://yourapp.com

# Set plan codes
supabase secrets set KYSHI_PLAN_CODE_KENYA=PLN_KENYA_WEEKLY_200
supabase secrets set KYSHI_PLAN_CODE_NIGERIA=PLN_NIGERIA_WEEKLY_500
supabase secrets set KYSHI_PLAN_CODE_GHANA=PLN_GHANA_WEEKLY_20
supabase secrets set KYSHI_PLAN_CODE_CIV=PLN_CIV_WEEKLY_1000
```

## Webhook Configuration

### 1. Configure Kyshi Webhook
In your Kyshi dashboard, set the webhook URL to:
```
https://yourapp.com/api/webhooks/kyshi
```

### 2. Test Webhook
```bash
# Test webhook endpoint
curl -X POST https://yourapp.com/api/webhooks/kyshi \
  -H "Content-Type: application/json" \
  -H "x-kyshi-signature: test" \
  -d '{"event": "test", "data": {}}'
```

## Scheduled Jobs Setup

### 1. Create Weekly Charge Job
Run this in your Supabase SQL editor:

```sql
-- Schedule weekly charges to run every 6 hours
SELECT cron.schedule(
  'process-weekly-charges', 
  '0 */6 * * *', 
  'SELECT supabase_functions.invoke(''process-weekly-charges'')'
);
```

### 2. Verify Cron Job
```sql
-- Check if cron job is scheduled
SELECT * FROM cron.job WHERE jobname = 'process-weekly-charges';
```

## Country-Specific Configuration

### Kenya (M-Pesa)
- **Amount**: 200 KES
- **Payment Method**: Mobile Money (M-Pesa)
- **Provider**: m-pesa
- **Plan Code**: PLN_KENYA_WEEKLY_200

### Nigeria (Bank Transfer)
- **Amount**: 500 NGN
- **Payment Method**: Bank Transfer
- **Plan Code**: PLN_NIGERIA_WEEKLY_500

### Ghana (Mobile Money)
- **Amount**: 20 GHS
- **Payment Method**: Mobile Money
- **Provider**: mtn
- **Plan Code**: PLN_GHANA_WEEKLY_20

### Côte d'Ivoire (Mobile Money)
- **Amount**: 1000 XOF
- **Payment Method**: Mobile Money
- **Provider**: orange-money
- **Plan Code**: PLN_CIV_WEEKLY_1000

## Testing the Implementation

### 1. Test Subscription Creation
```bash
# Test API endpoint
curl -X POST https://yourapp.com/api/subscription/cancel \
  -H "Content-Type: application/json" \
  -d '{"subscriptionId": "test-id"}'
```

### 2. Test Payment Flow
1. Navigate to `/Beezee-App/app/ke/retail/more`
2. Click on subscription button
3. Fill in the form
4. Complete payment via M-Pesa

### 3. Test Webhook Events
Kyshi will send webhook events for:
- `subscription.created`
- `subscription.activated`
- `subscription.cancelled`
- `subscription.payment.succeeded`
- `subscription.payment.failed`

## Monitoring and Logging

### 1. Check Function Logs
```bash
# View function logs
supabase functions logs create-subscription
supabase functions logs kyshi-webhook
supabase functions logs process-weekly-charges
```

### 2. Monitor Database
```sql
-- Check active subscriptions
SELECT COUNT(*) as active_subscriptions 
FROM subscriptions 
WHERE is_active = true AND status = 'active';

-- Check recent transactions
SELECT * FROM transactions 
ORDER BY created_at DESC 
LIMIT 10;
```

## Deep Link Configuration

### iOS (Info.plist)
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>yourapp</string>
        </array>
    </dict>
</array>
```

### Android (AndroidManifest.xml)
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="yourapp" />
</intent-filter>
```

### PWA (manifest.json)
```json
{
  "scope": "/",
  "start_url": "/",
  "display": "standalone",
  "handle_links": "preferred"
}
```

## Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **Environment Variables**: Never commit secrets to git
3. **API Keys**: Use test keys for development, production keys for live
4. **Database Access**: Use RLS policies to restrict data access
5. **Error Handling**: Log errors but don't expose sensitive information

## Troubleshooting

### Common Issues

1. **Build Errors**: Check TypeScript types and imports
2. **Function Failures**: Check Supabase function logs
3. **Payment Failures**: Verify API keys and plan codes
4. **Webhook Issues**: Check webhook URL and signature verification

### Debug Commands

```bash
# Check function status
supabase functions list

# Test function locally
supabase functions serve create-subscription

# Check database connection
supabase db ping
```

## Production Checklist

- [ ] Environment variables set
- [ ] Database migration applied
- [ ] Edge functions deployed
- [ ] Webhook URL configured
- [ ] Cron jobs scheduled
- [ ] Deep links configured
- [ ] Payment testing completed
- [ ] Error monitoring setup
- [ ] Security review completed

## Support

For issues with:
- **Kyshi API**: Contact Kyshi support
- **Supabase**: Check Supabase documentation
- **Application**: Review logs and error messages
