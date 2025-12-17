# 📋 Required Environment Variables for .env.local

## Complete List of All Required Variables

---

## 🎯 Frontend Variables (VITE_ prefix - Required for App to Run)

### Supabase Configuration
```bash
# Your Supabase project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key (from Settings → API → anon public)
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Edge Functions base URL (usually same as SUPABASE_URL + /functions/v1)
VITE_SUPABASE_FUNCTIONS_URL=https://your-project-id.supabase.co/functions/v1
```

### WhatsApp Configuration
```bash
# Your WhatsApp Business number (no +, no spaces, just digits)
# Example: 27812345678
VITE_WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX
```

### App Configuration (Optional but Recommended)
```bash
# App name
VITE_APP_NAME=BeeZee Finance

# Monthly subscription price
VITE_MONTHLY_PRICE=55.50

# Trial period in days
VITE_TRIAL_DAYS=7
```

---

## 🔐 Backend Variables (For Supabase Edge Functions - Set in Supabase Secrets)

These are NOT in `.env.local` - they go in Supabase Dashboard → Edge Functions → Secrets:

```bash
# Supabase Service Role Key (from Settings → API → service_role)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key

# WhatsApp Business Number (same as frontend, for Edge Functions)
WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX
```

---

## 📝 Complete .env.local Template

Copy this template and fill in your actual values:

```bash
# ============================================
# SUPABASE CONFIGURATION (Frontend)
# ============================================
# Get these from: https://app.supabase.com → Your Project → Settings → API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
VITE_SUPABASE_FUNCTIONS_URL=https://your-project-id.supabase.co/functions/v1

# ============================================
# WHATSAPP CONFIGURATION (Frontend)
# ============================================
# Your WhatsApp Business number (format: 27XXXXXXXXX, no +, no spaces)
VITE_WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX

# ============================================
# APP CONFIGURATION (Optional)
# ============================================
VITE_APP_NAME=BeeZee Finance
VITE_MONTHLY_PRICE=55.50
VITE_TRIAL_DAYS=7

# ============================================
# BACKEND VARIABLES (NOT in .env.local)
# ============================================
# These go in Supabase Dashboard → Edge Functions → Secrets:
# - SUPABASE_SERVICE_ROLE_KEY
# - GEMINI_API_KEY
# - WHATSAPP_BUSINESS_NUMBER
```

---

## 🔍 Where to Get Each Value

### 1. Supabase Credentials

**Go to:** https://app.supabase.com → Your Project → **Settings** → **API**

**You'll find:**
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (for Edge Functions secrets)

**Example:**
```
Project URL: https://rtfzksajhriwhulnwaks.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different key)
```

### 2. Gemini API Key

**Go to:** https://aistudio.google.com/app/apikey

**Steps:**
1. Sign in with Google account
2. Click "Create API Key"
3. Copy the key → `GEMINI_API_KEY` (for Edge Functions secrets)

**Example:**
```
GEMINI_API_KEY=AIzaSyAc9HOv6Uf_okI1YbHP0Qq8JD92eiSBVa8
```

### 3. WhatsApp Business Number

**Format:** `27XXXXXXXXX` (South African number, no +, no spaces)

**Example:**
```
VITE_WHATSAPP_BUSINESS_NUMBER=27812345678
```

---

## ⚠️ Important Notes

### Variable Naming Rules

1. **Frontend variables MUST start with `VITE_`**
   - ✅ `VITE_SUPABASE_URL`
   - ❌ `SUPABASE_URL` (won't work in frontend)
   - ❌ `NEXT_PUBLIC_SUPABASE_URL` (Next.js format, not Vite)

2. **Backend variables (Edge Functions) do NOT use `VITE_`**
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` (in Supabase secrets)
   - ✅ `GEMINI_API_KEY` (in Supabase secrets)
   - ❌ `VITE_SUPABASE_SERVICE_ROLE_KEY` (wrong)

### Security

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ Never commit API keys to Git
- ✅ Service role key should NEVER be in frontend code
- ✅ Only anon key goes in `.env.local` (safe for frontend)

---

## 🧪 Testing Your Configuration

### Test 1: Check Variables Are Loaded

Open browser console (F12) and type:
```javascript
// Should show your Supabase URL
console.log(import.meta.env.VITE_SUPABASE_URL)

// Should show your anon key (first few chars)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20))
```

### Test 2: Check Supabase Connection

In browser console:
```javascript
// Should connect without errors
import { supabase } from './utils/supabase'
console.log(supabase)
```

### Test 3: Verify Edge Functions Secrets

```bash
# Check if secrets are set in Supabase
supabase secrets list
```

---

## 📋 Minimum Required for App to Run

**Absolute minimum (app will load but features won't work):**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Recommended (all features work):**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1
VITE_WHATSAPP_BUSINESS_NUMBER=27XXXXXXXXX
```

---

## 🚨 Common Mistakes

### ❌ Wrong Prefix
```bash
# WRONG - Next.js format
NEXT_PUBLIC_SUPABASE_URL=...

# CORRECT - Vite format
VITE_SUPABASE_URL=...
```

### ❌ Service Role in Frontend
```bash
# WRONG - Never put service role in .env.local
VITE_SUPABASE_SERVICE_ROLE_KEY=...

# CORRECT - Only in Supabase secrets
SUPABASE_SERVICE_ROLE_KEY=... (in Supabase Dashboard)
```

### ❌ Wrong WhatsApp Format
```bash
# WRONG
VITE_WHATSAPP_BUSINESS_NUMBER=+27 82 123 4567
VITE_WHATSAPP_BUSINESS_NUMBER=+27821234567

# CORRECT
VITE_WHATSAPP_BUSINESS_NUMBER=27821234567
```

---

## ✅ Quick Checklist

- [ ] `.env.local` file exists in `beezee/` folder
- [ ] All variables start with `VITE_` (for frontend)
- [ ] Supabase URL is correct format
- [ ] Supabase anon key is correct
- [ ] WhatsApp number has no + or spaces
- [ ] Dev server restarted after creating/updating `.env.local`
- [ ] No errors in browser console
- [ ] App loads successfully

---

## 📚 Related Files

- `env.example` - Template file (safe to commit)
- `.env.local` - Your actual credentials (DO NOT commit)
- `.gitignore` - Should include `.env.local`

---

**Your `.env.local` should have at minimum the 3 Supabase variables for the app to load!**


