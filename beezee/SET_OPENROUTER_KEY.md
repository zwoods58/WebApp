# 🔑 Set OPENROUTER_API_KEY in Supabase

## The Error
```
OPENROUTER_API_KEY not configured
```

This means the Edge Function is deployed but doesn't have access to your OpenRouter API key.

## ✅ Solution: Set the Secret in Supabase

### Step 1: Get Your OpenRouter API Key
1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign in to your account
3. Go to **API Keys** section
4. Copy your API key (starts with `sk-or-v1-...`)

### Step 2: Set the Secret in Supabase Dashboard

**Option A: Via Supabase Dashboard (Easiest)**
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Edge Functions** → **Secrets** (or **Settings** → **Edge Functions** → **Secrets**)
4. Click **"Add Secret"** or **"New Secret"**
5. Enter:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `sk-or-v1-your-key-here` (paste your actual key)
6. Click **"Save"** or **"Add"**

**Option B: Via Supabase CLI** (if you have it installed)
```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Step 3: Verify the Secret is Set

**In Supabase Dashboard:**
- Go to **Edge Functions** → **Secrets**
- You should see `OPENROUTER_API_KEY` in the list

**Or via CLI:**
```bash
supabase secrets list
```

### Step 4: Test Again

After setting the secret:
1. Refresh your app
2. Try asking the Financial Coach a question
3. It should work now! ✅

## ⚠️ Important Notes

- The secret is **case-sensitive**: Use `OPENROUTER_API_KEY` (all caps)
- The secret is **project-specific**: Set it for each Supabase project
- After setting the secret, **no redeployment needed** - Edge Functions automatically have access
- The secret is **secure**: Only Edge Functions can access it, not your frontend code

## 🔍 Troubleshooting

### Still Getting "not configured" Error?
1. **Check the secret name**: Must be exactly `OPENROUTER_API_KEY` (case-sensitive)
2. **Check the secret value**: Must start with `sk-or-v1-...`
3. **Wait a few seconds**: Sometimes it takes a moment to propagate
4. **Redeploy the function**: Go to Edge Functions → `Financial-Coach` → Deploy (even if code hasn't changed)

### Getting "401 Unauthorized" from OpenRouter?
- Your API key might be invalid
- Check your OpenRouter account has credits/balance
- Verify the key is correct (no extra spaces)

---

**Once you set the secret, all Edge Functions that use OpenRouter will work!**

