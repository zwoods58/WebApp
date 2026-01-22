# 🐝 BeeZee Finance - PWA for South African Informal Business Owners

A Progressive Web App designed to help South African informal business owners manage their finances with ease. Built with offline-first architecture, AI-powered insights, and WhatsApp integration.

## 🌟 Features

### Core Functionality
- ✅ **Offline-First Architecture**: Works seamlessly even without internet connectivity
- 📱 **Progressive Web App**: Installable on home screen, works like a native app
- 💰 **Transaction Management**: Track income and expenses with multiple input methods
- 🎤 **Voice Input**: Record transactions using voice commands (via Google Gemini)
- 📸 **Receipt Scanning**: Extract transaction details from receipt photos (OCR)
- 📊 **Financial Reports**: Visualize your business performance with charts
- 🤖 **AI Financial Coach**: Get personalized business advice powered by Gemini
- 💬 **WhatsApp Integration**: Receive reminders and insights via WhatsApp

### Technical Features
- 🔄 **Background Sync**: Automatically syncs offline transactions when connectivity returns
- 🔐 **Phone Authentication**: Secure SMS OTP login via Supabase Auth
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Real-time Updates**: Live data synchronization with Supabase Realtime
- 🔒 **Row-Level Security**: Data isolation and security at the database level

## 🚀 Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL, Edge Functions, Auth, Storage, Realtime)
- **AI Processing**: Google Gemini 1.5 Flash via Vertex AI
- **Communications**: Twilio WhatsApp Business API
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Offline Storage**: IndexedDB (via idb)
- **Service Worker**: Workbox
- **Charts**: Recharts
- **Hosting**: Vercel / Netlify

## 📦 Project Structure

```
beezee/
├── public/                      # Static assets
├── src/
│   ├── components/             # React components
│   │   ├── Layout.jsx         # Main layout with bottom navigation
│   │   └── OfflineBadge.jsx   # Offline indicator
│   ├── pages/
│   │   ├── auth/              # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── VerifyOTP.jsx
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Transactions.jsx   # Transaction list
│   │   ├── AddTransaction.jsx # Add transaction form
│   │   ├── Reports.jsx        # Financial reports
│   │   ├── Coach.jsx          # AI financial coach
│   │   ├── Settings.jsx       # App settings
│   │   └── Profile.jsx        # User profile
│   ├── store/                 # Zustand state management
│   │   ├── authStore.js
│   │   ├── offlineStore.js
│   │   └── transactionStore.js
│   ├── utils/
│   │   ├── supabase.js        # Supabase client & helpers
│   │   └── offlineSync.js     # IndexedDB & sync logic
│   ├── service-worker.js      # Service worker for PWA
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── supabase/
│   ├── schema.sql             # Database schema
│   ├── config.toml            # Supabase configuration
│   └── functions/             # Edge Functions
│       ├── voice-to-transaction/
│       ├── receipt-to-transaction/
│       ├── generate-report/
│       ├── financial-coach/
│       └── notification-trigger/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Google Cloud account (for Gemini API)
- Twilio account (for WhatsApp)

### 1. Clone and Install Dependencies

```bash
cd beezee
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema:
   ```bash
   # Using Supabase CLI
   supabase db reset
   
   # Or manually run supabase/schema.sql in SQL Editor
   ```
3. Deploy Edge Functions:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Deploy all functions
   supabase functions deploy voice-to-transaction
   supabase functions deploy receipt-to-transaction
   supabase functions deploy generate-report
   supabase functions deploy financial-coach
   supabase functions deploy notification-trigger
   ```

4. Set up Storage bucket for receipts:
   - Go to Storage in Supabase Dashboard
   - Create a bucket named `receipts`
   - Set it to public or configure RLS policies

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Fill in your credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1

# App Config
VITE_APP_NAME=BeeZee Finance
VITE_MONTHLY_PRICE=55.50
VITE_TRIAL_DAYS=7

# Features
VITE_ENABLE_WHATSAPP=true
VITE_ENV=development
```

### 4. Configure Edge Functions Environment Variables

Set secrets for Edge Functions:

```bash
# Gemini API Key
supabase secrets set GEMINI_API_KEY=your-gemini-api-key

# Twilio
supabase secrets set TWILIO_ACCOUNT_SID=your-account-sid
supabase secrets set TWILIO_AUTH_TOKEN=your-auth-token
supabase secrets set TWILIO_WHATSAPP_NUMBER=+14155238886

# Supabase (for functions)
supabase secrets set SUPABASE_URL=your-supabase-url
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
```

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Configure environment variables in Netlify dashboard

## 📱 PWA Installation

### Android
1. Open the app in Chrome
2. Tap the menu icon (⋮)
3. Select "Add to Home screen"
4. Confirm installation

### iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

## 🔐 Security Considerations

1. **Row-Level Security**: All database tables have RLS policies enabled
2. **JWT Verification**: Edge Functions verify JWT tokens
3. **Phone Authentication**: Secure SMS OTP via Supabase Auth
4. **Environment Variables**: Sensitive data stored in environment variables
5. **HTTPS Only**: App should only be served over HTTPS in production

## 💡 Usage Guide

### Adding Transactions

1. **Manual Entry**: Tap "+" button, select type, enter details
2. **Voice Input**: Tap microphone icon, speak your transaction
3. **Receipt Scan**: Tap camera icon, take photo of receipt

### Viewing Reports

1. Navigate to Reports tab
2. Select time period (7, 30, or 90 days)
3. View income/expense breakdown
4. Tap "AI Insights" for personalized analysis

### Financial Coach

1. Navigate to Coach tab
2. Type your question or select a suggested one
3. Receive personalized advice based on your data

### Offline Usage

1. App works fully offline after initial load
2. Transactions saved locally in IndexedDB
3. Automatic sync when connectivity returns
4. Offline indicator shows sync status

## 🐛 Troubleshooting

### Service Worker Not Registering
- Check that you're serving over HTTPS
- Clear browser cache and reload
- Check browser console for errors

### Transactions Not Syncing
- Check internet connectivity
- Check offline badge for sync status
- Open browser DevTools > Application > IndexedDB to view offline queue

### Edge Functions Failing
- Check function logs in Supabase Dashboard
- Verify environment variables are set
- Check Gemini API quota

## 📊 Performance Optimization

1. **Image Compression**: Receipts compressed before upload
2. **Lazy Loading**: Routes loaded on demand
3. **Service Worker Caching**: Static assets cached for offline use
4. **Database Indexes**: Optimized queries with proper indexes
5. **CDN**: Use CDN for South African users (Cloudflare recommended)

## 🤝 Contributing

This is a custom project for South African informal business owners. For feature requests or bug reports, please contact the development team.

## 📄 License

Proprietary - All Rights Reserved

## 🙏 Acknowledgments

- Google Gemini for AI processing
- Supabase for backend infrastructure
- Tailwind CSS for styling
- Recharts for data visualization

## 📞 Support

For support, email: support@beezee.co.za
WhatsApp: +27 XX XXX XXXX

---

Built with 🐝 for South African entrepreneurs


