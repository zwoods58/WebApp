# AtarWebb - Modern Website Platform

A Next.js-based platform for building modern, responsive websites with an integrated AI website builder.

## 🚀 Features

- **Modern Website Platform**: Showcase services, portfolio, and products
- **AI Website Builder**: Generate custom websites using AI (Claude API)
- **E-commerce Integration**: Product catalog with Stripe checkout
- **User Account System**: 
  - Free tier (1 generation)
  - Pro subscription ($20/month via Flutterwave)
  - Buyout option ($150 one-time)
- **Admin Dashboard**: Complete analytics and management tools
- **Payment Integration**: Stripe and Flutterwave support
- **Database**: Supabase (PostgreSQL) with RLS
- **Deployment**: Optimized for Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (database + auth)
- Claude API key (for AI generation)
- Flutterwave account (for payments)
- Stripe account (optional, for checkout)
- Vercel account (for deployment)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Claude AI
CLAUDE_API_KEY=your_claude_api_key

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=your_public_key
FLUTTERWAVE_SECRET_KEY=your_secret_key
FLUTTERWAVE_SECRET_HASH=your_webhook_secret

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [docs/setup/ENVIRONMENT_VARIABLES.md](docs/setup/ENVIRONMENT_VARIABLES.md) for detailed configuration.

### 3. Database Setup

Run Supabase migrations:

```bash
# Apply all migrations in order
npx supabase db push
```

Or manually run migrations from `Supabase/migrations/` in order.

### 4. Setup Admin User

```bash
node scripts/setup-admin.js
```

Follow the prompts to create your admin account.

## 🚦 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access the site at `http://localhost:3000`

## 📁 Project Structure

```
modern-site/
├── app/                          # Next.js app directory
│   ├── (pages)/                  # Public pages
│   ├── ai-builder/              # AI builder pages
│   ├── admin/                   # Admin dashboard
│   ├── api/                     # API routes
│   └── layout.tsx               # Root layout
├── src/
│   ├── components/              # React components
│   │   ├── sections/           # Page sections
│   │   ├── ui/                 # UI components
│   │   └── ai-builder/         # AI builder components
│   ├── lib/                    # Utilities & helpers
│   └── data/                   # Static data
├── public/                      # Static assets
├── docs/                        # Documentation
│   ├── setup/                  # Setup guides
│   ├── deployment/             # Deployment docs
│   ├── integrations/           # Integration guides
│   └── troubleshooting/        # Troubleshooting
├── scripts/                     # Utility scripts
├── Supabase/                    # Database migrations
└── ai_builder/                  # AI builder utilities

```

## 📚 Documentation

### Setup & Configuration
- [Environment Variables](docs/setup/ENVIRONMENT_VARIABLES.md)
- [Admin Setup](docs/setup/QUICK_ADMIN_SETUP.md)
- [AI Builder Setup](docs/setup/AI_BUILDER_SETUP.md)
- [Account Tiers](docs/setup/ACCOUNT_TIERS_SETUP.md)
- [Claude API](docs/setup/CLAUDE_API_SETUP.md)

### Integrations
- [Flutterwave Payments](docs/integrations/FLUTTERWAVE_SANDBOX_SETUP.md)
- [Google Ads](docs/integrations/GOOGLE_ADS_SETUP.md)
- [Webhooks](docs/integrations/WEBHOOK_SETUP_COMPLETE.md)
- [ngrok Setup](docs/integrations/NGROK_SETUP_GUIDE.md)

### Deployment
- [Deployment Guide](docs/deployment/DEPLOYMENT.md)
- [Quick Deploy](docs/deployment/DEPLOY_NOW.md)

### Troubleshooting
- [Webhook Issues](docs/troubleshooting/WEBHOOK_TROUBLESHOOTING.md)
- [Flutterwave Auth](docs/troubleshooting/FLUTTERWAVE_AUTH_ISSUE.md)
- [AI Builder Issues](docs/troubleshooting/AI_BUILDER_ROUTING_ISSUES.md)

## 🔑 Key Features

### AI Website Builder
1. Users enter business details (name, location, type, colors)
2. Claude AI generates a complete, responsive website
3. Preview available for 48 hours (Free tier) or unlimited (Pro)
4. Download code with Buyout purchase ($150)

### Account Tiers
- **Free**: 1 website generation, 48-hour preview
- **Pro ($20/month)**: Unlimited generations, permanent previews, multi-page sites
- **Buyout ($150)**: Download complete website code

### Admin Dashboard
- User analytics & management
- Revenue tracking (Stripe + Flutterwave)
- Order management
- Project monitoring
- System health metrics

## 🔐 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Environment variables for sensitive data
- Webhook signature verification
- JWT-based authentication via Supabase Auth

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy

```bash
vercel --prod
```

See [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Local Testing
```bash
npm run dev
```

### Payment Testing
Use Flutterwave test credentials:
- Test cards available in [docs/integrations/FLUTTERWAVE_TEST_CREDENTIALS.md](docs/integrations/FLUTTERWAVE_TEST_CREDENTIALS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

- Check [docs/troubleshooting/](docs/troubleshooting/) for common issues
- Review API documentation in relevant doc files
- Contact: support@atarwebb.com

## 🔄 Version History

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

Built with ❤️ using Next.js, Supabase, and Claude AI
