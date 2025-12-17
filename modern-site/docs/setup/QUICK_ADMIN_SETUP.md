# Quick Admin Setup Guide

## The Error You're Seeing

A **400 Bad Request** from Supabase Auth means the admin user doesn't exist yet in your Supabase project.

## Quick Fix (Choose One Method)

### Method 1: Create User in Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication**
   - Click "Authentication" in the left sidebar
   - Click "Users" tab

3. **Create Admin User**
   - Click "Add User" or "Invite User" button
   - Fill in:
     - **Email**: `admin@atarwebb.com`
     - **Password**: `Royalblue#28`
     - **Auto Confirm**: ✅ Enable this (check the box)
   - Click "Create User"

4. **Set Admin Tier**
   - Go to "SQL Editor" in Supabase Dashboard
   - Run this query:
     ```sql
     UPDATE public.user_accounts
     SET account_tier = 'admin'
     WHERE email = 'admin@atarwebb.com';
     ```

5. **Try Login Again**
   - Go to `/admin`
   - Use the credentials above

### Method 2: Use Setup Script (Automated)

1. **Get Service Role Key**
   - Supabase Dashboard → Settings → API
   - Copy the `service_role` key (NOT the anon key)

2. **Add to `.env.local`**
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Run Setup Script**
   ```bash
   cd modern-site
   node scripts/setup-admin.js
   ```

4. **Try Login**
   - Go to `/admin`
   - Email: `admin@atarwebb.com`
   - Password: `Royalblue#28`

## Verify Setup

After creating the user, you can verify:

1. **Check User Exists**: Supabase Dashboard → Authentication → Users (should see admin@atarwebb.com)
2. **Check Account Tier**: Run this SQL:
   ```sql
   SELECT email, account_tier FROM public.user_accounts WHERE email = 'admin@atarwebb.com';
   ```
   Should return: `admin | admin`

## Common Issues

- **400 Error**: User doesn't exist → Create user first
- **Invalid credentials**: Wrong password → Reset in Supabase Dashboard
- **Access denied**: Account tier not set → Run the SQL update query
- **Email not confirmed**: Enable "Auto Confirm" when creating user

## Still Having Issues?

1. Check browser console (F12) for detailed error messages
2. Verify Supabase URL and keys in `.env.local`
3. Make sure you're using the correct Supabase project


