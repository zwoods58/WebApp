# Run CRM Automations Locally

You can run the CRM automations manually from your command line anytime!

## 🚀 Quick Start

### Run ALL Automations at Once
```bash
npm run automate
```

This will run all 7 automations in sequence:
1. Score all leads
2. Assign unassigned leads
3. Update dashboard metrics
4. Follow up stale leads
5. Escalate old leads
6. Generate daily report
7. Generate weekly report

---

## 🎯 Run Individual Automations

### Lead Scoring
Updates the score for all leads based on their data.
```bash
npm run automate:score
```

### Lead Assignment
Assigns unassigned leads to sales reps in round-robin fashion.
```bash
npm run automate:assign
```

### Dashboard Metrics
Updates dashboard statistics and metrics.
```bash
npm run automate:metrics
```

### Follow-up Emails
Sends follow-up emails to leads that haven't been contacted in 3+ days.
```bash
npm run automate:followup
```

### Lead Escalation
Escalates leads that have been inactive for 7+ days.
```bash
npm run automate:escalate
```

### Daily Report
Generates and emails a daily report to admin.
```bash
npm run automate:daily
```

### Weekly Report
Generates and emails a weekly report to admin.
```bash
npm run automate:weekly
```

---

## 📋 What Each Automation Does

### 1. **Lead Scoring** (`npm run automate:score`)
- Calculates scores for all leads (0-100)
- Based on: contact info, source, industry, status
- Higher scores = hotter leads

### 2. **Lead Assignment** (`npm run automate:assign`)
- Finds leads without a sales rep
- Assigns them in round-robin to available sales users
- Sends email notification to assigned rep
- Creates initial contact task

### 3. **Dashboard Metrics** (`npm run automate:metrics`)
- Updates total lead count
- Calculates conversion rates
- Updates status breakdowns
- Refreshes average scores

### 4. **Follow-up** (`npm run automate:followup`)
- Finds leads not contacted in 3+ days
- Sends automated follow-up emails
- Updates lead status to FOLLOW_UP
- Logs activity in notes

### 5. **Escalation** (`npm run automate:escalate`)
- Finds leads inactive for 7+ days
- Sends urgent notification to admin
- Marks as NOT_INTERESTED if no response
- Documents escalation in notes

### 6. **Daily Report** (`npm run automate:daily`)
- Summarizes new leads today
- Shows closed deals today
- Displays appointments booked
- Overall conversion rate
- Emails to admin at 6 PM

### 7. **Weekly Report** (`npm run automate:weekly`)
- Weekly lead summary
- Conversion statistics
- Industry breakdown
- Source breakdown
- Emails to admin Monday 9 AM

---

## 💡 Pro Tips

### Test with Specific Automation
If you're testing a specific feature, run just that automation:
```bash
npm run automate:score    # Test lead scoring
npm run automate:assign   # Test assignment logic
```

### Run After Importing Leads
After importing new leads, run:
```bash
npm run automate
```
This will score them, assign them, and set up tasks.

### Check Email Sending
Run the daily report to test if emails are working:
```bash
npm run automate:daily
```
Check `admin@atarwebb.com` for the report email.

---

## 🔄 Regular Schedule Recommendation

If you want to run these manually on a schedule:

**Daily (Morning - 9 AM):**
```bash
npm run automate:score
npm run automate:assign
npm run automate:followup
```

**Daily (Evening - 6 PM):**
```bash
npm run automate:daily
```

**Weekly (Monday 9 AM):**
```bash
npm run automate:weekly
```

Or just run everything at once:
```bash
npm run automate
```

---

## 🤖 Automatic Scheduling

For automatic scheduling, see:
- **CRON_ALTERNATIVE_SETUP.md** - Free external cron service
- **VERCEL_CRON_SETUP.md** - Vercel Pro plan cron jobs

---

## ❓ Troubleshooting

### "Cannot find module" error
Make sure your dev server is not running and try:
```bash
npm install
npm run automate
```

### No emails sending
Check your `.env.local` file has correct SMTP settings:
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
SMTP_FROM=admin@atarwebb.com
```

### Leads not being processed
Make sure you have leads in the system:
```bash
npm run seed         # Add sample data
npm run automate     # Process them
```

---

That's it! You now have full control over when automations run. 🎉

