# Vercel KV Setup for Consultation Storage

## Step 1: Create Vercel KV Database

1. **Go to your Vercel dashboard**
2. **Click on your project** (atarwebb.com)
3. **Go to "Storage" tab**
4. **Click "Create Database"**
5. **Select "KV" (Key-Value)**
6. **Name it** "consultations-kv" or similar
7. **Click "Create"**

## Step 2: Add Environment Variables

After creating the KV database, Vercel will automatically add these environment variables:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

## Step 3: Redeploy

After setting up KV:
1. **Redeploy your project**
2. **Test the consultation form**
3. **Check your admin backend** for stored consultations

## Why This Fixes the Issue

- **File storage** doesn't work on Vercel (no persistent file system)
- **Vercel KV** provides persistent key-value storage
- **Consultations will be stored** and accessible from your admin backend

## Alternative: Use Supabase

If you prefer, we can also set up Supabase for database storage instead of Vercel KV.
