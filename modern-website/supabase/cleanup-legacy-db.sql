-- ═══════════════════════════════════════════════════════════════
-- DATABASE CLEANUP SCRIPT (V2 AUTH MIGRATION)
-- ═══════════════════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor to remove legacy artifacts
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- 1. DROP LEGACY TABLES (Careful: ensure you don't need this data!)
-- These were used by the old 12-phrase system and are now redundant.
DROP TABLE IF EXISTS "public"."users" CASCADE;
DROP TABLE IF EXISTS "public"."trusted_devices" CASCADE;

-- 2. CLEANUP MIGRATION HISTORY
-- This removes the record of old migrations from the dashboard view.
-- Replace name strings with the exact names from your dashboard if they differ.
DELETE FROM supabase_migrations.schema_migrations 
WHERE version IN (
    '20240107_create_users_table',
    '20260114090412_add_trusted_devices_table', 
    '20260114090807_fix_uuid_defaults',
    '20260114110000_auth_v2'
);

COMMIT;

-- ═══════════════════════════════════════════════════════════════
-- CLEANUP COMPLETE
-- ═══════════════════════════════════════════════════════════════
-- Your backend is now 100% focused on the V2 (Business User) system.
