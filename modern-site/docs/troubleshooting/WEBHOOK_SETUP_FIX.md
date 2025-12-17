# Fixing Flutterwave Webhook 500 Error

## The Problem

You're getting a **500 Internal Server Error** from Flutterwave when trying to save the webhook. This happens because:

1. ❌ Flutterwave tries to **validate** your webhook URL before saving
2. ❌ The localtunnel URL (`atarwebb-test.loca.lt`) is not accessible
3. ❌ Validation fails → 500 error

## Quick Fix Options

### Option 1: Use ngrok (Most Reliable) ⭐ RECOMMENDED

**Why ngrok is better:**
- ✅ More stable than localtunnel
- ✅ Better for Flutterwave validation
- ✅ Free account available

**Steps:**

1. **Sign up:** https://ngrok.com (free)
2. **Download:** https://ngrok.com/download
3. **Install:** Extract and add to PATH, or use:
   ```bash
   choco install ngrok
   ```
4. **Authenticate:**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```
5. **Start tunnel:**
   ```bash
   ngrok http 3000
   ```
6. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)
7. **Use in Flutterwave:**
   ```
   https://your-ngrok-url.ngrok.io/api/ai-builder/payments/webhook
   ```

### Option 2: Deploy to Vercel (Best for Testing)

**Why Vercel:**
- ✅ Real HTTPS URL (always accessible)
- ✅ No tunnel needed
- ✅ Free tier available

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Use production URL:**
   ```
   https://your-app.vercel.app/api/ai-builder/payments/webhook
   ```

### Option 3: Fix Localtunnel

If you want to keep using localtunnel:

1. **Make sure dev server is running:**
   ```bash
   npm run dev
   ```

2. **Start tunnel in NEW terminal:**
   ```bash
   lt --port 3000
   ```

3. **Wait for URL** (e.g., `https://random-name.loca.lt`)

4. **Test URL in browser:**
   ```
   https://your-tunnel-url.loca.lt/api/ai-builder/payments/webhook
   ```
   Should show error (expected - needs POST), but confirms it's reachable

5. **Use in Flutterwave:**
   ```
   https://your-tunnel-url.loca.lt/api/ai-builder/payments/webhook
   ```

## Why Localtunnel Failed

Localtunnel URLs can:
- ❌ Expire after inactivity
- ❌ Have connection issues
- ❌ Not be accessible from Flutterwave's servers
- ❌ Require the tunnel to stay active

## Recommended Solution

**For Development:** Use **ngrok**
**For Production:** Use your **production domain**

## After Getting Working URL

1. **Paste URL in Flutterwave:**
   ```
   https://your-working-url/api/ai-builder/payments/webhook
   ```

2. **Add Secret Hash:**
   ```
   7VkrUQadPK/RVinmOu5/Bz4PVsdngavtIYJTsjmzhVs=
   ```

3. **Save** - Should work now!

4. **Add to `.env.local`:**
   ```env
   FLUTTERWAVE_SECRET_HASH=7VkrUQadPK/RVinmOu5/Bz4PVsdngavtIYJTsjmzhVs=
   ```

5. **Restart dev server**

---

## Need Help?

If you're still getting errors:
1. Try **ngrok** (most reliable)
2. Or **deploy to Vercel** for stable testing
3. Check Flutterwave dashboard → Webhooks → Logs for details

