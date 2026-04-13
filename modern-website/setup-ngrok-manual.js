// Manual Ngrok Setup Instructions
console.log(`
=== NGROK SETUP REQUIRED ===

Since Ngrok is not installed or not in PATH, please follow these steps:

1. INSTALL NGROK:
   - Download from: https://ngrok.com/download
   - Or use Chocolatey: choco install ngrok
   - Or use npm: npm install -g ngrok

2. START YOUR APP:
   - Your Next.js dev server is already running on port 3000

3. START NGROK:
   - Open a NEW terminal window
   - Run: ngrok http 3000
   - Copy the HTTPS URL it shows (e.g., https://abc123-def456.ngrok-free.app)

4. UPDATE .env.local:
   Replace "PLACEHOLDER_NGROK_URL" with your actual Ngrok URL in these lines:
   
   NGROK_URL=https://YOUR_ACTUAL_NGROK_URL.ngrok-free.app
   NEXT_PUBLIC_APP_URL=https://YOUR_ACTUAL_NGROK_URL.ngrok-free.app
   NEXT_PUBLIC_SITE_URL=https://YOUR_ACTUAL_NGROK_URL.ngrok-free.app
   ALLOWED_ORIGINS=https://YOUR_ACTUAL_NGROK_URL.ngrok-free.app,http://localhost:3000,https://localhost:3000

5. RESTART YOUR APP:
   - Stop the dev server (Ctrl+C)
   - Run: npm run dev again

6. TEST PAYMENTS:
   - Open: https://YOUR_NGROK_URL.ngrok-free.app
   - Try the payment flow

7. WEBHOOK SETUP:
   - In Kyshi dashboard, set webhook URL to:
   - https://YOUR_NGROK_URL.ngrok-free.app/api/webhooks/kyshi

=== EXAMPLE ===
If Ngrok shows: https://abc123-def456.ngrok-free.app
Then update .env.local to:
NGROK_URL=https://abc123-def456.ngrok-free.app
NEXT_PUBLIC_APP_URL=https://abc123-def456.ngrok-free.app
NEXT_PUBLIC_SITE_URL=https://abc123-def456.ngrok-free.app
ALLOWED_ORIGINS=https://abc123-def456.ngrok-free.app,http://localhost:3000,https://localhost:3000
`);
