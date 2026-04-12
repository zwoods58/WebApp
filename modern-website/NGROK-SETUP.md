# 🚀 Ngrok Setup for BeeZee Payment Testing

## Quick Setup (3 Steps)

### Step 1: Start Your App
```bash
cd modern-website
npm run dev
```
Your app should be running on `http://localhost:3000`

### Step 2: Start Ngrok
```bash
ngrok http 3000
```
You'll see output like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.0.0
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://abc123.ngrok-free.app -> http://localhost:3000
```

### Step 3: Update Environment Variable
Copy your ngrok URL (the `https://abc123.ngrok-free.app` part) and update your `.env.local`:

```bash
# Add this line to your .env.local file
NGROK_URL=https://abc123.ngrok-free.app
```

## 🔄 Restart Your App
After updating `.env.local`, restart your app:
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

## 🎯 Test Payment Flow
1. Open your app: `http://localhost:3000/Beezee-App/app/ke/retail/more`
2. Click subscription button
3. Complete payment on Paystack
4. You should be redirected to: `https://abc123.ngrok-free.app/api/kyshi/payment-success`
5. After 3 seconds, auto-redirect back to your More page

## 🐛 Troubleshooting

### "Not working" - Check these:

1. **App Running?**
   ```bash
   curl http://localhost:3000
   # Should return HTML content
   ```

2. **Ngrok Running?**
   ```bash
   curl http://127.0.0.1:4040
   # Should show ngrok interface
   ```

3. **Environment Variable Set?**
   ```bash
   grep NGROK_URL .env.local
   # Should show: NGROK_URL=https://...
   ```

4. **Correct Port?**
   - Your app runs on port 3000
   - Make sure ngrok tunnels port 3000, not 4040

### Common Issues:

**Issue**: "Payment not redirecting"
- **Fix**: Make sure `NGROK_URL` is set correctly in `.env.local`
- **Fix**: Restart your app after setting the environment variable

**Issue**: "Ngrok URL not working"
- **Fix**: Use the HTTPS URL from ngrok output (not the tunnel URL)
- **Fix**: Make sure no firewall is blocking ngrok

## 📱 Mobile Testing
For mobile testing, use your ngrok URL directly:
```
https://abc123.ngrok-free.app/Beezee-App/app/ke/retail/more
```

## ✅ Success Indicators
You know it's working when:
- ✅ Ngrok shows forwarding to localhost:3000
- ✅ App loads on ngrok URL
- ✅ Subscription button redirects to Paystack
- ✅ Payment success shows the redirect page
- ✅ Auto-redirect brings you back to More page

## 🎉 Production Deployment
For production, remove the `NGROK_URL` line from `.env.local` and ensure:
```bash
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```
