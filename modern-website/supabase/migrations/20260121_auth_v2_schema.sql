-- ═══════════════════════════════════════════════════════════════
-- Beezee V2 Authentication System - Database Schema
-- Migration: Complete rebuild from 12-word mnemonic to Phone + PIN
-- Date: 2026-01-21
-- Note: This script drops existing V2 tables to ensure a clean rebuild.
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 0. CLEAN SLATE (Hard Cutoff Rebuild)
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS auth_audit_log CASCADE;
DROP TABLE IF EXISTS verification_codes CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS business_users CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- 1. CORE IDENTITY TABLE
-- Stores user credentials and recovery information
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE business_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Authentication Credentials
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  country_code VARCHAR(3) NOT NULL,           -- 'KE', 'NG', 'ZA'
  pin_hash TEXT NOT NULL,                     -- Argon2id hashed (NEVER plain text)
  
  -- Business Information
  business_name VARCHAR(255) NOT NULL,
  
  -- Multi-Factor Recovery (Prevents SIM-swap attacks)
  backup_email VARCHAR(255) UNIQUE NOT NULL,   -- Required for recovery
  backup_email_verified BOOLEAN DEFAULT FALSE,
  security_answer_hash TEXT NOT NULL,          -- Normalized business name hash
  
  -- Rate Limiting (Prevents brute-force)
  failed_attempts INT DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Phase 2: Advanced Security (Optional - implement later)
  trusted_contact_phone VARCHAR(20),
  trusted_contact_name VARCHAR(255),
  trusted_contact_verified BOOLEAN DEFAULT FALSE,
  security_tier VARCHAR(20) DEFAULT 'standard'  -- 'standard' | 'advanced'
);

COMMENT ON TABLE business_users IS 'Primary user identity table - stores authentication credentials';
COMMENT ON COLUMN business_users.pin_hash IS 'Argon2id hash - NEVER store plain PIN';
COMMENT ON COLUMN business_users.security_answer_hash IS 'Normalized hash of business name for recovery';

-- ═══════════════════════════════════════════════════════════════
-- 2. STATEFUL SESSION MANAGEMENT (The Kill Switch)
-- Enables instant remote logout of stolen devices
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES business_users(id) ON DELETE CASCADE,
  
  -- Token Management
  refresh_token_hash TEXT UNIQUE NOT NULL,      -- SHA-256 hash of refresh token
  
  -- Device Tracking
  device_fingerprint TEXT,
  device_name VARCHAR(255),                     -- e.g., "Chrome on Android"
  
  -- Session Control (The Kill Switch)
  revoked BOOLEAN DEFAULT FALSE,                -- Set to TRUE to kill session
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason VARCHAR(50),                   -- 'user_initiated', 'pin_changed', 'security_event'
  
  -- Lifecycle
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- 30 days from creation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE user_sessions IS 'Active sessions - enables instant revocation (kill switch)';
COMMENT ON COLUMN user_sessions.revoked IS 'Set to TRUE to immediately invalidate token';

-- ═══════════════════════════════════════════════════════════════
-- 3. SMS/EMAIL VERIFICATION CODES
-- Temporary codes for signup and recovery
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_or_email VARCHAR(255) NOT NULL,        -- Phone number OR email address
  code VARCHAR(6) NOT NULL,                    -- 6-digit numeric code
  purpose VARCHAR(20) NOT NULL,                -- 'signup', 'recovery', 'email_verify'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- 10 minutes from creation
  used BOOLEAN DEFAULT FALSE,                  -- Prevent code reuse
  attempts INT DEFAULT 0,                      -- Track failed attempts
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE verification_codes IS 'Temporary verification codes - auto-expire after 10 minutes';
COMMENT ON COLUMN verification_codes.attempts IS 'Lock after 3 failed attempts';

-- ═══════════════════════════════════════════════════════════════
-- 4. SECURITY AUDIT LOG
-- Track all authentication events for security monitoring
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE auth_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES business_users(id),
  phone_number VARCHAR(20),                     -- Store even if user doesn't exist
  event_type TEXT NOT NULL,                     -- 'login_success', 'login_fail', 'pin_reset', etc.
  ip_address INET,
  user_agent TEXT,
  country_code VARCHAR(3),
  metadata JSONB,                               -- Additional context
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE auth_audit_log IS 'Security audit trail - never delete';

-- ═══════════════════════════════════════════════════════════════
-- PERFORMANCE INDEXES
-- Critical for fast lookups at scale
-- ═══════════════════════════════════════════════════════════════

-- Primary lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON business_users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON business_users(backup_email);
CREATE INDEX IF NOT EXISTS idx_users_country ON business_users(country_code);

-- Session validation (queried on EVERY request)
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id, revoked);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at, revoked);

-- Verification lookups
CREATE INDEX IF NOT EXISTS idx_verification_phone ON verification_codes(phone_or_email, used, expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_purpose ON verification_codes(purpose, used);

-- Audit queries
CREATE INDEX IF NOT EXISTS idx_audit_user ON auth_audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_event ON auth_audit_log(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_phone ON auth_audit_log(phone_number, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- SECURITY: Row Level Security (RLS)
-- Prevent unauthorized data access
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE business_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for Edge Functions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_users' 
    AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access" ON business_users
      FOR ALL TO service_role USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_sessions' 
    AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access" ON user_sessions
      FOR ALL TO service_role USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verification_codes' 
    AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access" ON verification_codes
      FOR ALL TO service_role USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_audit_log' 
    AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access" ON auth_audit_log
      FOR ALL TO service_role USING (true);
  END IF;
END $$;
