# Neo.space Email Setup for CRM Automation

## Quick Setup

Replace your `.env.local` file with Neo.space SMTP settings:

### Step 1: Update `.env.local`

```env
# Neo.space SMTP Configuration
SMTP_HOST=smtp.neo.space
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@neo.space
SMTP_PASSWORD=your-neo-space-password
SMTP_FROM=admin@atarwebb.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Neo.space SMTP Settings

**Most Common Neo.space SMTP Configuration:**
- **SMTP Host:** `smtp.neo.space`
- **SMTP Port:** `587` (STARTTLS) or `465` (SSL/TLS)
- **Your Email:** Your full Neo.space email address
- **Password:** Your Neo.space email password

**Option 1: Using Port 587 (STARTTLS - Recommended):**
```env
SMTP_HOST=smtp.neo.space
SMTP_PORT=587
SMTP_SECURE=false
```

**Option 2: Using Port 465 (SSL/TLS):**
```env
SMTP_HOST=smtp.neo.space
SMTP_PORT=465
SMTP_SECURE=true
```

### Step 3: Find Your Exact SMTP Settings

**Where to look in Neo.space:**
1. Log in to your Neo.space account
2. Go to **Settings** → **Email Settings** or **Mail Configuration**
3. Look for **Outgoing Mail Server** or **SMTP Settings**
4. You should see the exact host, port, and security settings

**Alternative SMTP hosts to try if `smtp.neo.space` doesn't work:**
- `mail.neo.space`
- `outgoing.neo.space`
- `[your-domain].neo.space` (if using custom domain)

### Step 4: Test the Configuration

1. Update your `.env.local` with the correct settings
2. Restart your dev server: `npm run dev`
3. Visit: `http://localhost:3000/api/automation/start`
4. Check terminal for: `[EMAIL]: Nodemailer initialized with smtp.neomail.com`

### Troubleshooting

**If emails don't send:**
1. Verify SMTP host and port with Neomail support
2. Check if your email password is correct
3. Some providers require "Allow less secure apps" or app-specific passwords
4. Check terminal for detailed error messages

**Common SMTP Hosts by Provider:**
- Neomail: `smtp.neomail.com`
- Gmail: `smtp.gmail.com`
- Outlook: `smtp-mail.outlook.com`
- Custom domain: Usually `mail.yourdomain.com` or `smtp.yourdomain.com`

### Need Help?

Contact Neomail support to get:
- Exact SMTP server address
- Correct port number (587 or 465)
- SSL/TLS requirements

