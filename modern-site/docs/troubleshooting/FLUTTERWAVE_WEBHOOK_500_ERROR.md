# Fixing Flutterwave 500 Error When Saving Webhook

## The Problem

You're seeing a **500 Internal Server Error** from Flutterwave when trying to save the webhook configuration. This happens because Flutterwave tries to **validate** the webhook URL before saving it, and the validation is failing.

## Why This Happens

Flutterwave's API validates webhook URLs by:
1. Making a test request to your webhook URL
2. Checking if it responds correctly
3. If validation fails → 500 error

Common causes:
- ❌ Webhook URL not accessible from internet
- ❌ Webhook endpoint doesn't respond correctly
- ❌ Tunnel (localtunnel) not running or unstable
- ❌ CORS or security issues

## Solutions

### Solution 1: Use a More Stable Tunnel (Recommended)

**Option A: Use ngrok (Most Reliable)**

1. **Sign up for free ngrok account:**
   - Go to https://ngrok.com
   - Sign up (free)
   - Get your auth token

2. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or using chocolatey:
   choco install ngrok
   ```

3. **Authenticate:**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. **Start tunnel:**
   ```bash
   ngrok http 3000
   ```

5. **Use the HTTPS URL** shown (e.g., `https://abc123.ngrok.io`)

6. **Update webhook URL:**
   ```
   https://your-ngrok-url.ngrok.io/api/ai-builder/payments/webhook
   ```

**Option B: Deploy to Vercel (Best for Production Testing)**

1. **Deploy your app:**
   ```bash
   vercel
   ```

2. **Use production URL:**
   ```
   https://your-app.vercel.app/api/ai-builder/payments/webhook
   ```

### Solution 2: Make Webhook Endpoint More Accessible

The webhook endpoint needs to respond to Flutterwave's validation request. Let's add a test endpoint:

**Test if your webhook is accessible:**

Try accessing this URL in your browser:
```
https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook
```

If it doesn't load, the tunnel isn't working properly.

### Solution 3: Check Localtunnel Status

1. **Make sure localtunnel is still running**
2. **Check if URL is still valid** (localtunnel URLs can expire)
3. **Restart tunnel if needed:**
   ```bash
   lt --port 3000
   ```

### Solution 4: Use Flutterwave's Test Mode Differently

Sometimes Flutterwave sandbox has issues. Try:

1. **Wait a few minutes** and try again
2. **Clear browser cache** and refresh
3. **Try in incognito/private window**
4. **Contact Flutterwave support** if issue persists

## Quick Fix Steps

1. **Restart localtunnel:**
   ```bash
   # Stop current tunnel (Ctrl+C)
   lt --port 3000
   ```

2. **Get new URL** (if localtunnel gives you a different one)

3. **Update webhook URL** in Flutterwave dashboard

4. **Try saving again**

## Alternative: Skip Webhook Validation (Temporary)

If you need to test immediately:

1. **Save webhook without validation** (if Flutterwave allows)
2. **Test manually** by making a payment
3. **Check webhook logs** in Flutterwave dashboard

## Recommended Approach

**For Development:**
- Use **ngrok** (more stable than localtunnel)
- Or deploy to **Vercel preview** for testing

**For Production:**
- Use your **production domain**
- Example: `https://yourdomain.com/api/ai-builder/payments/webhook`

## Still Getting 500 Error?

The 500 error is coming from **Flutterwave's API**, not your server. This means:

1. ✅ Your webhook code is probably fine
2. ❌ Flutterwave can't validate your URL
3. 🔧 Try a different tunnel service (ngrok recommended)
4. 📧 Contact Flutterwave support if issue persists

---

## Next Steps

1. Try using **ngrok** instead of localtunnel
2. Or **deploy to Vercel** for stable testing
3. Once webhook saves successfully, test with a payment
4. Check webhook logs in Flutterwave dashboard

