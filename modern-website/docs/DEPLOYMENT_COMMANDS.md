# Deployment Commands

## 1. Deploy Supabase Edge Functions
```bash
supabase functions deploy create-subscription
supabase functions deploy kyshi-webhook
supabase functions deploy process-weekly-charges
```

## 2. Set Supabase Secrets
```bash
supabase secrets set KYSHI_SECRET_KEY=sk_test_3dd6532c95634d1da5888520b9bf96c8
supabase secrets set KYSHI_WEBHOOK_SECRET=c4accdbb6b2f49608ef729cd9afed411
supabase secrets set NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN_HERE
supabase secrets set CRON_SECRET=GENERATE_A_RANDOM_STRING_HERE
supabase secrets set RESEND_API_KEY=YOUR_RESEND_KEY_HERE
supabase secrets set RESEND_FROM_EMAIL=billing@YOUR_DOMAIN_HERE
```

## 3. Run SQL in Supabase SQL Editor
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create weekly charge processing job
SELECT cron.schedule(
  'process-weekly-charges',
  '0 2 * * 1', -- Every Monday at 2 AM UTC
  $$
  -- Your weekly charge processing logic here
  -- This will trigger the process-weekly-charges edge function
  -- The function should use the CRON_SECRET to authenticate requests
  $$
);

-- Log the scheduled job
INSERT INTO cron.job_run_details (schedule, command, database, node)
VALUES (
  '0 2 * * 1',
  'process-weekly-charges',
  current_database(),
  inet_server_addr()
);
```

## 4. Kyshi Webhook URL
Register this webhook URL in your Kyshi dashboard:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/kyshi-webhook
```

## 5. Environment Variables
Make sure to update these in your environment:
- `NEXT_PUBLIC_APP_URL` - Your deployed domain
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Your billing email address
