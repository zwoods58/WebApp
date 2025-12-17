# Fix CORS Error - Step by Step (No Console Needed)

## The Problem

The CORS error happens because Supabase is blocking OPTIONS requests before they reach your function code. This is because JWT verification is enabled by default.

## Solution: Disable JWT Verification in Supabase Dashboard

### Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Sign in if needed
3. Select your project: `rtfzksajhriwhulnwaks`

### Step 2: Navigate to Edge Functions

1. In the left sidebar, click **"Edge Functions"**
2. You should see a list of functions including:
   - `verify-otp-custom`
   - `send-otp-whatsapp`
   - And others

### Step 3: Disable JWT for `verify-otp-custom`

1. **Click on `verify-otp-custom`** in the list
2. Look for one of these tabs/buttons:
   - **"Settings"** tab
   - **"Details"** tab  
   - **"Configuration"** tab
   - A gear icon ⚙️
   - Three dots menu ⋮ → Settings
3. Look for one of these options:
   - **"Verify JWT"** (toggle/checkbox)
   - **"Require Authentication"** (toggle/checkbox)
   - **"Public Function"** (toggle/checkbox - turn this ON)
   - **"JWT Verification"** (dropdown - select "Disabled")
4. **Turn OFF** JWT verification (or turn ON "Public Function")
5. Click **"Save"** or **"Deploy"** or **"Update"**

### Step 4: Disable JWT for `send-otp-whatsapp`

1. Go back to Edge Functions list
2. Click on **`send-otp-whatsapp`**
3. Repeat Step 3 (disable JWT verification)

### Step 5: Verify Function Code is Correct

While you're in the Dashboard, let's make sure the function code is correct:

1. In `verify-otp-custom`, click **"Code"** tab
2. Scroll to around **line 15-20**
3. It should show:
   ```typescript
   if (req.method === 'OPTIONS') {
     return new Response(null, { 
       status: 200,
       headers: corsHeaders 
     });
   }
   ```
4. If it's different, you need to update it:
   - Copy the entire code from `beezee/supabase/functions/verify-otp-custom/index.ts`
   - Paste it in the Dashboard Code editor
   - Click **"Deploy"**

### Step 6: Clear Browser Cache

1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Or just do a hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

### Step 7: Test Again

1. Go back to your app: http://localhost:5173
2. Try entering the OTP code again
3. The CORS error should be gone!

## If You Can't Find JWT Setting

If the Dashboard doesn't show a JWT verification toggle:

### Option A: Check Function Logs

1. Go to Edge Functions → `verify-otp-custom` → **"Logs"** tab
2. Try entering an OTP code in your app
3. Look at the logs:
   - **If you see OPTIONS requests with status 200** = Function works, might be a cache issue
   - **If you see NO OPTIONS requests** = Supabase is blocking them (JWT verification)
   - **If you see OPTIONS with 401/403** = JWT verification is enabled

### Option B: Delete and Recreate Function

1. Delete `verify-otp-custom` function
2. Create a new function with the same name
3. When creating, look for **"Public"** or **"No Auth Required"** option
4. Select that option
5. Copy code from `beezee/supabase/functions/verify-otp-custom/index.ts`
6. Paste and deploy

### Option C: Use Supabase CLI (if you install it)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref rtfzksajhriwhulnwaks

# Deploy with --no-verify-jwt flag
supabase functions deploy verify-otp-custom --no-verify-jwt
supabase functions deploy send-otp-whatsapp --no-verify-jwt
```

## What to Look For

The JWT setting might be in different places depending on your Supabase Dashboard version:

- **New Dashboard:** Settings tab → "Verify JWT" toggle
- **Older Dashboard:** Function details → "Require Authentication" checkbox
- **Some versions:** Function creation screen → "Public Function" option

## Most Important Step

**Disable JWT verification in the Dashboard** - this is the #1 fix. Everything else is secondary.

After disabling JWT, clear your browser cache and try again!

