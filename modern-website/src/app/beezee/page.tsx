import React from 'react';
import BeezeeHeader from '@/components/beezee/BeezeeHeader';
import BeezeeHero from '@/components/beezee/BeezeeHero';
import BeezeeProcessSection from '@/components/beezee/BeezeeProcessSection';
import PartnershipSection from '@/components/beezee/PartnershipSection';
import BeezeePricing from '@/components/beezee/BeezeePricing';
import GlobalPulseCTA from '@/components/beezee/GlobalPulseCTA';
import GhostFooter from '@/components/beezee/GhostFooter';
import DotScrollIndicator from '@/components/universal/DotScrollIndicator';
import { Metadata } from 'next';
import './beezee-animations.css';

export const metadata: Metadata = {
  title: 'BeeZee | Easy Business Management for African Shops',
  description: 'Simple business management for African shops and small businesses. Track sales, manage stock, and get smart business advice with BeeZee - made for Kenya, Nigeria, and South Africa.',
  keywords: 'BeeZee, business management, African shops, Kenya business, Nigeria business, South Africa business, sales tracking, stock management, small business app, easy accounting',
  authors: [{ name: 'BeeZee Finance' }],
  creator: 'AtarWebb',
  publisher: 'AtarWebb',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://atarwebb.com'),
  alternates: {
    canonical: '/beezee',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/beezee',
    title: 'BeeZee | Easy Business Management for African Shops',
    description: 'Simple business management for African shops. Track sales, manage stock, and get smart business advice with BeeZee.',
    siteName: 'BeeZee Finance',
    images: [
      {
        url: '/beezee-icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'BeeZee Finance Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeeZee | Easy Business Management for African Shops',
    description: 'Simple business management for African shops. Track sales, manage stock, and get smart business advice.',
    images: ['/beezee-icon-512x512.png'],
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
    icon: '/beezee-icon-192x192.png',
    apple: '/beezee-icon-192x192.png',
    shortcut: '/favicon.ico'
  }
};

export default function BeezeeLanding() {
  return (
    <main className="bg-white min-h-screen font-sans selection:bg-system-blue selection:text-white">
      <BeezeeHeader />
      <BeezeeHero />
      <BeezeeProcessSection />
      <PartnershipSection />
      <BeezeePricing />
      <GlobalPulseCTA />
      <GhostFooter />
      <DotScrollIndicator />
    </main>
  );
}
