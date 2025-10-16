# Production Environment Variables Setup

## 🚨 **CRITICAL: Fix 401 Unauthorized Errors**

Your Vercel production deployment is failing because essential environment variables are missing. Follow these steps to fix the 401 errors.

## 🔧 **Required Environment Variables**

### **1. CRON_SECRET (CRITICAL)**
This is the most likely cause of your 401 errors.

**Generate a secret:**
```bash
openssl rand -base64 32
```

**Add to Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `CRON_SECRET` = [your generated secret]
3. Environment: **Production** (and optionally Preview/Development)

### **2. Supabase Configuration**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### **3. JWT Secret**
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### **4. SMTP Configuration (for emails)**
```
SMTP_HOST=smtp.neo.space
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@neo.space
SMTP_PASSWORD=your-neo-space-password
SMTP_FROM=admin@atarwebb.com
```

### **5. App Configuration**
```
NEXT_PUBLIC_APP_URL=https://atarwebb.com
NEXT_PUBLIC_APP_NAME=AtarWebb
```

### **6. Debug Key (Optional)**
```
DEBUG_KEY=your-debug-key-for-troubleshooting
```

## 🧪 **Testing Your Setup**

### **Step 1: Check Environment Variables**
After setting up the environment variables, test them:

```bash
# Replace YOUR_DOMAIN with your actual Vercel domain
curl "https://YOUR_DOMAIN.vercel.app/api/debug/env?key=YOUR_DEBUG_KEY"
```

This will show you which environment variables are properly set.

### **Step 2: Test Cron Jobs Manually**
```bash
# Test a cron job manually
curl -X GET "https://YOUR_DOMAIN.vercel.app/api/cron/score-leads" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### **Step 3: Check Vercel Logs**
1. Go to Vercel Dashboard → Your Project → Functions
2. Look for any error logs in the cron job functions
3. Check the "Logs" tab for detailed error information

## 🚀 **Deployment Steps**

1. **Set all environment variables** in Vercel dashboard
2. **Redeploy your application:**
   ```bash
   git add .
   git commit -m "Fix production environment variables"
   git push origin main-production
   ```
3. **Wait for deployment** to complete
4. **Test the endpoints** using the curl commands above

## 🔍 **Troubleshooting 401 Errors**

### **Common Causes:**

1. **Missing CRON_SECRET** - Most common cause
2. **Wrong environment** - Variables set in Development but not Production
3. **Typos** - Check variable names are exactly correct
4. **Case sensitivity** - Environment variable names are case-sensitive

### **Debug Steps:**

1. **Check the debug endpoint** to see what's missing
2. **Look at Vercel function logs** for detailed error messages
3. **Verify cron jobs** are listed in Vercel dashboard
4. **Test manually** with curl commands

## ✅ **Success Indicators**

You'll know it's working when:
- ✅ Debug endpoint shows all variables as "SET"
- ✅ Manual cron job tests return success
- ✅ Vercel dashboard shows cron jobs running
- ✅ No 401 errors in function logs
- ✅ You receive automated emails

## 🆘 **Still Getting 401 Errors?**

If you're still getting 401 errors after following these steps:

1. **Double-check** all environment variable names and values
2. **Redeploy** after making changes
3. **Check Vercel logs** for specific error details
4. **Test each endpoint individually** to isolate the problem

The most common issue is the `CRON_SECRET` not being set in the Production environment in Vercel.

