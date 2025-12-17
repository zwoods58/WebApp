# Supabase Database Migrations

## 📋 Migration Files

These migrations set up the complete database schema for AtarWebb.

### Migration Order:

1. **001_extensions_and_types.sql** - PostgreSQL extensions & custom enum types
2. **002_user_accounts.sql** - User accounts with subscription tiers
3. **003_draft_projects.sql** - AI builder draft projects
4. **004_subscriptions_and_payments.sql** - Subscription & payment tracking
5. **005_project_versions_and_assets.sql** - Version history & file uploads
6. **006_ecommerce_orders.sql** - E-commerce order management
7. **007_row_level_security.sql** - RLS policies for data security
8. **008_database_functions.sql** - Business logic functions
9. **009_triggers.sql** - Automated triggers
10. **010_performance_indexes.sql** - Performance optimization indexes
11. **011_file_tree_support.sql** - File tree support for agentic architecture
12. **012_code_versions.sql** - Code version history and undo/redo support
13. **013_autonomous_features.sql** - Runtime error tracking and code suggestions

---

## 🚀 How to Apply Migrations

### **Option 1: Via Supabase Dashboard (Recommended)**

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** in left sidebar
3. For each migration (in order):
   - Click **New query**
   - Copy entire file contents
   - Paste into editor
   - Click **Run**
   - Wait for "Success" message
4. Repeat for all 13 migrations in order

### **Option 2: Via Supabase CLI**

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Run all migrations
supabase db push

# Or apply migrations individually
psql $DATABASE_URL < Supabase/migrations/001_extensions_and_types.sql
psql $DATABASE_URL < Supabase/migrations/002_user_accounts.sql
# ... etc
```

### **Option 3: All at Once (Advanced)**

```bash
# Combine all migrations and run together
cat Supabase/migrations/*.sql | psql $DATABASE_URL
```

---

## ✅ Verification Steps

After running all migrations:

### **1. Check Tables Created**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables:
-- buyouts
-- code_suggestions
-- code_versions
-- draft_projects
-- order_items
-- orders
-- payments
-- project_assets
-- project_versions
-- runtime_errors
-- subscriptions
-- user_accounts
```

### **2. Check Indexes Created**

```sql
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Should show ~50+ indexes
```

### **3. Check RLS Enabled**

```sql
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- rowsecurity should be true for all tables
```

### **4. Check Functions Created**

```sql
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Expected functions:
-- apply_suggestion
-- cleanup_old_versions
-- downgrade_from_pro
-- get_error_stats
-- get_latest_version
-- get_main_component
-- get_version
-- get_version_history
-- handle_new_user
-- log_runtime_error
-- mark_error_fixed
-- process_buyout
-- restore_version
-- save_code_suggestions
-- save_code_version
-- set_admin_tier
-- update_updated_at_column
-- upgrade_to_pro
```

### **5. Check Triggers Created**

```sql
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Should show ~10+ triggers
```

---

## 🔄 Rollback (if needed)

To rollback all migrations:

```sql
-- Drop all tables (cascades to dependent objects)
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.project_assets CASCADE;
DROP TABLE IF EXISTS public.project_versions CASCADE;
DROP TABLE IF EXISTS public.buyouts CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.draft_projects CASCADE;
DROP TABLE IF EXISTS public.user_accounts CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS account_tier CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.upgrade_to_pro CASCADE;
DROP FUNCTION IF EXISTS public.downgrade_from_pro CASCADE;
DROP FUNCTION IF EXISTS public.process_buyout CASCADE;
DROP FUNCTION IF EXISTS public.set_admin_tier CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
```

---

## 📊 Database Schema Overview

### **Core Tables:**

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `user_accounts` | User account & tiers | FREE/PRO/Admin tiers |
| `draft_projects` | AI-generated websites | Stores HTML, metadata, limits |
| `subscriptions` | Pro subscriptions | Monthly $20, Flutterwave |
| `payments` | Payment history | All transactions |
| `buyouts` | One-time purchases | $150 code buyouts |
| `project_versions` | Version history | Rollback capability |
| `project_assets` | Uploaded files | Images, logos, etc. |
| `orders` | E-commerce orders | Order management |
| `order_items` | Order line items | Products in orders |
| `code_versions` | Code snapshots | Undo/redo support |
| `runtime_errors` | Error tracking | Monitoring & auto-fix |
| `code_suggestions` | Code quality | Improvement suggestions |

### **Account Tiers:**

| Tier | Features | Cost |
|------|----------|------|
| `default_draft` | 3 regenerations, 14-day preview | FREE |
| `pro_subscription` | Unlimited, live deployment, dashboard | $20/month |
| `admin` | Full system access | N/A |

### **Relationships:**

```
auth.users (Supabase Auth)
    ↓
user_accounts
    ├── draft_projects
    │   ├── project_versions
    │   ├── project_assets
    │   ├── code_versions
    │   ├── runtime_errors
    │   └── code_suggestions
    ├── subscriptions
    ├── payments
    ├── buyouts
    └── orders
        └── order_items
```

---

## 🔐 Security Features

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Users can only access their own data**
- ✅ **Admin access via service role key** (bypasses RLS)
- ✅ **Secure functions** with `SECURITY DEFINER`
- ✅ **Cascade deletes** for user data cleanup

---

## ⚡ Performance Optimizations

### **Indexes Created:** 50+

- Composite indexes for RLS checks
- Partial indexes for common filters
- GIN indexes for JSONB searches
- INCLUDE columns to avoid table lookups

### **Expected Performance:**

- **Login queries:** < 50ms (was 500-2000ms)
- **Dashboard load:** < 300ms (was 1000-3000ms)
- **RLS policy checks:** < 5ms per query

---

## 🐛 Troubleshooting

### **Issue: "relation already exists"**
**Solution:** Safe to ignore - migrations use `IF NOT EXISTS`

### **Issue: "permission denied"**
**Solution:** Use service role key or run via Supabase Dashboard

### **Issue: Slow queries after migration**
**Solution:** Run `ANALYZE` on all tables:
```sql
ANALYZE;
```

### **Issue: RLS blocks admin access**
**Solution:** Admins should use service role key in API routes, not anon key

---

## 📝 Notes

- **Idempotent:** All migrations can be run multiple times safely
- **Non-blocking:** Migrations won't affect live users
- **Tested:** All migrations tested on local and production
- **Documented:** Every table, function, and policy is commented

---

## 🎯 Next Steps After Migration

1. **⚠️ CRITICAL: Set up Auth Trigger (Required)**
   - See `011_setup_auth_trigger.md` for instructions
   - Go to Database → Webhooks → Create webhook
   - Table: `auth.users`, Events: INSERT, Function: `public.handle_new_user`
   - **This is required for new users to get accounts automatically!**

2. **Create Admin User:**
   ```sql
   SELECT public.set_admin_tier('admin@atarwebb.com');
   ```

3. **Set up Storage Buckets:**
   - Create `user-uploads` bucket (for image uploads)
   - Create `project-assets` bucket (for project files)
   - See `SUPABASE_STORAGE_SETUP.md`

4. **Test the System:**
   - Sign up a new user
   - Create a draft project
   - Test AI generation
   - Test Pro upgrade
   - Test buyout purchase

---

## 📞 Support

If you encounter issues:

1. Check migration logs for errors
2. Verify all tables created: `\dt` in psql
3. Verify indexes created: `\di` in psql
4. Check RLS policies: `SELECT * FROM pg_policies;`
5. Review error logs in Supabase Dashboard

---

**Last Updated:** 2025-01-12  
**Database Version:** PostgreSQL 15+  
**Compatible With:** Supabase Postgres

