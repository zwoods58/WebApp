'use client';

import { useEffect, useState } from 'react';
import { LanguageProvider } from '@/hooks/LanguageContext';
import { UnifiedAuthProvider, useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { BusinessProfileProvider } from '@/contexts/BusinessProfileContext';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthErrorBoundary } from '@/components/AuthErrorBoundary';
import { usePathname } from 'next/navigation';
import BottomNav from '@/components/universal/BottomNav';
import { initConnectionMonitoring, cleanupConnectionMonitoring } from '@/lib/connection-manager';
import { ConnectionStatus } from '@/components/ConnectionStatus';

function BeezeeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { business } = useUnifiedAuth();
  
  // Initialize connection monitoring
  useEffect(() => {
    initConnectionMonitoring()
    return () => {
      cleanupConnectionMonitoring()
    }
  }, [])

  // Extract country and industry from pathname
  const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
  const country = pathMatch?.[1] || '';
  const industry = pathMatch?.[2] || '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 pt-0">
      {/* Global connection status indicator */}
      <ConnectionStatus />
      
      {children}
      
      {/* Bottom Navigation - always show for app pages */}
      {country && industry && (
        <BottomNav industry={industry} country={country} />
      )}
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
    localStorage.removeItem('beezee_unified_auth');
    localStorage.removeItem('beezee_business_auth');
    localStorage.removeItem('beezee_direct_auth');
    localStorage.removeItem('sessionData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('beezee_simple_auth');
    window.location.href = '/Beezee-App/auth/login';
  };

  return (
    <AuthErrorBoundary onRetry={handleRetry} onClearSession={handleClearSession}>
      <UnifiedAuthProvider>
        <BusinessProfileProvider>
          <LanguageProvider industry="retail">
            <ToastProvider>
              <BeezeeContent>{children}</BeezeeContent>
            </ToastProvider>
          </LanguageProvider>
        </BusinessProfileProvider>
      </UnifiedAuthProvider>
    </AuthErrorBoundary>
  );
}

