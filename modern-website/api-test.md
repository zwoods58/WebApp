# API Test for Mobile Money Subscriptions

## Test URLs
- **Local**: http://localhost:3000
- **Network**: http://192.168.1.68:3000 (if accessible)

## Manual Testing Steps

### 1. Access the Application
Open your browser and navigate to: http://localhost:3000

### 2. Login Process
1. Click "Login" or "Sign In" 
2. Enter phone: `+254777888999`
3. Enter PIN: `111111`
4. Click login

### 3. Navigate to Kenya Retail More Page
URL: http://localhost:3000/Beezee-App/app/ke/retail/more

### 4. Look for Mobile Money Features
- "Manage Subscription" menu item (should appear for Kenya)
- Click it to open subscription dashboard

### 5. Verify Mobile Money Configuration
In the dashboard, you should see:
- Kenya Mobile Money Providers
- M-PESA, Airtel Money, T-Kash
- 200 KES per week
- Support contact numbers

## API Endpoint Testing (Optional)

If you want to test the backend APIs directly:

### Test Subscription Status
```bash
curl -X GET "http://localhost:3000/api/kyshi/subscription-status?email=test@example.com"
```

### Test Manual Charge (if you have a subscription ID)
```bash
curl -X POST "http://localhost:3000/api/kyshi/charge-manual" \
  -H "Content-Type: application/json" \
  -d '{"subscriptionId": "your-subscription-id-here"}'
```

## Expected Mobile Money Configuration

### Kenya (KE)
- **Currency**: KES
- **Weekly Amount**: 200
- **Plan Code**: PLN__Lt82Xz0-p5-wD6
- **Providers**: M-PESA, Airtel Money, T-Kash
- **Default Provider**: M-PESA
- **Payment Method**: mobile_money

### Database Fields to Verify
```sql
-- Check subscriptions table
SELECT payment_method, preferred_provider, is_mobile_money_subscription 
FROM kyshi_subscriptions 
WHERE country_code = 'KE';

-- Should show:
-- payment_method = 'mobile_money'
-- preferred_provider = 'mpesa' 
-- is_mobile_money_subscription = true
```

## Browser Console Checks
Open F12 and look for:
- Mobile money config loading messages
- API responses from Kyshi endpoints
- Any JavaScript errors

## Success Indicators
- Login works with +254777888999 / 111111
- Kenya page shows mobile money options
- Subscription dashboard displays Kenya providers
- No console errors
- Mobile money configuration loads correctly

## If Issues Occur
1. Check browser console for errors
2. Verify the dev server is running (port 3000)
3. Check if mobile money components are loading
4. Look for network requests failing in browser dev tools

The manual test should verify that all the mobile money subscription features we implemented are working correctly for the Kenya market.
