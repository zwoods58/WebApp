# Payment Flow Testing Guide

This guide provides comprehensive testing scripts to verify the complete payment flow from your database to Kyshi.

## 🚀 Quick Start

### 1. Environment Setup

Make sure you have these environment variables set:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Kyshi Configuration
KYSHI_SECRET_KEY=sk_test_3dd6532c95634d1da5888520b9bf96c8
KYSHI_WEBHOOK_SECRET=your-webhook-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Test Scripts Available

#### 📊 **Complete Payment Flow Test** (`test-payment-flow.js`)
Tests the entire pipeline:
- Database connection
- Subscription creation in database
- Kyshi API call
- Database update with Kyshi response
- Webhook simulation
- Final state verification

```bash
node test-payment-flow.js
```

#### ⚡ **Edge Function Test** (`test-edge-function.js`)
Tests the Supabase Edge Function specifically:
- Direct Edge Function calls
- Multiple country support
- Error handling

```bash
node test-edge-function.js
```

#### 🪝 **Webhook Test** (`test-webhook-endpoint.js`)
Tests the webhook endpoint:
- All webhook event types
- Signature verification
- Database updates

```bash
node test-webhook-endpoint.js
```

## 🧪 Test Scenarios

### Kenya (M-Pesa)
- **Plan Code**: `PLN_MVyWThBVJ1Np0IB`
- **Amount**: 200 KES
- **Payment Method**: `mobile_money`
- **Provider**: `m-pesa`

### Nigeria (Bank Transfer)
- **Plan Code**: `PLN_iiRmmGJcnQy5paj`
- **Amount**: 500 NGN
- **Payment Method**: `bank_transfer`
- **Bank Selection**: Required

### Ghana (Mobile Money)
- **Plan Code**: `PLN_WQN3ZhV2AX-knWQ`
- **Amount**: 20 GHS
- **Payment Method**: `mobile_money`
- **Provider**: `mtn`

## 📋 Test Results Interpretation

### ✅ Success Indicators
- **Database Connection**: Can connect to Supabase
- **Subscription Creation**: Test subscription created in database
- **Kyshi API**: Subscription created in Kyshi, payment URL returned
- **Database Update**: Kyshi IDs saved to database
- **Webhook Processing**: Webhook events processed successfully
- **Final State**: Subscription status updated correctly

### ❌ Common Issues & Solutions

#### Database Connection Failed
```
❌ Database connection failed: connection refused
```
**Solution**: Check Supabase URL and service role key

#### Kyshi API Error
```
❌ Kyshi API error: Invalid API key
```
**Solution**: Verify KYSHI_SECRET_KEY is correct

#### Webhook Signature Failed
```
❌ Webhook failed: Invalid signature
```
**Solution**: Check KYSHI_WEBHOOK_SECRET matches webhook configuration

#### Edge Function Not Found
```
❌ Edge Function failed: 404 Not Found
```
**Solution**: Deploy Edge Function to Supabase

## 🔍 Manual Testing Steps

### 1. Test Frontend Integration
```javascript
// Test via browser console
fetch('/api/subscription/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    country: 'Kenya'
  })
})
```

### 2. Test Payment URL
1. Run the test script to get a payment URL
2. Open the URL in browser
3. Complete the payment flow
4. Check database for updates

### 3. Test Webhook Manually
```bash
# Using curl to test webhook
curl -X POST http://localhost:3000/api/webhooks/kyshi \
  -H "Content-Type: application/json" \
  -H "x-kyshi-signature: sha256=$(echo -n '{"event":"subscription.activated","data":{"id":"test"}}' | openssl dgst -sha256 -hmac 'your-webhook-secret' -hex | cut -d' ' -f2)" \
  -d '{"event":"subscription.activated","data":{"id":"test"}}'
```

## 📊 Monitoring & Debugging

### Check Supabase Logs
```sql
-- View recent subscriptions
SELECT * FROM subscriptions 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- View recent transactions
SELECT * FROM transactions 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### Check Edge Function Logs
```bash
# Using Supabase CLI
supabase functions logs create-subscription --follow
```

### Check Webhook Logs
```bash
# Check Next.js logs
tail -f logs/nextjs.log
```

## 🚨 Troubleshooting Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase database is accessible
- [ ] Edge Function is deployed
- [ ] Kyshi API keys are valid
- [ ] Webhook secret matches Kyshi configuration
- [ ] Network connectivity to Kyshi API
- [ ] CORS headers are properly configured
- [ ] Database schema matches expectations

## 🎯 Success Criteria

The payment flow is working correctly when:

1. **Frontend** can call subscription creation API
2. **Edge Function** processes requests and returns payment URLs
3. **Kyshi API** creates subscriptions successfully
4. **Database** stores subscription and transaction data
5. **Webhooks** update subscription status correctly
6. **Users** can complete payments and see updated status

## 📞 Support

If you encounter issues:

1. Check the error logs in each component
2. Verify environment variables
3. Test each component individually
4. Check network connectivity
5. Review Kyshi API documentation for any changes
