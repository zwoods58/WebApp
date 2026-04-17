'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/global/AppLayout';
import { useGlobalRefresh } from '@/hooks/useGlobalRefresh';
import { QueryProvider } from '@/providers/QueryProvider';
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
    <QueryProvider>
      <AppLayout>
        {children}
      </AppLayout>
      
      {/* Custom Splash Screen - shows only on initial startup */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </QueryProvider>
  );
}
