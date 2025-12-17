# AtarWebb - Professional Web Development

Welcome to the AtarWebb project repository.

## Project Structure

This repository contains the main AtarWebb website:

- **`modern-site/`** - Main Next.js application (working directory)
  - Full-featured website with AI builder, admin dashboard, and more
  - See [modern-site/README.md](modern-site/README.md) for detailed documentation

## Quick Start

```bash
cd modern-site
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Environment Setup

Copy the environment variables template and configure:

```bash
cd modern-site
cp ../.env.example .env.local
```

See [modern-site/ENV_CONSOLIDATION.md](modern-site/ENV_CONSOLIDATION.md) for environment variable details.

## Documentation

- [Environment Variables Setup](modern-site/ENV_CONSOLIDATION.md)
- [Deployment Guide](modern-site/DEPLOYMENT.md)
- [Google Ads Setup](modern-site/GOOGLE_ADS_SETUP.md)
- [Full Documentation](modern-site/docs/)

## Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Payments**: Flutterwave, Stripe
- **AI**: Claude API
- **Deployment**: Vercel

## Support

For questions or issues, please refer to the documentation in the `modern-site/docs/` directory.

