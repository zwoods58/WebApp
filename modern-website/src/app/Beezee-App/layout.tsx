'use client';

import { useEffect } from 'react';
import { LanguageProvider } from '@/hooks/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { BusinessProfileProvider } from '@/contexts/BusinessProfileContext';
import { ToastProvider } from '@/providers/ToastProvider';
import OfflineIndicator from '@/components/ui/OfflineIndicator';
import GlobalPullToRefresh from '@/components/global/GlobalPullToRefresh';
import { AuthErrorBoundary } from '@/components/AuthErrorBoundary';
import { usePathname } from 'next/navigation';
import { offlineSyncHandler } from '@/services/offlineSyncHandler';
import { initServiceWorker, initializeQueue } from '@/utils/registerSW';
import { SyncRefreshBanner } from '@/components/ui/SyncRefreshBanner';
import BottomNav from '@/components/universal/BottomNav';

function BeezeeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Extract country and industry from pathname
  const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
  const country = pathMatch?.[1] || '';
  const industry = pathMatch?.[2] || '';
  
  // Initialize Service Worker and new queue system
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize the new IndexedDB queue system
        await initializeQueue()
        
        // Initialize Service Worker
        initServiceWorker()
        
        // Keep existing sync handler for compatibility
        offlineSyncHandler.initialize()
        
        console.log('✅ PWA architecture initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize PWA architecture:', error)
      }
    }

    initialize()
    
    return () => {
      offlineSyncHandler.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <GlobalPullToRefresh>
        <SyncRefreshBanner />
        <OfflineIndicator />
        {children}
        {/* Bottom Navigation - always show for app pages */}
        {country && industry && (
          <BottomNav industry={industry} country={country} />
        )}
      </GlobalPullToRefresh>
    </div>
  );
}

export default function BeezeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleRetry = () => {
    // Force a full page reload to retry auth restoration
    window.location.reload();
  };

  const handleClearSession = () => {
    // Clear all auth data and redirect to login
    localStorage.removeItem('beezee_business_auth');
    localStorage.removeItem('beezee_direct_auth');
    localStorage.removeItem('sessionData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('beezee_simple_auth');
    window.location.href = '/Beezee-App/auth/login';
  };

  return (
    <AuthErrorBoundary onRetry={handleRetry} onClearSession={handleClearSession}>
      <AuthProvider>
        <BusinessProvider>
          <BusinessProfileProvider>
            <LanguageProvider industry="retail">
              <ToastProvider>
                <BeezeeContent>{children}</BeezeeContent>
              </ToastProvider>
            </LanguageProvider>
          </BusinessProfileProvider>
        </BusinessProvider>
      </AuthProvider>
    </AuthErrorBoundary>
  );
}

