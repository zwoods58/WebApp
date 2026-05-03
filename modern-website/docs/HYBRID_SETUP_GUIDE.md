# Hybrid Payment System Setup Guide

## Your Configuration
- **Webhook URL**: `https://atarwebb.com/api/webhooks/kyshi`
- **Webhook Secret**: `c4accdbb6b2f49608ef729cd9afed411`

## Quick Setup

### 1. Test Your Webhook
```bash
node test-my-webhook.js
```

### 2. Configure Kyshi Dashboard
1. Log into your Kyshi dashboard
2. Go to Webhooks section
3. Add webhook URL: `https://atarwebb.com/api/webhooks/kyshi`
4. Set webhook secret: `c4accdbb6b2f49608ef729cd9afed411`
5. Enable events:
   - subscription.created
   - subscription.activated
   - subscription.cancelled
   - subscription.payment.succeeded
   - subscription.payment.failed

### 3. Enable Hybrid Monitoring
```typescript
import { subscriptionMonitor } from './lib/subscription-monitor';

// Start backup polling (10 minute intervals)
subscriptionMonitor.startPolling(10);
```

## How It Works

### Primary: Webhooks (Real-time)
- Kyshi sends instant notifications to your webhook
- Your webhook processes events immediately
- Users get instant access/payment confirmation
- Database updated in real-time

### Secondary: API Polling (Backup)
- Every 10 minutes, check for missed events
- Catches any webhooks that failed to deliver
- Ensures no subscription updates are missed
- Provides redundancy and reliability

## Testing Your Setup

### Test Webhook Directly
```bash
# Test all webhook events
node test-my-webhook.js

# Test specific events
node test-webhook-endpoint.js
```

### Test Complete Flow
```bash
# Test full payment pipeline
node test-payment-flow.js

# Test Edge Function
node test-edge-function.js
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Webhook Configuration
KYSHI_WEBHOOK_SECRET=c4accdbb6b2f49608ef729cd9afed411

# App Configuration
NEXT_PUBLIC_APP_URL=https://atarwebb.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Kyshi Configuration
KYSHI_SECRET_KEY=your-kyshi-secret-key
```

## Monitoring & Debugging

### Check Webhook Logs
```bash
# Check Next.js logs
tail -f logs/nextjs.log

# Check specific webhook events
grep "webhook" logs/nextjs.log
```

### Monitor Subscriptions
```sql
-- View recent webhook activity
SELECT * FROM activity_logs 
WHERE action LIKE '%subscription_%'
ORDER BY created_at DESC;

-- View pending subscriptions
SELECT * FROM subscriptions 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Health Checks
```typescript
// Check webhook health
import { webhookConfig } from './config/webhook-config';

const healthCheck = async () => {
  const response = await fetch(webhookConfig.kyshi.url, {
    method: 'GET',
    headers: { 'User-Agent': 'Health-Check/1.0' }
  });
  
  console.log('Webhook health:', response.status);
};
```

## Security Checklist

### Webhook Security
- [x] HTTPS endpoint (https://atarwebb.com)
- [x] Signature verification implemented
- [x] Secret key configured
- [x] Event validation
- [x] Rate limiting protection

### API Security
- [x] API keys stored securely
- [x] Request validation
- [x] Error handling
- [x] Timeout protection

## Troubleshooting

### Webhook Not Receiving Events
1. Check Kyshi dashboard webhook configuration
2. Verify webhook URL is accessible
3. Check webhook secret matches
4. Look at server logs for errors

### Signature Verification Fails
1. Ensure secret matches Kyshi configuration
2. Check signature calculation method
3. Verify request body encoding

### API Polling Not Working
1. Check API keys are valid
2. Verify database connection
3. Check polling interval settings

### Database Not Updating
1. Check database connection
2. Verify table schema
3. Check error logs

## Production Deployment

### Before Going Live
1. [ ] Test all webhook events
2. [ ] Verify backup polling works
3. [ ] Set up monitoring alerts
4. [ ] Configure error logging
5. [ ] Test with real payments

### Monitoring Setup
```typescript
// Set up alerts for webhook failures
if (webhookFailureCount > 5) {
  sendAlert('Webhook failures detected');
}

// Monitor subscription status
const pendingCount = await getPendingSubscriptionCount();
if (pendingCount > threshold) {
  sendAlert('High pending subscription count');
}
```

## Success Metrics

Your hybrid system is working when:
- [x] Webhook endpoint responds correctly
- [x] All events are processed
- [x] Database updates in real-time
- [x] Backup polling catches missed events
- [x] Users get instant payment confirmation
- [x] Failed payments are handled properly

## Support

If you encounter issues:
1. Check the test scripts output
2. Review server logs
3. Verify Kyshi dashboard settings
4. Test with the provided scripts
5. Check network connectivity

## Next Steps

1. **Run the webhook test**: `node test-my-webhook.js`
2. **Configure Kyshi dashboard** with your webhook URL
3. **Enable hybrid monitoring** in your application
4. **Test with real payments** to verify the flow
5. **Monitor performance** and adjust polling intervals

Your hybrid payment system is now configured and ready for testing!
