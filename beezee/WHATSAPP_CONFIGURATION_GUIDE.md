# 📱 WhatsApp Notifications - Configuration Guide

## Overview

This guide walks you through setting up WhatsApp notifications for BeeZee using Twilio's WhatsApp Business API.

---

## 🎯 Prerequisites

1. **Twilio Account** (www.twilio.com)
2. **WhatsApp Business Profile** (approved by Twilio)
3. **Supabase Project** (for Edge Functions)
4. **Business Phone Number** (South African recommended)

---

## 📋 Step-by-Step Setup

### 1. Create Twilio Account

```bash
# Sign up at: https://www.twilio.com/try-twilio
# Verify your email and phone number
# Note your Account SID and Auth Token
```

**Cost Estimate:**
- Trial: $15.50 free credit
- Production: ~$0.005 per WhatsApp message
- SA messages: ~$0.0042 per message

### 2. Set Up WhatsApp Sandbox (Testing)

For development and testing:

1. Go to **Twilio Console → Messaging → Try it out → Send a WhatsApp message**
2. Join the sandbox by sending the code to the Twilio number:
   ```
   join <your-sandbox-code>
   ```
3. Note your sandbox number (e.g., `whatsapp:+14155238886`)

**Sandbox Limitations:**
- Only works with registered phone numbers
- Must "join" sandbox before receiving messages
- Not suitable for production

### 3. Request WhatsApp Business API Access (Production)

For production use:

1. Go to **Twilio Console → Messaging → Senders → WhatsApp senders**
2. Click **Request Access to WhatsApp**
3. Fill out business information:
   - **Business Name:** BeeZee Finance
   - **Category:** Financial Services
   - **Description:** Simple finance tracking for informal businesses
   - **Website:** https://beezee.app
   - **Business Address:** (Your SA address)

4. Provide a South African business phone number
5. Wait for approval (1-3 business days)

**Requirements:**
- Facebook Business Manager account
- Verified business details
- SA business registration (recommended)

### 4. Configure WhatsApp Business Profile

Once approved:

1. **Profile Picture:** Upload BeeZee logo
2. **About:** "Making financial management accessible to South African entrepreneurs"
3. **Business Hours:** 24/7 (automated)
4. **Business Category:** Financial Services

### 5. Create Message Templates

WhatsApp requires pre-approved templates for proactive messages.

**Templates to create:**

#### Template 1: Welcome Message
```
Name: beezee_welcome
Category: ACCOUNT_UPDATE
Language: English

Body:
Welcome to BeeZee! 🎉

Your 7-day free trial has started.

Quick tips:
- Tap the mic to record sales and expenses
- Scan receipts with your camera
- Ask the coach any business questions

Need help? Reply to this message anytime!
```

#### Template 2: Trial Ending
```
Name: beezee_trial_ending
Category: ACCOUNT_UPDATE
Language: English

Body:
Just a reminder: Your free trial ends tomorrow.

You've recorded R{{1}} in sales so far! 🎯

Want to keep your business on track?
Subscribe for only R55.50/month.

{{2}}
```

#### Template 3: Weekly Summary
```
Name: beezee_weekly_summary
Category: ACCOUNT_UPDATE
Language: English

Body:
Your week at a glance:

💰 Money in: R{{1}}
💸 Money out: R{{2}}
📊 Profit: R{{3}}

View full report: {{4}}
```

#### Template 4: Payment Reminder
```
Name: beezee_payment_reminder
Category: PAYMENT_UPDATE
Language: English

Body:
Friendly reminder:

Your subscription renews in 3 days (R55.50).

No action needed if payment method is ready.

Questions? Reply here anytime.
```

**Submit for approval:**
1. Go to **Content Templates** in Twilio Console
2. Create each template
3. Submit for WhatsApp approval (24-48 hours)

### 6. Configure Environment Variables

Add these to your Supabase project:

```bash
# Supabase Dashboard → Project Settings → Edge Functions → Secrets

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886  # Sandbox for testing
BUSINESS_WHATSAPP_NUMBER=27812345678  # Your SA number (no + or spaces)
APP_NAME=BeeZee
APP_URL=https://beezee.app
```

**Set via CLI:**
```bash
supabase secrets set TWILIO_ACCOUNT_SID=ACxxxxx
supabase secrets set TWILIO_AUTH_TOKEN=your_token
supabase secrets set TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
supabase secrets set BUSINESS_WHATSAPP_NUMBER=27812345678
supabase secrets set APP_NAME=BeeZee
supabase secrets set APP_URL=https://beezee.app
```

### 7. Deploy Edge Function

```bash
cd beezee

# Deploy notification-trigger function
supabase functions deploy notification-trigger

# Test it
curl -X POST https://your-project.supabase.co/functions/v1/notification-trigger \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "notification_type": "welcome"
  }'
```

### 8. Configure Webhooks (Optional)

For delivery status updates:

1. Go to **Twilio Console → Messaging → Settings → WhatsApp sender**
2. Set **Status Callback URL:**
   ```
   https://your-project.supabase.co/functions/v1/whatsapp-webhook
   ```
3. Enable events: `sent`, `delivered`, `read`, `failed`

---

## 🧪 Testing

### Test 1: Send Welcome Message

```bash
# Via Supabase CLI
supabase functions invoke notification-trigger --data '{
  "user_id": "your-test-user-id",
  "notification_type": "welcome"
}'
```

### Test 2: Send to Your Number

1. Join the Twilio sandbox (if using sandbox)
2. Update test user's `whatsapp_number` in database
3. Set `whatsapp_opted_in = true` in `notification_preferences`
4. Trigger notification
5. Check your WhatsApp

### Test 3: Check Logs

```bash
# View Edge Function logs
supabase functions logs notification-trigger --tail

# Check for errors
supabase functions logs notification-trigger | grep ERROR
```

---

## 📊 Monitoring & Analytics

### Twilio Console

Monitor in **Twilio Console → Monitor → Logs → WhatsApp**:
- Message delivery status
- Error codes
- Delivery time
- Cost per message

### Supabase Dashboard

Track in your database:

```sql
-- Total notifications sent
SELECT 
  notification_type, 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed
FROM notifications
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY notification_type;

-- Delivery rate by type
SELECT 
  notification_type,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'delivered') / COUNT(*), 2) as delivery_rate
FROM notifications
WHERE sent_at > NOW() - INTERVAL '30 days'
GROUP BY notification_type;

-- Analytics events
SELECT 
  event_type,
  COUNT(*) as total
FROM notification_analytics
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY event_type;
```

---

## 💰 Cost Management

### Pricing (as of 2024)

- **Sandbox:** Free for testing
- **Business API:** ~$0.0042 per message (SA)
- **Templates:** Free to create
- **Incoming messages:** Free

### Monthly Cost Estimates

| Users | Notifications/User/Month | Total Messages | Monthly Cost |
|-------|-------------------------|----------------|--------------|
| 100   | 10                      | 1,000          | $4.20        |
| 500   | 10                      | 5,000          | $21.00       |
| 1,000 | 10                      | 10,000         | $42.00       |
| 5,000 | 10                      | 50,000         | $210.00      |

**Optimization Strategies:**
1. Limit notifications to 2 per week (except urgent)
2. Batch weekly summaries
3. Skip inactivity nudges for inactive users
4. Combine multiple insights into one message

### Cost Alerts

Set up in **Twilio Console → Billing → Usage Alerts**:
- Alert when spending exceeds $50/month
- Alert when message count exceeds 10,000/month
- Daily spending summary email

---

## 🚨 Error Handling

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 21211 | Invalid To number | Verify phone number format |
| 21610 | Unsubscribed user | Remove from notification list |
| 21408 | Permission denied | User must opt-in first |
| 63030 | Template not approved | Wait for template approval |
| 63016 | Template variables mismatch | Check template parameters |

### Retry Logic

In `notification-trigger/index.ts`, we handle:
- **Failed delivery:** Retry once after 1 hour
- **Rate limits:** Queue and retry later
- **Invalid numbers:** Fall back to SMS
- **User blocks:** Stop sending, flag account

---

## 🔒 Compliance & Best Practices

### POPIA Compliance (SA)

1. **Consent:** Get explicit opt-in before sending
2. **Opt-out:** Easy unsubscribe (reply "STOP")
3. **Purpose:** Only send relevant notifications
4. **Storage:** Keep WhatsApp number secure
5. **Audit:** Log all consent and opt-out events

### WhatsApp Business Policy

✅ **Allowed:**
- Account updates
- Payment reminders
- Transaction summaries
- Educational content
- Customer support

❌ **Not Allowed:**
- Marketing without consent
- Third-party promotions
- Spam
- Chain messages
- Misleading information

### Rate Limits

- **Sandbox:** 100 messages/day
- **Business API:** Tier-based (starts at 1,000/day)
- **Per user:** Max 2 messages/day (recommended)

**Request rate limit increase:**
1. Demonstrate good delivery rates (>90%)
2. Low block rates (<5%)
3. Active user engagement
4. Business case for higher volume

---

## 🔧 Troubleshooting

### Issue: Messages not sending

**Diagnosis:**
```bash
# Check Edge Function logs
supabase functions logs notification-trigger --tail

# Check Twilio logs
# Twilio Console → Monitor → Logs
```

**Solutions:**
- Verify environment variables set
- Check Twilio account balance
- Confirm WhatsApp number format
- Verify user opted in

### Issue: Template variables not working

**Problem:** Variables like `{{1}}` not replaced

**Solution:**
```typescript
// Correct Twilio API call with content variables
body: new URLSearchParams({
  From: TWILIO_WHATSAPP_NUMBER,
  To: whatsappNumber,
  Body: templateSid,  // Use template SID
  ContentVariables: JSON.stringify({
    "1": "150.50",
    "2": "https://beezee.app/subscribe"
  })
})
```

### Issue: High failure rate

**Diagnosis:**
```sql
SELECT 
  error_message,
  COUNT(*) as occurrences
FROM notifications
WHERE status = 'failed'
  AND sent_at > NOW() - INTERVAL '7 days'
GROUP BY error_message
ORDER BY occurrences DESC;
```

**Common causes:**
- Invalid phone numbers
- Users haven't joined sandbox
- Template not approved
- Rate limits exceeded

---

## 📱 Alternative: Plivo

If you prefer Plivo over Twilio:

### Plivo Setup

1. Sign up at https://www.plivo.com
2. Get WhatsApp Business API access
3. Set environment variables:
   ```bash
   PLIVO_AUTH_ID=your_auth_id
   PLIVO_AUTH_TOKEN=your_auth_token
   PLIVO_WHATSAPP_NUMBER=your_number
   ```

4. Update Edge Function to use Plivo API:
   ```typescript
   const plivoUrl = `https://api.plivo.com/v1/Account/${PLIVO_AUTH_ID}/Message/`;
   const auth = btoa(`${PLIVO_AUTH_ID}:${PLIVO_AUTH_TOKEN}`);
   
   await fetch(plivoUrl, {
     method: 'POST',
     headers: {
       'Authorization': `Basic ${auth}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       src: PLIVO_WHATSAPP_NUMBER,
       dst: whatsappNumber,
       text: message,
       type: 'whatsapp'
     })
   });
   ```

### Plivo vs Twilio

| Feature | Twilio | Plivo |
|---------|--------|-------|
| Ease of setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| SA pricing | $0.0042/msg | $0.0038/msg |
| Template approval | 24-48 hrs | 24-48 hrs |
| Support | Excellent | Good |
| Documentation | Excellent | Good |

**Recommendation:** Start with Twilio (better docs), switch to Plivo if cost becomes critical.

---

## 🎓 Best Practices

### Do's ✅

1. **Always get explicit consent** before sending WhatsApp messages
2. **Provide value first** - first 3 messages should be purely helpful
3. **Respect quiet hours** - no messages 9pm-7am
4. **Keep messages short** - under 160 characters when possible
5. **Include clear CTAs** - tell users what to do next
6. **Track metrics** - monitor delivery, read, and click rates
7. **Test thoroughly** - use sandbox before going live
8. **Handle opt-outs immediately** - respect user preferences

### Don'ts ❌

1. **Don't spam** - max 2 messages/week
2. **Don't send marketing** without explicit consent
3. **Don't use URL shorteners** - WhatsApp may block
4. **Don't send large images** - keep under 5MB
5. **Don't ignore errors** - fix delivery issues promptly
6. **Don't hardcode numbers** - use environment variables
7. **Don't forget logging** - track all notifications

---

## 📚 Additional Resources

- **Twilio Docs:** https://www.twilio.com/docs/whatsapp
- **WhatsApp Business Policy:** https://www.whatsapp.com/legal/business-policy
- **Plivo Docs:** https://www.plivo.com/docs/messaging/whatsapp
- **POPIA Compliance:** https://popia.co.za
- **Message Templates Guide:** https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates

---

## ✅ Configuration Checklist

Before going live:

- [ ] Twilio account created and verified
- [ ] WhatsApp Business API approved
- [ ] Business profile configured
- [ ] All message templates created and approved
- [ ] Environment variables set in Supabase
- [ ] Edge Function deployed and tested
- [ ] Webhooks configured (optional)
- [ ] Tested with real WhatsApp numbers
- [ ] Monitoring and alerts set up
- [ ] Cost alerts configured
- [ ] POPIA compliance verified
- [ ] Opt-in/opt-out flows tested
- [ ] Documentation completed

---

## 🆘 Support

**Twilio Support:**
- Help Center: https://support.twilio.com
- Community: https://www.twilio.com/community
- Email: help@twilio.com

**BeeZee Support:**
- Email: support@beezee.app
- GitHub Issues: https://github.com/beezee/issues

---

**Last Updated:** December 13, 2024  
**Version:** 1.0

---

**Built with 🐝 for South African entrepreneurs**


