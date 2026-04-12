# Kyshi Subscription Integration

This document provides a complete guide for the Kyshi subscription integration implemented in the BeeZee application.

## Overview

The Kyshi integration provides:
- Multi-country subscription support (Kenya, Ghana, Nigeria, South Africa, Côte d'Ivoire)
- Automated weekly billing with webhook processing
- Comprehensive test interface
- Error handling and monitoring
- Scheduled cron job for auto-renewal

## Architecture

### Database Schema
- `kyshi_customers` - Customer information
- `kyshi_plans` - Subscription plans per country
- `kyshi_subscriptions` - Active subscription records
- `kyshi_transactions` - Payment transaction records
- `kyshi_chargebacks` - Dispute tracking
- `kyshi_webhook_logs` - Webhook event logging

### API Endpoints

#### Subscription Management
- `POST /api/kyshi/create-subscription` - Create new subscription
- `POST /api/kyshi/cancel-subscription` - Cancel subscription
- `POST /api/kyshi/refund` - Process refund
- `GET /api/kyshi/subscription-status?email=...` - Get subscription status
- `POST /api/kyshi/charge-manual` - Manual charge trigger

#### Webhooks & Automation
- `POST /api/webhooks/kyshi` - Kyshi webhook handler
- `POST /api/cron/charge-due-subscriptions` - Scheduled billing

#### Testing
- `GET /test/kyshi` - Comprehensive test interface

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Kyshi
KYSHI_SECRET_KEY=sk_test_xxx
KYSHI_WEBHOOK_SECRET=your_webhook_secret
KYSHI_PUBLIC_KEY=pk_test_xxx
KYSHI_API_URL=https://api.kyshi.co/v1

# Cron Security
CRON_SECRET=some_random_string
```

### 2. Database Migration

The database schema is already applied via migration. Verify tables exist:

```sql
SELECT * FROM kyshi_customers;
SELECT * FROM kyshi_plans;
SELECT * FROM kyshi_subscriptions;
SELECT * FROM kyshi_transactions;
```

### 3. Seed Plans

Run the plan seeding script:

```bash
npx ts-node scripts/seed-kyshi-plans.ts
```

This creates plans in both Kyshi and your database for all supported countries.

### 4. Webhook Configuration

Configure Kyshi dashboard:
- **Webhook URL**: `https://yourdomain.com/api/webhooks/kyshi`
- **Secret**: Use the same value as `KYSHI_WEBHOOK_SECRET`
- **Events**: Enable all subscription and payment events
- **Format**: JSON
- **Retries**: Enable with exponential backoff

For local testing:
```bash
ngrok http 3000
# Use ngrok URL: https://abc123.ngrok.io/api/webhooks/kyshi
```

### 5. Cron Job Setup

The cron job is configured in `vercel.json` to run hourly:
```json
"crons": [
  {
    "path": "/api/cron/charge-due-subscriptions",
    "schedule": "0 * * * *"
  }
]
```

## Testing Guide

### Access Test Interface
Navigate to `/test/kyshi` in your browser.

### Test Workflow

1. **Create Subscription**
   - Fill customer details (email, name, phone, country)
   - Select appropriate plan
   - Click "Create Subscription"
   - If authorization URL appears, open it to add a test card

2. **Verify Subscription Status**
   - Switch to "Status" tab
   - Enter customer email
   - View active subscription details

3. **Test Manual Charge**
   - Click "Charge Now" on active subscription
   - Monitor webhook logs for incoming events

4. **Test Auto-Renewal**
   - Click "Simulate Advance Time" to make subscriptions due
   - Click "Trigger Cron Job" to run billing
   - Verify webhook processing

5. **Test Cancellation & Refunds**
   - Cancel active subscription
   - Refund successful transactions

### Test Cards (Kyshi Sandbox)
Contact Kyshi support for sandbox test card numbers, or use common test cards:
- Success: `4084084084084081`
- Declined: `4000000000000002`

## Monitoring

### Health Check
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
     https://yourdomain.com/api/cron/charge-due-subscriptions
```

### Metrics Dashboard
Access metrics programmatically:
```typescript
import { KyshiMonitoringService } from '@/lib/kyshi-monitoring';

const metrics = await KyshiMonitoringService.getMetrics();
const health = await KyshiMonitoringService.healthCheck();
```

### Webhook Logs
View webhook processing logs in:
- Database: `kyshi_webhook_logs` table
- Test interface: "Webhooks" tab
- Server logs: Console output

## Error Handling

### Common Issues

1. **Webhook Signature Verification**
   - Ensure `KYSHI_WEBHOOK_SECRET` matches dashboard
   - Check header name in webhook handler
   - Verify signature algorithm (HMAC-SHA256)

2. **Subscription Not Found**
   - Verify customer email matches exactly
   - Check subscription status in database
   - Ensure webhook events processed successfully

3. **Payment Failures**
   - Verify test card is valid for sandbox
   - Check subscription has payment method
   - Review webhook logs for error details

4. **Cron Job Issues**
   - Verify `CRON_SECRET` matches environment
   - Check Vercel cron configuration
   - Monitor webhook logs for processing

### Debug Mode

Enable detailed logging:
```typescript
// In API routes
console.log('Kyshi API request:', { endpoint, data });
console.log('Kyshi API response:', response);

// In webhook handler
console.log('Webhook received:', { event, data });
console.log('Webhook processed:', { success, error });
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] Replace test API keys with live keys
- [ ] Update webhook URL to production domain
- [ ] Generate new webhook secret
- [ ] Test with live payment methods
- [ ] Set up monitoring alerts
- [ ] Configure backup payment methods

### Security Considerations

- Use HTTPS for all endpoints
- Validate all webhook signatures
- Implement rate limiting
- Monitor for suspicious activity
- Regularly rotate API keys

### Scaling Considerations

- Database indexing on frequently queried fields
- Webhook processing queue for high volume
- Circuit breaker pattern for Kyshi API calls
- Caching for plan and customer data

## API Reference

### Create Subscription
```http
POST /api/kyshi/create-subscription
Content-Type: application/json

{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678",
  "countryCode": "KE",
  "planId": "uuid-of-plan"
}
```

### Cancel Subscription
```http
POST /api/kyshi/cancel-subscription
Content-Type: application/json

{
  "subscriptionId": "uuid-of-subscription"
}
```

### Manual Charge
```http
POST /api/kyshi/charge-manual
Content-Type: application/json

{
  "subscriptionId": "uuid-of-subscription"
}
```

### Webhook Event Format
```json
{
  "event": "successful",
  "data": {
    "reference": "txn_123456",
    "amount": 200,
    "currency": "KES",
    "customer": {
      "email": "customer@example.com",
      "currencyCode": "KES"
    }
  }
}
```

## Support

For issues related to:
- **Kyshi API**: Contact Kyshi support
- **Integration code**: Check this documentation and logs
- **Database issues**: Verify Supabase configuration
- **Webhook problems**: Check URL configuration and logs

## Troubleshooting

### Quick Debug Commands

```sql
-- Check active subscriptions
SELECT * FROM kyshi_subscriptions WHERE status = 'active';

-- Check recent transactions
SELECT * FROM kyshi_transactions 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Check webhook failures
SELECT * FROM kyshi_webhook_logs 
WHERE processed = false 
ORDER BY created_at DESC;
```

### Common Error Codes

- `401`: Invalid API key or webhook signature
- `404`: Subscription or plan not found
- `409`: Duplicate transaction or subscription already exists
- `500`: Database or API error

## Future Enhancements

- Multiple payment methods per customer
- Subscription plan upgrades/downgrades
- Advanced analytics dashboard
- Automated dunning for failed payments
- Multi-currency support for single customer
- Subscription pause/resume functionality
