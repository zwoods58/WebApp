# Security Question Fix - Testing Guide

## Changes Implemented ✅

1. **`src/types/signup.ts`** - Updated `securityQuestions` type from 3-question to single-question structure
2. **`src/hooks/useSignup.ts`** - Added `securityQuestions` field to `completeProfile` object sent to API
3. **`src/hooks/useSignup.ts`** - Added logging to track security question data flow

## Testing Steps

### 1. Create New Test Account

1. Navigate to signup page: `/Beezee-App/auth/signup`
2. Complete all steps:
   - Step 1: Welcome
   - Step 2: Select Country (e.g., Kenya)
   - Step 3: Select Industry (e.g., Retail)
   - Step 4: Select Industry Sector
   - Step 5: Enter basic info (name, phone number)
   - Step 6: Set up PIN
   - **Step 7: Set up Security Question** ← This is the critical step
   - Step 8: Set daily target
   - Step 9: Review and complete

3. Use a new phone number for testing (e.g., `+254700000001`)

### 2. Check Browser Console

During signup, you should see these console logs:

```
🚀 Starting signup process with PIN: {
  pinLength: 6,
  pinSet: true,
  pinHash: "***",
  hasSecurityQuestions: true,
  securityQuestionId: "uuid-here"
}
```

**Key indicators:**
- `hasSecurityQuestions: true` ✅
- `securityQuestionId` should have a valid UUID ✅

### 3. Verify Database

Run this SQL query in Supabase:

```sql
SELECT 
  phone_number,
  business_name,
  security_question_1_id,
  security_answer_1_hash,
  created_at
FROM businesses 
WHERE phone_number = '+254700000001'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result:**
- `security_question_1_id`: Valid UUID (not null) ✅
- `security_answer_1_hash`: Bcrypt hash starting with `$2b$` (not null) ✅

### 4. Test Forgot PIN Flow

1. Navigate to login page
2. Click "Forgot PIN?"
3. Enter the test phone number: `+254700000001`
4. Click "Continue"

**Expected Result:**
- ✅ Security question is displayed (not "Security question is not set up")
- ✅ Question text matches what you selected during signup

5. Enter the correct answer
6. Set a new PIN
7. Login with the new PIN

**Expected Result:**
- ✅ PIN reset successful
- ✅ Can login with new PIN

### 5. Test with Existing Account (Optional)

The existing account `+254232454676` will still show "Security question is not set up" because it was created before the fix.

**Options:**
1. Delete the account and recreate it
2. Leave it as-is (user would need to contact support)
3. Manually update via SQL (not recommended)

## Verification Checklist

- [ ] New account created successfully
- [ ] Console shows `hasSecurityQuestions: true`
- [ ] Database has non-null `security_question_1_id`
- [ ] Database has non-null `security_answer_1_hash`
- [ ] Forgot PIN flow displays security question
- [ ] Can answer question and reset PIN
- [ ] Can login with new PIN

## Rollback Plan

If issues occur, revert these changes:

```bash
git checkout HEAD -- src/types/signup.ts
git checkout HEAD -- src/hooks/useSignup.ts
```

## Notes

- The fix is minimal and low-risk
- API endpoint already handles the data correctly
- Database schema already supports the feature
- UI already collects the data properly
- The only issue was data not being passed from state to API (now fixed)
