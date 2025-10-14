-- Fix Supabase RLS (Row Level Security) Issues
-- Run this in your Supabase SQL Editor

-- Option 1: Disable RLS for testing (simpler approach)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Option 2: Enable RLS with permissive policies (if you want to keep RLS enabled)
-- Uncomment the lines below if you prefer to keep RLS enabled

/*
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for leads
CREATE POLICY "Allow all operations on leads" ON leads
    FOR ALL USING (true) WITH CHECK (true);

-- Create permissive policies for tasks
CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL USING (true) WITH CHECK (true);

-- Create permissive policies for users
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL USING (true) WITH CHECK (true);

-- Create permissive policies for bookings
CREATE POLICY "Allow all operations on bookings" ON bookings
    FOR ALL USING (true) WITH CHECK (true);
*/

-- Verify RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('leads', 'tasks', 'users', 'bookings');
