-- Add PIN authentication columns to businesses table
-- This migration adds secure PIN storage with attempt tracking and lockout functionality

-- Add PIN-related columns to businesses table
ALTER TABLE businesses 
ADD COLUMN pin_hash TEXT,
ADD COLUMN pin_attempts INTEGER DEFAULT 0,
ADD COLUMN pin_locked_until BIGINT DEFAULT NULL;

-- Create index for faster lookups on locked accounts
CREATE INDEX idx_businesses_pin_locked ON businesses(pin_locked_until) WHERE pin_locked_until IS NOT NULL;

-- Add comment explaining the new columns
COMMENT ON COLUMN businesses.pin_hash IS 'Hashed 6-digit PIN for secure authentication using bcrypt';
COMMENT ON COLUMN businesses.pin_attempts IS 'Number of failed PIN attempts for rate limiting';
COMMENT ON COLUMN businesses.pin_locked_until IS 'Timestamp when account gets locked after too many failed attempts (Unix timestamp)';

-- Update existing businesses to have 0 PIN attempts (for backward compatibility)
UPDATE businesses SET pin_attempts = 0 WHERE pin_attempts IS NULL;
