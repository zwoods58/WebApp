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
  title: 'Beezee | Financial Operating System',
  description: 'Fluid financial orchestration for African businesses. Transform raw data into actionable intelligence.',
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
