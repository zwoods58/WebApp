# Modern-Site Project Structure

This document outlines the complete folder structure of the AtarWebb platform.

## 📁 Root Directory

```
modern-site/
├── 📂 app/                    # Next.js App Router (Pages & API Routes)
├── 📂 ai_builder/             # AI Builder Backend Logic
├── 📂 src/                    # Frontend Source Code
├── 📂 public/                 # Static Assets
├── 📂 docs/                   # Documentation
├── 📂 scripts/                # Utility Scripts
├── 📂 Supabase/               # Database Migrations
├── 📂 node_modules/           # Dependencies (gitignored)
├── 📂 .next/                  # Build Output (gitignored)
├── 📂 .vercel/                # Vercel Config (gitignored)
├── 📄 package.json            # Project Dependencies
├── 📄 tsconfig.json           # TypeScript Config
├── 📄 next.config.js          # Next.js Config
├── 📄 tailwind.config.js      # Tailwind CSS Config
├── 📄 middleware.ts           # Next.js Middleware
├── 📄 vercel.json             # Vercel Deployment Config
├── 📄 README.md               # Main Documentation
└── 📄 .gitignore              # Git Ignore Rules
```

## 📂 App Directory (`app/`)

Next.js 14 App Router structure with pages and API routes.

### Pages
```
app/
├── page.tsx                   # Homepage
├── layout.tsx                 # Root Layout
├── 📂 ai-builder/             # AI Builder Pages
│   ├── page.tsx              # AI Builder Home
│   ├── login/                # Login Page
│   ├── signup/               # Signup Page
│   ├── dashboard/            # User Dashboard
│   ├── pro-dashboard/        # Pro User Dashboard
│   ├── building/             # Website Building Interface
│   ├── editor/               # Website Editor
│   ├── payment/              # Payment Pages
│   │   ├── success/
│   │   └── failed/
│   ├── upgrade/              # Upgrade to Pro
│   └── components/           # AI Builder Components
├── 📂 admin/                  # Admin Dashboard
│   ├── dashboard/            # Admin Analytics
│   ├── login/                # Admin Login
│   └── setup/                # Initial Admin Setup
├── 📂 products/               # Products Page
├── 📂 contact/                # Contact Page
├── 📂 checkout/               # Checkout Pages
│   ├── success/
│   └── cancel/
├── 📂 locations/              # Location-Specific Pages
│   ├── johannesburg/
│   ├── cape-town/
│   ├── durban/
│   ├── nairobi/
│   └── kigali/
├── 📂 industries/             # Industry-Specific Pages
│   ├── restaurants/
│   ├── salons/
│   └── real-estate/
├── 📂 partner-program/        # Partner Program Pages
└── 📂 fast-website/           # Fast Website Landing
```

### API Routes
```
app/api/
├── 📂 ai-builder/             # AI Builder API
│   ├── analytics/            # Analytics Endpoints
│   ├── assets/               # Asset Upload
│   ├── deploy/               # Deployment
│   ├── download/             # Code Download
│   ├── files/                # File Management
│   ├── generate/             # AI Generation
│   ├── pages/                # Multi-page Management
│   ├── save/                 # Save Project
│   ├── screenshot/           # Screenshot Capture
│   ├── seo/                  # SEO Management
│   ├── terminal/             # Terminal Commands
│   ├── versions/             # Version Control
│   └── payments/             # Payment Processing
│       ├── pro-subscription/
│       ├── buyout/
│       ├── verify/
│       ├── webhook/
│       ├── cancel-subscription/
│       └── refund/
├── 📂 admin/                  # Admin API
│   ├── analytics/
│   └── users/
├── 📂 checkout/               # Checkout API
│   └── create/
├── 📂 cron/                   # Cron Jobs
│   └── check-subscriptions/
└── 📂 preview/                # Preview API
    └── [draftId]/
```

## 📂 Source Directory (`src/`)

React components, utilities, and frontend logic.

```
src/
├── 📂 components/
│   ├── 📂 sections/           # Page Sections
│   │   ├── Hero.tsx          # Hero Banner
│   │   ├── Portfolio.tsx     # Portfolio Section
│   │   ├── Testimonials.tsx  # Testimonials
│   │   ├── FAQ.tsx           # FAQ Section
│   │   ├── CircularGallerySection.tsx
│   │   ├── CTAWithFooter.tsx
│   │   ├── GalleryQuote.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ValueProposition.tsx
│   │   └── WhyChooseAtarWebb.tsx
│   ├── 📂 ui/                 # Reusable UI Components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── carousel.tsx
│   │   ├── badge.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── tooltip.tsx
│   │   ├── animated-testimonials.tsx
│   │   ├── aurora-background.tsx
│   │   ├── circular-gallery.tsx
│   │   ├── section-with-mockup.tsx
│   │   ├── shape-landing-hero.tsx
│   │   ├── sparkles.tsx
│   │   ├── spiral-animation.tsx
│   │   └── testimonials-columns-1.tsx
│   ├── 📂 ai-builder/         # AI Builder Components
│   │   └── BuildingInterface.tsx
│   └── 📂 system/             # System Components
│       └── ErrorBoundary.tsx
├── 📂 lib/                    # Utilities & Helpers
│   ├── utils.ts              # General Utilities
│   ├── supabase.ts           # Supabase Client
│   └── account-tiers.ts      # Account Tier Logic
├── 📂 data/                   # Static Data
│   └── portfolio.ts          # Portfolio Data
├── 📂 assets/                 # Frontend Assets
└── index.css                  # Global Styles
```

## 📂 AI Builder Backend (`ai_builder/`)

Backend logic for AI website generation.

```
ai_builder/
├── 📂 lib/
│   ├── 📂 ai/                 # AI Generation Logic
│   │   ├── generator.ts      # Main Generator
│   │   ├── prompts.ts        # AI Prompts
│   │   ├── templates.ts      # HTML Templates
│   │   └── claude-client.ts  # Claude API Client
│   ├── 📂 analytics/          # Analytics
│   ├── 📂 ecommerce/          # E-commerce
│   │   └── cart.ts
│   ├── 📂 forms/              # Form Handling
│   │   └── submit.ts
│   ├── 📂 payments/           # Payment Logic
│   │   ├── flutterwave.ts
│   │   └── stripe.ts
│   ├── 📂 seo/                # SEO Tools
│   ├── 📂 supabase/           # Supabase Utilities
│   └── 📂 vercel/             # Vercel Deployment
└── 📂 library/                # Template Library
    ├── 📂 generic/            # Generic Templates (32 files)
    ├── 📂 industry/           # Industry Templates (438 files)
    ├── 📂 signature/          # Signature Templates (27 files)
    └── 📂 metadata/           # Template Metadata (6 files)
```

## 📂 Documentation (`docs/`)

Organized documentation by category.

```
docs/
├── README.md                  # Documentation Index
├── 📂 setup/                  # Setup Guides (11 files)
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── QUICK_ADMIN_SETUP.md
│   ├── AI_BUILDER_SETUP.md
│   ├── ACCOUNT_TIERS_SETUP.md
│   ├── CLAUDE_API_SETUP.md
│   ├── VIDEO_SETUP.md
│   └── ...
├── 📂 integrations/           # Integration Guides (9 files)
│   ├── FLUTTERWAVE_SANDBOX_SETUP.md
│   ├── GOOGLE_ADS_SETUP.md
│   ├── WEBHOOK_SETUP_COMPLETE.md
│   ├── NGROK_SETUP_GUIDE.md
│   └── ...
├── 📂 deployment/             # Deployment Guides (2 files)
│   ├── DEPLOYMENT.md
│   └── DEPLOY_NOW.md
├── 📂 troubleshooting/        # Troubleshooting (11 files)
│   ├── WEBHOOK_TROUBLESHOOTING.md
│   ├── FLUTTERWAVE_AUTH_ISSUE.md
│   ├── AI_BUILDER_ROUTING_ISSUES.md
│   └── ...
└── 📂 development/            # Dev Notes (7 files)
    ├── IMPLEMENTATION_SUMMARY.md
    ├── AI_PROMPT_BRAINSTORM.md
    ├── TESTING_GUIDE.md
    └── ...
```

## 📂 Scripts (`scripts/`)

Utility scripts for setup and maintenance.

```
scripts/
├── setup-admin.js             # Create Admin User
├── trim-videos.js             # Video Processing
├── start-ngrok.ps1            # Start ngrok Tunnel
├── setup-ngrok.ps1            # Setup ngrok
└── start-tunnel.ps1           # Generic Tunnel Start
```

## 📂 Database (`Supabase/`)

Database migrations and schema.

```
Supabase/
├── README.md                  # Database Documentation
└── 📂 migrations/             # SQL Migrations (9 files)
    ├── 20250101120000_initial_schema.sql
    ├── 20250102000000_account_tiers_schema.sql
    ├── 20250103000000_add_new_form_fields.sql
    ├── 20250104000000_fix_rls_recursion.sql
    ├── 20250105000000_setup_admin_user.sql
    ├── 20250107000000_optimize_admin_queries.sql
    ├── 20250107000001_optimize_dashboard_analytics.sql
    ├── 20250108000000_add_buyout_fields.sql
    └── 20250109000000_add_project_versions.sql
```

## 📂 Public Assets (`public/`)

Static files served publicly.

```
public/
├── favicon.ico
├── favicom.png
├── new logo.png
├── robots.txt
├── 📂 optimized/              # Optimized Images
│   ├── gallery (1-6).webp
│   └── new logo.webp
└── 📹 videos/                 # Video Assets
    ├── cooking.mp4
    ├── flourist.mp4
    ├── model.mp4
    └── ...
```

## 🔧 Configuration Files

- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS configuration
- **`components.json`** - Shadcn UI configuration
- **`middleware.ts`** - Next.js middleware (route protection)
- **`vercel.json`** - Vercel deployment configuration
- **`.gitignore`** - Git ignore rules
- **`.eslintrc.json`** - ESLint configuration

## 📊 Key Metrics

- **Total Pages**: 57 pages
- **API Routes**: 30+ endpoints
- **React Components**: 60+ components
- **Documentation Files**: 40+ docs
- **Database Migrations**: 9 migrations
- **Template Library**: 497 HTML templates

## 🎯 Important Paths

### User Journeys
- **Public Site**: `/` → `/products` → `/contact`
- **AI Builder**: `/ai-builder` → `/ai-builder/login` → `/ai-builder/dashboard`
- **Admin**: `/admin/login` → `/admin/dashboard`

### API Endpoints
- **AI Generation**: `/api/ai-builder/generate`
- **Payments**: `/api/ai-builder/payments/*`
- **Admin**: `/api/admin/*`

### Development
- **Components**: `src/components/`
- **Pages**: `app/`
- **API**: `app/api/`
- **Docs**: `docs/`

---

Last Updated: December 2025


