# Email to Kyshi Support

**To**: support@kyshi.co  
**Subject**: Test Account Limited to KES - Need NGN, GHS, XOF Support

---

## Email Body

Hi Kyshi Support Team,

We are integrating Kyshi for subscription payments in our application (BeeZee) and have successfully created a weekly subscription plan for **Kenya (KES 200)** using your API.

However, we are unable to create plans for other currencies listed in your documentation as supported. All attempts return **422 "An Error Occurred"** errors.

### What Works ✅
- **Kenya (KES)**: Successfully created plan with code `PLN_U24q-9CKbW-7DOl`
- API endpoint: `POST /v1/plans`
- Amount: 200 KES (major units)

### What Fails ❌

We tested **12 different parameter variations** for the following currencies, and all failed:

#### Nigeria (NGN)
- Tested: 500 NGN, 50000 kobo, 100 NGN, with/without optional fields
- Result: All return **422 error**

#### Ghana (GHS)
- Tested: 20 GHS, 2000 pesewas, 1 GHS, with/without optional fields
- Result: All return **422 error**

#### Côte d'Ivoire (XOF)
- Tested: 1000 XOF, 500 XOF, 100 XOF, with/without optional fields
- Result: All return **422 error**

### Example Request (that fails)

```bash
curl -X POST https://api.kyshi.co/v1/plans \
  -H "x-api-key: sk_test_3dd6532c95634d1da5888520b9bf96c8" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beezee Weekly Nigeria",
    "description": "Weekly subscription for Beezee - Nigeria",
    "interval": "weekly",
    "amount": 500,
    "localCurrency": "NGN"
  }'
```

**Response**:
```json
{
  "status": false,
  "message": "An Error Occurred",
  "data": {},
  "code": 422
}
```

### Questions

1. **Are NGN, GHS, and XOF supported in test/sandbox mode?**
   - Your documentation lists them as supported currencies
   - Is there a difference between sandbox and live mode?

2. **Does our test account need activation for these currencies?**
   - Is KES the only currency enabled by default?
   - Do we need to request activation for NGN, GHS, XOF?

3. **Are there additional API parameters required?**
   - We tested with all optional fields (sendInvoices, sendSms, hostedPage)
   - Same 422 error occurs

4. **Is there an account-level configuration we're missing?**
   - Do we need to configure something in the dashboard?
   - Are there country/currency restrictions on test accounts?

### Our Use Case

We need to support weekly subscriptions in:
- **Kenya**: 200 KES/week
- **Nigeria**: 500 NGN/week
- **Ghana**: 20 GHS/week
- **Côte d'Ivoire**: 1000 XOF/week

We're ready to launch with Kenya, but need multi-currency support to serve our full African market.

### Account Details

- **API Key**: sk_test_3dd6532c95634d1da5888520b9bf96c8 (test mode)
- **Environment**: Sandbox/Test
- **Integration**: Subscription plans via API

### What We Need

Please advise on:
1. How to enable NGN, GHS, XOF on our test account
2. Correct API parameters for these currencies (if different from KES)
3. Timeline for activation if manual setup is required
4. Any documentation specific to multi-currency setup

We've completed full integration testing with Kenya and are ready to expand to other markets as soon as these currencies are available.

Thank you for your assistance!

Best regards,  
BeeZee Development Team

---

## Additional Context (if needed)

### Diagnostic Test Results

We ran comprehensive diagnostics testing:
- **4 variations per currency** (major units, minor units, optional fields, different amounts)
- **12 total tests** across NGN, GHS, XOF
- **100% failure rate** (all returned 422)

This suggests the issue is account-level, not parameter-related.

### Working Kenya Example

For reference, here's the exact request that works for Kenya:

```json
{
  "name": "Beezee Weekly Kenya",
  "description": "Weekly subscription for Beezee - Kenya",
  "interval": "weekly",
  "amount": 200,
  "localCurrency": "KES"
}
```

**Response**:
```json
{
  "status": true,
  "code": 201,
  "data": {
    "code": "PLN_U24q-9CKbW-7DOl",
    "amount": 200,
    "localCurrency": "KES",
    ...
  }
}
```

---

## Follow-up Actions

After sending this email:

1. **Wait for Kyshi response** (typically 1-2 business days)
2. **Continue testing Kenya** - Full subscription flow works
3. **Consider alternatives** if response time is critical:
   - Paystack (supports NGN, GHS, ZAR, KES)
   - Flutterwave (supports NGN, GHS, KES, ZAR, XOF)
4. **Launch Kenya-only beta** while waiting for multi-currency support

---

**Email prepared**: April 12, 2026  
**Status**: Ready to send to support@kyshi.co
