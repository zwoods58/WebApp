# AtarWebb - Modern Website Platform

A Next.js-based marketing platform for showcasing professional website design services.

## 🚀 Features

- **Modern Website Platform**: Showcase services, portfolio, and products
- **Responsive Design**: Optimized for all devices
- **Contact Integration**: Direct lead generation
- **Service Catalog**: Detailed breakdown of service tiers and pricing
- **Deployment**: Optimized for Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
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

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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
│   └── layout.tsx               # Root layout
├── src/
│   ├── components/              # React components
│   │   ├── sections/           # Page sections
│   │   └── ui/                 # UI components
│   ├── lib/                    # Utilities & helpers
│   └── data/                   # Static data
└── public/                      # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy

```bash
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

- Contact: support@atarwebb.com

---

Built with ❤️ using Next.js
