import React from 'react';
import BeezeeHero from '@/components/beezee/BeezeeHero';
import GhostSummaryBar from '@/components/beezee/GhostSummaryBar';
import TransactionPrism from '@/components/beezee/TransactionPrism';
import SystemTriad from '@/components/beezee/SystemTriad';
import CapabilitiesBar from '@/components/beezee/CapabilitiesBar';
import BeezeePricing from '@/components/beezee/BeezeePricing';
import GlobalPulseCTA from '@/components/beezee/GlobalPulseCTA';
import GhostFooter from '@/components/beezee/GhostFooter';
import { Metadata } from 'next';
import './beezee-animations.css';

export const metadata: Metadata = {
  title: 'BeeZee | Financial Operating System for African Businesses',
  description: 'Fluid financial orchestration for African businesses. Transform raw data into actionable intelligence with BeeZee - the financial management platform designed for Kenya, Nigeria, and South Africa.',
  keywords: 'BeeZee, financial management, African businesses, Kenya finance, Nigeria finance, South Africa finance, business intelligence, expense tracking, inventory management, financial operating system',
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
    title: 'BeeZee | Financial Operating System for African Businesses',
    description: 'Fluid financial orchestration for African businesses. Transform raw data into actionable intelligence with BeeZee.',
    siteName: 'BeeZee Finance',
    images: [
      {
        url: '/bezze.png',
        width: 512,
        height: 512,
        alt: 'BeeZee Finance Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeeZee | Financial Operating System for African Businesses',
    description: 'Fluid financial orchestration for African businesses. Transform raw data into actionable intelligence.',
    images: ['/bezze.png'],
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
    icon: '/bezze.png',
    apple: '/bezze.png',
    shortcut: '/bezze.png'
  }
};

export default function BeeZeeLanding() {
  return (
    <main className="bg-studio-white min-h-screen font-sans selection:bg-system-blue selection:text-white">
      <GhostSummaryBar />
      <BeezeeHero />
      <TransactionPrism />
      <SystemTriad />
      <CapabilitiesBar />
      <BeezeePricing />
      <GlobalPulseCTA />
      <GhostFooter />
    </main>
  );
}
