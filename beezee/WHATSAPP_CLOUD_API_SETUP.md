# WhatsApp Cloud API Setup Guide

## Overview

WhatsApp Cloud API is Meta's official API for sending WhatsApp messages. It's free for up to 1,000 conversations/month, perfect for OTP codes and notifications.

## Prerequisites

- Facebook account (personal)
- Business email address
- Phone number for verification
- Business name (can be your app name)

## Step-by-Step Setup

### Step 1: Create Meta Business Account

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Click **"Create Account"** or **"Get Started"**
3. Enter your business details:
   - Business name: `BeeZee Finance` (or your app name)
   - Your name
   - Business email
4. Verify your email address
5. Complete the business account setup

**Note:** You can use your personal Facebook account, but you'll need to create a Business Account.

---

### Step 2: Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as the app type
4. Fill in:
   - App name: `BeeZee Finance` (or your app name)
   - App contact email: Your email
   - Business account: Select the one you created
5. Click **"Create App"**

---

### Step 3: Add WhatsApp Product

1. In your app dashboard, go to **"Add Products"**
2. Find **"WhatsApp"** and click **"Set Up"**
3. You'll be taken to the WhatsApp setup page

---

### Step 4: Get Your Phone Number ID

1. In the WhatsApp setup page, you'll see **"Getting Started"**
2. You'll need to add a phone number:
   - Click **"Add phone number"**
   - Enter a phone number (can be your business number)
   - Verify it via SMS/call
3. Once verified, you'll see:
   - **Phone Number ID**: `123456789012345` (save this!)
   - **WhatsApp Business Account ID**: `123456789012345` (save this!)

---

### Step 5: Get Your Access Token

1. In the WhatsApp setup page, scroll to **"API Setup"**
2. You'll see **"Temporary access token"** (valid for 24 hours)
3. Click **"Generate token"** to create a permanent token:
   - Select permissions: `whatsapp_business_messaging`, `whatsapp_business_management`
   - Click **"Generate Token"**
   - **Copy and save this token** (you won't see it again!)

**Important:** Store this token securely. You'll need it for API calls.

---

### Step 6: Get Your App ID and App Secret

1. Go to **Settings** → **Basic** in your app dashboard
2. You'll see:
   - **App ID**: `1234567890123456` (save this!)
   - **App Secret**: Click **"Show"** and copy it (save this!)

---

### Step 7: Configure Webhook (Optional, for receiving messages)

1. Go to **WhatsApp** → **Configuration** in your app dashboard
2. Under **"Webhook"**, click **"Edit"**
3. Enter:
   - **Callback URL**: `https://your-project.supabase.co/functions/v1/whatsapp-webhook`
   - **Verify Token**: Create a random string (save this!)
4. Click **"Verify and Save"**

**Note:** You'll need to create the webhook endpoint in Supabase Edge Functions.

---

## What You'll Need for Your App

After setup, you'll have:

1. **Phone Number ID**: `123456789012345`
2. **Access Token**: `EAABwzLix...` (long string)
3. **App ID**: `1234567890123456`
4. **App Secret**: `abc123...` (for token refresh)
5. **WhatsApp Business Account ID**: `123456789012345`

---

## Free Tier Limits

- **1,000 conversations/month** (free)
- **Conversation**: 24-hour window after user's last message
- **After free tier**: ~$0.005-0.01 per conversation

**What counts as a conversation:**
- User sends you a message → 1 conversation
- You send user a message → 1 conversation (if within 24 hours of their last message)
- After 24 hours, new message = new conversation

---

## Message Templates (Required for Notifications)

WhatsApp requires message templates for notifications (not replies to user messages).

### Create a Template:

1. Go to **WhatsApp** → **Message Templates** in your app dashboard
2. Click **"Create Template"**
3. Fill in:
   - **Name**: `otp_verification`
   - **Category**: `AUTHENTICATION`
   - **Language**: `English`
   - **Content**: 
     ```
     Your BeeZee verification code is: {{1}}
     
     This code expires in 10 minutes.
     ```
   - **Variables**: Add variable `{{1}}` for the OTP code
4. Submit for approval (usually instant for authentication templates)

### Template Categories:

- **AUTHENTICATION**: OTP codes, login codes
- **UTILITY**: Confirmations, updates
- **MARKETING**: Promotions (requires more approval)

---

## Testing

### Test Phone Numbers:

1. Go to **WhatsApp** → **API Setup**
2. Scroll to **"To"** field
3. Add test phone numbers (up to 5)
4. These numbers can receive messages without templates

### Send Test Message:

```bash
curl -X POST "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "27812345678",
    "type": "text",
    "text": {
      "body": "Hello! This is a test message."
    }
  }'
```

---

## Environment Variables Needed

Add these to your `.env.local` and Supabase Edge Functions:

```env
# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAABwzLix...
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WHATSAPP_APP_ID=1234567890123456
WHATSAPP_APP_SECRET=abc123...
WHATSAPP_API_VERSION=v18.0
```

---

## Security Best Practices

1. **Never commit tokens to Git** - Use environment variables
2. **Store tokens securely** - Use Supabase Secrets or environment variables
3. **Rotate tokens regularly** - Regenerate access tokens periodically
4. **Use webhook verification** - Verify webhook requests are from Meta
5. **Rate limiting** - Implement rate limiting to avoid abuse

---

## Common Issues

### "Invalid OAuth access token"
- Token expired (regenerate in Meta dashboard)
- Wrong token (check you're using the right one)

### "Template not approved"
- Wait for template approval (usually instant for AUTHENTICATION)
- Check template format is correct

### "Phone number not registered"
- Add phone number in Meta dashboard
- Verify phone number is correct

### "Rate limit exceeded"
- You've exceeded free tier (1,000 conversations/month)
- Wait for next month or upgrade

---

## Next Steps

After setup:

1. ✅ Save all credentials securely
2. ✅ Create message templates
3. ✅ Test with your phone number
4. ✅ Update Edge Functions to use API
5. ✅ Replace `wa.me` links with API calls

---

## Resources

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta for Developers](https://developers.facebook.com/)
- [WhatsApp Business API Pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- [Message Templates Guide](https://developers.facebook.com/docs/whatsapp/message-templates)

---

## Support

If you get stuck:
- Check Meta's documentation
- Facebook Developer Community
- WhatsApp Business API Support (if you have access)


