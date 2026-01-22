# BeeZee Finance Mobile Apps

This directory contains the native mobile app versions for app store distribution.

## Structure

```
mobile-apps/
├── kenya/                    # Kenya Mobile App (M-PESA Super App, etc.)
├── south-africa/            # South Africa Mobile App (VodPay, etc.)
├── nigeria/                 # Nigeria Mobile App (OPay, etc.)
└── shared/                   # Shared components and configurations
```

## Technology Stack

- **Capacitor**: Cross-platform native app framework
- **React**: UI framework (same as PWA)
- **D-Local**: Payment processing
- **Supabase**: Backend services

## App Store Targets

### Kenya
- **M-PESA Super App**: Integration with Safaricom's app ecosystem
- **Google Play Store**: Direct Android distribution
- **Apple App Store**: iOS distribution

### South Africa  
- **Vodacom App Store**: VodPay integration
- **Google Play Store**: Direct Android distribution
- **Apple App Store**: iOS distribution

### Nigeria
- **OPay App Store**: OPay ecosystem integration
- **Google Play Store**: Direct Android distribution
- **Apple App Store**: iOS distribution

## Building Native Apps

Each country folder contains:
- `capacitor.config.ts` - Native app configuration
- `android/` - Android native project
- `ios/` - iOS native project
- `build/` - Built PWA files from web app

## Next Steps

1. Install Capacitor CLI: `npm install @capacitor/cli`
2. Initialize each country app: `npx cap init`
3. Add platforms: `npx cap add android`, `npx cap add ios`
4. Build and sync: `npm run build && npx cap sync`
