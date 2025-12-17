# Check Your Fetch Call

## Current Fetch Call (from `supabase.js`)

The fetch call is happening in `beezee/src/utils/supabase.js` at line 82:

```javascript
const response = await fetch(`${functionsUrl}/${functionName}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '', // Required
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` // Also included
  },
  body: JSON.stringify(payload),
});
```

**URL being called:**
- `${functionsUrl}/verify-otp-custom`
- Where `functionsUrl` = `VITE_SUPABASE_FUNCTIONS_URL` or `${VITE_SUPABASE_URL}/functions/v1`
- Full URL: `https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom`

## The Problem

The browser automatically sends an **OPTIONS preflight request** before the POST request. This OPTIONS request:
- Doesn't include the `apikey` header (browser doesn't send custom headers in preflight)
- Gets blocked by Supabase's JWT verification
- Never reaches your code

## The Solution

**You MUST disable JWT verification in Supabase Dashboard** because:
1. OPTIONS requests can't include custom headers
2. Supabase checks JWT before your code runs
3. OPTIONS fails → CORS error

## Verify the URL is Correct

Check your `.env.local` file has:
```env
VITE_SUPABASE_URL=https://rtfzksajhriwhulnwaks.supabase.co
VITE_SUPABASE_FUNCTIONS_URL=https://rtfzksajhriwhulnwaks.supabase.co/functions/v1
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Test the URL Directly

In browser console, test if the function exists:
```javascript
// Test OPTIONS (should work after disabling JWT)
fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
  method: 'OPTIONS'
}).then(r => console.log('OPTIONS Status:', r.status));

// Test POST (with apikey)
fetch('https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'YOUR_ANON_KEY_HERE'
  },
  body: JSON.stringify({ whatsapp_number: '+14693065247', code: '123456' })
}).then(r => r.json()).then(d => console.log('POST Response:', d));
```

## Next Step

**Disable JWT verification in Supabase Dashboard** - that's the only way to fix this CORS error!

