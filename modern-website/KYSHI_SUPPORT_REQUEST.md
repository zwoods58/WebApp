# Kyshi API Integration Support Request

## Issue: 403 Forbidden Error on Plan/Subscription Endpoints

### Account Information
- **API Keys:** Test mode credentials (sk_test_***)
- **Environment:** Test environment 
- **Base URL:** https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/v1

### What We're Trying to Implement
We're setting up a weekly subscription plan for Kenya customers:
- **Plan Name:** Kenya Weekly Premium
- **Amount:** 200 KSH per week
- **Currency:** KES (Kenyan Shillings)
- **Interval:** Weekly

### API Testing Results

#### ✅ **Working:**
- API authentication is successful (keys are recognized)
- Base URL connectivity confirmed
- Multiple endpoints discovered and responding

#### ❌ **Issues Encountered:**

**1. Plan Creation (POST /v1/plans)**
```json
{
  "name": "Kenya Weekly Premium",
  "description": "Weekly subscription for BeeZee premium features in Kenya", 
  "interval": "weekly",
  "amount": 200,
  "localCurrency": "KES"
}
```
**Response:** 403 Forbidden - "Forbidden resource"

**2. Plan Listing (GET /v1/plans)**
**Response:** 403 Forbidden - "Forbidden resource"

**3. Subscription Endpoint (GET /v1/subscriptions)**
**Response:** 401 Unauthorized - "API Key is missing" (but key is provided in x-api-key header)

**4. Transaction Endpoint (GET /v1/transactions)**
**Response:** 401 Unauthorized - "Unauthorized"

### Authentication Method Used
We're using the exact method specified in your documentation:
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'sk_test_cb94e10dcbdd4030a79f644b68ebc863'
}
```

### Endpoints Tested
- ✅ `/v1/transactions` - Responds (401/403)
- ✅ `/v1/subscriptions` - Responds (401/403) 
- ✅ `/v1/plans` - Responds (403)
- ❌ All other endpoints return 404 Not Found

### What We Need Help With

1. **Permission Issue:** The 403 Forbidden errors suggest our test account doesn't have access to plans/subscriptions endpoints
2. **API Key Format:** Please confirm if `x-api-key` header is the correct authentication method
3. **Test Environment Access:** Do we need to enable specific features or request access for subscription management?

### Expected Outcome
Once resolved, we should be able to:
- Create a weekly plan for 200 KSH
- Create subscriptions for Kenyan customers
- Manage subscription billing cycles

### Technical Setup
- **Framework:** Next.js 16
- **Environment:** Test mode
- **Integration Type:** Server-side API calls

Could you please check our test account permissions and provide guidance on enabling access to the subscription management endpoints?

Thank you!
