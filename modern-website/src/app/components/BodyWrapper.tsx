'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/global/AppLayout';
import { useGlobalRefresh } from '@/hooks/useGlobalRefresh';
import ServiceWorkerRegistration from './ServiceWorkerRegistration';
import { QueryProvider } from '@/providers/QueryProvider';

interface BodyWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function BodyWrapper({ children, className = '' }: BodyWrapperProps) {
  const [isClient, setIsClient] = useState(false);
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

  // Only show OfflineIndicator on non-BeeZee pages (BeeZee has its own)
  const isBeezeePage = pathname?.startsWith('/Beezee-App');

  return (
    <>
      <ServiceWorkerRegistration />
      <QueryProvider>
        <body 
          className={`${className} ${isClient ? 'hydrated' : ''}`}
          suppressHydrationWarning
        >
          <AppLayout>
            {children}
          </AppLayout>
        </body>
      </QueryProvider>
    </>
  );
}
