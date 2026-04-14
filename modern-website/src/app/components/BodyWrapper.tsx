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
    
    // Only register service worker on BeeZee app pages
    const isAppPath = pathname?.startsWith('/Beezee-App/');
    
    if ('serviceWorker' in navigator && isAppPath) {
      console.log('[App] Registering service worker for BeeZee app');
      swManager.register().then(success => {
        if (success) {
          console.log('[App] ✅ Service worker registered successfully');
        } else {
          console.warn('[App] ⚠️ Service worker registration failed');
        }
      }).catch(err => {
        console.error('[App] ❌ Service worker registration error:', err);
      });
    } else if (!isAppPath) {
      console.log('[App] Skipping SW registration - not on BeeZee app path');
    }
  }, [pathname]);

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
    <QueryProvider>
      <AppLayout>
        {children}
      </AppLayout>
      
      {/* Custom Splash Screen - shows only on initial startup */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </QueryProvider>
  );
}
