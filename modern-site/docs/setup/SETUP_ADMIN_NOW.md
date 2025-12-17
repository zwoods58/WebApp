# ⚡ QUICK FIX: Create Admin User Now

The error "Invalid email or password. Make sure the admin user exists in Supabase Auth" means the admin user needs to be created.

## 🚀 Fastest Method: Supabase Dashboard (2 minutes)

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project

### Step 2: Create the Admin User
1. Click **"Authentication"** in the left sidebar
2. Click **"Users"** tab
3. Click **"Add User"** button (top right)
4. Fill in:
   - **Email**: `admin@atarwebb.com`
   - **Password**: `Royalblue#28`
   - ✅ **Check "Auto Confirm"** (important!)
5. Click **"Create User"**

### Step 3: Set Admin Tier
1. Go to **"SQL Editor"** in Supabase Dashboard
2. Click **"New Query"**
3. Paste this SQL:
   ```sql
   UPDATE public.user_accounts
   SET account_tier = 'admin'
   WHERE email = 'admin@atarwebb.com';
   ```
4. Click **"Run"**

### Step 4: Login
1. Go back to: `http://localhost:3000/admin`
2. Login with:
   - Email: `admin@atarwebb.com`
   - Password: `Royalblue#28`

## ✅ Done! You should now be able to access the admin dashboard.

---

## Alternative: Use Setup Script (if you have service role key)

If you prefer automation:

1. Get your **Service Role Key**:
   - Supabase Dashboard → Settings → API
   - Copy the `service_role` key (NOT the anon key)

2. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Run:
   ```bash
   cd modern-site
   node scripts/setup-admin.js
   ```

4. Then login at `/admin`


