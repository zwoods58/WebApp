# ✅ Webhook Setup Complete!

## What's Configured

### ✅ ngrok Tunnel
- **Status**: Running
- **URL**: `https://jonathon-precognizable-contestably.ngrok-free.dev`
- **Forwarding**: `http://localhost:3000`

### ✅ Flutterwave Webhook
- **URL**: `https://jonathon-precognizable-contestably.ngrok-free.dev/api/ai-builder/payments/webhook`
- **Secret Hash**: `7VkrUQadPK/RVinmOu5/Bz4PVsdngavtIYJTsjmzhVs=`
- **Status**: ✅ Created successfully

### ✅ Environment Variables
Make sure your `.env.local` has:
```env
FLUTTERWAVE_PUBLIC_KEY=14e67305-fa27-4750-a78e-ee1a2a0164ae
FLUTTERWAVE_SECRET_KEY=29hOnb4XREOjq8kKBV47xsALWD8UEpn8
FLUTTERWAVE_ENCRYPTION_KEY=YRQQAGJjy16Y88nV0DnpSoALm7SdGFD1mUX56X8Rvco=
FLUTTERWAVE_SECRET_HASH=7VkrUQadPK/RVinmOu5/Bz4PVsdngavtIYJTsjmzhVs=
```

---

## Next Steps

### 1. Restart Dev Server (if needed)
If you just added `FLUTTERWAVE_SECRET_HASH` to `.env.local`:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Test the Webhook

**Option A: Make a Test Payment**
1. Go to your app
2. Try subscribing to Pro plan or purchasing buyout
3. Use test card: `5531886652142950`
4. Complete payment
5. Check webhook was received

**Option B: Check Flutterwave Logs**
1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Click on your webhook
3. View "Logs" tab
4. See delivery status and responses

### 3. Monitor Webhook Activity

**In your terminal** (where `npm run dev` is running):
- You'll see webhook requests logged
- Check for any errors

**In ngrok web interface:**
- Open: http://127.0.0.1:4040
- See all requests going through tunnel
- Inspect webhook payloads

---

## Testing Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] ngrok tunnel running (keep window open)
- [ ] `.env.local` has `FLUTTERWAVE_SECRET_HASH`
- [ ] Dev server restarted after adding secret hash
- [ ] Make test payment
- [ ] Check webhook received in Flutterwave logs
- [ ] Verify payment status updated in database

---

## What Happens When Webhook is Triggered

1. **Payment completed** → Flutterwave sends webhook
2. **ngrok receives** → Forwards to your local server
3. **Your webhook handler** → Processes the event
4. **Updates database** → Activates subscription/buyout
5. **Returns success** → Flutterwave marks as delivered

---

## Troubleshooting

### Webhook not receiving events?
- ✅ Check ngrok is still running
- ✅ Check dev server is running
- ✅ Verify webhook URL in Flutterwave matches ngrok URL
- ✅ Check Flutterwave dashboard → Webhooks → Logs

### "Invalid signature" error?
- ✅ Verify `FLUTTERWAVE_SECRET_HASH` in `.env.local` matches Flutterwave
- ✅ Restart dev server after updating `.env.local`
- ✅ No extra spaces or quotes in secret hash

### ngrok URL changed?
- ✅ Free tier: URL changes when you restart ngrok
- ✅ Update webhook URL in Flutterwave dashboard
- ✅ Or upgrade ngrok for static domain

---

## Important Notes

⚠️ **Keep ngrok running** while testing webhooks
⚠️ **Keep dev server running** on port 3000
⚠️ **Free tier**: ngrok URL changes on restart (update Flutterwave if needed)
⚠️ **Production**: Use your production domain instead of ngrok

---

## Success! 🎉

Your webhook is now configured and ready to receive payment events from Flutterwave!

