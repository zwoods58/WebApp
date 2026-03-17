"use client";

import Navigation from "@/components/atarwebb/Navigation";
import HeroSection from "@/components/synthetic/HeroSection";
import LayersSection from "@/components/synthetic/LayersSection";


import AboutSection from "@/components/synthetic/AboutSection";
import LeadershipSection from "@/components/synthetic/LeadershipSection";

import GlobalFooter from "@/components/synthetic/GlobalFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-foreground selection:bg-system-blue selection:text-white">
      <Navigation />

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