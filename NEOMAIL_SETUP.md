# Neomail Email Setup for CRM Automation

## Quick Setup

Replace your `.env.local` file with Neomail SMTP settings:

### Step 1: Update `.env.local`

```env
# Neomail SMTP Configuration
SMTP_HOST=smtp.neomail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-neomail-password
SMTP_FROM=admin@atarwebb.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Find Your Neomail SMTP Settings

**You'll need from Neomail:**
1. **SMTP Host** - Usually `smtp.neomail.com` or check Neomail docs
2. **SMTP Port** - Usually `587` (TLS) or `465` (SSL)
3. **Your Email** - The email address you use with Neomail
4. **Password** - Your Neomail password

**If using SSL (port 465):**
```env
SMTP_PORT=465
SMTP_SECURE=true
```

**If using TLS (port 587):**
```env
SMTP_PORT=587
SMTP_SECURE=false
```

### Step 3: Common Neomail SMTP Settings

Check your Neomail account settings or documentation for exact values:

- **Host:** `smtp.neomail.com` or `mail.yourdomain.com`
- **Port:** `587` (recommended) or `465`
- **Authentication:** Required (your email + password)

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

