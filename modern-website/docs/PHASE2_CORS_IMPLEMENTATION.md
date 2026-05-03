# Phase 2: CORS Policy Configuration - Implementation Summary

## ✅ Completed

CORS (Cross-Origin Resource Sharing) has been configured to allow secure cross-origin requests to the API while preventing unauthorized access.

---

## 📋 What Was Implemented

### 1. **CORS Headers in `next.config.ts`**

Added CORS headers for all API routes:
- `Access-Control-Allow-Origin` - Dynamic based on environment
- `Access-Control-Allow-Credentials` - Allows cookies/auth headers
- `Access-Control-Allow-Methods` - GET, POST, PUT, PATCH, DELETE, OPTIONS
- `Access-Control-Allow-Headers` - All necessary headers including Authorization

**Configuration:**
- **Development**: `http://localhost:3000`
- **Production**: Uses `NEXT_PUBLIC_SITE_URL` environment variable

### 2. **CORS Headers in `vercel.json`**

Added production CORS configuration for Vercel deployment:
- Same headers as next.config.ts
- Hardcoded production URL as fallback
- Applied to all `/api/*` routes

### 3. **CORS Middleware (`src/middleware/cors.ts`)**

Created comprehensive CORS middleware with:
- **Origin validation** - Checks if origin is allowed
- **Preflight handling** - Handles OPTIONS requests
- **Dynamic origin support** - Environment-based configuration
- **Wildcard subdomain support** - For `*.vercel.app` patterns
- **Helper functions**:
  - `isOriginAllowed()` - Validates origin
  - `addCorsHeaders()` - Adds CORS headers to response
  - `handlePreflight()` - Handles OPTIONS requests
  - `withCors()` - Wrapper for API routes

### 4. **Environment Variables**

Updated `.env.example` with:
```bash
NEXT_PUBLIC_SITE_URL=https://your-production-url.vercel.app
ALLOWED_ORIGINS=https://custom-domain.com,https://staging.domain.com
```

---

## 🔒 Security Features

### Allowed Origins

**Production:**
- Main production URL (from `NEXT_PUBLIC_SITE_URL`)
- Additional origins (from `ALLOWED_ORIGINS` env var)

**Development:**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`

### Allowed Methods
- `GET` - Read operations
- `POST` - Create operations
- `PUT` - Full update operations
- `PATCH` - Partial update operations
- `DELETE` - Delete operations
- `OPTIONS` - Preflight requests

### Allowed Headers
- `Authorization` - For authentication tokens
- `Content-Type` - For request body type
- `X-CSRF-Token` - CSRF protection
- `X-Requested-With` - AJAX identification
- `Accept` - Response format
- And more standard headers

### Security Measures
✅ **Origin validation** - Only allowed origins can access API
✅ **Credentials support** - Cookies and auth headers allowed
✅ **Preflight caching** - 24-hour cache for OPTIONS requests
✅ **Environment-based** - Different configs for dev/prod
✅ **Wildcard support** - For subdomain patterns

---

## 📝 Usage Examples

### Option 1: Using CORS Middleware Wrapper

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/middleware/cors';

async function handler(request: NextRequest) {
  const data = { message: 'Hello World' };
  return NextResponse.json(data);
}

export const POST = withCors(handler);
export const GET = withCors(handler);
```

### Option 2: Manual CORS Headers

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handlePreflight, addCorsHeaders } from '@/middleware/cors';

export async function OPTIONS(request: NextRequest) {
  return handlePreflight(request);
}

export async function POST(request: NextRequest) {
  // Your logic here
  const data = { message: 'Hello World' };
  const response = NextResponse.json(data);
  
  // Add CORS headers
  return addCorsHeaders(response, request.headers.get('origin'));
}
```

### Option 3: Automatic (via next.config.ts)

CORS headers are automatically added to all `/api/*` routes via `next.config.ts`. No code changes needed in individual routes.

---

## 🧪 Testing CORS

### Test with cURL

```bash
# Test preflight request
curl -X OPTIONS http://localhost:3000/api/auth/signup \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Test actual request
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+254712345678","name":"Test","country":"KE","industry":"retail","pin":"123456"}' \
  -v
```

### Test with JavaScript

```javascript
// From browser console or frontend app
fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Include cookies
  body: JSON.stringify({
    phoneNumber: '+254712345678',
    name: 'Test User',
    country: 'KE',
    industry: 'retail',
    pin: '123456'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

### Expected Response Headers

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,DELETE,PATCH,POST,PUT,OPTIONS
Access-Control-Allow-Headers: X-CSRF-Token, X-Requested-With, Accept, ...
Access-Control-Max-Age: 86400
```

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Set `NEXT_PUBLIC_SITE_URL` in Vercel environment variables
- [ ] Set `ALLOWED_ORIGINS` if using custom domains
- [ ] Update `vercel.json` with production URL
- [ ] Test CORS locally with different origins
- [ ] Verify OPTIONS requests work

### After Deploying

- [ ] Test API from production frontend
- [ ] Test API from different allowed origins
- [ ] Verify unauthorized origins are blocked
- [ ] Check browser console for CORS errors
- [ ] Test with credentials (cookies/auth)

---

## 🔧 Configuration Files Modified

1. **`next.config.ts`** - Added CORS headers for API routes
2. **`vercel.json`** - Added production CORS configuration
3. **`.env.example`** - Added CORS environment variables
4. **`src/middleware/cors.ts`** - Created CORS middleware (NEW)

---

## 📊 CORS Flow

```
1. Browser sends preflight OPTIONS request
   ↓
2. Server checks origin against allowed list
   ↓
3. If allowed, returns CORS headers with 204 status
   ↓
4. Browser caches preflight response (24 hours)
   ↓
5. Browser sends actual request (POST, GET, etc.)
   ↓
6. Server processes request and adds CORS headers
   ↓
7. Browser allows frontend to access response
```

---

## ⚠️ Common Issues & Solutions

### Issue: CORS error in browser
**Solution:** Check that origin is in allowed list. Verify `NEXT_PUBLIC_SITE_URL` is set correctly.

### Issue: Credentials not working
**Solution:** Ensure `Access-Control-Allow-Credentials: true` is set and frontend uses `credentials: 'include'`.

### Issue: Custom headers blocked
**Solution:** Add custom headers to `Access-Control-Allow-Headers` in CORS config.

### Issue: OPTIONS request fails
**Solution:** Ensure API route exports OPTIONS handler or uses `withCors` wrapper.

### Issue: Works locally but not in production
**Solution:** Verify `NEXT_PUBLIC_SITE_URL` environment variable is set in Vercel.

---

## 🎯 Security Best Practices

✅ **DO:**
- Validate origins against whitelist
- Use environment variables for configuration
- Enable credentials only when needed
- Set appropriate cache duration for preflight
- Log CORS violations for monitoring

❌ **DON'T:**
- Use `Access-Control-Allow-Origin: *` with credentials
- Allow all origins in production
- Hardcode production URLs in code
- Forget to handle OPTIONS requests
- Expose sensitive headers

---

## 📈 Next Steps

### Phase 3: Rate Limiting
- Implement request throttling
- Add rate limit headers
- Configure per-endpoint limits
- Set up Redis for distributed rate limiting

### Phase 4: PIN Reset
- Create reset token system
- Implement SMS verification
- Add expiration logic

### Phase 5: Monitoring
- Set up error tracking
- Add performance monitoring
- Configure alerts

---

## 📚 Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js Headers Configuration](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Vercel Headers Configuration](https://vercel.com/docs/projects/project-configuration#headers)
- [OWASP CORS Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#cross-origin-resource-sharing)

---

## ✨ Summary

**Phase 2: CORS Policy Configuration - COMPLETE**

- ✅ CORS headers configured in `next.config.ts`
- ✅ Production CORS configured in `vercel.json`
- ✅ CORS middleware created with helper functions
- ✅ Environment variables documented
- ✅ Testing examples provided
- ✅ Security best practices implemented

**Status:** Ready for testing and deployment
**Next Phase:** Phase 3 - Rate Limiting
