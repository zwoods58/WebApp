# Security Questions PIN Recovery - Test Plan

## Test Overview
This test verifies the complete security question PIN recovery flow from signup to PIN reset.

## Prerequisites
- Clean database or use a new phone number for testing
- Application running locally
- Access to browser DevTools for debugging

---

## Test 1: Complete Signup Flow with Security Question

### Steps:
1. Navigate to `/Beezee-App/auth/signup`
2. Complete Step 1: Welcome screen - Click "Get Started"
3. Complete Step 2: Select Country (e.g., Kenya)
4. Complete Step 3: Select Industry (e.g., Retail)
5. Complete Step 4: Select Industry Sector
6. Complete Step 5: Fill in Basic Info
   - Name: Test User
   - Business Name: Test Business
   - Phone: +254700000001 (use a unique number)
7. Complete Step 6: Set up PIN
   - Enter a 6-digit PIN (e.g., 123456)
   - Confirm the PIN
8. **Complete Step 7: Security Question** ⭐
   - Select a security question from dropdown
   - Enter an answer (remember this!)
   - Click "Continue"
9. Complete Step 8: Set Daily Target
10. Complete Step 9: Review and Submit

### Expected Results:
- ✅ All steps complete successfully
- ✅ Account is created
- ✅ User is logged in automatically
- ✅ Security question is saved to database

### Database Verification:
Run this SQL query to verify:
```sql
SELECT 
  phone_number, 
  security_question_1_id, 
  security_answer_1_hash,
  pin_hash
FROM businesses 
WHERE phone_number = '+254700000001';
```

**Expected:**
- `security_question_1_id` should be a UUID (not null)
- `security_answer_1_hash` should be a bcrypt hash (not null)
- `pin_hash` should be a bcrypt hash (not null)

---

## Test 2: Forgot PIN Flow - Phone Verification

### Steps:
1. Log out from the application
2. Navigate to `/Beezee-App/auth/login`
3. Click "Forgot PIN?" button
4. Enter the phone number from Test 1: +254700000001
5. Click "Continue"

### Expected Results:
- ✅ Phone number is verified
- ✅ Security question is displayed
- ✅ Question text matches the one selected during signup
- ✅ Shows "X attempt(s) remaining" (should be 3)

### Error Cases to Test:
- ❌ Non-existent phone number → "Unable to verify phone number"
- ❌ Phone without security question → "Security question is not set up"

---

## Test 3: Forgot PIN Flow - Answer Verification (Success)

### Steps:
1. Continue from Test 2
2. Enter the CORRECT answer to the security question
   - Use the exact answer you entered during signup
   - Answer is case-insensitive and spaces are normalized
3. Click "Verify Answer"

### Expected Results:
- ✅ Answer is verified successfully
- ✅ Advances to "Create New PIN" step
- ✅ No error messages

---

## Test 4: Forgot PIN Flow - Reset PIN

### Steps:
1. Continue from Test 3
2. Enter a new 6-digit PIN (e.g., 654321)
3. Confirm the new PIN
4. Click "Reset PIN"

### Expected Results:
- ✅ PIN is reset successfully
- ✅ Shows success message
- ✅ Redirects to login or shows "Go to Login" button

### Database Verification:
```sql
SELECT 
  phone_number, 
  pin_hash,
  recovery_attempts,
  recovery_locked_until
FROM businesses 
WHERE phone_number = '+254700000001';
```

**Expected:**
- `pin_hash` should be different from the original (new PIN)
- `recovery_attempts` should be reset to 0
- `recovery_locked_until` should be null

---

## Test 5: Login with New PIN

### Steps:
1. Navigate to `/Beezee-App/auth/login`
2. Enter phone number: +254700000001
3. Enter the NEW PIN (654321)
4. Click "Access Business"

### Expected Results:
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ User session is active

---

## Test 6: Rate Limiting - Failed Attempts

### Steps:
1. Log out
2. Click "Forgot PIN?"
3. Enter phone number: +254700000001
4. Enter WRONG answer (1st attempt)
5. Click "Verify Answer"
6. Enter WRONG answer (2nd attempt)
7. Click "Verify Answer"
8. Enter WRONG answer (3rd attempt)
9. Click "Verify Answer"
10. Try to verify again

### Expected Results:
- ✅ After 1st wrong answer: Shows error, "2 attempt(s) remaining"
- ✅ After 2nd wrong answer: Shows error, "1 attempt(s) remaining"
- ✅ After 3rd wrong answer: Shows error, "0 attempt(s) remaining"
- ✅ Account is locked for 15 minutes
- ✅ Shows "Account is temporarily locked. Please try again in X minute(s)."

### Database Verification:
```sql
SELECT 
  phone_number, 
  recovery_attempts,
  recovery_locked_until
FROM businesses 
WHERE phone_number = '+254700000001';
```

**Expected:**
- `recovery_attempts` should be 3
- `recovery_locked_until` should be a timestamp ~15 minutes in the future

---

## Test 7: Lockout Expiration

### Steps:
1. Wait 15 minutes OR manually update the database:
```sql
UPDATE businesses 
SET recovery_locked_until = NULL, recovery_attempts = 0 
WHERE phone_number = '+254700000001';
```
2. Try the forgot PIN flow again
3. Enter the correct answer

### Expected Results:
- ✅ Lockout is cleared
- ✅ Can proceed with PIN reset
- ✅ Attempts counter is reset

---

## Test 8: Edge Cases

### Test 8.1: Case Insensitivity
- Answer during signup: "Nairobi"
- Answer during recovery: "nairobi" or "NAIROBI"
- **Expected:** ✅ Should work (case-insensitive)

### Test 8.2: Extra Spaces
- Answer during signup: "My First Pet"
- Answer during recovery: "My  First  Pet" (extra spaces)
- **Expected:** ✅ Should work (spaces normalized)

### Test 8.3: Leading/Trailing Spaces
- Answer during signup: "Fluffy"
- Answer during recovery: "  Fluffy  "
- **Expected:** ✅ Should work (trimmed)

### Test 8.4: Empty Answer
- Try to submit empty answer
- **Expected:** ❌ Button should be disabled

### Test 8.5: Very Long Answer
- Enter 101 characters in answer field
- **Expected:** ❌ Input limited to 100 characters

---

## Test 9: Security Validation

### Test 9.1: Token Expiration
The reset token should expire after 5 minutes. To test:
1. Complete forgot PIN flow up to getting the reset token
2. Wait 6 minutes
3. Try to reset PIN with the old token
- **Expected:** ❌ Should show error "Reset token expired"

### Test 9.2: Invalid Token
Try to call the PIN reset API with a fake token:
```bash
curl -X POST http://localhost:3000/api/auth/pin-reset/complete \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "fake-token-12345",
    "businessId": "some-uuid",
    "newPin": "123456"
  }'
```
- **Expected:** ❌ Should return error

---

## Test 10: Multiple Accounts

### Steps:
1. Create 2 different accounts with different phone numbers
2. Both should have security questions set up
3. Test forgot PIN flow for Account A
4. Verify it doesn't affect Account B

### Expected Results:
- ✅ Each account has independent recovery attempts
- ✅ Lockout on Account A doesn't affect Account B
- ✅ Reset tokens are account-specific

---

## Success Criteria

All tests should pass with ✅ results. The system should:
1. ✅ Save security questions during signup
2. ✅ Verify phone numbers correctly
3. ✅ Match answers (case-insensitive, normalized)
4. ✅ Enforce rate limiting (3 attempts, 15-min lockout)
5. ✅ Generate valid reset tokens
6. ✅ Successfully reset PINs
7. ✅ Allow login with new PIN
8. ✅ Handle edge cases gracefully
9. ✅ Maintain security (token expiration, validation)
10. ✅ Isolate accounts properly

---

## Quick Test Script

For rapid testing, use this phone number sequence:
- Test Account 1: +254700000001
- Test Account 2: +254700000002
- Test Account 3: +254700000003

Security Question/Answer pairs for testing:
- Q: "What is your favorite food?" A: "pizza"
- Q: "What is your favorite color?" A: "blue"
- Q: "In what city were you born?" A: "nairobi"

---

## Debugging Tips

If tests fail, check:
1. **Browser Console** - Look for API errors
2. **Network Tab** - Check request/response payloads
3. **Database** - Verify data is being saved
4. **Server Logs** - Check for backend errors
5. **Environment Variables** - Ensure Supabase keys are correct

Common issues:
- Security question not saving → Check `updateSecurityQuestions` is called
- Phone not found → Verify phone format (+254...)
- Answer not matching → Check normalization (lowercase, trim, spaces)
- Lockout not working → Check `recovery_locked_until` timestamp
