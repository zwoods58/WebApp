# 📱 In-App Notifications with wa.me Links - Complete Guide

## 🎯 Overview

This system provides **in-app notifications** with **wa.me Click-to-Chat links** for user engagement and support. **No WhatsApp Business API required!**

**Key Benefits:**
- ✅ **Zero Cost** - No API fees, no per-message charges
- ✅ **Zero Setup Time** - No business verification, no approval process
- ✅ **Higher Trust** - Users initiate conversations, feels more personal
- ✅ **No Rate Limits** - No messaging quotas or restrictions
- ✅ **Simpler Architecture** - No webhook handling, no message queue

---

## 🏗️ Architecture

### How It Works

1. **Notifications are created** in Supabase database (via Edge Function or cron jobs)
2. **Notifications appear in-app** (like a news feed)
3. **Users see notifications** with action buttons and optional WhatsApp help links
4. **Users click wa.me link** → Opens WhatsApp with pre-filled message
5. **User chooses recipient** → Sends message to your business number
6. **You respond** via WhatsApp Business app on your phone

### Database Schema

```sql
-- Notifications table (in-app only)
notifications (
  id, user_id, type, title, message,
  action_label, action_url,           -- Primary in-app action
  whatsapp_help_label, whatsapp_help_text,  -- Optional WhatsApp link
  priority, read, dismissed,
  created_at, expires_at,
  action_clicked, whatsapp_clicked    -- Analytics
)

-- User preferences
notification_preferences (
  user_id, trial_reminders, payment_reminders,
  milestone_celebrations, weekly_summaries,
  insights, quiet_hours_start, quiet_hours_end
)
```

---

## 📋 Notification Types

### 1. Trial Reminders

**Day 3 Check-in:**
- Title: "👋 Hey [Name]!"
- Message: "You've been using the app for 3 days! Recorded X transactions so far."
- Action: "View My Progress" → `/reports`
- WhatsApp: "Need help?" → Pre-filled support message

**Trial Ending:**
- Title: "⏰ X days left"
- Message: "Your free trial ends tomorrow. You've tracked RXXX so far!"
- Action: "Subscribe Now (R55.50/month)" → `/settings/subscription`
- WhatsApp: "Questions first?" → Pre-filled subscription questions

### 2. Payment Notifications

**Payment Due (3 days before):**
- Title: "💳 Payment due soon"
- Message: "Your subscription renews in 3 days (R55.50)."
- Action: "Update Payment Method" → `/settings/payment`
- WhatsApp: "Payment questions?" → Pre-filled payment help

**Payment Failed:**
- Title: "⚠️ Payment couldn't be processed"
- Message: "We couldn't process your payment. Update your payment info."
- Action: "Update Payment Now" → `/settings/payment`
- WhatsApp: "Need payment help?" → Pre-filled payment support

### 3. Engagement & Milestones

**Milestone Celebration:**
- Title: "🎉 Milestone reached!"
- Message: "You just recorded your Xth transaction!"
- WhatsApp: "Share your achievement" → Pre-filled share message

**Weekly Summary:**
- Title: "📊 Weekly report ready"
- Message: "This week: Made RXXX, Spent RXXX. Profit: RXXX"
- Action: "View Full Report" → `/reports`
- WhatsApp: "Share this week" → Pre-filled report share

**AI Coach Insight:**
- Title: "💡 Your coach noticed something"
- Message: "Your transport costs went up by RXXX this month."
- Action: "Chat with Coach" → `/coach`
- WhatsApp: "Get personal advice" → Pre-filled coach discussion

---

## 🚀 Setup Instructions

### 1. Apply Database Migration

```bash
# Run the new migration
supabase db push

# Or manually in Supabase SQL Editor
# Run: supabase/migrations/20241213000006_notifications_wa_me.sql
```

### 2. Deploy Edge Function

```bash
# Deploy create-notification function
supabase functions deploy create-notification

# Set environment variable
supabase secrets set WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX
```

### 3. Configure Frontend

Add to `.env`:
```bash
VITE_WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX
```

### 4. Set Up WhatsApp Business

1. **Get a business phone number** (SIM card or virtual number)
2. **Install WhatsApp Business** on a phone
3. **Configure business profile:**
   - Business name: BeeZee Finance
   - Category: Financial Services
   - Description: "Simple finance tracking for South African informal businesses"
   - Business hours: Mon-Fri 9am-5pm
   - Website: https://your-app-url.com

4. **Set up quick replies** (optional):
   - `/start` → "Welcome! What can I help you with today?"
   - `/trial` → "Your trial gives you 7 days of full access..."
   - `/payment` → "We accept all major cards via PayFast..."

5. **Use labels** to organize conversations:
   - 🔵 Trial Users
   - 💳 Payment Issues
   - 💡 Feature Requests
   - ✅ Resolved

---

## 💻 Usage Examples

### Creating a Notification (Edge Function)

```typescript
// Call from anywhere (cron job, user action, etc.)
const response = await fetch('https://your-project.supabase.co/functions/v1/create-notification', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user-uuid',
    type: 'trial_ending',
    data: {} // Optional additional data
  })
});
```

### Creating a Notification (Direct SQL)

```sql
INSERT INTO notifications (
  user_id, type, title, message,
  action_label, action_url,
  whatsapp_help_label, whatsapp_help_text,
  priority, expires_at
) VALUES (
  'user-uuid',
  'milestone',
  '🎉 Milestone reached!',
  'You just recorded your 50th transaction!',
  NULL, NULL,
  'Share your achievement',
  'I just hit 50 transactions tracking my business! 🎉',
  'low',
  NOW() + INTERVAL '30 days'
);
```

### Using wa.me Links in Components

```javascript
import { createWaMeLink, openWhatsApp } from '../utils/waMeLinks';

// Create link
const link = createWaMeLink('Hi, I need help with my account');

// Open WhatsApp
openWhatsApp('Hi, I need help with my account');

// Support button
<SupportButton context="recording transactions" />
```

---

## 📊 Scheduled Notifications (Cron Jobs)

### Using Supabase pg_cron

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Trial Day 3 check-in (runs daily at 10 AM)
SELECT cron.schedule(
  'trial-day-3-checkin',
  '0 10 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/create-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb,
    body := jsonb_build_object('userId', id, 'type', 'trial_day_3')
  )
  FROM users
  WHERE subscription_status = 'trial'
    AND DATE(created_at) = CURRENT_DATE - INTERVAL '3 days'
    AND NOT EXISTS (
      SELECT 1 FROM notifications 
      WHERE user_id = users.id AND type = 'trial_day_3'
    );
  $$
);

-- Trial ending reminder (runs daily at 9 AM)
SELECT cron.schedule(
  'trial-ending-reminder',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/create-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb,
    body := jsonb_build_object('userId', id, 'type', 'trial_ending')
  )
  FROM users
  WHERE subscription_status = 'trial'
    AND trial_end_date <= CURRENT_DATE + INTERVAL '1 day'
    AND trial_end_date > CURRENT_DATE;
  $$
);

-- Weekly summary (Sunday 6 PM)
SELECT cron.schedule(
  'weekly-summary',
  '0 18 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/generate-weekly-summary',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb,
    body := jsonb_build_object('userId', id)
  )
  FROM users
  WHERE subscription_status IN ('trial', 'active');
  $$
);
```

### Alternative: GitHub Actions Cron

```yaml
# .github/workflows/notifications.yml
name: Scheduled Notifications

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM
  workflow_dispatch:

jobs:
  send-notifications:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger notification function
        run: |
          curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/create-notification \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"userId": "...", "type": "trial_ending"}'
```

---

## 📈 Analytics & Optimization

### Track Engagement

```sql
-- Notification engagement by type
SELECT 
  type,
  COUNT(*) as total_sent,
  SUM(CASE WHEN read THEN 1 ELSE 0 END) as read_count,
  SUM(CASE WHEN action_clicked THEN 1 ELSE 0 END) as action_clicks,
  SUM(CASE WHEN whatsapp_clicked THEN 1 ELSE 0 END) as whatsapp_clicks,
  ROUND(100.0 * SUM(CASE WHEN read THEN 1 ELSE 0 END) / COUNT(*), 2) as read_rate,
  ROUND(100.0 * SUM(CASE WHEN action_clicked THEN 1 ELSE 0 END) / COUNT(*), 2) as action_rate,
  ROUND(100.0 * SUM(CASE WHEN whatsapp_clicked THEN 1 ELSE 0 END) / COUNT(*), 2) as whatsapp_rate
FROM notifications
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY type
ORDER BY total_sent DESC;
```

### User Preferences

```sql
-- Check which notification types users disable
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN trial_reminders THEN 1 ELSE 0 END) as trial_reminders_enabled,
  SUM(CASE WHEN payment_reminders THEN 1 ELSE 0 END) as payment_reminders_enabled,
  SUM(CASE WHEN milestone_celebrations THEN 1 ELSE 0 END) as milestones_enabled,
  SUM(CASE WHEN weekly_summaries THEN 1 ELSE 0 END) as weekly_summaries_enabled
FROM notification_preferences;
```

---

## 🎨 UI Components

### NotificationBadge (Header)

Shows unread count with real-time updates:
```jsx
<NotificationBadge />
```

### NotificationsPage

Full notification list with actions:
```jsx
<Route path="/notifications" element={<Notifications />} />
```

### SupportButton

Reusable support button anywhere:
```jsx
<SupportButton context="recording transactions" />
```

---

## 🔧 Troubleshooting

### Notifications Not Appearing

1. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'notifications';
   ```

2. **Check user preferences:**
   ```sql
   SELECT * FROM notification_preferences WHERE user_id = 'user-uuid';
   ```

3. **Check expiration:**
   ```sql
   SELECT * FROM notifications 
   WHERE user_id = 'user-uuid' 
   AND (expires_at IS NULL OR expires_at > NOW());
   ```

### wa.me Links Not Working

1. **Verify phone number format:**
   - Should be: `27XXXXXXXXX` (no +, no spaces)
   - Example: `27812345678`

2. **Check URL encoding:**
   - Use `encodeURIComponent()` for messages
   - Test link manually in browser

3. **Test on mobile device:**
   - wa.me links work best on mobile
   - Desktop may require WhatsApp Web

---

## 💰 Cost Comparison

| Feature | WhatsApp API | wa.me Links |
|---------|-------------|-------------|
| Setup Time | 1-3 weeks | 1 hour |
| Monthly Cost | R300+ | R0 |
| Rate Limits | Yes | No |
| Approval Required | Yes | No |
| Webhook Handling | Required | Not needed |
| User Trust | Medium | High |

**Annual Savings at 10,000 users: R36,000+**

---

## ✅ Checklist

### Setup
- [ ] Database migration applied
- [ ] Edge Function deployed
- [ ] Environment variables set
- [ ] WhatsApp Business app installed
- [ ] Business profile configured

### Testing
- [ ] Create test notification
- [ ] Verify notification appears in-app
- [ ] Test wa.me link opens WhatsApp
- [ ] Test action buttons navigate correctly
- [ ] Test mark as read/dismiss
- [ ] Test real-time updates

### Production
- [ ] Cron jobs configured
- [ ] Analytics queries tested
- [ ] Support team trained
- [ ] Quick replies set up
- [ ] Labels configured

---

## 📚 Additional Resources

- **wa.me Documentation:** https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat
- **Supabase pg_cron:** https://supabase.com/docs/guides/database/extensions/pg_cron
- **WhatsApp Business:** https://www.whatsapp.com/business

---

**Built with 🐝 for South African entrepreneurs**

*Simple, free, and effective user engagement*

---

**Last Updated:** December 13, 2024  
**Status:** ✅ Complete & Production Ready


