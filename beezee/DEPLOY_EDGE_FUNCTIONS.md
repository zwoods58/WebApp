# Deploy Edge Functions

## Step 1: Install Supabase CLI

If you haven't already:

```bash
# Windows (PowerShell)
scoop install supabase

# Or download from: https://github.com/supabase/cli/releases
```

## Step 2: Login to Supabase

```bash
supabase login
```

## Step 3: Link to Your Project

```bash
cd beezee
supabase link --project-ref rtfzksajhriwhulnwaks
```

## Step 4: Deploy Edge Functions

```bash
# Deploy send-otp-whatsapp function
supabase functions deploy send-otp-whatsapp

# Deploy verify-otp-custom function
supabase functions deploy verify-otp-custom
```

## Step 5: Set Environment Variables (Optional)

If you want direct links to your WhatsApp Business number:

```bash
supabase secrets set WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX
```

(Replace with your WhatsApp Business number, no + or spaces)

## Step 6: Test the Functions

After deployment, test with:

```bash
# Test send-otp-whatsapp
curl -X POST \
  https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/send-otp-whatsapp \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"whatsapp_number": "+14693065247"}'

# Test verify-otp-custom
curl -X POST \
  https://rtfzksajhriwhulnwaks.supabase.co/functions/v1/verify-otp-custom \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"whatsapp_number": "+14693065247", "code": "123456"}'
```

## Troubleshooting

### "Function not found"
- Make sure you're in the `beezee` directory
- Check that the function folders exist in `supabase/functions/`
- Try `supabase functions list` to see deployed functions

### "Permission denied"
- Make sure you're logged in: `supabase login`
- Make sure the project is linked: `supabase link --project-ref rtfzksajhriwhulnwaks`

### CORS errors in browser
- The functions now have CORS headers configured
- Make sure you redeployed after adding CORS headers

## Verify Deployment

Check the Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/rtfzksajhriwhulnwaks
2. Click **Edge Functions** in the left sidebar
3. You should see:
   - `send-otp-whatsapp`
   - `verify-otp-custom`

Both should have status "Deployed" ✅


