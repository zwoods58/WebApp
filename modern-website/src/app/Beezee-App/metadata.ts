import type { Metadata } from "next";

// BeeZee App Metadata
export const metadata: Metadata = {
  title: "BeeZee - Your Digital Black Book",
  description: "Your Digital Black Book - Financial management for informal businesses across Africa. Track cash, credit, services, and inventory in one simple app.",
  keywords: "business management, financial tracking, informal business, Africa, SME, digital black book, bookkeeping, inventory, cash flow",
  authors: [{ name: "BeeZee" }],
  creator: "BeeZee",
  publisher: "BeeZee",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://atarwebb.com'),
  alternates: {
    canonical: '/Beezee-App/',
    languages: {
      'en': '/Beezee-App/en',
      'x-default': '/Beezee-App/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/Beezee-App/',
    title: 'BeeZee - Your Digital Black Book',
    description: 'Your Digital Black Book - Financial management for informal businesses across Africa. Track cash, credit, services, and inventory in one simple app.',
    siteName: 'BeeZee',
    images: [
      {
        url: '/beezee-icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'BeeZee Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeeZee - Your Digital Black Book',
    description: 'Your Digital Black Book - Financial management for informal businesses across Africa.',
    images: ['/beezee-icon-512x512.png'],
    creator: '@beezee_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/beezee-icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/beezee-icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/beezee-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/beezee-icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/beezee-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/beezee-icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/beezee-icon-192x192.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/beezee-icon-192x192.png',
        sizes: '192x192',
      },
    ],
  },
  manifest: '/manifest.json',
};

