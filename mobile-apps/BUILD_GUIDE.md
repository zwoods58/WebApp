# Mobile App Build Guide

## Overview

The mobile apps for app store distribution are located in `/mobile-apps/`. These are native wrappers around the PWAs using Capacitor.

## Structure

```
mobile-apps/
├── kenya/
│   ├── capacitor.config.ts
│   ├── android/ (generated after sync)
│   └── ios/ (generated after sync)
├── south-africa/
│   ├── capacitor.config.ts
│   ├── android/ (generated after sync)
│   └── ios/ (generated after sync)
├── nigeria/
│   ├── capacitor.config.ts
│   ├── android/ (generated after sync)
│   └── ios/ (generated after sync)
└── package.json
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd mobile-apps
npm install
```

### 2. Build Web Apps
```bash
# Build all country PWAs
npm run build:all

# Or build individually
npm run build:kenya
npm run build:south-africa
npm run build:nigeria
```

### 3. Initialize Capacitor Projects
```bash
# Initialize each country app
npx cap init "BeeZee Finance Kenya" com.bezeefinance.kenya --web-dir=../modern-website/src/app/kenya/app/dist kenya
npx cap init "BeeZee Finance South Africa" com.bezeefinance.southafrica --web-dir=../modern-website/src/app/south-africa/app/dist south-africa
npx cap init "BeeZee Finance Nigeria" com.bezeefinance.nigeria --web-dir=../modern-website/src/app/nigeria/app/dist nigeria
```

### 4. Add Native Platforms
```bash
# Add Android and iOS for each country
npx cap add android kenya
npx cap add ios kenya
npx cap add android south-africa
npx cap add ios south-africa
npx cap add android nigeria
npx cap add ios nigeria
```

### 5. Sync Native Projects
```bash
# Sync all countries
npm run sync:all

# Or sync individually
npm run sync:kenya
npm run sync:south-africa
npm run sync:nigeria
```

## Development

### Run on Device/Simulator
```bash
# Run Kenya app
npm run run:kenya

# Run South Africa app
npm run run:south-africa

# Run Nigeria app
npm run run:nigeria
```

### Open in Native IDE
```bash
# Open Kenya Android Studio
npm run open:kenya

# Open South Africa Android Studio
npm run open:south-africa

# Open Nigeria Android Studio
npm run open:nigeria
```

## App Store Submission

### Android (Google Play Store)
1. Build APK: `npx cap build android`
2. Upload to Google Play Console
3. Complete store listing and screenshots

### iOS (Apple App Store)
1. Build iOS: `npx cap build ios`
2. Open in Xcode: `npx cap open ios`
3. Archive and upload to App Store Connect

### Platform-Specific Stores

#### Kenya - M-PESA Super App
- Contact Safaricom developer relations
- Submit app for M-PESA Super App integration
- Follow M-PESA Super App guidelines

#### South Africa - Vodacom App Store
- Contact Vodacom developer portal
- Submit for VodPay integration
- Follow Vodacom app store requirements

#### Nigeria - OPay App Store
- Contact OPay developer program
- Submit for OPay ecosystem integration
- Follow OPay app store guidelines

## Configuration Notes

Each country app has specific configurations:
- **Kenya**: Green theme (#10B981), M-PESA integration focus
- **South Africa**: Gold theme (#F59E0B), VodPay integration focus  
- **Nigeria**: Blue theme (#3B82F6), OPay integration focus

All apps include:
- D-Local payment processing
- Push notifications
- Native splash screens
- Offline capabilities
- Country-specific payment methods
