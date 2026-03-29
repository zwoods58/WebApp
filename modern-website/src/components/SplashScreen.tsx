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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-system-blue via-primary-blue to-secondary-blue transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform -rotate-3"></div>
            <div className="relative inset-0 bg-gradient-to-br from-system-blue to-primary-blue rounded-2xl shadow-2xl flex items-center justify-center">
              <span className="text-white text-4xl font-bold">BZ</span>
            </div>
          </div>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-system-blue opacity-20 animate-ping"></div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-2">BeeZee</h1>
        <p className="text-white/80 text-sm mb-8">Business Management Solution</p>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
