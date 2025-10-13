# 🚀 CRM Automation - Quick Start

## ⚡ TL;DR

Your CRM now has **8 automated workflows** running 24/7!

**Nothing to configure** - it works out of the box!

---

## 🤖 What's Automated

✅ **Lead Scoring** (Hourly)
✅ **Lead Assignment** (Hourly)  
✅ **Follow-up Emails** (Daily 9am)
✅ **Lead Escalation** (Daily 10am)
✅ **Daily Reports** (6pm)
✅ **Weekly Reports** (Monday 9am)
✅ **Task Creation** (On import)
✅ **Dashboard Updates** (Hourly)

---

## 📋 How It Works

### When You Import Leads:
1. Lead gets scored (0-100)
2. Auto-assigned to sales rep
3. Welcome email sent
4. Task created for sales rep
5. Slack notification posted

### Background Jobs:
- **Every Hour**: Scoring, assignment, metrics
- **Every Day**: Follow-ups, escalation, reports
- **Every Week**: Performance summary

---

## 🎯 Quick Commands

### Start Automations
```bash
curl http://localhost:3000/api/automation/start
```

### Trigger Manually
```bash
# Run all automations now
curl -X POST http://localhost:3000/api/automation/trigger \
  -H "Content-Type: application/json" \
  -d '{"automation": "all"}'
```

### Available Triggers
- `lead-scoring` - Update scores
- `follow-up` - Send emails
- `assignment` - Assign leads
- `escalation` - Escalate old leads
- `daily-report` - Generate report
- `all` - Run everything

---

## 📁 Key Files

```
src/lib/automation/
  ├── scheduler.ts        # Main scheduler
  ├── lead-management.ts  # Lead automations
  ├── analytics.ts        # Reports
  └── helpers.ts          # Utilities

src/app/api/automation/
  ├── start/route.ts      # Start endpoint
  └── trigger/route.ts    # Manual triggers
```

---

## 🔧 Optional Setup

### Email (SendGrid)
```env
SENDGRID_API_KEY=your-key
```

### Slack
```env
SLACK_WEBHOOK_URL=your-webhook
```

---

## 📊 View Schedule

Visit: `http://localhost:3000/api/automation/start`

See all automation schedules and status.

---

## 🎨 n8n (Optional)

Want visual workflows?

```bash
npm install n8n -g
n8n start
# Open http://localhost:5678
# Import from /n8n-workflows/
```

---

## 📚 Full Documentation

- **Complete Guide**: `AUTOMATION_GUIDE.md`
- **Summary**: `CRM_AUTOMATION_SUMMARY.md`  
- **n8n Blueprints**: `/n8n-workflows/`

---

## ✨ That's It!

**Your CRM is now fully automated** and running in the background!

Import leads → Everything happens automatically 🎉

