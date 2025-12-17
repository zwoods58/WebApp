# AtarWebb Modern Site - Production Deployment Guide

## Pre-Deployment Checklist

✅ **Completed:**
- [x] All pages styled and functional
- [x] Production webhook URLs configured
- [x] SEO optimization (metadata, Open Graph, Twitter Cards)
- [x] Structured data (JSON-LD) for search engines
- [x] Sitemap.xml generated
- [x] Robots.txt configured
- [x] Build tested and passing
- [x] Responsive design verified
- [x] Forms tested with production webhooks

## Production URLs

### Site URL
- **Production:** https://atarwebb.com

### Webhook URLs (n8n)
- **Contact Form:** `https://n8n.srv1075493.hstgr.cloud/webhook/referral-submission`
- **Partner Program:** `https://n8n.srv1075493.hstgr.cloud/webhook/partner-referral`

## Deployment Instructions

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the modern-site directory**:
   ```bash
   cd modern-site
   vercel --prod
   ```

4. **Configure Custom Domain** (if needed):
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add `atarwebb.com` and `www.atarwebb.com`
   - Follow DNS configuration instructions

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Set root directory to `modern-site`
5. Framework Preset: **Next.js**
6. Build Command: `npm run build`
7. Output Directory: `.next`
8. Click "Deploy"

### Option 3: Manual Build & Deploy

1. **Build the project**:
   ```bash
   cd modern-site
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm run start
   ```

3. The site will be available at `http://localhost:3000`

4. For production hosting, upload the `.next` folder and `node_modules` to your server

## Environment Variables

If you need to add environment variables in Vercel:

1. Go to Project Settings → Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://atarwebb.com`
   - `NEXT_PUBLIC_CONTACT_WEBHOOK_URL` = `https://n8n.srv1075493.hstgr.cloud/webhook/referral-submission`
   - `NEXT_PUBLIC_PARTNER_WEBHOOK_URL` = `https://n8n.srv1075493.hstgr.cloud/webhook/partner-referral`

**Note:** Webhook URLs are currently hardcoded in the pages, so environment variables are optional.

## Post-Deployment Verification

After deployment, verify the following:

### 1. Pages Load Correctly
- [ ] Home page: `https://atarwebb.com/`
- [ ] Products: `https://atarwebb.com/products`
- [ ] Contact: `https://atarwebb.com/contact`
- [ ] Partner Program: `https://atarwebb.com/partner-program`

### 2. Forms Work
- [ ] Test contact form submission
- [ ] Test partner program application
- [ ] Verify webhooks receive data in n8n

### 3. SEO Elements
- [ ] Sitemap accessible: `https://atarwebb.com/sitemap.xml`
- [ ] Robots.txt accessible: `https://atarwebb.com/robots.txt`
- [ ] Open Graph tags present (view page source)
- [ ] Structured data present (view page source)

### 4. Performance
- [ ] Run Google PageSpeed Insights
- [ ] Run Lighthouse audit
- [ ] Check mobile responsiveness

### 5. Analytics (Optional)
- [ ] Google Analytics tracking (if configured)
- [ ] Search Console verification (if configured)

## Custom Domain Configuration

### DNS Records for atarwebb.com

If using Vercel, add these DNS records:

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## SSL/HTTPS

Vercel automatically provides SSL certificates via Let's Encrypt. No additional configuration needed.

## Performance Optimizations

The site includes:
- ✅ Static page generation
- ✅ Dynamic imports for heavy components
- ✅ Image optimization (Next.js Image component recommended)
- ✅ Code splitting
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Gzip compression
- ✅ Browser caching headers

## Monitoring

### Vercel Analytics
Enable Vercel Analytics in your project settings for:
- Real-time traffic monitoring
- Core Web Vitals tracking
- Performance insights

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## Rollback Procedure

If you need to rollback:

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Contact: info@atarwebb.com

## Build Information

- **Framework:** Next.js 14.2.33
- **Node Version:** 18+ recommended
- **Build Time:** ~30-60 seconds
- **Bundle Size:** See build output for details

---

**Last Updated:** November 10, 2025
**Version:** 1.0.0

