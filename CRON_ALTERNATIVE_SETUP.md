# Free Cron Job Setup (Works on Vercel Hobby Plan)

Since Vercel Cron Jobs require a Pro plan, you can use **free external cron services** to trigger your automations.

## 🎯 Recommended: cron-job.org (100% Free)

### Step 1: Sign Up

1. Go to: https://cron-job.org/en/
2. Click **Sign up for free**
3. Create an account (it's completely free, no credit card needed)

### Step 2: Add Your CRON_SECRET to Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `CRON_SECRET`
   - **Value**: `IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`
   - **Environment**: Production
5. Click **Save**
6. **Redeploy** your application

### Step 3: Create Cron Jobs on cron-job.org

After signing in to cron-job.org, create these cron jobs:

#### 1. Score Leads (Every Hour at :00)
- **Title**: Score Leads
- **URL**: `https://your-domain.vercel.app/api/cron/score-leads`
- **Schedule**: Every hour at :00
- **Request Method**: GET
- **Headers**: Add custom header
  - **Name**: `Authorization`
  - **Value**: `Bearer IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`

#### 2. Assign Leads (Every Hour at :15)
- **Title**: Assign Leads
- **URL**: `https://your-domain.vercel.app/api/cron/assign-leads`
- **Schedule**: Every hour at :15
- **Request Method**: GET
- **Headers**: 
  - **Name**: `Authorization`
  - **Value**: `Bearer IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`

#### 3. Update Metrics (Every Hour at :30)
- **Title**: Update Dashboard Metrics
- **URL**: `https://your-domain.vercel.app/api/cron/update-metrics`
- **Schedule**: Every hour at :30
- **Request Method**: GET
- **Headers**: 
  - **Name**: `Authorization`
  - **Value**: `Bearer IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`

#### 4. Follow Up Leads (Daily at 9:00 AM)
- **Title**: Follow Up Stale Leads
- **URL**: `https://your-domain.vercel.app/api/cron/follow-up-leads`
- **Schedule**: Every day at 09:00
- **Request Method**: GET
- **Headers**: 
  - **Name**: `Authorization`
  - **Value**: `Bearer IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`

#### 5. Escalate Leads (Daily at 10:00 AM)
- **Title**: Escalate Old Leads
- **URL**: `https://your-domain.vercel.app/api/cron/escalate-leads`
- **Schedule**: Every day at 10:00
- **Request Method**: GET
- **Headers**: 
  - **Name**: `Authorization`
  - **Value**: `Bearer IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`

#### 6. Daily Report (Daily at 6:00 PM)
- **Title**: Generate Daily Report
- **URL**: `https://your-domain.vercel.app/api/cron/daily-report`
- **Schedule**: Every day at 18:00
- **Request Method**: GET
- **Headers**: 
  - **Name**: `Authorization`
  - **Value**: `Bearer IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`

#### 7. Weekly Report (Mondays at 9:00 AM)
- **Title**: Generate Weekly Report
- **URL**: `https://your-domain.vercel.app/api/cron/weekly-report`
- **Schedule**: Every Monday at 09:00
- **Request Method**: GET
- **Headers**: 
  - **Name**: `Authorization`
  - **Value**: `Bearer IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=`

---

## 🧪 Testing

After creating each cron job, you can click **Execute now** to test it immediately. Check the execution history to see if it succeeded (should return 200 OK).

---

## 📊 Monitoring

On cron-job.org dashboard you'll see:
- ✅ Green checkmarks for successful executions
- ❌ Red X for failures
- Execution history and logs
- Email notifications if jobs fail

---

## ⚡ Alternative: EasyCron

If you prefer, **EasyCron** (https://www.easycron.com/) is another great free option with a similar setup process.

---

## 🔒 Security Note

The `CRON_SECRET` ensures only authorized services can trigger your automations. Keep it secure and don't share it publicly!

---

## ✅ You're All Set!

Once you create these 7 cron jobs on cron-job.org, your CRM automations will run automatically in the background, completely free! 🎉

