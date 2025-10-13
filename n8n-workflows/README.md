# n8n Workflow Blueprints

This directory contains n8n workflow designs that mirror the code-based automations in your CRM.

## 🔄 How to Use

1. **Your code automations are already working** - deploy and use immediately
2. **Want to visualize in n8n?** - Follow the guides below
3. **Want to switch to n8n?** - Import the JSON files provided

## 📋 Available Workflows

### 1. Lead Processing Workflow
- **File**: `lead-processing.md`
- **Code**: `src/lib/automation/lead-management.ts`
- **Function**: `processNewLead()`
- **Triggers**: When new lead is imported
- **Actions**: Score → Assign → Welcome Email → Create Task

### 2. Lead Scoring Workflow
- **File**: `lead-scoring.md`
- **Code**: `src/lib/automation/lead-management.ts`
- **Function**: `updateAllLeadScores()`
- **Schedule**: Every hour
- **Actions**: Calculate score for all leads

### 3. Follow-up Automation
- **File**: `follow-up-automation.md`
- **Code**: `src/lib/automation/lead-management.ts`
- **Function**: `followUpStaleLeads()`
- **Schedule**: Daily at 9am
- **Actions**: Find stale leads → Send email → Update notes

### 4. Lead Assignment
- **File**: `lead-assignment.md`
- **Code**: `src/lib/automation/lead-management.ts`
- **Function**: `assignUnassignedLeads()`
- **Schedule**: Every hour
- **Actions**: Find unassigned → Assign round-robin → Notify

### 5. Lead Escalation
- **File**: `lead-escalation.md`
- **Code**: `src/lib/automation/lead-management.ts`
- **Function**: `escalateOldLeads()`
- **Schedule**: Daily at 10am
- **Actions**: Find old leads → Escalate → Update status

### 6. Daily Report
- **File**: `daily-report.md`
- **Code**: `src/lib/automation/analytics.ts`
- **Function**: `generateDailyReport()`
- **Schedule**: Daily at 6pm
- **Actions**: Calculate metrics → Email admin → Post to Slack

### 7. Weekly Report
- **File**: `weekly-report.md`
- **Code**: `src/lib/automation/analytics.ts`
- **Function**: `generateWeeklyReport()`
- **Schedule**: Monday at 9am
- **Actions**: Calculate weekly metrics → Send report

## 🚀 Quick Start with n8n

### Step 1: Install n8n
\`\`\`bash
npm install n8n -g
n8n start
# Open http://localhost:5678
\`\`\`

### Step 2: Import Workflows
1. Open n8n in browser
2. Click "Import from File"
3. Select JSON files from this directory
4. Configure credentials (SendGrid, Slack, etc.)
5. Activate workflows

### Step 3: Connect to Your CRM
- Update webhook URLs to point to your CRM
- Configure database connection (when ready)
- Test each workflow

## 📊 Workflow Comparison

| Automation | Code Version | n8n Version |
|-----------|-------------|-------------|
| **Processing** | Runs on import | Webhook trigger |
| **Scheduling** | Node-cron | n8n Schedule |
| **Email** | SendGrid API | SendGrid node |
| **Database** | Direct mockDb | HTTP/PostgreSQL |
| **Slack** | Webhook | Slack node |

## 🔌 API Endpoints for n8n

Your CRM exposes these endpoints for n8n:

- `GET /api/leads` - Fetch all leads
- `POST /api/leads/import` - Import leads
- `PATCH /api/leads/[id]` - Update lead
- `GET /api/admin/stats` - Get statistics
- `POST /api/automation/trigger` - Trigger automation

## ⚙️ Environment Variables

For n8n workflows, you'll need:

\`\`\`env
CRM_API_URL=http://localhost:3000/api
SENDGRID_API_KEY=your-key
SLACK_WEBHOOK_URL=your-webhook
DATABASE_URL=your-db-url
\`\`\`

