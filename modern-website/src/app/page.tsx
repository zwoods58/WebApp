"use client";

import GlobalNavigation from "@/components/synthetic/GlobalNavigation";
import HeroSection from "@/components/synthetic/HeroSection";
import LayersSection from "@/components/synthetic/LayersSection";


import AboutSection from "@/components/synthetic/AboutSection";
import LeadershipSection from "@/components/synthetic/LeadershipSection";

import GlobalFooter from "@/components/synthetic/GlobalFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian text-foreground selection:bg-system-blue selection:text-white">
      <GlobalNavigation />

      <HeroSection />

      <div id="infrastructure" className="scroll-mt-20">
        <LayersSection />
      </div>



      <AboutSection />
      <LeadershipSection />


      <GlobalFooter />

    </main>
  );
}
