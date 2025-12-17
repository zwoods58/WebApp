# Webhook Error Troubleshooting

## Common Errors and Solutions

### Error 1: "Invalid signature" or 401 Unauthorized

**Cause:** Secret hash mismatch between Flutterwave and your `.env.local`

**Solution:**
1. Check Flutterwave dashboard → Settings → Webhooks
2. Copy the exact Secret hash shown there
3. Make sure it matches exactly in your `.env.local`:
   ```env
   FLUTTERWAVE_SECRET_HASH=exact_hash_from_flutterwave
   ```
4. No extra spaces, no quotes, exact match
5. Restart dev server after updating

---

### Error 2: "Connection refused" or "Webhook not receiving events"

**Cause:** Tunnel not running or URL incorrect

**Solution:**
1. Make sure localtunnel/ngrok is running
2. Check the URL is correct:
   ```
   https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook
   ```
3. Test the URL in browser (should show error, but confirms it's reachable)
4. Check Flutterwave dashboard → Webhooks → Logs for delivery status

---

### Error 3: "Webhook URL format invalid"

**Cause:** URL format issue in Flutterwave dashboard

**Solution:**
- Make sure URL starts with `https://`
- No trailing slash
- Full path: `/api/ai-builder/payments/webhook`
- Example: `https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook`

---

### Error 4: "Secret hash required" or "Field cannot be empty"

**Cause:** Flutterwave requires secret hash to be set

**Solution:**
1. Generate a secret hash (see below)
2. Add it to Flutterwave dashboard → Secret hash field
3. Add same hash to `.env.local`:
   ```env
   FLUTTERWAVE_SECRET_HASH=your_hash_here
   ```

---

### Error 5: Environment variable not loading

**Cause:** `.env.local` not being read or server not restarted

**Solution:**
1. Make sure `.env.local` is in project root (`modern-site/` folder)
2. Restart dev server completely:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
3. Check variable is loaded:
   ```bash
   # In your code, add temporary log:
   console.log('Secret hash:', process.env.FLUTTERWAVE_SECRET_HASH)
   ```

---

## Generate a New Secret Hash

If you need to generate a new secret hash:

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Using PowerShell:**
```powershell
$guid1 = [System.Guid]::NewGuid().ToString()
$guid2 = [System.Guid]::NewGuid().ToString()
($guid1 + $guid2).Replace('-','')
```

**Online tool:**
- https://www.random.org/strings/
- Generate 32-character random string

---

## Testing Your Webhook

### Manual Test:

1. **Check webhook endpoint is reachable:**
   ```bash
   curl https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook
   ```
   Should return error (expected - needs POST request)

2. **Test with Flutterwave:**
   - Make a test payment
   - Check Flutterwave dashboard → Webhooks → Logs
   - Look for delivery status and response codes

3. **Check your server logs:**
   - Look for webhook requests in terminal
   - Check for any error messages

---

## Quick Checklist

- [ ] Secret hash set in Flutterwave dashboard
- [ ] Same secret hash in `.env.local` as `FLUTTERWAVE_SECRET_HASH`
- [ ] Webhook URL is correct and accessible
- [ ] Tunnel (localtunnel/ngrok) is running
- [ ] Dev server restarted after updating `.env.local`
- [ ] Webhook events enabled in Flutterwave dashboard
- [ ] No extra spaces or quotes in secret hash

---

## Still Having Issues?

Share the exact error message and I can help debug further!

Common things to check:
1. Exact error message from Flutterwave
2. Server logs/console output
3. Webhook delivery logs in Flutterwave dashboard

