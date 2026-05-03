# Kyshi Data Flow Guide

## Overview
This guide ensures complete data flow from Supabase through your API to Kyshi and back via webhooks.

## Data Flow Architecture

```
Frontend/Client
    |
    v
Your API (subscription-api.ts)
    |
    v
Edge Function (create-subscription)
    |
    v
Kyshi API
    |
    v
Webhook (Kyshi -> Your Server)
    |
    v
Database Updates
```

## 1. Frontend to API Data Flow

### Required Data from Frontend
```typescript
{
  user_id: string,           // From auth context
  user_email: string,        // User email
  user_phone?: string,       // Optional phone
  country: string,           // Kenya, Nigeria, Ghana, etc.
  full_name: string,         // User full name
  business_id?: string,      // Optional business ID
  industry?: string          // Optional industry
}
```

### API Validation
```typescript
// src/lib/kyshi-data-validator.ts
const validation = await validateKyshiData.completeFlow(userId);
if (!validation.isValid) {
  return { error: validation.errors };
}
```

## 2. API to Edge Function Data Flow

### Enhanced Request Payload
```typescript
{
  user_id: string,
  user_email: string,
  user_phone?: string,
  country: string,
  full_name: string,
  business_id?: string,
  industry?: string
}
```

### Edge Function Processing
1. **Validate all fields**
2. **Get country configuration**
3. **Prepare Kyshi payload**
4. **Store in database**
5. **Call Kyshi API**

## 3. Edge Function to Kyshi API Data Flow

### Kyshi Subscription Request
```typescript
{
  planCode: string,           // Country-specific plan code
  customer: string,           // User email
  paymentMethod: string,      // mobile_money, bank_transfer, card
  redirectUrl: string,        // Callback URL
  mobileMoneyProvider?: string // m-pesa, mtn, orange-money
}
```

### Country-Specific Configurations
```typescript
Kenya: {
  planCode: "PLN_MVyWThBVJ1Np0IB",
  paymentMethod: "mobile_money",
  mobileMoneyProvider: "m-pesa",
  amount: 200,
  currency: "KES"
}

Nigeria: {
  planCode: "PLN_iiRmmGJcnQy5paj",
  paymentMethod: "bank_transfer",
  amount: 500,
  currency: "NGN"
}

Ghana: {
  planCode: "PLN_WQN3ZhV2AX-knWQ",
  paymentMethod: "mobile_money",
  mobileMoneyProvider: "mtn",
  amount: 20,
  currency: "GHS"
}
```

## 4. Database Storage

### Complete Subscription Record
```typescript
{
  // User Information
  user_id: string,
  user_email: string,
  user_phone?: string,
  user_name: string,
  country: string,
  business_id?: string,
  industry?: string,
  
  // Plan Information
  amount: number,
  currency: string,
  payment_method: string,
  kyshi_plan_code: string,
  
  // Kyshi Integration
  kyshi_subscription_id: string,
  kyshi_subscription_code: string,
  
  // Status Tracking
  status: string,              // pending, active, cancelled, expired
  is_active: boolean,
  
  // Payment Tracking
  next_charge_date: string,
  last_charge_date?: string,
  
  // Timestamps
  created_at: string,
  updated_at: string,
  cancelled_at?: string
}
```

### Transaction Records
```typescript
{
  kyshi_transaction_id: string,
  kyshi_reference: string,
  subscription_id: string,
  amount: number,
  currency: string,
  status: string,              // success, failed, pending
  payment_method: string,
  processed_at: string,
  created_at: string
}
```

## 5. Kyshi Webhook Data Flow

### Webhook Events
```typescript
// subscription.created
{
  event: "subscription.created",
  data: {
    id: string,                // Kyshi subscription ID
    code: string,              // Kyshi subscription code
    status: "pending",
    amount: number,
    currency: string,
    paymentMethod: string,
    customer: {
      email: string,
      phone?: string
    },
    plan: {
      id: string,
      name: string,
      amount: number,
      currency: string,
      interval: string
    }
  }
}

// subscription.activated
{
  event: "subscription.activated",
  data: {
    id: string,
    code: string,
    status: "active",
    startDate: string,
    nextPaymentDate: string,
    isActive: true
  }
}

// subscription.payment.succeeded
{
  event: "subscription.payment.succeeded",
  data: {
    id: string,                // Transaction ID
    reference: string,
    subscriptionId: string,
    amount: number,
    currency: string,
    status: "success",
    paymentMethod: string,
    processedAt: string
  }
}

// subscription.payment.failed
{
  event: "subscription.payment.failed",
  data: {
    id: string,
    reference: string,
    subscriptionId: string,
    amount: number,
    currency: string,
    status: "failed",
    paymentMethod: string,
    processedAt: string
  }
}

// subscription.cancelled
{
  event: "subscription.cancelled",
  data: {
    id: string,
    code: string,
    status: "cancelled",
    cancelledAt: string
  }
}
```

## 6. Webhook Processing

### Event Handling
```typescript
switch (event.event) {
  case 'subscription.created':
    await handleSubscriptionCreated(supabase, event.data);
    break;
    
  case 'subscription.activated':
    await handleSubscriptionActivated(supabase, event.data);
    break;
    
  case 'subscription.payment.succeeded':
    await handlePaymentSucceeded(supabase, event.data);
    break;
    
  case 'subscription.payment.failed':
    await handlePaymentFailed(supabase, event.data);
    break;
    
  case 'subscription.cancelled':
    await handleSubscriptionCancelled(supabase, event.data);
    break;
}
```

### Database Updates
```typescript
// Subscription Created
- Update status to 'pending'
- Store Kyshi IDs
- Add plan details
- Add customer details

// Subscription Activated
- Update status to 'active'
- Set is_active to true
- Store payment dates
- Grant user access

// Payment Succeeded
- Create transaction record
- Update charge dates
- Extend access if needed

// Payment Failed
- Create transaction record
- Handle retry logic
- Notify user

// Subscription Cancelled
- Update status to 'cancelled'
- Set is_active to false
- Revoke user access
- Store cancellation date
```

## 7. Data Validation

### Input Validation
```typescript
// Required fields validation
const requiredFields = ['user_id', 'user_email', 'country', 'full_name'];

// Email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Country validation
const supportedCountries = ['Kenya', 'Nigeria', 'Ghana', 'CoteDIvoire', 'CotedIvoire'];
```

### Webhook Validation
```typescript
// Signature verification
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(body, 'utf8')
  .digest('hex');

// Event validation
const validEvents = [
  'subscription.created',
  'subscription.activated',
  'subscription.cancelled',
  'subscription.payment.succeeded',
  'subscription.payment.failed'
];
```

## 8. Error Handling

### API Errors
```typescript
// Missing fields
{
  error: "Missing required fields",
  missing_fields: ["user_id", "country"]
}

// Invalid country
{
  error: "Unsupported country: InvalidCountry"
}

// Kyshi API error
{
  error: "Failed to create subscription in Kyshi",
  details: "Invalid plan code"
}
```

### Webhook Errors
```typescript
// Invalid signature
{
  error: "Invalid webhook signature"
}

// Invalid event
{
  error: "Unknown event type: invalid.event"
}

// Database error
{
  error: "Failed to update subscription",
  details: "Database connection failed"
}
```

## 9. Monitoring & Logging

### Key Metrics to Track
- Subscription creation success rate
- Webhook delivery success rate
- Payment success/failure rates
- Time to activation
- Error rates by type

### Logging Strategy
```typescript
// Request logging
console.log('Subscription request:', {
  user_id,
  country,
  payment_method: config.paymentMethod
});

// Webhook logging
console.log('Webhook received:', {
  event: event.event,
  subscription_id: event.data.id,
  status: event.data.status
});

// Error logging
console.error('Subscription creation failed:', {
  error: error.message,
  user_id,
  country
});
```

## 10. Testing Data Flow

### Unit Tests
- Data validation
- Country configuration
- Webhook event mapping
- Database updates

### Integration Tests
- Complete subscription flow
- Webhook processing
- Error scenarios
- Edge cases

### End-to-End Tests
- Real payment scenarios
- Webhook delivery
- User access updates
- Notification sending

## 11. Security Considerations

### Data Protection
- Encrypt sensitive data
- Validate all inputs
- Use HTTPS everywhere
- Secure API keys

### Webhook Security
- Verify signatures
- Rate limiting
- IP whitelisting
- Replay attack prevention

## 12. Performance Optimization

### Database Optimization
- Index on user_id
- Index on kyshi_subscription_id
- Partition by country
- Archive old records

### API Optimization
- Cache country configs
- Batch webhook processing
- Async database updates
- Connection pooling

This comprehensive data flow ensures that all required information is captured, validated, and properly stored throughout the subscription payment lifecycle.
