'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true ||
                  document.referrer.includes('android-app://');
    
    // Only show splash screen for installed PWA
    if (!isPWA) {
      setIsVisible(false);
      return;
    }

    // Prevent body scrolling when splash is active
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100vw';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Also prevent any touch scrolling on mobile
    document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    document.documentElement.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Show immediately for PWA
    setShouldShow(true);

    // Hide splash screen after app is ready
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Restore scrolling when splash is hidden
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      
      // Remove touch event listeners
      document.body.removeEventListener('touchmove', (e) => e.preventDefault(), { passive: false } as any);
      document.documentElement.removeEventListener('touchmove', (e) => e.preventDefault(), { passive: false } as any);
    }, 2000); // Slightly longer to ensure app loads

    return () => {
      clearTimeout(timer);
      // Restore scrolling on cleanup
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      
      // Remove touch event listeners
      document.body.removeEventListener('touchmove', (e) => e.preventDefault(), { passive: false } as any);
      document.documentElement.removeEventListener('touchmove', (e) => e.preventDefault(), { passive: false } as any);
    };
  }, []);

  if (!isVisible || !shouldShow) return null;

  return (
    <>
      {/* Backdrop to prevent content from showing through */}
      <div 
        className="fixed inset-0 bg-white splash-screen-force-full" 
        style={{ 
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          width: '100vw',
          height: '100vh',
          minWidth: '100vw',
          minHeight: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          overflow: 'hidden',
          zIndex: 99999,
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        }} 
      />
      
      {/* Main splash screen content */}
      <div
        className="fixed inset-0 flex flex-col splash-screen-force-full"
        style={{ 
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
          width: '100vw',
          height: '100vh',
          minWidth: '100vw',
          minHeight: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          overflow: 'hidden',
          zIndex: 100000,
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        }}
      >
      {/* Main Content Container - takes up full height */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo with pulse animation */}
        <div className="mb-6 animate-pulse-subtle">
          <Image
            src="/beezee-icon-192x192.png"
            alt="BeeZee"
            width={120}
            height={120}
            className="w-[120px] h-[120px] md:w-[120px] md:h-[120px]"
            priority
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-inter-tight">
          BeeZee
        </h1>

        {/* Tagline */}
        <p className="text-sm font-medium text-gray-500 mb-8 font-inter-tight">
          Your Digital Black Book
        </p>

        {/* Loading Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-[#4A8DB8] rounded-full animate-bounce-dot animation-delay-0"></div>
          <div className="w-2 h-2 bg-[#4A8DB8] rounded-full animate-bounce-dot animation-delay-150"></div>
          <div className="w-2 h-2 bg-[#4A8DB8] rounded-full animate-bounce-dot animation-delay-300"></div>
        </div>
      </div>

      {/* Footer - positioned at bottom */}
      <div className="pb-6 animate-fade-in-delayed text-center">
        <p className="text-[11px] text-gray-400 font-inter-tight">
          Powered by AtarWebb
        </p>
      </div>
    </div>
    </>
  );
}
