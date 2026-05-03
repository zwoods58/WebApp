# Subscription Payment Verification Checklist

## Ghana (MTN MoMo, Vodafone Cash, AirtelTigo)
### Test Steps:
1. **Enter email**: valid email format (user@test.com)
2. **Enter phone**: 9-digit Ghana number (e.g., 240000000)
3. **Select provider**: MTN, Vodafone, or AirtelTigo
4. **Submit**: Should show "Redirecting..." and redirect to payment provider
5. **Complete payment**: Use test credentials or actual mobile money
6. **Callback**: Should redirect to `/subscription/callback?reference=REF&sub_id=ID`
7. **Verification**: API should call Kyshi to verify transaction
8. **Success**: Shows green checkmark, redirects to `/dashboard` after 3 seconds
9. **Failed**: Shows red X, redirects to `/subscribe` after 4 seconds

### Expected Results:
- ✅ Modal closes and redirects to payment provider
- ✅ Callback URL receives reference and sub_id parameters
- ✅ Verification API updates subscription status to "active"
- ✅ User sees success message and is redirected to dashboard
- ✅ Database shows: status=active, is_active=true, proper dates

---

## Kenya (M-Pesa)
### Test Steps:
1. **Enter email**: valid email format (user@test.com)
2. **Enter phone**: 9-digit Kenya number (e.g., 712345678)
3. **Submit**: Should show "Check your phone" with spinner
4. **STK Push**: User receives M-Pesa prompt on phone
5. **Enter PIN**: Complete M-Pesa transaction
6. **Callback**: Should redirect to `/subscription/callback?reference=REF&sub_id=ID`
7. **Verification**: API should call Kyshi to verify transaction
8. **Success**: Shows green checkmark, redirects to `/dashboard` after 3 seconds

### Expected Results:
- ✅ Modal shows M-Pesa branding and KES 200 amount
- ✅ User receives STK Push on their phone
- ✅ Callback URL receives reference and sub_id parameters
- ✅ Verification API updates subscription status to "active"
- ✅ Database shows: status=active, is_active=true, next_charge_date=NOW+7days

---

## Côte d'Ivoire (Orange Money, MTN MoMo)
### Test Steps:
1. **Enter email**: valid email format (user@test.com)
2. **Enter phone**: 10-digit CI number (e.g., 0700000000)
3. **Select provider**: Orange Money or MTN MoMo
4. **Language toggle**: EN/FR should switch all UI text
5. **Submit**: Should show "Redirection..." and redirect to payment provider
6. **Complete payment**: Use test credentials or actual mobile money
7. **Callback**: Should redirect to `/subscription/callback?reference=REF&sub_id=ID`
8. **Verification**: API should call Kyshi to verify transaction
9. **Success**: Shows "Abonnement Activé!", redirects to `/dashboard`

### Expected Results:
- ✅ Modal shows proper French/English translations
- ✅ Orange (#FF6600) and MTN (#EAB308) branding colors
- ✅ Callback URL receives reference and sub_id parameters
- ✅ Verification API updates subscription status to "active"
- ✅ Database shows: status=active, is_active=true, next_charge_date=NOW+7days

---

## Nigeria (Bank Transfer)
### Test Steps:
1. **Enter email**: valid email format (user@test.com)
2. **Submit**: Should show "Generating Account..."
3. **Bank details appear**: 
   - Bank: [bank name from API]
   - Account Name: [account name from API]
   - Account Number: [10-digit account number with letter spacing]
   - Amount: ₦500 (exact amount including fees)
4. **Copy account**: Click "Copy" button should copy account number
5. **Warning message**: Shows "⚠️ Transfer the exact amount shown. This account number expires in 3 days."
6. **Make transfer**: Transfer ₦500 to the provided account number
7. **Click "I've Made the Transfer"**: Should show success state
8. **Webhook processing**: Kyshi webhook should detect the payment
9. **Email confirmation**: User should receive confirmation email

### Expected Results:
- ✅ No redirect - user stays in modal entire time
- ✅ Account number can be copied to clipboard
- ✅ Shows 3-day expiry warning
- ✅ Success state shows "Transfer Submitted" with email confirmation
- ✅ Webhook processes bank transfer and activates subscription
- ✅ Database shows: status=active, is_active=true after webhook processes payment

---

## General Testing Checklist:
- [ ] All modals open and close properly
- [ ] Form validation works for invalid emails/phones
- [ ] Loading states show during API calls
- [ ] Error handling displays proper messages
- [ ] Callback URLs are accessible and functional
- [ ] Verification API handles all response statuses
- [ ] Database updates are correct for each country
- [ ] Email confirmations are sent
- [ ] Webhook endpoints receive and process payments
- [ ] User is redirected to correct pages after payment
- [ ] Subscription status reflects correctly in UI

## API Endpoints to Test:
- `POST /api/subscription/create` - Creates subscription and returns payment details
- `GET /api/subscription/verify?reference=REF&sub_id=ID` - Verifies payment status
- `POST /functions/v1/kyshi-webhook` - Processes webhook notifications
- `POST /functions/v1/process-weekly-charges` - Processes recurring charges
