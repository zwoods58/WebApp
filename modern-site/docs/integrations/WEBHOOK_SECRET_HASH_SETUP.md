# Flutterwave Webhook Secret Hash Setup

## Important: Secret Hash is Required

Flutterwave requires you to set a **Secret Hash** for webhook security. You need to use the **same secret hash** in both places:

1. **Flutterwave Dashboard** → Settings → Webhooks → Secret hash field
2. **Your `.env.local` file** → `FLUTTERWAVE_SECRET_HASH`

---

## Step-by-Step Setup

### Step 1: Generate a Secret Hash

Run this command to generate a secure random hash:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

Or use this online tool: https://www.random.org/strings/ (generate a 32-character random string)

**Example generated hash:**
```
7utUKn/NP4eMepW0xeS5eDnfc1Fj8Iu+vyXS48DYTHE=
```

### Step 2: Add to Flutterwave Dashboard

1. Go to Flutterwave Dashboard → Settings → Webhooks
2. In the **Secret hash** field, paste your generated hash
3. In the **URL** field, enter:
   ```
   https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook
   ```
4. Click **Save**

### Step 3: Add to Your `.env.local` File

Open `.env.local` and add:

```env
FLUTTERWAVE_SECRET_HASH=your_generated_hash_here
```

**Important:** Use the **exact same hash** in both places!

### Step 4: Restart Dev Server

After adding the secret hash to `.env.local`:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## How It Works

When Flutterwave sends a webhook:
1. It includes the secret hash in the `verif-hash` header
2. Your webhook handler compares it with `FLUTTERWAVE_SECRET_HASH`
3. If they match → webhook is processed
4. If they don't match → webhook is rejected (401 error)

---

## Security Notes

✅ **Use a strong, random hash** (at least 32 characters)
✅ **Never commit `.env.local` to git** (it's in `.gitignore`)
✅ **Use different hashes for test and production**
✅ **Keep your secret hash secure**

---

## Troubleshooting

### "Invalid signature" error (401)

- Check that the hash in Flutterwave matches the hash in `.env.local`
- Ensure there are no extra spaces or line breaks
- Restart your dev server after updating `.env.local`

### Webhook not receiving events

- Verify webhook URL is correct
- Check that tunnel is still running (localtunnel/ngrok)
- Check Flutterwave dashboard → Webhooks → Logs for errors
- Ensure events are enabled in Flutterwave dashboard

---

## Quick Reference

**Webhook URL:**
```
https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook
```

**Secret Hash:** (Generate your own using the command above)

**Environment Variable:**
```env
FLUTTERWAVE_SECRET_HASH=your_secret_hash_here
```

