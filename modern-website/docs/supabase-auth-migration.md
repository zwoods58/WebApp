# Supabase Auth Migration Guide

## 🎉 Major Changes Implemented

### 1. **Complete Supabase Auth Integration**
- **Replaced localStorage authentication** with Supabase's built-in Auth system
- **Phone OTP authentication** using `supabase.auth.signInWithOtp()` and `supabase.auth.verifyOtp()`
- **Automatic session management** with auth state listeners
- **Secure user profile fetching** after authentication

### 2. **New Authentication Flow**
```
1. User enters phone number
2. Send OTP via Supabase Auth
3. Verify user exists in database
4. User enters OTP code
5. Verify OTP with Supabase Auth
6. Fetch user profile from database
7. Set tenant context from auth data
```

### 3. **Updated Components**
- **useAuth.ts**: Complete rewrite using Supabase Auth
- **TenantContext.tsx**: Now uses auth data instead of localStorage
- **useExpenses.ts**: Updated to use tenant context from auth
- **All other hooks**: Will need similar updates

## 🔧 New Authentication API

### signInWithPhone(phone: string)
```typescript
const { error, data } = await signInWithPhone('+233301234123');

if (data?.requiresOTP) {
  // Show OTP input field
  // User needs to enter verification code
}

if (error) {
  // Handle error (user not found, invalid phone, etc.)
}
```

### verifyOTP(phone: string, token: string)
```typescript
const { error, data } = await verifyOTP('+233301234123', '123456');

if (data?.session) {
  // User is now authenticated
  // Auth state listener will fetch user profile
}

if (error) {
  // Handle invalid OTP
}
```

## 🔄 Updated Tenant Context

The tenant context now automatically derives from Supabase Auth:

```typescript
const { tenant, isAuthenticated, session } = useTenant();

// tenant contains:
// {
//   userId: user.id,
//   businessId: user.business.id,
//   country: user.business.country,
//   industry: user.business.industry,
//   businessName: user.business.business_name
// }
```

## 🧪 Testing Steps

### 1. Test Phone Number Entry
1. Go to login page
2. Enter phone number: `+233301234123`
3. Console should show:
   ```
   🔍 Attempting phone sign-in for: +233301234123
   ✅ OTP sent successfully
   👤 User database check result: {...}
   ✅ User found in database: { userId: ..., businessId: ... }
   ```

### 2. Test OTP Verification
1. Enter the OTP code received
2. Console should show:
   ```
   🔍 Verifying OTP for phone: +233301234123
   ✅ OTP verified successfully for user: ...
   🔄 Auth state changed: SIGNED_IN, ...
   👤 Fetching user profile for: ...
   ✅ User profile loaded successfully
   🏠 Loading tenant from Supabase Auth: ...
   ✅ Tenant data loaded successfully from Supabase Auth
   ```

### 3. Test Data Access
1. Navigate to expenses page
2. Console should show:
   ```
   💰 Fetching expenses for tenant: { userId: ..., businessId: ... }
   ```
3. Data should load correctly

### 4. Test Session Persistence
1. Refresh the page
2. Console should show:
   ```
   🔍 Checking for existing Supabase session...
   ✅ Found existing session for user: ...
   ```

## 🚨 Important Notes

### 1. **Two-Step Authentication**
- Users must first enter phone number
- Then enter OTP code
- This is more secure than direct phone lookup

### 2. **Database Requirements**
- Users must exist in `users` table with phone number
- Users must have corresponding `businesses` record
- Phone numbers must include country code

### 3. **Session Management**
- Sessions are managed by Supabase Auth automatically
- No more localStorage session handling
- Sessions persist across page refreshes

### 4. **Error Handling**
- Better error messages for different scenarios
- Clear console logging for debugging
- Graceful fallbacks for missing data

## 🔍 Debug Information

The new system provides detailed console logging:
- Auth state changes
- Session checks
- User profile fetching
- Tenant context loading
- Database query results

## ⚠️ Migration Checklist

- [x] useAuth.ts migrated to Supabase Auth
- [x] TenantContext.tsx updated
- [x] useExpenses.ts updated
- [ ] Update login page component for OTP flow
- [ ] Update signup to create Supabase Auth user
- [ ] Remove localStorage dependencies from other hooks
- [ ] Test complete authentication flow

## 🎯 Expected Benefits

1. **Better Security**: Supabase Auth handles session security
2. **Reliability**: No more localStorage corruption issues
3. **User Experience**: Standard OTP authentication flow
4. **Maintainability**: Less custom authentication code
5. **Scalability**: Built-in auth features work at scale

## 🚀 Next Steps

1. Update login page UI to handle OTP input
2. Test authentication flow thoroughly
3. Update remaining hooks to use tenant context
4. Remove localStorage authentication code
5. Deploy and monitor authentication metrics

This migration should resolve all the authentication and data isolation issues you were experiencing!
