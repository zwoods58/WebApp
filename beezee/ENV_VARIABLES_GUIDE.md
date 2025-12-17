# Environment Variables Guide

## Required Variables

### Supabase Configuration

```env
# Your Supabase project URL (found in Supabase Dashboard → Settings → API)
VITE_SUPABASE_URL=https://rtfzksajhriwhulnwaks.supabase.co

# Your Supabase anonymous/public key (found in Supabase Dashboard → Settings → API)
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Base URL for Edge Functions (DO NOT include individual function names)
# Format: https://<your-project>.supabase.co/functions/v1
VITE_SUPABASE_FUNCTIONS_URL=https://rtfzksajhriwhulnwaks.supabase.co/functions/v1
```

**Important:** `VITE_SUPABASE_FUNCTIONS_URL` should be the **base URL only**. The code automatically appends function names.

✅ **Correct:**
```env
VITE_SUPABASE_FUNCTIONS_URL=https://rtfzksajhriwhulnwaks.supabase.co/functions/v1
```

❌ **Wrong (don't include function names):**
```env
VITE_SUPABASE_FUNCTIONS_URL=https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/send-otp-whatsapp
```

### Optional Variables

```env
# Application Configuration
VITE_APP_NAME=BeeZee Finance
VITE_MONTHLY_PRICE=55.50
VITE_TRIAL_DAYS=7

# Feature Flags
VITE_ENABLE_VOICE_PIN=true
VITE_ENABLE_WHATSAPP=true

# Environment
VITE_ENV=production
```

## How It Works

The code uses `VITE_SUPABASE_FUNCTIONS_URL` like this:

```javascript
// Base URL from env
const functionsUrl = "https://rtfzksajhriwhulnwaks.supabase.co/functions/v1";

// Function name is appended automatically
fetch(`${functionsUrl}/send-otp-whatsapp`, ...)
// Results in: https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/send-otp-whatsapp
```

## Where to Find Your Values

1. **Supabase Dashboard** → **Settings** → **API**
   - `VITE_SUPABASE_URL`: Project URL
   - `VITE_SUPABASE_ANON_KEY`: `anon` `public` key
   - `VITE_SUPABASE_FUNCTIONS_URL`: Same as Project URL + `/functions/v1`

## Example `.env.local` File

```env
VITE_SUPABASE_URL=https://rtfzksajhriwhulnwaks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_FUNCTIONS_URL=https://rtfzksajhriwhulnwaks.supabase.co/functions/v1
VITE_APP_NAME=BeeZee Finance
```

## Troubleshooting

**Error: "401 Unauthorized"**
- Check that `VITE_SUPABASE_ANON_KEY` is correct
- Make sure you're using the `anon` `public` key, not the `service_role` key

**Error: "Edge function not found"**
- Check that `VITE_SUPABASE_FUNCTIONS_URL` is the base URL (ends with `/functions/v1`)
- Don't include individual function names in the URL
- Make sure the Edge Functions are deployed in Supabase

**Error: "Failed to fetch"**
- Check your internet connection
- Verify the Supabase project URL is correct
- Make sure CORS is configured in your Edge Functions


