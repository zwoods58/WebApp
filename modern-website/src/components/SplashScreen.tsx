'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if this is the first time the app is loading
    const hasSeenSplash = sessionStorage.getItem('beezee_splash_seen');
    
    if (!hasSeenSplash) {
      setShouldShow(true);
      // Mark that user has seen the splash screen
      sessionStorage.setItem('beezee_splash_seen', 'true');
      
      // Hide splash screen after 2.5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onFinish?.();
        }, 300); // Allow fade out animation
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      // Don't show splash screen if already seen
      onFinish?.();
    }
  }, [onFinish]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F8F9FA] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ minHeight: '100vh', width: '100vw' }}
    >
      <div className="text-center flex flex-col items-center justify-center space-y-8 p-8">
        {/* BeeZee Title */}
        <h1 className="text-5xl font-bold text-gray-800">BeeZee</h1>

        {/* BeeZee Logo */}
        <div className="relative">
          <img 
            src="/beezee-icon-192x192.png" 
            alt="BeeZee Logo" 
            className="w-48 h-48 object-contain"
          />
          {/* Subtle pulse animation */}
          <div className="absolute inset-0 w-48 h-48 rounded-full bg-system-blue opacity-10 animate-ping"></div>
        </div>

        {/* Tagline */}
        <p className="text-2xl text-gray-600 font-medium">Your digital black book</p>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-system-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-system-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-system-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Powered by */}
        <p className="text-sm text-gray-500">Powered by AtarWebb</p>
      </div>
    </div>
  );
}

