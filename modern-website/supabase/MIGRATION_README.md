# ⚠️ READ THIS FIRST - Important Migration Notes

## What This Migration Does

This migration creates the **V2 Authentication System** with:
- New `business_users` table (Argon2id PIN hashing)
- New `user_sessions` table (stateful JWT with kill switch)
- New `verification_codes` table (SMS/Email codes)
- New `auth_audit_log` table (security tracking)

## ⚠️ CRITICAL: Existing Data

**This migration does NOT delete or modify existing tables.**

If you have existing users in the old system, they will remain untouched. The new V2 tables are separate.

## Running the Migration

### Option 1: Supabase Dashboard (Recommended for First Time)

1. Open https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy contents of `supabase/migrations/20260121_auth_v2_schema.sql`
6. Paste and click **Run**
7. Verify in **Database** → **Tables** that you see:
   - `business_users`
   - `user_sessions`
   - `verification_codes`
   - `auth_audit_log`

### Option 2: Supabase CLI (For Local Testing)

```bash
cd C:\Users\Wesley\WebApp\modern-website

# Apply migration
supabase db push

# Verify
supabase db diff
```

## Post-Migration Checklist

- [ ] Verify all 4 tables exist
- [ ] Check indexes are created (see `pg_indexes` table)
- [ ] Verify RLS policies are active
- [ ] Test a simple INSERT into `business_users` (should work with service role)

## Rollback (If Needed)

If something goes wrong:

```sql
-- Run this in SQL Editor to rollback
DROP TABLE IF EXISTS auth_audit_log CASCADE;
DROP TABLE IF EXISTS verification_codes CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS business_users CASCADE;
```

## Next Steps After Migration

1. Set environment secrets (see `ENVIRONMENT_SETUP.md`)
2. Deploy Edge Functions (run `supabase\deploy-auth.ps1`)
3. Test with Postman (see `DEPLOYMENT_GUIDE.md`)
