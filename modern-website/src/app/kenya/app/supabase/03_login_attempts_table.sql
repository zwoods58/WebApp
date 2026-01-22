-- Login attempts tracking for security analytics
CREATE TABLE login_attempts (
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

-- Create indexes for performance
CREATE INDEX idx_login_attempts_user_id ON login_attempts(user_id);
CREATE INDEX idx_login_attempts_phone ON login_attempts(phone_number);
CREATE INDEX idx_login_attempts_attempt_time ON login_attempts(attempt_time);
CREATE INDEX idx_login_attempts_success ON login_attempts(success);
CREATE INDEX idx_login_attempts_country ON login_attempts(country_code);

-- Enable Row Level Security (RLS)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (users can only access their own login attempts)
CREATE POLICY "Users can only access their own login attempts" 
ON login_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admin policy for viewing all login attempts (if you have admin users)
CREATE POLICY "Admins can view all login attempts" 
ON login_attempts 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');
