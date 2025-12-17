# ⚡ Quick Start Guide - BeeZee Finance

Get your BeeZee Finance PWA up and running in 15 minutes!

## 🎯 Prerequisites

Make sure you have:
- Node.js 18+ installed
- A Supabase account (free tier works)
- Git installed

## 🚀 5-Minute Local Setup

### Step 1: Install Dependencies (2 min)
```bash
cd beezee
npm install
```

### Step 2: Configure Supabase (5 min)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Wait for database to initialize (~2 minutes)

2. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/schema.sql`
   - Paste and run
   - Verify tables created in Table Editor

3. **Get API Keys**
   - Go to Project Settings → API
   - Copy:
     - Project URL
     - `anon` `public` key

### Step 3: Configure Environment (2 min)

```bash
# Copy example env file
cp env.example .env

# Edit .env and add your Supabase credentials
```

Minimum required variables:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
VITE_SUPABASE_FUNCTIONS_URL=https://xxxxx.supabase.co/functions/v1
```

### Step 4: Start Development Server (1 min)
```bash
npm run dev
```

Open `http://localhost:3000` in your browser!

## 🧪 Test the App

### Create Account
1. Click "Sign up"
2. Enter phone number: `+27812345678` (or your real number)
3. Check SMS for OTP code
4. Enter code to verify

### Add Test Transaction
1. Navigate to "+" button
2. Select "Expense"
3. Enter:
   - Amount: `100`
   - Category: `Supplies`
   - Description: `Test purchase`
4. Click "Save Transaction"

### View Dashboard
- See your transaction reflected
- Check the stats cards

## 🎨 Optional: Deploy Edge Functions (Advanced)

If you want AI features (voice, receipt scanning, coach):

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login and Link
```bash
supabase login
supabase link --project-ref your-project-ref
```

### 3. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy the key

### 4. Set Secrets
```bash
supabase secrets set GEMINI_API_KEY=your-gemini-key
```

### 5. Deploy Functions
```bash
# Deploy all functions (takes ~5 minutes)
supabase functions deploy voice-to-transaction
supabase functions deploy receipt-to-transaction
supabase functions deploy generate-report
supabase functions deploy financial-coach
supabase functions deploy notification-trigger
```

## 🔧 Troubleshooting

### "Cannot connect to Supabase"
- ✅ Check `.env` file has correct URL and key
- ✅ Verify Supabase project is running (green status in dashboard)
- ✅ Check browser console for errors

### "Service Worker not registering"
- ✅ Make sure you're using a modern browser (Chrome/Edge/Safari)
- ✅ Check you're on `http://localhost` or `https://`
- ✅ Open DevTools → Application → Service Workers

### "SMS not sending"
- ✅ Check phone number format: `+27812345678`
- ✅ Verify Supabase Auth is enabled
- ✅ Check Auth quota in Supabase dashboard

### "Database tables not found"
- ✅ Re-run `schema.sql` in SQL Editor
- ✅ Check RLS is enabled on tables
- ✅ Verify no SQL errors in console

## 📱 Test PWA Features

### Test Offline Mode
1. Open app in browser
2. Open DevTools → Network
3. Check "Offline" checkbox
4. Try adding a transaction
5. Go back online
6. Transaction should sync automatically

### Test Installation
1. Chrome: Click install icon in address bar
2. iOS Safari: Share → Add to Home Screen
3. Android: Menu → Install app

## 🎓 Next Steps

### Learn the Features
- ✅ Add multiple transactions
- ✅ View reports (Reports tab)
- ✅ Try financial coach (Coach tab)
- ✅ Customize settings

### Customize the App
- Edit colors in `tailwind.config.js`
- Change app name in `.env`
- Modify categories in `AddTransaction.jsx`
- Update branding in auth pages

### Deploy to Production
See `DEPLOYMENT.md` for full deployment guide.

Quick deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## 💡 Tips for Development

### Hot Module Replacement
Vite supports HMR - changes appear instantly without refresh!

### Database Changes
After modifying schema:
```bash
# Export current schema
supabase db dump -f supabase/schema.sql

# Or reset database
supabase db reset
```

### View Logs
```bash
# Edge function logs
supabase functions logs function-name --tail

# Local development logs
# Check browser console and terminal
```

### Debug Service Worker
1. Chrome DevTools → Application
2. Service Workers → Inspect
3. Check Cache Storage
4. View IndexedDB

## 📚 Resources

- **Full Documentation**: `README.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

## 🆘 Getting Help

If you're stuck:

1. Check browser console for errors
2. Check Supabase logs
3. Review the full README.md
4. Check Supabase Discord community

## ✅ Quick Checklist

Setup complete when you can:
- [ ] Load app at localhost:3000
- [ ] Create account with phone number
- [ ] Add a transaction manually
- [ ] See transaction on dashboard
- [ ] View transactions page
- [ ] Access all navigation tabs
- [ ] See service worker registered in DevTools
- [ ] Test offline mode (optional)

---

**Congratulations! You're ready to build with BeeZee Finance! 🎉**

Time to deployment: ~15 minutes ⚡


