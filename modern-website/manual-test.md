# Manual Mobile Money Subscription Test

## Test Setup
- **URL**: http://localhost:3000 (or use network URL: http://192.168.1.68:3000)
- **Phone Number**: +254777888999
- **PIN**: 111111

## Test Steps

### 1. Login Test
1. Navigate to: http://localhost:3000
2. Click on "Login" or "Sign In" button
3. Enter phone number: `+254777888999`
4. Enter PIN: `111111`
5. Click "Login" or "Sign In"
6. **Expected**: Should be redirected to the main app (`/Beezee-App/app/ke/retail/` or similar)

### 2. Navigate to Kenya Retail Page
1. After login, navigate to: http://localhost:3000/Beezee-App/app/ke/retail/more
2. **Expected**: Should see the "More" page with Kenya (KE) and Retail indicators

### 3. Check for Mobile Money Features
1. Look for "Manage Subscription" option in the menu
2. **Expected**: Should see this option since Kenya is a mobile money country
3. Click on "Manage Subscription"
4. **Expected**: Should open a subscription dashboard modal

### 4. Verify Mobile Money Content
In the subscription dashboard, look for:
- Kenya Mobile Money Providers section
- M-PESA, Airtel Money, T-Kash providers
- KES currency and weekly amount (200 KES)
- Mobile money payment instructions
- Support information with provider phone numbers

### 5. Test Subscription Creation (if available)
1. Look for "Subscription" or "Upgrade" button
2. Click to open subscription modal
3. **Expected**: Should see Kenya-specific plan options
4. Check if mobile money is the default payment method

### 6. Test Manual Renewal Flow
1. If you have an existing subscription, look for "Renew Now" or "Pay Now" button
2. Click the button
3. **Expected**: Should trigger mobile money payment flow
4. Should redirect to Kyshi checkout for mobile money payment

## Expected Results

### Mobile Money Configuration
- Kenya (KE) should be detected as mobile money country
- Payment method should default to "mobile_money"
- Default provider should be M-PESA
- Weekly amount should be 200 KES

### UI Elements
- Subscription dashboard should load without errors
- Country-specific provider information should display
- Support contact numbers should be correct:
  - M-PESA: 100 or 0722 000 000
  - Airtel Money: 100 or 0733 000 100
  - T-Kash: 100 or 0712 000 000

### Database Verification
After subscription creation, check database:
```sql
SELECT * FROM kyshi_subscriptions WHERE country_code = 'KE';
-- Should show payment_method = 'mobile_money'
-- Should show is_mobile_money_subscription = true
-- Should show preferred_provider = 'mpesa'
```

## Troubleshooting

### If Login Fails
- Check if the phone number exists in the database
- Verify PIN is correct (111111)
- Check browser console for errors

### If Subscription Options Don't Appear
- Verify country detection is working (should show KE)
- Check if mobile money configuration is loaded
- Look for JavaScript errors in browser console

### If Dashboard Doesn't Open
- Check for errors in browser console
- Verify mobile money components are properly imported
- Check if the modal CSS classes are correct

## Success Criteria
- [ ] Login successful with provided credentials
- [ ] Kenya retail page loads correctly
- [ ] "Manage Subscription" option appears
- [ ] Subscription dashboard opens without errors
- [ ] Mobile money providers are displayed correctly
- [ ] Kenya-specific configuration is loaded (KES, 200/week, M-PESA default)
- [ ] Support information is accurate
- [ ] No JavaScript errors in browser console

## Browser Console Check
Open browser console (F12) and look for:
- Mobile money configuration loading
- Any import/export errors
- API call responses from Kyshi endpoints
- Database query results
