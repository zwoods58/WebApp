'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/global/AppLayout';
import { useGlobalRefresh } from '@/hooks/useGlobalRefresh';
import { QueryProvider } from '@/providers/QueryProvider';
import { swManager } from '@/lib/serviceWorker';
import SplashScreen from '@/components/SplashScreen';

interface BodyWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function BodyWrapper({ children, className = '' }: BodyWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { performGlobalRefresh } = useGlobalRefresh();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    
    // Register service worker globally on all pages
    if ('serviceWorker' in navigator) {
      swManager.register().catch(err => {
        console.warn('[App] Service worker registration warning:', err);
      });
    }
  }, []);

  const handleGlobalRefresh = async () => {
    await performGlobalRefresh({
      clearCache: true,
      refetchData: true,
      showNotification: true
    });
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Only show OfflineIndicator on non-BeeZee pages (BeeZee has its own)
  const isBeezeePage = pathname?.startsWith('/Beezee-App');

  return (
    <>
      <QueryProvider>
        <body 
          className={`${className} ${isClient ? 'hydrated' : ''}`}
          suppressHydrationWarning
        >
          <AppLayout>
            {children}
          </AppLayout>
          
          {/* Custom Splash Screen - shows only on initial startup */}
          <SplashScreen onFinish={handleSplashFinish} />
        </body>
      </QueryProvider>
    </>
  );
}
