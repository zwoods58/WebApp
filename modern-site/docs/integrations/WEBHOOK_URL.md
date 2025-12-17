# Your Webhook URL

## For Flutterwave Webhook Configuration:

Use this URL in the Flutterwave dashboard:

```
https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook
```

**Note:** If localtunnel has connection issues, try one of these alternatives:

### Option 1: Use ngrok (if you have an account)
1. Sign up at https://ngrok.com (free)
2. Download ngrok
3. Run: `ngrok http 3000`
4. Use the HTTPS URL shown

### Option 2: Use Cloudflare Tunnel
1. Install: `winget install cloudflare.cloudflared`
2. Run: `cloudflared tunnel --url http://localhost:3000`
3. Use the HTTPS URL shown

### Option 3: Deploy to Vercel (for production testing)
1. Deploy your app to Vercel
2. Use: `https://your-app.vercel.app/api/ai-builder/payments/webhook`

---

## Current Setup:

- **Tunnel URL**: `https://atarwebb-test.loca.lt`
- **Full Webhook URL**: `https://atarwebb-test.loca.lt/api/ai-builder/payments/webhook`
- **Port**: 3000 (your Next.js dev server)

---

## Next Steps:

1. Copy the webhook URL above
2. Paste it into Flutterwave dashboard → Settings → Webhooks → URL field
3. Leave Secret hash empty
4. Click Save
5. Copy the Secret hash Flutterwave generates
6. Add to `.env.local`: `FLUTTERWAVE_SECRET_HASH=your_hash_here`
7. Restart dev server

