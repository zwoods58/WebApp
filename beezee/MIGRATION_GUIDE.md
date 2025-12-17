# 🗄️ Database Migration Guide

## Overview

All database migrations are now organized in `supabase/migrations/` with timestamped files for proper ordering.

---

## 📁 Migration Files

```
supabase/migrations/
├── 20241213000001_initial_schema.sql       (Core tables)
├── 20241213000002_notifications.sql        (Notification system)
├── 20241213000003_payments_and_auth.sql    (Payments & auth tables)
├── 20241213000004_rls_policies.sql         (Security policies)
└── 20241213000005_functions_and_triggers.sql (Automation)
```

---

## 🚀 Quick Start

### Method 1: Supabase CLI (Recommended)

```bash
cd beezee

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Apply all migrations at once
supabase db push

# Verify
supabase db shell
\dt
\q
```

### Method 2: Manual Application

```bash
# Apply each migration in order
psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres \
  -f supabase/migrations/20241213000001_initial_schema.sql

psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres \
  -f supabase/migrations/20241213000002_notifications.sql

# ... continue with remaining files in order
```

---

## 📊 What Each Migration Does

### Migration 1: Initial Schema (20241213000001)
**Creates:**
- `users` table (20+ fields)
- `transactions` table
- `reports` table
- `coaching_sessions` table
- `categories` table
- Default SA categories (13 items)
- Performance indexes

**Tables:** 5  
**Indexes:** 10+  
**Rows Inserted:** 13 (categories)

### Migration 2: Notifications (20241213000002)
**Creates:**
- `notifications` table
- `notification_preferences` table
- `notification_analytics` table
- Indexes for performance

**Tables:** 3  
**Indexes:** 9

### Migration 3: Payments & Auth (20241213000003)
**Creates:**
- `subscription_payments` table
- `trusted_devices` table
- `login_attempts` table
- `payment_methods` table
- `offline_queue` table
- Indexes for all

**Tables:** 5  
**Indexes:** 11

### Migration 4: RLS Policies (20241213000004)
**Creates:**
- Enables RLS on all 12 tables
- 25+ security policies
- User-level data isolation

**Policies:** 25+  
**Tables Secured:** 12

### Migration 5: Functions & Triggers (20241213000005)
**Creates:**
- 5 PostgreSQL functions
- 7 triggers
- Automation for timestamps
- Subscription status checks
- Login attempt logging

**Functions:** 5  
**Triggers:** 7

---

## ✅ Verification Steps

### 1. Check Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Output:**
```
categories
coaching_sessions
login_attempts
notification_analytics
notification_preferences
notifications
offline_queue
payment_methods
reports
subscription_payments
transactions
trusted_devices
users
```

### 2. Check RLS is Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**All tables should have:** `rowsecurity = true`

### 3. Check Policies Exist

```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Expected:** 25+ policies across all tables

### 4. Check Functions Exist

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Expected Functions:**
- check_rate_limit
- check_subscription_status
- create_default_notification_preferences
- log_login_attempt
- update_updated_at_column

### 5. Check Triggers Exist

```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Expected:** 7 triggers

### 6. Test Sample Queries

```sql
-- Insert test user
INSERT INTO users (phone_number, first_name, business_name)
VALUES ('+27812345678', 'Test User', 'Test Business')
RETURNING *;

-- Verify default notification preferences created
SELECT * FROM notification_preferences 
WHERE user_id = (SELECT id FROM users WHERE phone_number = '+27812345678');

-- Clean up
DELETE FROM users WHERE phone_number = '+27812345678';
```

---

## 🔄 Rollback Instructions

### Full Rollback (Drop Everything)

```sql
-- WARNING: This will delete ALL data!

-- Drop triggers first
DROP TRIGGER IF EXISTS create_notification_prefs_for_new_user ON users;
DROP TRIGGER IF EXISTS check_user_subscription ON users;
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
DROP TRIGGER IF EXISTS update_notification_prefs_updated_at ON notification_preferences;
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Drop functions
DROP FUNCTION IF EXISTS check_rate_limit CASCADE;
DROP FUNCTION IF EXISTS log_login_attempt CASCADE;
DROP FUNCTION IF EXISTS create_default_notification_preferences CASCADE;
DROP FUNCTION IF EXISTS check_subscription_status CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS notification_analytics CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS offline_queue CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS login_attempts CASCADE;
DROP TABLE IF EXISTS trusted_devices CASCADE;
DROP TABLE IF EXISTS subscription_payments CASCADE;
DROP TABLE IF EXISTS coaching_sessions CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### Partial Rollback (Remove Single Migration)

If you need to rollback just the latest migration:

```sql
-- Example: Rollback functions and triggers
DROP TRIGGER IF EXISTS create_notification_prefs_for_new_user ON users;
-- ... drop other triggers
DROP FUNCTION IF EXISTS check_rate_limit CASCADE;
-- ... drop other functions
```

---

## 🐛 Troubleshooting

### Issue: "relation already exists"

**Cause:** Migration was partially applied before

**Solution:**
```sql
-- Check what exists
\dt

-- Drop conflicting tables
DROP TABLE IF EXISTS [table_name] CASCADE;

-- Re-run migration
```

### Issue: "permission denied"

**Cause:** Not using service_role key or insufficient permissions

**Solution:**
```bash
# Ensure you're using the right credentials
export SUPABASE_DB_PASSWORD="your_db_password"

# Or use Supabase CLI with proper auth
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Issue: "could not connect to server"

**Cause:** Wrong connection string or network issue

**Solution:**
```bash
# Test connection first
psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres -c "SELECT 1"

# Check your Supabase project is running
# Visit: https://app.supabase.com/project/YOUR_PROJECT
```

### Issue: Functions not working

**Cause:** Missing plpgsql extension or syntax error

**Solution:**
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS plpgsql;

-- Check for errors in function
\df+ function_name

-- Re-create function
-- Copy from migration file and run
```

---

## 📝 Migration Best Practices

### 1. Always Backup First

```bash
# Backup before migration
pg_dump postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Test on Staging First

```bash
# Apply to staging project first
supabase link --project-ref STAGING_PROJECT_REF
supabase db push

# Test thoroughly
# Then apply to production
```

### 3. Run Migrations in Order

Always apply migrations in timestamp order:
1. 20241213000001
2. 20241213000002
3. 20241213000003
4. 20241213000004
5. 20241213000005

### 4. Verify After Each Migration

```bash
# After each migration
supabase db shell

-- Run verification queries
SELECT COUNT(*) FROM [new_table];
\d [new_table]

\q
```

### 5. Keep Migrations Immutable

Never modify existing migration files. Create new ones for changes:

```bash
# Don't modify: 20241213000001_initial_schema.sql
# Instead create: 20241213000006_add_user_field.sql
```

---

## 🔍 Migration Status Check

### Quick Health Check Script

```sql
-- Run this to check migration status
DO $$
DECLARE
    table_count INT;
    policy_count INT;
    function_count INT;
    trigger_count INT;
BEGIN
    SELECT COUNT(*) INTO table_count FROM information_schema.tables WHERE table_schema = 'public';
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE schemaname = 'public';
    SELECT COUNT(*) INTO function_count FROM information_schema.routines WHERE routine_schema = 'public';
    SELECT COUNT(*) INTO trigger_count FROM information_schema.triggers WHERE trigger_schema = 'public';
    
    RAISE NOTICE 'Tables: % (expected: 13)', table_count;
    RAISE NOTICE 'Policies: % (expected: 25+)', policy_count;
    RAISE NOTICE 'Functions: % (expected: 5)', function_count;
    RAISE NOTICE 'Triggers: % (expected: 7)', trigger_count;
    
    IF table_count = 13 AND policy_count >= 25 AND function_count = 5 AND trigger_count >= 7 THEN
        RAISE NOTICE '✅ All migrations applied successfully!';
    ELSE
        RAISE WARNING '⚠️  Some migrations may be missing. Check counts above.';
    END IF;
END $$;
```

---

## 📊 Expected Database Schema

After all migrations, you should have:

```
Total Tables: 13
├── users (authentication & profiles)
├── transactions (financial records)
├── reports (generated reports)
├── coaching_sessions (AI coach history)
├── categories (transaction categories)
├── notifications (notification records)
├── notification_preferences (user preferences)
├── notification_analytics (delivery tracking)
├── subscription_payments (payment history)
├── trusted_devices (device fingerprints)
├── login_attempts (rate limiting)
├── payment_methods (stored payment info)
└── offline_queue (sync queue)

Total Indexes: 40+
Total RLS Policies: 25+
Total Functions: 5
Total Triggers: 7
```

---

## 🎯 Next Steps After Migration

1. **Verify All Migrations:**
   ```bash
   supabase db shell < verify_migrations.sql
   ```

2. **Deploy Edge Functions:**
   ```bash
   supabase functions deploy voice-login
   supabase functions deploy notification-trigger
   # ... etc
   ```

3. **Test Authentication Flow:**
   - Onboarding
   - Login with OTP
   - Login with Voice PIN
   - Device trust

4. **Monitor Logs:**
   ```bash
   supabase functions logs voice-login --tail
   ```

---

## 📞 Support

If you encounter issues:

1. **Check Supabase Dashboard:**
   - https://app.supabase.com/project/YOUR_PROJECT/database/tables

2. **View Database Logs:**
   - Dashboard → Logs → Database

3. **Community Support:**
   - https://github.com/supabase/supabase/discussions

4. **Documentation:**
   - https://supabase.com/docs/guides/database

---

**Migration system ready! 🚀**

**Built with 🐝 for South African entrepreneurs**


