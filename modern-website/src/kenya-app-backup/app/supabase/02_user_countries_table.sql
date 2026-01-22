-- Country tracking table for multi-country analytics
CREATE TABLE user_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_countries_user_id ON user_countries(user_id);
CREATE INDEX idx_user_countries_country_code ON user_countries(country_code);
CREATE INDEX idx_user_countries_created_at ON user_countries(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_countries ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (users can only access their own country data)
CREATE POLICY "Users can only access their own country data" 
ON user_countries 
FOR ALL 
USING (auth.uid() = user_id);
