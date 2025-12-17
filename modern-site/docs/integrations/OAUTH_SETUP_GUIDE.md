# OAuth Setup Guide for Google & GitHub

This guide will walk you through setting up Google and GitHub OAuth authentication with Supabase.

## 📋 Prerequisites

- A Supabase project (already set up)
- A Google Cloud account (for Google OAuth)
- A GitHub account (for GitHub OAuth)

---

## 🔵 Part 1: Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one
   - Name it (e.g., "AtarWebb OAuth")
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External (or Internal if using Google Workspace)
     - App name: "AtarWebb"
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Click "Add or Remove Scopes" → Select:
       - `.../auth/userinfo.email`
       - `.../auth/userinfo.profile`
     - Click "Save and Continue"
     - Test users: Add your email (optional for testing)
     - Click "Save and Continue" → "Back to Dashboard"

5. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: "AtarWebb Web Client"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://your-domain.com
     https://your-project.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     https://your-project.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - Click "Create"
   - **Copy your Client ID and Client Secret** (you'll need these!)

### Step 2: Add Google OAuth to Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/
   - Select your project

2. **Navigate to Authentication Settings**
   - Go to "Authentication" → "Providers" in the left sidebar
   - Find "Google" in the list

3. **Enable Google Provider**
   - Toggle "Enable Google provider" to ON
   - **Client ID (for OAuth):** Paste your Google Client ID
   - **Client Secret (for OAuth):** Paste your Google Client Secret
   - Click "Save"

---

## 🐙 Part 2: GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Sign in to your GitHub account

2. **Create New OAuth App**
   - Click "OAuth Apps" in the left sidebar
   - Click "New OAuth App"

3. **Fill in OAuth App Details**
   - **Application name:** "AtarWebb"
   - **Homepage URL:**
     ```
     https://your-domain.com
     ```
   - **Authorization callback URL:**
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
   - Click "Register application"

4. **Get Your Credentials**
   - You'll see your **Client ID** (copy it!)
   - Click "Generate a new client secret"
   - **Copy your Client Secret** (you'll only see it once!)

### Step 2: Add GitHub OAuth to Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/
   - Select your project

2. **Navigate to Authentication Settings**
   - Go to "Authentication" → "Providers"
   - Find "GitHub" in the list

3. **Enable GitHub Provider**
   - Toggle "Enable GitHub provider" to ON
   - **Client ID (for OAuth):** Paste your GitHub Client ID
   - **Client Secret (for OAuth):** Paste your GitHub Client Secret
   - Click "Save"

---

## 🔧 Part 3: Update Your Code

### Update Redirect URLs

Make sure your redirect URLs in the code match your Supabase project URL:

```typescript
// In app/ai-builder/page.tsx
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github'
  options: {
    redirectTo: `${window.location.origin}/ai-builder`
  }
})
```

### Add Callback Handler (Optional but Recommended)

Create a callback route to handle OAuth redirects:

**File: `app/auth/callback/route.ts`**

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the AI builder page
  return NextResponse.redirect(new URL('/ai-builder', request.url))
}
```

---

## ✅ Part 4: Testing

### Test Google OAuth

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/ai-builder`
3. Click "Start Build"
4. Click "Sign in with Google"
5. You should be redirected to Google's login page
6. After logging in, you should be redirected back to `/ai-builder`

### Test GitHub OAuth

1. Click "Sign in with GitHub"
2. You should be redirected to GitHub's authorization page
3. Click "Authorize"
4. You should be redirected back to `/ai-builder`

---

## 🚨 Troubleshooting

### Common Issues

1. **"Redirect URI mismatch" error**
   - **Solution:** Make sure the redirect URI in your OAuth app matches exactly:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
   - Check for trailing slashes, http vs https, etc.

2. **"Invalid client" error**
   - **Solution:** Double-check your Client ID and Client Secret in Supabase
   - Make sure you copied them correctly (no extra spaces)

3. **OAuth works locally but not in production**
   - **Solution:** Add your production domain to:
     - Google: Authorized JavaScript origins and redirect URIs
     - GitHub: Authorization callback URL
     - Supabase: Site URL in Authentication → URL Configuration

4. **Users not being created in Supabase**
   - **Solution:** Check Supabase Authentication → Users
   - Make sure RLS policies allow user creation
   - Check Supabase logs for errors

### Verify Supabase Configuration

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Make sure these are set:
   - **Site URL:** `https://your-domain.com` (or `http://localhost:3000` for dev)
   - **Redirect URLs:** Add your callback URLs

---

## 📝 Quick Reference

### Google OAuth Redirect URI
```
https://your-project.supabase.co/auth/v1/callback
```

### GitHub OAuth Callback URL
```
https://your-project.supabase.co/auth/v1/callback
```

### Supabase Project URL Format
```
https://[project-id].supabase.co
```

---

## 🎉 You're Done!

Once set up, users can sign in with Google or GitHub directly from your modal. The authentication state will be automatically managed by Supabase.


