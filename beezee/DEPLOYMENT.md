# 🚀 Deployment Guide - BeeZee Finance

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are configured:

**Frontend (Vercel/Netlify)**
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `VITE_SUPABASE_FUNCTIONS_URL`
- ✅ `VITE_APP_NAME`
- ✅ `VITE_MONTHLY_PRICE`
- ✅ `VITE_TRIAL_DAYS`

**Backend (Supabase Edge Functions)**
- ✅ `GEMINI_API_KEY`
- ✅ `TWILIO_ACCOUNT_SID`
- ✅ `TWILIO_AUTH_TOKEN`
- ✅ `TWILIO_WHATSAPP_NUMBER`

### 2. Database Setup
- ✅ Run `schema.sql` in Supabase SQL Editor
- ✅ Verify all tables created
- ✅ Verify RLS policies enabled
- ✅ Create storage bucket for receipts

### 3. Edge Functions
- ✅ Deploy all 5 Edge Functions
- ✅ Test each function individually
- ✅ Verify secrets are set

### 4. Testing
- ✅ Test offline functionality
- ✅ Test service worker registration
- ✅ Test PWA installation
- ✅ Test on Android device
- ✅ Test authentication flow
- ✅ Test transaction sync

## Deployment Steps

### Deploy to Vercel

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# First deployment (creates project)
vercel

# Production deployment
vercel --prod
```

#### 4. Configure Environment Variables
Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all required variables for Production, Preview, and Development.

#### 5. Configure Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase Auth allowed domains

### Deploy to Netlify

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify
```bash
netlify login
```

#### 3. Initialize Site
```bash
netlify init
```

#### 4. Deploy
```bash
# Deploy to production
netlify deploy --prod
```

#### 5. Configure Environment Variables
```bash
# Using CLI
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
# ... repeat for all variables

# Or via Netlify Dashboard
# Go to Site Settings → Environment Variables
```

### Deploy Supabase Edge Functions

#### 1. Install Supabase CLI
```bash
npm install -g supabase
```

#### 2. Login and Link Project
```bash
supabase login
supabase link --project-ref your-project-ref
```

#### 3. Deploy Functions
```bash
# Deploy all functions
supabase functions deploy voice-to-transaction
supabase functions deploy receipt-to-transaction
supabase functions deploy generate-report
supabase functions deploy financial-coach
supabase functions deploy notification-trigger
```

#### 4. Set Secrets
```bash
supabase secrets set GEMINI_API_KEY=your-key
supabase secrets set TWILIO_ACCOUNT_SID=your-sid
supabase secrets set TWILIO_AUTH_TOKEN=your-token
supabase secrets set TWILIO_WHATSAPP_NUMBER=your-number
```

#### 5. Verify Deployment
```bash
# List deployed functions
supabase functions list

# View function logs
supabase functions logs voice-to-transaction
```

## Post-Deployment Configuration

### 1. Update Supabase Auth Settings

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL**: `https://your-domain.com`

**Redirect URLs**: 
- `https://your-domain.com`
- `https://your-domain.com/**`

### 2. Configure CORS

In Supabase Dashboard → Settings → API:

Add your domain to allowed origins.

### 3. Set Up WhatsApp Business

1. Create Twilio account
2. Set up WhatsApp Business profile
3. Configure webhook URL to Supabase Edge Function
4. Test message sending

### 4. Configure Google Gemini API

1. Create Google Cloud project
2. Enable Vertex AI API
3. Create API key with Gemini access
4. Set quota limits to control costs

### 5. CDN Configuration (Recommended for South Africa)

Use Cloudflare for better performance in South Africa:

1. Sign up for Cloudflare
2. Add your domain
3. Update nameservers
4. Enable:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - Always Use HTTPS
   - HTTP/3 (with QUIC)

### 6. Monitoring Setup

#### Vercel Analytics
```bash
# Install package
npm install @vercel/analytics

# Add to main.jsx
import { Analytics } from '@vercel/analytics/react';

// In render:
<Analytics />
```

#### Sentry Error Tracking
```bash
# Install Sentry
npm install @sentry/react

# Configure in main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: import.meta.env.VITE_ENV,
});
```

## Performance Optimization

### 1. Image Optimization
- Compress all images before deployment
- Use WebP format where possible
- Set up image CDN (Cloudinary/ImageKit)

### 2. Bundle Size Optimization
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer
```

### 3. Caching Strategy
- Service Worker handles offline caching
- Set long cache times for static assets
- Use versioned asset names

### 4. Database Optimization
- Verify all indexes are created
- Enable connection pooling
- Use Supabase connection pooler URL

## Monitoring and Maintenance

### 1. Uptime Monitoring
Set up monitoring with:
- UptimeRobot (free)
- Pingdom
- Better Uptime

### 2. Error Tracking
- Monitor Sentry for errors
- Check Supabase logs daily
- Review Edge Function logs

### 3. Performance Monitoring
- Google Lighthouse audits
- Core Web Vitals
- Vercel/Netlify Analytics

### 4. Database Backups
Supabase provides automatic daily backups. For additional security:
- Enable PITR (Point-in-Time Recovery)
- Export critical data weekly

## Rollback Procedure

### Vercel
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Netlify
```bash
# View site deploys
netlify deploy:list

# Rollback via dashboard or CLI
netlify deploy:restore [deploy-id]
```

### Supabase Edge Functions
```bash
# Redeploy previous version
# (Keep versioned copies in Git)
git checkout previous-version
supabase functions deploy function-name
```

## Troubleshooting

### Service Worker Issues
1. Clear cache: Chrome DevTools → Application → Clear Storage
2. Unregister SW: Application → Service Workers → Unregister
3. Check Console for errors
4. Verify HTTPS is enabled

### Database Connection Issues
1. Check Supabase status page
2. Verify connection pooler settings
3. Check RLS policies
4. Review database logs

### Edge Function Failures
1. Check function logs in Supabase
2. Verify secrets are set correctly
3. Test functions locally with Supabase CLI
4. Check API quotas (Gemini, Twilio)

## Security Hardening

### 1. Enable Security Headers
Already configured in `vercel.json` and `netlify.toml`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### 2. Rate Limiting
Configure in Supabase:
- API rate limits
- Function invocation limits
- Auth rate limits

### 3. DDoS Protection
- Cloudflare DDoS protection
- Vercel/Netlify edge protection

### 4. Regular Updates
```bash
# Check for security updates
npm audit

# Update dependencies
npm update

# Fix vulnerabilities
npm audit fix
```

## Cost Monitoring

### Monthly Cost Estimate (for 1000 active users)

**Supabase** (~$25/month)
- Database: Free tier or $25/month
- Storage: Included
- Auth: Included

**Google Gemini** (~$10-30/month)
- Depends on usage
- Monitor quotas

**Twilio** (~$50-100/month)
- WhatsApp messages: $0.005-0.01 per message
- SMS: $0.05 per message

**Hosting** (Free - $20/month)
- Vercel: Free tier sufficient
- Netlify: Free tier sufficient

**Total Estimated**: $85-175/month

Monitor costs in respective dashboards and set up billing alerts.

## Go-Live Checklist

- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Edge Functions deployed and tested
- [ ] Frontend deployed to production
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] PWA manifest configured
- [ ] Service Worker registered
- [ ] Analytics tracking working
- [ ] Error monitoring active
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on monitoring
- [ ] Support channels ready

---

🎉 **You're ready to launch BeeZee Finance!**

For issues or questions during deployment, refer to:
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com


