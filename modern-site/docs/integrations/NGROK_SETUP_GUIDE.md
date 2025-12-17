# ngrok Setup Guide - Step by Step

## Step 1: Sign Up for ngrok (Free)

1. Go to: https://ngrok.com
2. Click **"Sign up"** (top right)
3. Sign up with email or GitHub
4. **Get your auth token** from the dashboard (you'll need this)

---

## Step 2: Install ngrok

### Option A: Download (Recommended for Windows)

1. Go to: https://ngrok.com/download
2. Download **Windows** version
3. Extract the ZIP file
4. Copy `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
5. Add to PATH (optional but recommended):
   - Open System Properties → Environment Variables
   - Add `C:\ngrok\` to PATH

### Option B: Using Chocolatey (if you have it)

```powershell
choco install ngrok
```

### Option C: Using Scoop (if you have it)

```powershell
scoop install ngrok
```

---

## Step 3: Authenticate ngrok

After installing, authenticate with your token:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_FROM_DASHBOARD
```

Replace `YOUR_AUTH_TOKEN_FROM_DASHBOARD` with the token from ngrok dashboard.

---

## Step 4: Start Your Dev Server

Make sure your Next.js dev server is running:

```bash
npm run dev
```

Should show: `Ready on http://localhost:3000`

---

## Step 5: Start ngrok Tunnel

In a **new terminal window**, run:

```bash
ngrok http 3000
```

You'll see output like:
```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

---

## Step 6: Configure Flutterwave Webhook

1. Go to Flutterwave Dashboard → Settings → Webhooks
2. **URL field:** 
   ```
   https://your-ngrok-url.ngrok.io/api/ai-builder/payments/webhook
   ```
3. **Secret hash field:**
   ```
   7VkrUQadPK/RVinmOu5/Bz4PVsdngavtIYJTsjmzhVs=
   ```
4. Click **Save**

---

## Step 7: Add Secret Hash to .env.local

Make sure your `.env.local` has:

```env
FLUTTERWAVE_SECRET_HASH=7VkrUQadPK/RVinmOu5/Bz4PVsdngavtIYJTsjmzhVs=
```

Then restart your dev server.

---

## Testing

1. **Keep ngrok running** (don't close that terminal)
2. **Keep dev server running** (don't close that terminal)
3. **Make a test payment** in your app
4. **Check webhook logs** in Flutterwave dashboard

---

## Troubleshooting

### "ngrok: command not found"
- Make sure ngrok is installed
- Check if it's in your PATH
- Or use full path: `C:\ngrok\ngrok.exe http 3000`

### "authentication failed"
- Check your auth token is correct
- Make sure you ran: `ngrok config add-authtoken YOUR_TOKEN`

### "address already in use"
- Port 3000 is already in use
- Make sure only one ngrok instance is running
- Or use different port: `ngrok http 3001`

---

## Quick Commands

```bash
# Start tunnel
ngrok http 3000

# View tunnel status (web interface)
# Open: http://127.0.0.1:4040

# Stop tunnel
# Press Ctrl+C in ngrok terminal
```

---

## Important Notes

- ✅ **Keep ngrok running** while testing webhooks
- ✅ **Keep dev server running** on port 3000
- ✅ **Free tier:** URL changes each time you restart ngrok
- ✅ **Paid tier:** Can get static domain (optional)

---

Ready to start? Let me know when you've signed up and I'll help you authenticate!

