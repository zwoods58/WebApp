'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';

interface BodyWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function BodyWrapper({ children, className = '' }: BodyWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
    const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);

    // PWA Update Management
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const updateCheckInterval = 60 * 1000; // 60 seconds

      // 1. Periodic check for updates
      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((registration) => {
          console.log('[PWA] Checking for updates...');
          registration.update();
        });
      }, updateCheckInterval);

      // 2. Listen for the new service worker taking control
      // This happens automatically when the SW calls clients.claim()
      const handleControllerChange = () => {
        console.log('[PWA] New version detected! Refreshing...');
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      return () => {
        clearInterval(interval);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);

  
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Only show OfflineIndicator on non-app pages
  const isAppPage = pathname?.startsWith('/');

  return (
    <>
      <div className={className}>
        {children}
      </div>
      
      {/* Custom Splash Screen - shows only on initial startup */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </>
  );
}

