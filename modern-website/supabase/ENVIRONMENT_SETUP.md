# Environment Variables Setup for V2 Authentication

## Required Secrets

Set these in Supabase using the CLI or Dashboard:

```bash
# JWT Secret (generate a strong random key)
supabase secrets set JWT_SECRET="your-256-bit-random-key-here"

# Africa's Talking (Kenya) - Sandbox
supabase secrets set AT_API_KEY="atsk_f787f6228dc32e6b94769cf0a053afc66ca927ac4a9004d9f536753974567a0082bd469e"
supabase secrets set AT_USERNAME="sandbox"

# Termii (Nigeria) - Get from https://termii.com
supabase secrets set TERMII_API_KEY="your-termii-key"

# Twilio (South Africa) - Get from https://twilio.com
supabase secrets set TWILIO_ACCOUNT_SID="your-twilio-sid"
supabase secrets set TWILIO_AUTH_TOKEN="your-twilio-auth-token"
supabase secrets set TWILIO_PHONE_NUMBER="+27xxxxxxxxx"

# Resend (Email verification) - Get from https://resend.com
supabase secrets set RESEND_API_KEY="re_xxxxxxxxxxxx"

# WhatsApp Cloud API (South Africa Testing)
supabase secrets set WHATSAPP_TOKEN="your-permanent-access-token"
supabase secrets set WHATSAPP_PHONE_ID="989385247587073"
supabase secrets set WHATSAPP_TEMPLATE_NAME="hello_world"
# App ID: 1577376313584090
# App Secret: af25b010f73ab86fa976e1dce32c210e
```

## Generate JWT Secret

Run this in your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use this online: https://www.random.org/strings/

## Testing with Sandbox

For initial testing with Kenya:
- AT_USERNAME should be "sandbox"
- AT_API_KEY is already set (sandbox key provided)
- Test phone numbers in sandbox mode: Use the test numbers provided in your Africa's Talking dashboard

## Production Keys

When ready for production:
1. Get production API keys from all providers
2. Update the secrets using `supabase secrets set`
3. Change AT_USERNAME to your production username
