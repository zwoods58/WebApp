"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React from 'react';
import BeezeeHeader from '@/components/beezee/BeezeeHeader';
import BeezeeHero from '@/components/beezee/BeezeeHero';
import BeezeeProcessSection from '@/components/beezee/BeezeeProcessSection';
import PartnershipSection from '@/components/beezee/PartnershipSection';
import BeezeePricing from '@/components/beezee/BeezeePricing';
import GlobalPulseCTA from '@/components/beezee/GlobalPulseCTA';
import GhostFooter from '@/components/beezee/GhostFooter';
import DotScrollIndicator from '@/components/universal/DotScrollIndicator';
import './beezee-animations.css';

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

