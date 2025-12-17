# Admin Dashboard Setup

This guide explains how to set up and access the admin dashboard for AtarWebb Solutions.

## Admin Credentials

- **Email**: `admin@atarwebb.com`
- **Password**: `Royalblue#28`

## Setup Instructions

### Option 1: Using the Setup Script (Recommended)

1. Make sure you have the Supabase Service Role Key:
   - Go to Supabase Dashboard > Settings > API
   - Copy the `service_role` key (not the anon key)
   - Add it to your `.env.local` file:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

2. Run the setup script:
   ```bash
   node scripts/setup-admin.js
   ```

3. The script will:
   - Create the admin user in Supabase Auth
   - Set the account tier to 'admin'
   - Confirm the email automatically

### Option 2: Manual Setup via Supabase Dashboard

1. **Create the Auth User**:
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Add User" or "Invite User"
   - Email: `admin@atarwebb.com`
   - Password: `Royalblue#28`
   - Auto Confirm: Yes (to skip email verification)
   - Click "Create User"

2. **Set Admin Tier**:
   - Go to Supabase Dashboard > SQL Editor
   - Run this query:
     ```sql
     UPDATE public.user_accounts
     SET account_tier = 'admin'
     WHERE email = 'admin@atarwebb.com';
     ```

## Accessing the Admin Dashboard

1. Navigate to `/admin/login` in your application
2. Enter the admin credentials
3. You'll be redirected to `/admin/dashboard`

## Dashboard Features

The admin dashboard provides:

- **User Analytics**: Total users, active subscriptions, revenue, buyouts
- **Geographic Data**: Users by country and city
- **Industry Analytics**: Users by business type/industry
- **Recent Activity**: Latest users and payments
- **Real-time Refresh**: Update data with the refresh button

## Security Notes

- The admin dashboard is protected by authentication
- Only users with `account_tier = 'admin'` can access it
- Regular users will be redirected to the login page
- Always use the service role key securely and never expose it in client-side code

## Troubleshooting

### Can't Login
- Verify the user exists in Supabase Auth
- Check that `account_tier` is set to 'admin' in `user_accounts` table
- Ensure email confirmation is not required (or user is confirmed)

### No Data Showing
- Check that you have data in the database tables
- Verify RLS policies allow admin access (or use service role key)
- Check browser console for errors

### Permission Denied
- Ensure the user's `account_tier` is set to 'admin'
- Check Supabase RLS policies
- Verify you're using the correct Supabase project


