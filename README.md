# BeeZee Finance - Multi-Country Financial Management Platform

A comprehensive financial management platform serving Kenya, South Africa, and Nigeria with D-Local payment integration.

## 🏗️ Project Structure

```
WebApp/
├── modern-website/          # ✅ Main website + PWAs
│   ├── src/app/
│   │   ├── kenya/app/        # 🇰🇪 Kenya PWA
│   │   ├── south-africa/app/  # 🇿🇦 South Africa PWA  
│   │   └── nigeria/app/       # 🇳🇬 Nigeria PWA
│   └── src/components/         # Website components
├── mobile-apps/             # ✅ Native mobile apps
│   ├── kenya/               # Kenya native app
│   ├── south-africa/         # South Africa native app
│   ├── nigeria/              # Nigeria native app
│   └── BUILD_GUIDE.md       # Mobile app build guide
├── .git/                   # ✅ Git repository
├── .gitignore              # ✅ Git ignore
├── .nvmrc                  # ✅ Node version
├── .vercel/                # ✅ Vercel config
└── .vscode/                # ✅ VS Code settings
```

## 🚀 Quick Start

### Web Application
```bash
cd modern-website
npm install
npm run dev
```

### Mobile Apps (App Store Distribution)
```bash
cd mobile-apps
npm install
npm run sync:all
npm run run:kenya  # or run:south-africa, run:nigeria
```

## 🌐 Access Points

- **Main Website**: `http://localhost:3000/`
- **Kenya PWA**: `http://localhost:3000/kenya/app`
- **South Africa PWA**: `http://localhost:3000/south-africa/app`
- **Nigeria PWA**: `http://localhost:3000/nigeria/app`

## 💳 Payment Integration

All countries use **D-Local** payment processing:

### Kenya (🇰🇪)
- Mobile Money (M-Pesa, Airtel Money, etc.)
- Credit/Debit Cards
- Bank Transfer

### South Africa (🇿🇦)
- Credit/Debit Cards
- Bank Transfer (Multiple providers)
- Capitec Pay

### Nigeria (🇳🇬)
- Credit/Debit Cards
- OPay Wallet
- Paga Wallet
- Bank Transfer

## 📱 Mobile App Distribution

### Platform Integration
- **Kenya**: M-PESA Super App ecosystem
- **South Africa**: VodPay ecosystem
- **Nigeria**: OPay ecosystem

### App Stores
- Google Play Store (all countries)
- Apple App Store (all countries)
- Platform-specific stores (M-PESA, VodPay, OPay)

## 🛠️ Technology Stack

### Web Application
- **Framework**: Next.js 16.1.1
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Payments**: D-Local
- **PWA**: Vite + PWA Plugin

### Mobile Apps
- **Framework**: Capacitor
- **Base**: React (from PWAs)
- **Payments**: D-Local
- **Native Features**: Push notifications, offline support

## 📋 Features

### Core Features
- ✅ Multi-country support
- ✅ D-Local payment integration
- ✅ PWA capabilities (offline, installable)
- ✅ Mobile app distribution
- ✅ Country-specific payment methods
- ✅ AI-powered financial coaching
- ✅ Receipt scanning
- ✅ Voice transactions
- ✅ Financial reporting

### Business Features
- ✅ Transaction management
- ✅ Invoice generation
- ✅ Inventory tracking
- ✅ Booking management
- ✅ Financial reports
- ✅ Tax calculations

## 🚀 Deployment

### Web Application
```bash
cd modern-website
npm run build
# Deploy to Vercel/Netlify/your hosting
```

### Mobile Apps
See `mobile-apps/BUILD_GUIDE.md` for detailed instructions.

## 📚 Documentation

- `mobile-apps/BUILD_GUIDE.md` - Mobile app development
- `mobile-apps/README.md` - Mobile app overview
- Individual app documentation in each country folder

## 🤝 Support

For questions or issues:
1. Check the relevant documentation
2. Test the web application first
3. Verify mobile app setup in BUILD_GUIDE.md

## 🎯 Current Status

- ✅ D-Local integration complete
- ✅ PWAs integrated in website
- ✅ Mobile app structure ready
- ✅ Multi-country support
- ✅ Payment processing configured
- ✅ Codebase cleaned and optimized
