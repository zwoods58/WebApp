'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after component mounts
    setIsLoaded(true);

    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center flex-1">
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

      {/* Footer */}
      <div className="pb-6 animate-fade-in-delayed">
        <p className="text-[11px] text-gray-400 font-inter-tight">
          Powered by AtarWebb
        </p>
      </div>
    </div>
  );
}
