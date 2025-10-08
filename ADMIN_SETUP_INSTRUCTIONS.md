# Admin User Setup Instructions

## 🔐 Creating Your Admin User

To set up your admin user with the credentials:
- **Email:** admin@atarwebb.com
- **Password:** Atarwebroyalblue#28

### Method 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `paqhkcdqrbhyfsntcdnz`

2. **Navigate to Authentication:**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Create New User:**
   - Click "Add user" button
   - Enter the following details:
     - **Email:** admin@atarwebb.com
     - **Password:** Atarwebroyalblue#28
     - **Email Confirm:** ✅ (checked)
     - **User Metadata:**
       ```json
       {
         "full_name": "AtarWebb Admin",
         "role": "admin"
       }
       ```

4. **Create User Record in Database:**
   - Go to "SQL Editor" in the left sidebar
   - Run this SQL query:

   ```sql
   -- Insert admin user into our users table
   INSERT INTO users (
     id,
     email,
     full_name,
     role,
     status,
     created_at,
     updated_at
   ) VALUES (
     (SELECT id FROM auth.users WHERE email = 'admin@atarwebb.com'),
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
   ```

### Method 2: Using Supabase CLI (Alternative)

If you have Supabase CLI installed:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref paqhkcdqrbhyfsntcdnz

# Create admin user
supabase auth users create admin@atarwebb.com --password "Atarwebroyalblue#28" --email-confirm
```

### Method 3: Using the Setup Script (If you have service role key)

1. **Get your Service Role Key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the "service_role" key (not the anon key)

2. **Update your env.local file:**
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

3. **Run the setup script:**
   ```bash
   node src/lib/setup-admin.js
   ```

## 🎯 After Setup

Once the admin user is created:

1. **Visit your admin dashboard:**
   - URL: https://web-j6766d0lx-zwoods58s-projects.vercel.app/admin

2. **Login with:**
   - Email: admin@atarwebb.com
   - Password: Atarwebroyalblue#28

3. **You should see:**
   - Full admin dashboard with all features
   - Sample data (project requests, clients, projects)
   - All CRUD operations working
   - File upload system
   - Email notifications
   - Search and filtering

## 🔧 Troubleshooting

### If login doesn't work:
1. Check that the user was created in Supabase Auth
2. Verify the user record exists in the `users` table
3. Check that RLS policies allow admin access
4. Clear browser cache and try again

### If you get permission errors:
1. Make sure the user has `role = 'admin'` in the users table
2. Check that RLS policies are properly configured
3. Verify the user ID matches between auth.users and users table

## 📞 Support

If you encounter any issues, check:
1. Supabase Dashboard → Authentication → Users
2. Supabase Dashboard → Table Editor → users table
3. Browser console for any JavaScript errors
4. Network tab for failed API calls

The admin dashboard is fully functional with all the features we implemented!
