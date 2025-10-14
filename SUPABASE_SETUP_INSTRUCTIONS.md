# Supabase Setup Instructions

## 📋 Prerequisites

You have:
- Supabase URL: `https://paqhkcdqrbhyfsntcdnz.supabase.co`
- Supabase Anon Key: (you'll add this)

## 🚀 Step-by-Step Setup

### Step 1: Add Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://paqhkcdqrbhyfsntcdnz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Email Configuration - SMTP Settings
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-brevo-smtp-key
SMTP_FROM=admin@atarwebb.com

# Vercel Cron Job Security
CRON_SECRET=IdrCTXnIRR1767UPlC/wN+tMy7Z69nAIQxe54Fn8Oyo=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AtarWebb CRM
```

### Step 2: Run SQL Schema in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com/
2. Select your project (`paqhkcdqrbhyfsntcdnz`)
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-schema.sql`
6. Click **Run** button

This will create:
- `users` table (for admin and sales users)
- `leads` table (for CRM leads)
- `tasks` table (for tasks and notes sync)
- `bookings` table (for consultation/contact bookings)
- All necessary indexes
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps
- Default admin and sales users

### Step 3: Verify Tables Created

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these tables:
   - users
   - leads
   - tasks
   - bookings

### Step 4: Test Default Users

Two users are automatically created:

**Admin User:**
- Email: `admin@atarwebb.com`
- Password: `admin123`
- Role: ADMIN

**Sales User:**
- Email: `sales@atarwebb.com`
- Password: `admin123`
- Role: SALES

### Step 5: Get Your Anon Key

1. In Supabase Dashboard, go to **Settings** → **API**
2. Find the **anon public** key
3. Copy it
4. Add it to your `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 6: Restart Development Server

```bash
# Stop the current dev server (Ctrl+C if running)
npm run dev
```

## 📊 Database Structure

### Users Table
- Stores admin and sales user accounts
- Supports role-based access (ADMIN, SALES)
- Passwords are bcrypt hashed

### Leads Table
- All CRM lead data
- Includes: contact info, company, status, score, notes
- Linked to users (assigned sales rep)
- Tracks: source, industry, location, timeline

### Tasks Table
- CRM tasks and reminders
- Links to leads for notes sync feature
- Tracks: priority, status, due date, assignment

### Bookings Table
- Consultation and contact form bookings
- 30-minute time slots
- Tracks: date, time, duration, type, status
- Prevents double-booking

## 🔒 Security (Row Level Security)

RLS is enabled on all tables:

**Users:**
- Admins can see all users
- Sales users can only see themselves

**Leads:**
- Admins can see all leads
- Sales users can only see their assigned leads

**Tasks:**
- Admins can see all tasks
- Sales users can only see their assigned tasks

**Bookings:**
- Everyone can read (to check availability)
- Authenticated users can create bookings
- Only admins can update/delete bookings

## 🧪 Testing

After setup, test the connection:

1. Start your dev server: `npm run dev`
2. Go to: http://localhost:3000/admin
3. Login with admin credentials
4. Try importing leads
5. Try creating a task
6. Test the booking system

## 🚨 Troubleshooting

### "relation does not exist" error
- Make sure you ran the entire SQL schema
- Check that all tables were created in Table Editor

### "JWT expired" or auth errors
- Check that your Supabase URL and Anon Key are correct
- Verify they're in `.env.local`
- Restart your dev server

### RLS policy errors
- The policies are set up for authenticated users
- For development, you can temporarily disable RLS in Supabase Dashboard
- Go to Table → Policies → Disable

### Cannot insert/update data
- Check RLS policies are correct
- Verify user roles are set properly
- Check Supabase logs in Dashboard

## 📝 Default Credentials

**For Testing:**
- Admin: `admin@atarwebb.com` / `admin123`
- Sales: `sales@atarwebb.com` / `admin123`

**⚠️ IMPORTANT: Change these passwords in production!**

## 🔄 Migrating Existing Data

If you have data in the mock database you want to keep:

1. Export leads from mock-db (if any)
2. Use Supabase Dashboard → Table Editor → Insert rows
3. Or use the import feature in your CRM

## ✅ Next Steps

After Supabase is set up:
1. Update API routes to use Supabase (in progress)
2. Test all CRM features
3. Deploy to Vercel
4. Add your actual SMTP credentials for emails

## 📞 Need Help?

If you encounter issues:
1. Check Supabase Dashboard logs
2. Check browser console for errors
3. Verify environment variables are loaded
4. Make sure tables were created successfully

