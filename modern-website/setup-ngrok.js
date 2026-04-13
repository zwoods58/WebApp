// Ngrok Setup Helper
// Run this to update your .env.local with the current Ngrok URL

const fs = require('fs');
const path = require('path');

function setupNgrok() {
  console.log('=== Ngrok Setup Helper ===');
  console.log('\nTo use the payment system with Ngrok:');
  console.log('1. Start your Next.js app: npm run dev');
  console.log('2. Start Ngrok: ngrok http 3000');
  console.log('3. Copy your Ngrok URL (e.g., https://abc123.ngrok-free.app)');
  console.log('4. Update your .env.local file with the Ngrok URL');
  
  console.log('\nCurrent .env.local needs these updates:');
  console.log('NGROK_URL=https://YOUR_NGROK_URL.ngrok-free.app');
  console.log('NEXT_PUBLIC_APP_URL=https://YOUR_NGROK_URL.ngrok-free.app');
  console.log('NEXT_PUBLIC_SITE_URL=https://YOUR_NGROK_URL.ngrok-free.app');
  console.log('ALLOWED_ORIGINS=https://YOUR_NGROK_URL.ngrok-free.app,http://localhost:3000,https://localhost:3000');
  
  console.log('\nExample:');
  console.log('If your Ngrok URL is: https://abc123-def456.ngrok-free.app');
  console.log('Then set:');
  console.log('NGROK_URL=https://abc123-def456.ngrok-free.app');
  console.log('NEXT_PUBLIC_APP_URL=https://abc123-def456.ngrok-free.app');
  console.log('NEXT_PUBLIC_SITE_URL=https://abc123-def456.ngrok-free.app');
  console.log('ALLOWED_ORIGINS=https://abc123-def456.ngrok-free.app,http://localhost:3000,https://localhost:3000');
  
  console.log('\n=== Payment Flow with Ngrok ===');
  console.log('1. User clicks "Pay with Mobile Money"');
  console.log('2. PaymentButton calls /api/kyshi/payment-link with Ngrok return URL');
  console.log('3. Kyshi redirects to: https://YOUR_NGROK.ngrok.app/payment/return');
  console.log('4. Return page checks payment status and shows success/failure');
  console.log('5. User can return to app dashboard');
  
  console.log('\n=== Webhook Configuration ===');
  console.log('For webhooks to work with Ngrok:');
  console.log('1. In Kyshi dashboard, set webhook URL to:');
  console.log('   https://YOUR_NGROK.ngrok.app/api/webhooks/kyshi');
  console.log('2. Make sure your Ngrok tunnel is running when testing payments');
}

setupNgrok();
