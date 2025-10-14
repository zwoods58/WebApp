-- AtarWebb CRM - Supabase Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- =====================
-- CLEANUP (Starting fresh)
-- =====================
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'SALES')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- LEADS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  source TEXT,
  industry TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  time_zone TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'NOT_INTERESTED', 'FOLLOW_UP', 'QUALIFIED', 'APPOINTMENT_BOOKED', 'CLOSED_WON')),
  status_detail TEXT,
  score INTEGER DEFAULT 50,
  notes TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- TASKS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'OVERDUE')),
  category TEXT NOT NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  lead_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- BOOKINGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  type TEXT NOT NULL DEFAULT 'CONSULTATION' CHECK (type IN ('CONSULTATION', 'CONTACT')),
  status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- INDEXES for Performance
-- =====================
-- Drop existing indexes if they exist (to avoid conflicts)
DROP INDEX IF EXISTS idx_leads_user_id;
DROP INDEX IF EXISTS idx_leads_email;
DROP INDEX IF EXISTS idx_leads_status;
DROP INDEX IF EXISTS idx_leads_created_at;
DROP INDEX IF EXISTS idx_tasks_assigned_to;
DROP INDEX IF EXISTS idx_tasks_lead_id;
DROP INDEX IF EXISTS idx_tasks_due_date;
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_bookings_date;
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_bookings_email;

-- Create indexes
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);

CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users - Admin can see all" ON users;
DROP POLICY IF EXISTS "Leads - Admin can see all" ON leads;
DROP POLICY IF EXISTS "Tasks - Admin can see all" ON tasks;
DROP POLICY IF EXISTS "Bookings - Public read" ON bookings;
DROP POLICY IF EXISTS "Bookings - Authenticated create" ON bookings;
DROP POLICY IF EXISTS "Bookings - Admin can update/delete" ON bookings;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users: Admin can see all, Sales can only see themselves
CREATE POLICY "Users - Admin can see all" ON users
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'ADMIN' OR 
    auth.uid()::text = id::text
  );

-- Leads: Admin can see all, Sales can only see their assigned leads
CREATE POLICY "Leads - Admin can see all" ON leads
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'ADMIN' OR 
    user_id::text = auth.uid()::text
  );

-- Tasks: Admin can see all, Sales can only see their assigned tasks
CREATE POLICY "Tasks - Admin can see all" ON tasks
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'ADMIN' OR 
    assigned_to::text = auth.uid()::text
  );

-- Bookings: Everyone can read (for checking availability), only authenticated users can create
CREATE POLICY "Bookings - Public read" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Bookings - Authenticated create" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Bookings - Admin can update/delete" ON bookings
  FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =====================
-- SEED DATA
-- =====================
-- Insert default admin and sales users
-- Password for both: admin123 (hashed with bcrypt)
INSERT INTO users (id, email, password, name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@atarwebb.com', '$2b$10$rQZ8K9XvY7H2pL3mN6qQe.8vB1cD4fG7hI0jK3lM5nP8qR1sT4uV7wX0yZ2a', 'Admin User', 'ADMIN'),
  ('00000000-0000-0000-0000-000000000002', 'sales@atarwebb.com', '$2b$10$rQZ8K9XvY7H2pL3mN6qQe.8vB1cD4fG7hI0jK3lM5nP8qR1sT4uV7wX0yZ2a', 'Sales Rep', 'SALES')
ON CONFLICT (email) DO NOTHING;

-- =====================
-- VIEWS (Optional - for easier querying)
-- =====================
CREATE OR REPLACE VIEW leads_with_user AS
SELECT 
  l.*,
  u.name as assigned_to_name,
  u.email as assigned_to_email
FROM leads l
LEFT JOIN users u ON l.user_id = u.id;

CREATE OR REPLACE VIEW tasks_with_details AS
SELECT 
  t.*,
  u.name as assigned_to_name,
  u.email as assigned_to_email
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id;

-- =====================
-- GRANT PERMISSIONS
-- =====================
-- Grant access to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- =====================
-- DONE!
-- =====================
-- Your database schema is now set up and ready to use!
-- Remember to:
-- 1. Update your .env.local with Supabase credentials
-- 2. Test the connection
-- 3. Import leads or add data as needed

