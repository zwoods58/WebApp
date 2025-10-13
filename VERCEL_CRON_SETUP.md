# Vercel Cron Jobs Setup Guide

This guide explains how to set up automated CRM tasks using Vercel Cron Jobs.

## 🎯 What Gets Automated

Your CRM automations will run automatically on the following schedule:

### Hourly Automations
- **:00** (Every hour) - Update lead scores
- **:15** (Every hour) - Assign unassigned leads to sales reps
- **:30** (Every hour) - Update dashboard metrics

### Daily Automations
- **9:00 AM** - Send follow-up emails to stale leads
- **10:00 AM** - Escalate old leads that need attention
- **6:00 PM** - Generate and email daily report to admin

### Weekly Automations
- **Monday 9:00 AM** - Generate and email weekly report to admin

## 🔧 Setup Instructions

### Step 1: Generate a CRON_SECRET

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Or use any random string generator. Copy the output.

### Step 2: Add CRON_SECRET to Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `CRON_SECRET`
   - **Value**: [paste your generated secret]
   - **Environment**: Production (and optionally Preview/Development)
4. Click **Save**

### Step 3: Redeploy Your Application

After adding the environment variable, trigger a new deployment:

```bash
git commit --allow-empty -m "Trigger deployment for cron setup"
git push origin main-production
```

Or click **Redeploy** in the Vercel dashboard.

### Step 4: Verify Cron Jobs

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Cron Jobs**
3. You should see all 7 cron jobs listed:
   - `/api/cron/score-leads` (hourly at :00)
   - `/api/cron/assign-leads` (hourly at :15)
   - `/api/cron/update-metrics` (hourly at :30)
   - `/api/cron/follow-up-leads` (daily at 9:00 AM)
   - `/api/cron/escalate-leads` (daily at 10:00 AM)
   - `/api/cron/daily-report` (daily at 6:00 PM)
   - `/api/cron/weekly-report` (Mondays at 9:00 AM)

## 🧪 Testing Cron Jobs Manually

You can test each cron job manually by calling the API endpoint with your CRON_SECRET:

```bash
curl -X GET https://your-domain.vercel.app/api/cron/score-leads \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace:
- `your-domain.vercel.app` with your actual Vercel domain
- `YOUR_CRON_SECRET` with your actual secret

## 📊 Monitoring Cron Jobs

### View Cron Job Logs

1. Go to your Vercel project dashboard
2. Click on **Deployments** → select your deployment
3. Click on **Functions** tab
4. Find the cron function logs (e.g., `/api/cron/score-leads`)

### Email Notifications

The automations will send emails to `admin@atarwebb.com`:
- Daily reports (6:00 PM)
- Weekly reports (Monday 9:00 AM)
- Notifications for important events (escalations, assignments, etc.)

## ⚙️ Customizing Schedules

To change the cron schedules, edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/score-leads",
      "schedule": "0 * * * *"  // Cron expression
    }
  ]
}
```

### Cron Expression Format

```
*    *    *    *    *
┬    ┬    ┬    ┬    ┬
│    │    │    │    │
│    │    │    │    └─── Day of week (0-7, 0 or 7 = Sunday)
│    │    │    └──────── Month (1-12)
│    │    └───────────── Day of month (1-31)
│    └────────────────── Hour (0-23)
└─────────────────────── Minute (0-59)
```

Examples:
- `0 * * * *` - Every hour at :00
- `30 9 * * *` - Every day at 9:30 AM
- `0 9 * * 1` - Every Monday at 9:00 AM
- `*/15 * * * *` - Every 15 minutes

## 🚨 Important Notes

1. **Timezone**: Vercel cron jobs run in **UTC** timezone. Adjust your schedules accordingly.
2. **Limits**: 
   - Hobby plan: 1 cron job per project
   - Pro plan: 100 cron jobs per project
3. **Execution Time**: Each cron job must complete within 10 seconds (Hobby) or 5 minutes (Pro)
4. **Persistence**: Since Vercel uses serverless functions, data is stored in the mock database (in-memory). For production, you should use a real database like Supabase or PostgreSQL.

## 🔐 Security

- The `CRON_SECRET` ensures only Vercel can trigger your cron jobs
- Never commit your `CRON_SECRET` to git
- Rotate your secret periodically for better security

## 📝 Troubleshooting

### Cron jobs not appearing in Vercel dashboard

- Ensure `vercel.json` is committed to your repository
- Redeploy your application after making changes
- Check that you're on a plan that supports cron jobs

### Cron jobs failing

- Check the function logs in Vercel dashboard
- Verify `CRON_SECRET` is set correctly
- Ensure email configuration is correct for notifications

### Emails not being sent

- Check `SMTP_*` environment variables
- Verify your email provider settings
- Check function logs for email errors

## ✅ Success Indicators

Your cron jobs are working if:
1. You see them listed in Vercel dashboard → Cron Jobs
2. Function logs show successful executions
3. You receive daily/weekly email reports
4. Dashboard metrics update automatically
5. Leads get assigned automatically

---

For more information, see:
- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md) - Details about each automation

