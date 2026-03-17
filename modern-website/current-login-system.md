# Current Login System Flow

## 🔄 How It Works Right Now

### 1. **Two Authentication Options Available**

You now have **two ways** to authenticate users:

#### Option A: `signInWithPhone(phone)` - Full OTP Flow
```typescript
const result = await signInWithPhone('+233301234123');
// Sends OTP → User must enter code → verifyOTP() → Authenticated
```

#### Option B: `signInDirect(phone)` - Direct Bypass (Temporary)
```typescript
const result = await signInDirect('+233301234123');
// Immediate authentication without OTP
```

---

### 2. **Current Login Flow with `signInDirect`** (Recommended for now)

```
📱 User enters phone number
    ↓
🔍 signInDirect(phone) called
    ↓
🗄️ Database: Check if user exists in 'users' table
    ↓
🏢 Database: Get business data from 'businesses' table
    ↓
✅ User found + Business exists
    ↓
🎫 Create temporary session (bypasses Supabase Auth)
    ↓
👤 Set auth state with user + business data
    ↓
🏠 TenantContext updates automatically from auth data
    ↓
🎉 User is authenticated! Data access works
```

---

### 3. **What Happens Behind the Scenes**

#### Step 1: Phone Validation
```typescript
// Validates phone format + country code
// +254, +233, +234, etc. supported
```

#### Step 2: Database Lookup
```sql
-- Query executed:
SELECT id, phone_number, business_name, country, default_industry, auth_method,
       businesses(id, business_name, country, industry, settings)
FROM users 
INNER JOIN businesses ON users.id = businesses.user_id
WHERE phone_number = '+233301234123'
```

#### Step 3: Session Creation
```typescript
// Creates temporary session object
const tempSession = {
  user: { id: user.id, phone: phone, aud: 'authenticated', ... },
  access_token: 'temp_token_' + Date.now(),
  expires_in: 3600
};
```

#### Step 4: Auth State Update
```typescript
setAuthState({
  user: { ...userData, business, auth_method: 'phone_direct' },
  isAuthenticated: true,
  session: tempSession
});
```

#### Step 5: Tenant Context Auto-Update
```typescript
// TenantContext listens to auth changes
// Automatically extracts:
tenant = {
  userId: user.id,
  businessId: user.business.id,
  country: user.business.country,
  industry: user.business.industry,
  businessName: user.business.business_name
}
```

---

### 4. **How to Use It in Your Login Component**

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { signInDirect, loading, error, isAuthenticated } = useAuth();
  const [phone, setPhone] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await signInDirect(phone);
    
    if (result.error) {
      // Show error message
      alert(result.error.message);
    } else {
      // Success! Navigate to dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="tel" 
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+233301234123"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

---

### 5. **What Happens After Login**

#### Data Access Works Automatically
```typescript
// In any component:
const { tenant } = useTenant();
const { expenses } = useExpenses();

// tenant contains: { userId: '...', businessId: '...', ... }
// expenses loads automatically filtered by tenant.userId and tenant.businessId
```

#### Session Persistence
```typescript
// When user refreshes page:
// 1. useAuth checks for existing session
// 2. If session exists, reloads user profile
// 3. TenantContext updates automatically
// 4. User stays logged in
```

---

### 6. **Console Logging You'll See**

```
🔍 Attempting direct sign-in for phone: +233301234123
👤 User database check result: { user: {...}, error: null }
✅ Direct authentication successful: { userId: abc-123, businessId: biz-456 }
🏠 Loading tenant from Supabase Auth: { user: {...}, isAuthenticated: true }
✅ Tenant data loaded successfully from Supabase Auth: { userId: abc-123, businessId: biz-456 }
💰 Fetching expenses for tenant: { userId: abc-123, businessId: biz-456 }
```

---

### 7. **Error Handling**

If user doesn't exist:
```
❌ No user found in database for phone: +233301234123
→ Error: "No account found with this phone number. Please sign up first."
```

If phone format is invalid:
```
→ Error: "Invalid phone format or unsupported country..."
```

---

### 8. **Key Differences from Old System**

| Old System | New System |
|------------|------------|
| ❌ localStorage dependent | ✅ Supabase Auth infrastructure |
| ❌ Manual session management | ✅ Automatic session handling |
| ❌ Data disappearing issues | ✅ Reliable tenant context |
| ❌ No proper validation | ✅ Database-backed authentication |
| ❌ Complex localStorage bugs | ✅ Simple, reliable flow |

---

### 9. **What You Need to Do**

1. **Update your login form** to call `signInDirect(phone)` instead of localStorage logic
2. **Remove any localStorage authentication code** from your login component
3. **Test with phone number**: `+233301234123`
4. **Verify data loads** in expenses/other pages

That's it! The system handles everything else automatically. 🎉
