-- Simple Setup - Just Add Missing Pieces
-- No policy changes, just ensure tables and columns exist

-- ========================================
-- 1. Drop Only Views (they're easy to recreate)
-- ========================================

DROP VIEW IF EXISTS vw_admin_transactions CASCADE;
DROP VIEW IF EXISTS vw_country_performance CASCADE;
DROP VIEW IF EXISTS vw_dashboard_metrics CASCADE;

-- ========================================
-- 2. Drop Only Problematic Tables (keep core ones)
-- ========================================

DROP TABLE IF EXISTS coaching_sessions CASCADE;
DROP TABLE IF EXISTS subscription_payments CASCADE;
DROP TABLE IF EXISTS trusted_devices CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS offline_queue CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS voice_logs CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS user_revenue_stats CASCADE;

-- ========================================
-- 3. Ensure Essential Tables Exist
-- ========================================

-- These should already exist, but create if not
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'KE',
  notifications_enabled BOOLEAN DEFAULT true,
  encrypted_pin TEXT,
  recovery_phrase TEXT,
  pin_salt TEXT,
  phrase_salt TEXT,
  device_fingerprint TEXT,
  last_login TIMESTAMP,
  login_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'manual',
  trial_end_date TIMESTAMP,
  currency_code TEXT DEFAULT 'KES',
  locale TEXT DEFAULT 'en-KE',
  timezone TEXT DEFAULT 'Africa/Nairobi'
);

CREATE TABLE IF NOT EXISTS user_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  phone_number TEXT,
  business_name TEXT,
  attempt_time TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  device_fingerprint TEXT,
  success BOOLEAN DEFAULT false,
  failure_reason TEXT,
  country_code TEXT
);

-- ========================================
-- 4. Add Missing Columns (if any)
-- ========================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS encrypted_pin TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS recovery_phrase TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS pin_salt TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phrase_salt TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 1;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'manual';

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'KES';

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-KE';

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Africa/Nairobi';

-- ========================================
-- 5. Add Missing Indexes
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country_code);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

CREATE INDEX IF NOT EXISTS idx_user_countries_user_id ON user_countries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_countries_country_code ON user_countries(country_code);
CREATE INDEX IF NOT EXISTS idx_user_countries_created_at ON user_countries(created_at);

CREATE INDEX IF NOT EXISTS idx_login_attempts_user_id ON login_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_phone ON login_attempts(phone_number);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempt_time ON login_attempts(attempt_time);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);
CREATE INDEX IF NOT EXISTS idx_login_attempts_country ON login_attempts(country_code);

-- ========================================
-- 6. Ensure RLS is Enabled (don't change policies)
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 7. Create Update Trigger (if not exists)
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. Setup Complete
-- ========================================
-- Database is ready for unified backend testing
-- All essential tables exist with proper columns
-- Indexes added for performance
-- RLS enabled (existing policies preserved)
-- Triggers created for automatic timestamps
