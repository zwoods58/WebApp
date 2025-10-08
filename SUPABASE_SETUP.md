# Supabase Setup for Consultation Storage

## Step 1: Create Supabase Project

1. **Go to** [supabase.com](https://supabase.com)
2. **Sign up/Login** to your account
3. **Click "New Project"**
4. **Fill in project details:**
   - **Name:** atarwebb-consultations
   - **Database Password:** (choose a strong password)
   - **Region:** Choose closest to your users
5. **Click "Create new project"**

## Step 2: Create Consultations Table

Once your project is created:

1. **Go to "Table Editor"** in your Supabase dashboard
2. **Click "Create a new table"**
3. **Table name:** `consultations`
4. **Add these columns:**

| Column Name | Type | Default Value | Nullable |
|-------------|------|---------------|----------|
| id | int8 | auto-increment | No |
| name | text | - | No |
| email | text | - | No |
| phone | text | - | Yes |
| company | text | - | Yes |
| project_details | text | - | Yes |
| preferred_date | date | - | No |
| preferred_time | time | - | No |
| has_file_upload | bool | false | No |
| status | text | 'pending' | No |
| payment_status | text | 'pending' | No |
| created_at | timestamptz | now() | No |

5. **Click "Save"**

## Step 3: Get API Keys

1. **Go to "Settings" → "API"**
2. **Copy these values:**
   - **Project URL** (starts with https://)
   - **Service Role Key** (starts with eyJ...)

## Step 4: Add Environment Variables to Vercel

**In your Vercel dashboard:**

1. **Go to your project** (atarwebb.com)
2. **Go to "Settings" → "Environment Variables"**
3. **Add these variables:**

- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Your Project URL from Step 3

- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Your Service Role Key from Step 3

## Step 5: Redeploy

After adding the environment variables:
1. **Redeploy your project**
2. **Test the consultation form**
3. **Check your admin backend** for stored consultations

## Why This Works

- **Supabase** provides a real PostgreSQL database
- **Persistent storage** that works on Vercel
- **Real-time updates** (optional)
- **Easy to manage** through Supabase dashboard
