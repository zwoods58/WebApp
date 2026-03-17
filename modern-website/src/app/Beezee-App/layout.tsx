'use client';

import { LanguageProvider } from '@/hooks/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { BusinessProfileProvider } from '@/contexts/BusinessProfileContext';
import { ToastProvider } from '@/providers/ToastProvider';
import { OfflineBanner } from '@/components/universal';
import AppLayout from '@/components/global/AppLayout';
import { TourProvider } from '@/components/universal/IndustryTour';
import { AuthErrorBoundary } from '@/components/AuthErrorBoundary';
import { useRouter } from 'next/navigation';

function BeezeeContent({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <TourProvider industry="retail" country="ke">
        <OfflineBanner />
        {children}
      </TourProvider>
    </AppLayout>
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

