# ⚡ Quick Reference: .env.local File

## 📋 Minimum Required (App Will Load)

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1
```

## 📋 Complete Template (All Features Work)

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1

# WhatsApp (Required for notifications)
VITE_WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX

# App Config (Optional)
VITE_APP_NAME=BeeZee Finance
VITE_MONTHLY_PRICE=55.50
VITE_TRIAL_DAYS=7
```

---

## 🔑 Where to Get Values

| Variable | Where to Find |
|----------|---------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public |
| `VITE_SUPABASE_FUNCTIONS_URL` | Same as URL + `/functions/v1` |
| `VITE_WHATSAPP_BUSINESS_NUMBER` | Your WhatsApp Business number (format: 27XXXXXXXXX) |

---

## ⚠️ Important Rules

1. **ALL frontend variables MUST start with `VITE_`**
2. **NO spaces around `=` sign**
3. **NO quotes needed** (unless value has spaces)
4. **WhatsApp number: NO +, NO spaces** (just digits)

---

## ✅ Example (Based on Your Credentials)

```bash
VITE_SUPABASE_URL=https://rtfzksajhriwhulnwaks.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_F9DqzXn2-50DXeaTx13aBQ_aRz9T2vr
VITE_SUPABASE_FUNCTIONS_URL=https://rtfzksajhriwhulnwaks.supabase.co/functions/v1
VITE_WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX
```

---

## 🚫 NOT in .env.local (These go in Supabase Secrets)

- `SUPABASE_SERVICE_ROLE_KEY` → Supabase Dashboard → Edge Functions → Secrets
- `GEMINI_API_KEY` → Supabase Dashboard → Edge Functions → Secrets

---

**That's it! Just these 3-4 variables and your app will load!** 🎉


