-- Setup admin user for AtarWebb Solutions
-- This script creates the admin user and sets up the necessary permissions

-- First, let's create the admin user in the auth.users table
-- Note: This should be done through Supabase Dashboard or Auth API
-- The password will be hashed automatically by Supabase Auth

-- Insert admin user into our custom users table
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- We'll use a fixed UUID for the admin
  'admin@atarwebb.com',
  'AtarWebb Admin',
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = 'AtarWebb Admin',
  role = 'admin',
  status = 'active',
  updated_at = NOW();

-- Create a function to automatically create user records when auth.users are created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, status, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    'active',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions to the admin user
-- Note: RLS policies should handle this, but we can also set explicit permissions

-- Update RLS policies to ensure admin has full access
-- (These should already be in place from the main database.sql file)

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.users 
    WHERE id = user_id AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample data for testing (optional)
-- You can remove this section if you don't want sample data

-- Sample project request
INSERT INTO project_requests (
  name,
  email,
  phone,
  company,
  project_type,
  budget,
  timeline,
  description,
  requirements,
  status,
  created_at
) VALUES (
  'John Smith',
  'john@example.com',
  '+1-555-0123',
  'Acme Corp',
  'E-commerce Website',
  '$10,000 - $25,000',
  '2-3 months',
  'We need a modern e-commerce website for our online store with payment integration and inventory management.',
  'Must support multiple payment methods, mobile responsive, SEO optimized',
  'new',
  NOW()
) ON CONFLICT DO NOTHING;

-- Sample client
INSERT INTO clients (
  name,
  email,
  phone,
  company,
  status,
  source,
  notes,
  user_id,
  created_at
) VALUES (
  'Jane Doe',
  'jane@techstartup.com',
  '+1-555-0456',
  'TechStartup Inc',
  'client',
  'Website Contact Form',
  'High priority client, interested in multiple projects',
  '00000000-0000-0000-0000-000000000001',
  NOW()
) ON CONFLICT DO NOTHING;

-- Sample project
INSERT INTO projects (
  title,
  description,
  status,
  priority,
  budget,
  start_date,
  end_date,
  client_id,
  user_id,
  created_at
) VALUES (
  'TechStartup Website Redesign',
  'Complete redesign of the company website with modern UI/UX and improved performance',
  'in_progress',
  'high',
  15000,
  NOW(),
  NOW() + INTERVAL '3 months',
  (SELECT id FROM clients WHERE email = 'jane@techstartup.com' LIMIT 1),
  '00000000-0000-0000-0000-000000000001',
  NOW()
) ON CONFLICT DO NOTHING;

-- Sample analytics data
INSERT INTO analytics (
  page,
  event,
  user_id,
  session_id,
  metadata,
  created_at
) VALUES 
  ('/admin', 'page_view', '00000000-0000-0000-0000-000000000001', 'session_001', '{"source": "direct"}', NOW()),
  ('/admin', 'button_click', '00000000-0000-0000-0000-000000000001', 'session_001', '{"button": "refresh_data"}', NOW()),
  ('/admin/requests', 'page_view', '00000000-0000-0000-0000-000000000001', 'session_001', '{"tab": "requests"}', NOW())
ON CONFLICT DO NOTHING;

-- Create notification for admin setup
INSERT INTO notifications (
  type,
  recipient_email,
  recipient_name,
  subject,
  message,
  status,
  priority,
  created_at
) VALUES (
  'system',
  'admin@atarwebb.com',
  'AtarWebb Admin',
  'Admin Account Setup Complete',
  'Your admin account has been successfully set up. You can now access the admin dashboard with your credentials.',
  'sent',
  'high',
  NOW()
) ON CONFLICT DO NOTHING;
