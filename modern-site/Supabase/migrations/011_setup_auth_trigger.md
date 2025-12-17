# Setup Auth Trigger (Manual Step)

## ⚠️ IMPORTANT - Required After Migrations

After running migrations 001-010, you need to manually set up the auth trigger because Supabase doesn't allow creating triggers on `auth.users` via SQL.

---

## 🎯 What This Does

Automatically creates a `user_accounts` record when a new user signs up via Supabase Auth.

---

## 📋 Setup Instructions

### **Option 1: Via Database Webhooks (Recommended)**

1. **Go to Supabase Dashboard** → Your Project
2. **Click "Database"** in left sidebar
3. **Click "Webhooks"** tab
4. **Click "Create a new webhook"**
5. **Fill in the form:**
   - **Name:** `create_user_account_on_signup`
   - **Table:** `auth.users`
   - **Events:** Check **INSERT** only
   - **Type:** Select **PostgreSQL Function**
   - **Function:** `public.handle_new_user`
6. **Click "Create webhook"**
7. **Done!** ✅

### **Option 2: Via SQL (If you have superuser access)**

If your Supabase project allows superuser SQL commands, run this in SQL Editor:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
```

**Note:** This usually requires special permissions and may not work on hosted Supabase.

---

## ✅ Verify It Works

### **Test the trigger:**

1. **Sign up a new test user** via your app or Supabase Dashboard
2. **Check if user_account was created:**

```sql
-- Run this in SQL Editor:
SELECT 
  ua.id,
  ua.email,
  ua.account_tier,
  ua.created_at,
  au.email as auth_email
FROM public.user_accounts ua
JOIN auth.users au ON au.id = ua.id
WHERE ua.email = 'test@example.com'; -- Replace with your test email

-- Should return 1 row with:
-- - Matching id
-- - Same email
-- - account_tier = 'default_draft'
-- - Recent created_at timestamp
```

### **Expected Result:**
```
id  | email              | account_tier   | created_at
----|--------------------|-----------------|-----------
xxx | test@example.com   | default_draft  | 2025-01-12...
```

---

## 🐛 Troubleshooting

### **Issue: Webhook not firing**
**Solution:** 
- Check webhook is enabled (toggle in Webhooks list)
- Check Events includes "INSERT"
- Verify function name is exactly `public.handle_new_user`

### **Issue: User account not created**
**Solution:**
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
- Check for errors in Database logs: Database → Logs

### **Issue: "function does not exist"**
**Solution:** 
- Run migration 008 again: `008_database_functions.sql`
- Verify function: `\df public.handle_new_user` in psql

---

## 📊 What the Function Does

The `handle_new_user()` function (created in migration 008):

```sql
-- Automatically creates user_account record with:
- id: Same as auth.users.id
- email: Same as auth.users.email  
- account_tier: 'default_draft' (FREE tier)
- created_at: Current timestamp
```

---

## 🔄 Alternative: Manual Account Creation

If you don't want to set up the trigger, users can be created manually:

```sql
-- After a user signs up, run this:
INSERT INTO public.user_accounts (id, email, account_tier)
SELECT id, email, 'default_draft'
FROM auth.users
WHERE id = 'USER_ID_HERE'
ON CONFLICT (id) DO NOTHING;
```

**But this is NOT recommended** - use the webhook instead!

---

## ✅ Checklist

After setup:
- [ ] Webhook created in Dashboard
- [ ] Events set to INSERT
- [ ] Function set to `public.handle_new_user`
- [ ] Tested with new user signup
- [ ] Verified user_account was created
- [ ] Production users will auto-create accounts

---

**Status:** ⚠️ **REQUIRED MANUAL STEP**  
**Time Required:** 2 minutes  
**Difficulty:** Easy

**Set this up now so new users automatically get accounts!** 🚀

