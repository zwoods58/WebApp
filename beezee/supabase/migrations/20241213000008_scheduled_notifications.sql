-- Scheduled Notifications Migration
-- Sets up pg_cron jobs for automated notification scheduling
--
-- IMPORTANT: Before running this migration, you need to:
-- 1. Enable pg_cron extension in Supabase Dashboard → Database → Extensions
-- 2. Enable pg_net extension (for HTTP calls) in Supabase Dashboard → Database → Extensions
-- 3. Replace YOUR_PROJECT_REF and YOUR_SERVICE_ROLE_KEY with actual values
--
-- To find these values:
-- 1. Go to Supabase Dashboard → Settings → API
-- 2. Project URL: https://YOUR_PROJECT_REF.supabase.co
-- 3. Service Role Key: Copy from "service_role" secret (keep it secret!)

-- ============================================
-- ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- SCHEDULED NOTIFICATION JOBS
-- ============================================
-- These cron jobs call the notification-cron Edge Function
-- Replace placeholders with your actual values before running

-- ============================================
-- TRIAL DAY 3 CHECK-IN
-- Runs daily at 10:00 AM
-- ============================================
SELECT cron.schedule(
  'trial-day-3-checkin',
  '0 10 * * *', -- Daily at 10 AM (UTC)
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notification-cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object('job_type', 'trial_day_3')
    )
  $$
);

-- ============================================
-- TRIAL ENDING REMINDER
-- Runs daily at 9:00 AM
-- ============================================
SELECT cron.schedule(
  'trial-ending-reminder',
  '0 9 * * *', -- Daily at 9 AM (UTC)
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notification-cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object('job_type', 'trial_day_6')
    )
  $$
);

-- ============================================
-- WEEKLY SUMMARY
-- Runs every Sunday at 6:00 PM (18:00)
-- ============================================
SELECT cron.schedule(
  'weekly-summary',
  '0 18 * * 0', -- Sunday at 6 PM (UTC)
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notification-cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object('job_type', 'weekly_summary')
    )
  $$
);

-- ============================================
-- PAYMENT DUE REMINDER
-- Runs daily at 8:00 AM
-- ============================================
SELECT cron.schedule(
  'payment-due-reminder',
  '0 8 * * *', -- Daily at 8 AM (UTC)
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notification-cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object('job_type', 'payment_due')
    )
  $$
);

-- ============================================
-- INACTIVITY NUDGE
-- Runs daily at 11:00 AM
-- ============================================
SELECT cron.schedule(
  'inactivity-nudge',
  '0 11 * * *', -- Daily at 11 AM (UTC)
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notification-cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object('job_type', 'inactivity_nudge')
    )
  $$
);

-- ============================================
-- CLEANUP OLD NOTIFICATIONS
-- Runs daily at 2:00 AM
-- ============================================
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 2 * * *', -- Daily at 2 AM (UTC)
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notification-cron',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object('job_type', 'cleanup')
    )
  $$
);

-- ============================================
-- USAGE NOTES
-- ============================================
-- 
-- VIEW ALL SCHEDULED JOBS:
-- SELECT * FROM cron.job;
--
-- UNSCHEDULE A JOB:
-- SELECT cron.unschedule('job-name');
-- Example: SELECT cron.unschedule('trial-day-3-checkin');
--
-- UPDATE A JOB:
-- First unschedule, then reschedule with new parameters
--
-- TIMEZONE NOTE:
-- All times are in UTC. Adjust the cron schedule if you need
-- different timezones. For example, South Africa (SAST) is UTC+2,
-- so 10 AM SAST = 8 AM UTC.

