# Authentication Test Guide

## Issues Fixed

1. **Critical Login Query Bug**: Removed the incorrect `.eq('businesses.industry', 'default_industry')` comparison that was preventing users from logging in.

2. **Switched to Regular Supabase**: Changed from `supabaseAdmin` to regular `supabase` for authentication queries with fallback logic.

3. **Simplified Query Structure**: Split complex join into separate queries to avoid potential RLS issues.

4. **Added Fallback Logic**: If regular supabase fails due to RLS restrictions, automatically falls back to supabaseAdmin.

5. **Enhanced Validation**: Added comprehensive error handling and logging throughout the authentication flow.

## Testing Steps

### 1. Test Login with Existing User

1. Open browser console to see detailed logs
2. Go to login page
3. Enter a phone number that exists in the database
4. Check console for:
   - `🔍 Attempting login for phone: +254...`
   - `👤 User query result (basic - regular supabase): {...}`
   - `🏢 Business query result (regular supabase): {...}`
   - `✅ Tenant data loaded successfully: {...}`

**Expected Flow:**
- First tries regular `supabase` (respects RLS)
- If RLS blocks the query, automatically falls back to `supabaseAdmin`
- Either way should successfully authenticate the user

### 2. Test Data Access

1. After successful login, navigate to the expenses page
2. Check console for:
   - `💰 Fetching expenses for tenant: {userId: ..., businessId: ...}`
   - Data should load and display correctly

### 3. Test Error Scenarios

1. Try logging in with a non-existent phone number
2. Should see: `❌ User not found for phone: +254...`
3. Should get error message: "No account found with this phone number. Please sign up first."

### 4. Test Fallback Logic

1. If RLS is enabled on users/businesses tables, you should see:
   - `🔄 Regular supabase failed, trying with supabaseAdmin...`
   - `👤 User query result (basic - supabaseAdmin): {...}`
   - Authentication should still succeed

## Key Changes Made

### useAuth.ts
- **Switched to regular supabase** as primary authentication client
- **Added fallback logic** to supabaseAdmin if RLS blocks queries
- **Simplified query structure** - split complex join into separate queries
- **Enhanced error logging** with detailed step-by-step information
- **Improved validation** for user-business relationships

### TenantContext.tsx
- Added tenant data validation
- Added error handling for corrupted data
- Added `clearCorruptedData` function

### useExpenses.ts
- Added tenant validation before database queries
- Enhanced error messages
- Added debugging logs

## Expected Behavior

- ✅ Users can log in with existing phone numbers (via regular supabase or fallback)
- ✅ Data loads correctly for authenticated users
- ✅ Proper error messages for invalid credentials
- ✅ No more "data disappearing" issues
- ✅ Clear debugging information in console
- ✅ Graceful fallback if RLS blocks queries

## Troubleshooting

If issues persist:
1. **Check browser console** for detailed error logs - this will show exactly which step is failing
2. **Verify phone number format** includes country code (+254, +233, etc.)
3. **Check database structure** - ensure user has both `users` and `businesses` records
4. **Verify RLS policies** - if they're too restrictive, the fallback should handle it
5. **Look for fallback messages** - if you see "trying with supabaseAdmin" that's normal

## Debug Information

The new logging will show:
- Which client is being used (regular vs admin)
- Exact error messages from database
- Step-by-step authentication flow
- Data validation results

This should make it much easier to identify any remaining issues!
