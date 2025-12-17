# 🔧 Quick Fix: Blank Screen Issue

## Problem
The preview is showing a blank screen.

## Most Likely Cause
**Missing environment variables** - The app requires Supabase credentials to run.

---

## ✅ Solution

### Step 1: Create `.env` File

Create a file named `.env` in the `beezee` folder with:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Edge Functions URL  
VITE_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1

# WhatsApp Business Number
VITE_WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX

# App Config
VITE_APP_NAME=BeeZee Finance
VITE_MONTHLY_PRICE=55.50
VITE_TRIAL_DAYS=7
```

### Step 2: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Create a new project (or use existing)
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Step 3: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🔍 Other Possible Issues

### Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors:

1. **Missing Supabase URL/Key:**
   - Error: "Missing Supabase environment variables"
   - Fix: Create `.env` file (see above)

2. **Module not found:**
   - Error: "Cannot find module..."
   - Fix: Run `npm install`

3. **Service Worker error:**
   - Error: "Service Worker registration failed"
   - Fix: This is OK, service worker is optional for dev

### Check Network Tab

1. Open DevTools → Network tab
2. Refresh page
3. Look for failed requests (red)
4. Check if `main.jsx` is loading (should be 200 OK)

---

## 🧪 Test Without Supabase

If you want to test the UI without Supabase:

1. The code has been updated to handle missing env vars gracefully
2. You'll see warnings in console but app should still load
3. Auth features won't work, but you can see the UI

---

## ✅ Verification

After creating `.env` and restarting:

1. ✅ No errors in browser console
2. ✅ Page loads (even if showing login screen)
3. ✅ Can see UI elements
4. ✅ Can navigate (if logged in)

---

## 🆘 Still Not Working?

### Check These:

1. **Is dev server running?**
   ```bash
   # Should see: "Local: http://localhost:5173"
   ```

2. **Is the correct URL open?**
   - Should be: `http://localhost:5173`
   - Not: `http://localhost:3000` (old port)

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check for JavaScript errors:**
   - Open Console (F12)
   - Look for red error messages
   - Share the error message if you see one

---

## 📝 Quick Checklist

- [ ] `.env` file exists in `beezee/` folder
- [ ] `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Dev server restarted after creating `.env`
- [ ] Browser console checked for errors
- [ ] Correct URL (localhost:5173)

---

**If still blank after these steps, share the browser console error message!**


