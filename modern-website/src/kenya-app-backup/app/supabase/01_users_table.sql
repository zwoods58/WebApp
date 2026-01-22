-- Main users table with all user data
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'KE',
  notifications_enabled BOOLEAN DEFAULT true,
  
  -- Security credentials (encrypted)
  encrypted_pin TEXT,
  recovery_phrase TEXT,
  pin_salt TEXT,
  phrase_salt TEXT,
  
  -- Device & session data
  device_fingerprint TEXT,
  last_login TIMESTAMP,
  login_count INTEGER DEFAULT 1,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'manual',
  trial_end_date TIMESTAMP,
  
  -- Country-specific data
  currency_code TEXT DEFAULT 'KES',
  locale TEXT DEFAULT 'en-KE',
  timezone TEXT DEFAULT 'Africa/Nairobi'
);

-- Create indexes for performance
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_country ON users(country_code);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (users can only access their own data)
CREATE POLICY "Users can only access their own data" 
ON users 
FOR ALL 
USING (auth.uid() = id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
