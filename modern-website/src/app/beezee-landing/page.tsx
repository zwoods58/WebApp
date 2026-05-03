"use client";

import React from 'react';
import Link from 'next/link';
import BeezeeHeader from '../components/beezee/BeezeeHeader';
import BeezeeHero from '../components/beezee/BeezeeHero';
import BeezeeProcessSection from '../components/beezee/BeezeeProcessSection';
import BeezeePricingSection from '../components/beezee/BeezeePricingSection';
import GlobalPulseCTA from '../components/beezee/GlobalPulseCTA';
import GhostFooter from '../components/beezee/GhostFooter';
import DotScrollIndicator from '../components/universal/DotScrollIndicator';
import './beezee-animations.css';

export default function BeezeeLanding() {
  return (
    <main className="bg-white min-h-screen font-sans selection:bg-system-blue selection:text-white">
      <BeezeeHeader />
      <BeezeeHero />
      <BeezeeProcessSection />
      <BeezeePricingSection />
      <GlobalPulseCTA />
      <GhostFooter />
      <DotScrollIndicator />
      
          </main>
  );
}