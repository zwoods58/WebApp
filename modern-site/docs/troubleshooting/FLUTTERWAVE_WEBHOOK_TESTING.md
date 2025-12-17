# Flutterwave Webhook Testing Guide

## Overview

This guide explains how to set up and test Flutterwave webhooks for local development and testing.

---

## Webhook Endpoint

Your webhook endpoint is:
```
https://your-domain.com/api/ai-builder/payments/webhook
```

For local testing, you'll need to expose your local server using a tunnel service.

---

## Local Testing Setup

### Option 1: Using ngrok (Recommended)

1. **Install ngrok**:
   ```bash
   # Download from https://ngrok.com/download
   # Or using npm:
   npm install -g ngrok
   ```

2. **Start your Next.js dev server**:
   ```bash
   npm run dev
   # Server runs on http://localhost:3000
   ```

3. **Start ngrok tunnel**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL**:
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```

5. **Use this URL in Flutterwave**:
   ```
   https://abc123.ngrok.io/api/ai-builder/payments/webhook
   ```

### Option 2: Using Cloudflare Tunnel (Alternative)

1. **Install cloudflared**:
   ```bash
   # Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation
   ```

2. **Start tunnel**:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Use the provided HTTPS URL** in Flutterwave dashboard

### Option 3: Using localtunnel

1. **Install localtunnel**:
   ```bash
   npm install -g localtunnel
   ```

2. **Start tunnel**:
   ```bash
   lt --port 3000
   ```

3. **Use the provided URL** in Flutterwave dashboard

---

## Setting Up Webhook in Flutterwave Dashboard

### Step 1: Get Your Webhook Secret Hash

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to **Settings** → **Webhooks**
3. Click **Add Webhook** or **Edit** existing webhook
4. Set the webhook URL:
   ```
   https://your-ngrok-url.ngrok.io/api/ai-builder/payments/webhook
   ```
5. **Copy the Secret Hash** (you'll need this for verification)
6. Add it to your `.env.local`:
   ```env
   FLUTTERWAVE_SECRET_HASH=your_secret_hash_here
   ```

### Step 2: Select Webhook Events

Enable these events in Flutterwave dashboard:

✅ **Required Events:**
- `charge.completed` - Payment completed
- `charge.failed` - Payment failed
- `subscription.charged` - Subscription renewal
- `subscription.cancelled` - Subscription cancelled

**Optional Events (for better tracking):**
- `charge.pending` - Payment pending
- `charge.refunded` - Refund processed
- `subscription.created` - Subscription created
- `subscription.expired` - Subscription expired

### Step 3: Save Webhook Configuration

Click **Save** to activate the webhook.

---

## Testing Webhooks

### Test 1: Payment Success Webhook

1. **Make a test payment**:
   - Go to your app
   - Try subscribing to Pro plan or purchasing buyout
   - Use test card: `5531886652142950`
   - Complete payment

2. **Check webhook received**:
   - Check your terminal/console for webhook logs
   - Verify payment status updated in database
   - Check Flutterwave dashboard → **Webhooks** → **Logs**

### Test 2: Payment Failure Webhook

1. **Use declined test card**:
   - Card: `4084084084084081`
   - Complete payment attempt

2. **Verify webhook**:
   - Check webhook logs
   - Verify error handling

### Test 3: Subscription Renewal Webhook

1. **Set up test subscription**:
   - Subscribe to Pro plan
   - Wait for renewal (or trigger manually in Flutterwave dashboard)

2. **Check renewal webhook**:
   - Verify `subscription.charged` event received
   - Check subscription status updated

### Test 4: Subscription Cancellation Webhook

1. **Cancel subscription**:
   - Use cancel subscription button in dashboard
   - Or cancel in Flutterwave dashboard

2. **Verify cancellation webhook**:
   - Check `subscription.cancelled` event received
   - Verify subscription status updated

---

## Webhook Verification

### How It Works

The webhook handler verifies requests using:

1. **Secret Hash Verification**:
   ```typescript
   const hash = request.headers.get('verif-hash')
   if (hash !== process.env.FLUTTERWAVE_SECRET_HASH) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }
   ```

2. **Event Processing**:
   - `charge.completed` → Updates subscription/buyout status
   - `subscription.charged` → Processes renewal
   - `subscription.cancelled` → Cancels subscription

### Debugging Webhooks

1. **Check Webhook Logs**:
   ```bash
   # In your terminal where npm run dev is running
   # You'll see webhook requests logged
   ```

2. **Flutterwave Dashboard Logs**:
   - Go to **Settings** → **Webhooks** → **Logs**
   - See all webhook attempts and responses
   - Check status codes (200 = success, 4xx/5xx = error)

3. **Add Logging** (if needed):
   ```typescript
   // In webhook handler
   console.log('Webhook received:', {
     event: body.event,
     data: body.data,
     timestamp: new Date().toISOString()
   })
   ```

---

## Common Issues & Solutions

### Issue 1: Webhook Not Receiving Events

**Solution:**
- Verify webhook URL is correct (check for typos)
- Ensure ngrok/tunnel is running
- Check Flutterwave dashboard → Webhooks → Logs for errors
- Verify webhook events are enabled

### Issue 2: "Unauthorized" Error (401)

**Solution:**
- Check `FLUTTERWAVE_SECRET_HASH` matches Flutterwave dashboard
- Restart dev server after adding secret hash
- Verify secret hash copied correctly (no extra spaces)

### Issue 3: Webhook Timeout

**Solution:**
- Ensure webhook handler responds quickly (< 5 seconds)
- Check database connection is working
- Verify no blocking operations in webhook handler

### Issue 4: Events Not Processing

**Solution:**
- Check webhook handler logs for errors
- Verify event type matches handler logic
- Check database tables exist and have correct schema
- Verify user accounts exist in database

---

## Production Webhook Setup

### For Production:

1. **Use Production Domain**:
   ```
   https://yourdomain.com/api/ai-builder/payments/webhook
   ```

2. **Get Production Secret Hash**:
   - Flutterwave Dashboard → Settings → Webhooks
   - Copy production webhook secret hash
   - Add to production environment variables

3. **Enable All Required Events**:
   - `charge.completed`
   - `charge.failed`
   - `subscription.charged`
   - `subscription.cancelled`

4. **Test in Production**:
   - Make a small test payment
   - Verify webhook received and processed
   - Check webhook logs in Flutterwave dashboard

---

## Webhook Events Handled

Your webhook handler processes these events:

| Event | Description | Action |
|-------|-------------|--------|
| `charge.completed` | Payment successful | Updates subscription/buyout status |
| `charge.failed` | Payment failed | Logs failure, may trigger grace period |
| `subscription.charged` | Subscription renewed | Updates subscription expiry date |
| `subscription.cancelled` | Subscription cancelled | Updates subscription status to cancelled |

---

## Quick Test Checklist

- [ ] ngrok/tunnel running and accessible
- [ ] Webhook URL added to Flutterwave dashboard
- [ ] Secret hash copied to `.env.local`
- [ ] Webhook events enabled in Flutterwave
- [ ] Dev server restarted after adding secret hash
- [ ] Test payment made
- [ ] Webhook received (check logs)
- [ ] Payment status updated in database

---

## Environment Variables Needed

```env
# Flutterwave Webhook Secret Hash
FLUTTERWAVE_SECRET_HASH=your_secret_hash_from_flutterwave_dashboard

# Other Flutterwave credentials
FLUTTERWAVE_PUBLIC_KEY=14e67305-fa27-4750-a78e-ee1a2a0164ae
FLUTTERWAVE_SECRET_KEY=29hOnb4XREOjq8kKBV47xsALWD8UEpn8
FLUTTERWAVE_ENCRYPTION_KEY=7utUKn/NP4eMepW0xeS5eDnfc1Fj8Iu+vyXS48DYTHE=
```

---

## Next Steps

1. **Set up ngrok** (or alternative tunnel)
2. **Add webhook URL** to Flutterwave dashboard
3. **Copy secret hash** to `.env.local`
4. **Restart dev server**
5. **Make test payment**
6. **Verify webhook received** and processed

For more details, see:
- `docs/FLUTTERWAVE_RECURRING_PAYMENTS.md` - Recurring payments setup
- `docs/ENVIRONMENT_VARIABLES.md` - All environment variables

