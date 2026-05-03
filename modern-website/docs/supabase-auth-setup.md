# Supabase Authentication Configuration Guide

## 🎯 Overview
This guide will help you configure email confirmation settings for your BeeZee app's new Supabase authentication system.

## 📋 Prerequisites
- ✅ Database schema updated with `supabase_user_id` column
- ✅ RLS policies updated for new auth system
- ✅ Authentication code implemented
- ✅ Supabase project: `zruprmhkcqhgzydjfhrk`

## 🔧 Manual Configuration Steps

### Step 1: Access Supabase Dashboard
1. Go to: https://zruprmhkcqhgzydjfhrk.supabase.co
2. Navigate to: **Authentication** → **Settings**

### Step 2: Enable Email Confirmations
1. Find the **"Enable email confirmations"** toggle
2. Turn it **ON** (it should be enabled by default)
3. Save the settings

### Step 3: Configure Site URLs
1. **Site URL**: `http://localhost:3000` (for development)
   - For production: `https://yourdomain.com`
2. **Redirect URLs**: Add the following:
   - `http://localhost:3000/Beezee-App/auth/callback`
   - `http://localhost:3000/Beezee-App/auth/confirmation`
3. **Additional Redirect URLs** (optional):
   - `http://localhost:3000/Beezee-App/auth/update-password`

### Step 4: Email Templates (Optional)
Navigate to **Authentication** → **Email Templates** to customize:

#### Confirmation Email Template
- **Template Type**: Sign up confirmation
- **Subject**: Confirm your BeeZee account
- **Variables available**:
  - `{{ .ConfirmationURL }}` - Confirmation link
  - `{{ .Email }}` - User's email
  - `{{ .SiteURL }}` - Your app URL

#### Password Reset Template
- **Template Type**: Password recovery
- **Subject**: Reset your BeeZee password
- **Variables available**:
  - `{{ .ConfirmationURL }}` - Password reset link
  - `{{ .Email }}` - User's email

### Step 5: SMTP Settings (if using custom email)
If you want to use your own SMTP server instead of Supabase's:
1. Go to **Authentication** → **Email Providers**
2. Add custom SMTP provider
3. Configure with your email service credentials

## 🧪 Testing Configuration

### Test Email Confirmation
1. Run your development server: `npm run dev`
2. Go to: `http://localhost:3000/Beezee-App/auth/signup`
3. Create a test account with a real email
4. Check the email for confirmation link
5. Click the link to verify it works

### Test Password Reset
1. Go to: `http://localhost:3000/Beezee-App/auth/forgot-password`
2. Enter the test email
3. Check email for reset link
4. Follow the link and set new password

## 🔍 Troubleshooting

### Issue: Emails not being sent
**Solution**: 
- Check if email confirmations are enabled in dashboard
- Verify SMTP settings (if using custom email)
- Check spam/junk folders

### Issue: Confirmation links not working
**Solution**:
- Verify redirect URLs match exactly
- Check that URLs are accessible
- Ensure no trailing slashes or protocol issues

### Issue: RLS policies blocking access
**Solution**:
- Run this SQL to check business associations:
```sql
SELECT email, supabase_user_id, created_at 
FROM businesses 
WHERE supabase_user_id IS NOT NULL;
```

## 📱 Mobile App Configuration

If you have a mobile app, add these additional redirect URLs:
- `beezeeapp://auth/callback`
- `beezeeapp://auth/confirmation`

## 🚀 Production Deployment

For production deployment, update these values:

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://zruprmhkcqhgzydjfhrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Supabase Dashboard Settings
- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: 
  - `https://yourdomain.com/Beezee-App/auth/callback`
  - `https://yourdomain.com/Beezee-App/auth/confirmation`
  - `https://yourdomain.com/Beezee-App/auth/update-password`

## ✅ Verification Checklist

- [ ] Email confirmations enabled
- [ ] Site URL configured correctly
- [ ] Redirect URLs added
- [ ] Email templates customized (optional)
- [ ] Test signup flow works
- [ ] Test password reset works
- [ ] Test login with confirmed email
- [ ] RLS policies working correctly

## 🆘 Support

If you encounter issues:
1. Check Supabase logs: Authentication → Logs
2. Review this guide's troubleshooting section
3. Ensure your development server is running
4. Verify environment variables are correct

---

**Once configured, your Supabase email confirmation system will be fully operational!** 🎉
