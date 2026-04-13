'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InstantSplash() {
  const [showContent, setShowContent] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show splash content immediately
    setShowContent(true);
    
    // Start fade out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Navigate to signup after fade out completes
    const navigateTimer = setTimeout(() => {
      router.push('/Beezee-App/auth/signup');
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [router]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#1e3c72' }}
    >
      <div className={`text-center transition-all duration-1000 ${
        showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* Logo */}
        <div className="mb-8 splash-fade-in">
          <img 
            src="/beezee-icon-192x192.png" 
            alt="BeeZee" 
            className="w-24 h-24 mx-auto splash-pulse"
          />
        </div>
        
        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-2 splash-slide-up">
          BeeZee
        </h1>
        
        {/* Tagline */}
        <p className="text-lg text-blue-100 mb-8 splash-slide-up" style={{ animationDelay: '200ms' }}>
          Your Digital Black Book
        </p>
        
        {/* Loading indicator */}
        <div className="flex justify-center space-x-2 splash-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="w-2 h-2 bg-white rounded-full splash-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full splash-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full splash-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        {/* Loading text */}
        <p className="text-sm text-blue-200 mt-4 splash-pulse" style={{ animationDelay: '600ms' }}>
          Loading your business dashboard...
        </p>
      </div>
    </div>
  );
}
