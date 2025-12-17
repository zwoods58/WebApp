# Environment Variables Documentation

This document lists all required environment variables for the AtarWebb application.

## Required Environment Variables

### Supabase Configuration

```env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (Public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Service Role Key (Private - Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find:**
- Go to your Supabase project dashboard
- Navigate to Settings > API
- Copy the Project URL and anon/public key
- Copy the service_role key (keep this secret!)

---

### Flutterwave Payment Gateway

**Test Credentials (Use these for development):**
```env
# Flutterwave Public Key (Client ID)
FLUTTERWAVE_PUBLIC_KEY=14e67305-fa27-4750-a78e-ee1a2a0164ae

# Flutterwave Secret Key (Client Secret)
FLUTTERWAVE_SECRET_KEY=29hOnb4XREOjq8kKBV47xsALWD8UEpn8

# Flutterwave Encryption Key
FLUTTERWAVE_ENCRYPTION_KEY=7utUKn/NP4eMepW0xeS5eDnfc1Fj8Iu+vyXS48DYTHE=

# Flutterwave Webhook Secret Hash (for webhook verification)
FLUTTERWAVE_SECRET_HASH=your_secret_hash_here
```

**Production Credentials (Use these for production):**
```env
# Replace with your live credentials from Flutterwave Dashboard
FLUTTERWAVE_PUBLIC_KEY=your_live_public_key
FLUTTERWAVE_SECRET_KEY=your_live_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=your_live_encryption_key
FLUTTERWAVE_SECRET_HASH=your_production_secret_hash
```

**Where to find:**
- Go to Flutterwave Dashboard: https://dashboard.flutterwave.com
- Navigate to Settings > API Keys
- Copy your Public Key (Client ID) and Secret Key (Client Secret)
- Get Encryption Key from Settings > Security
- Generate a webhook secret hash in Settings > Webhooks
- **Important**: Use test credentials for development, live credentials for production

---

### Application Configuration

```env
# Application URL (for redirects and webhooks)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Cron Secret (for scheduled tasks)
CRON_SECRET=your_random_secret_string_here
```

**Notes:**
- `NEXT_PUBLIC_APP_URL` should be your production domain
- `CRON_SECRET` can be any random string (use a password generator)

---

### AI/OpenRouter Configuration (Optional)

```env
# OpenRouter API Key (if using OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# Claude API Key (if using Claude directly)
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
```

**Where to find:**
- OpenRouter: https://openrouter.ai/keys
- Claude: https://console.anthropic.com/settings/keys

---

## Environment Setup by Environment

### Development (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key

# Flutterwave Test Credentials
FLUTTERWAVE_PUBLIC_KEY=14e67305-fa27-4750-a78e-ee1a2a0164ae
FLUTTERWAVE_SECRET_KEY=29hOnb4XREOjq8kKBV47xsALWD8UEpn8
FLUTTERWAVE_ENCRYPTION_KEY=7utUKn/NP4eMepW0xeS5eDnfc1Fj8Iu+vyXS48DYTHE=
FLUTTERWAVE_SECRET_HASH=test_secret_hash

NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=dev_secret_123
```

### Production (.env.production)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxxxxx
FLUTTERWAVE_SECRET_HASH=your_production_secret_hash
NEXT_PUBLIC_APP_URL=https://your-domain.com
CRON_SECRET=your_secure_random_string
```

---

## Security Best Practices

1. **Never commit `.env` files to version control**
   - Add `.env*` to `.gitignore`
   - Use `.env.example` for documentation

2. **Use different keys for development and production**
   - Never use production keys in development
   - Use Flutterwave test keys for development

3. **Rotate secrets regularly**
   - Change webhook secrets periodically
   - Rotate API keys if compromised

4. **Limit access to service role keys**
   - Only use `SUPABASE_SERVICE_ROLE_KEY` server-side
   - Never expose in client-side code

---

## Verifying Environment Variables

After setting up your environment variables, verify they're loaded correctly:

```bash
# Check if variables are loaded (development)
npm run dev

# Check build (production)
npm run build
```

If variables are missing, you'll see errors in the console.

---

## Troubleshooting

### "Environment variable not found" errors

1. Check that the variable name matches exactly (case-sensitive)
2. Restart your development server after adding variables
3. Verify `.env.local` is in the project root
4. For Vercel, add variables in Project Settings > Environment Variables

### Flutterwave webhook not working

1. Verify `FLUTTERWAVE_SECRET_HASH` matches your Flutterwave dashboard
2. Check webhook URL is correct: `https://your-domain.com/api/ai-builder/payments/webhook`
3. Ensure webhook events are enabled in Flutterwave dashboard

### Supabase connection issues

1. Verify `NEXT_PUBLIC_SUPABASE_URL` includes `https://`
2. Check that RLS policies allow access
3. Verify service role key has correct permissions

