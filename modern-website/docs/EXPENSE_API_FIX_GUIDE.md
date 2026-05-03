# Expense API Fix Guide - Database Connection Issue

## Problem
Expense API returns error: `relation "businesses" does not exist` (code: 42P01)

## Root Cause
Your environment variables are pointing to a **different Supabase project** than the one with the complete schema.

## Quick Fix Steps

### 1. Check Current Environment
Run the database checker to see what you're currently connected to:
```bash
npm run check:database
```

### 2. Update Environment Variables
Copy `.env.example` to `.env.local` and use the correct project reference:

```bash
cp .env.example .env.local
```

**Critical**: Update these values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://zruprmhkcqhgzydjfhrk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

### 3. Get Keys from Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select project: `zebulunwoods3@gmail.com's Project`
3. Settings → API
4. Copy **Project URL** and **service_role** key

### 4. Restart Development Server
```bash
npm run dev
```

### 5. Test the Fix
Try adding an expense again. The API should now connect to the correct database.

## Verification
After fixing, the API should:
- ✅ Connect to database with `businesses` table
- ✅ Successfully query business information
- ✅ Insert expenses without schema errors

## Debug Output
The updated API now logs:
- Database connection URL and project reference
- Available tables in the connected database
- Detailed error information if tables are missing

## If Still Failing
1. Run `npm run check:database` to verify connection
2. Check that all required tables exist: `businesses`, `expenses`, `transactions`
3. If tables are missing, run database migrations from the `supabase/migrations/` folder

## Support
Check the browser console and server logs for detailed debugging information.
