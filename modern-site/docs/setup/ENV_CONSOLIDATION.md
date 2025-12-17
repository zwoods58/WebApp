# Environment Variables Consolidation Guide

## Current Vercel Environment Variables ✅

Based on your Vercel project, you currently have:

### ✅ Already Set (All Environments)
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `BREVO_SMTP_PASSWORD`
- `BREVO_SMTP_USER`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`

### ✅ Already Set (Production Only)
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRITICAL - This was just added**
- `FLUTTERWAVE_PUBLIC_KEY` (but you said to ignore Flutterwave)

---

## Required Variables Checklist

### 🔴 CRITICAL (Must Have for Build)

1. **Supabase** ✅
   - `NEXT_PUBLIC_SUPABASE_URL` ✅ Set
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ Set
   - `SUPABASE_SERVICE_ROLE_KEY` ✅ Set (Production only - needs to be in all environments)

2. **App Configuration** ✅
   - `NEXT_PUBLIC_APP_URL` ✅ Set
   - `NEXT_PUBLIC_APP_NAME` ✅ Set
   - `CRON_SECRET` ✅ Set

### 🟡 OPTIONAL (For Features)

3. **Email (You have both Brevo and SendGrid)**
   - `BREVO_SMTP_USER` ✅ Set
   - `BREVO_SMTP_PASSWORD` ✅ Set
   - `SENDGRID_API_KEY` ✅ Set
   - `SENDGRID_FROM_EMAIL` ✅ Set

4. **Payments**
   - `STRIPE_SECRET_KEY` ❌ Not set (optional - only if using Stripe)
   - `FLUTTERWAVE_PUBLIC_KEY` ✅ Set (but you said to ignore)
   - `FLUTTERWAVE_SECRET_KEY` ❌ Not set (optional)
   - `FLUTTERWAVE_SECRET_HASH` ❌ Not set (optional)

5. **AI Features**
   - `CLAUDE_API_KEY` ❌ Not set (optional - for AI builder)
   - `OPENROUTER_API_KEY` ❌ Not set (optional - for AI builder)

---

## Action Items

### 1. Add SUPABASE_SERVICE_ROLE_KEY to All Environments

Currently it's only in Production. Add it to Preview and Development too:

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY development
```

### 2. Consolidate Your .env.local Files

Since you have two .env.local files (old website + redesigned), here's what to do:

**Option A: Use the redesigned website's .env.local**
- This should have the most up-to-date values
- Make sure it has all the variables listed above

**Option B: Merge both files**
- Take unique variables from both
- Use the redesigned website's values as primary
- Keep any old variables that are still needed

### 3. Recommended .env.local Structure

Create a single `.env.local` in `modern-site/` with:

```env
# Supabase (CRITICAL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AtarWebb
CRON_SECRET=your-cron-secret

# Email (Choose one - Brevo or SendGrid)
BREVO_SMTP_USER=your-brevo-user
BREVO_SMTP_PASSWORD=your-brevo-password
# OR
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=your-email@domain.com

# Payments (Optional - only if using)
STRIPE_SECRET_KEY=your-stripe-key

# AI Features (Optional - only if using AI builder)
CLAUDE_API_KEY=your-claude-key
```

---

## Next Steps

1. **Review your two .env.local files** and identify which values to keep
2. **Create a single consolidated .env.local** in `modern-site/`
3. **Ensure all critical variables are in Vercel** (especially `SUPABASE_SERVICE_ROLE_KEY` in all environments)
4. **Test the build locally** before deploying

---

## Quick Check Command

To see what's missing, run:

```bash
cd modern-site
npm run build
```

This will show any missing environment variables.


