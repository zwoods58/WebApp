'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/global/AppLayout';
import { useGlobalRefresh } from '@/hooks/useGlobalRefresh';

interface BodyWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function BodyWrapper({ children, className = '' }: BodyWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const { performGlobalRefresh } = useGlobalRefresh();

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

  return (
    <body 
      className={`${className} ${isClient ? 'hydrated' : ''}`}
      suppressHydrationWarning
    >
      <AppLayout>
        {children}
      </AppLayout>
    </body>
  );
}
