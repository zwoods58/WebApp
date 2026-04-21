"use client";

import { QueryProvider } from '@/providers/QueryProvider';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { BusinessProfileProvider } from '@/contexts/BusinessProfileContext';
import { IndustryProvider } from '@/contexts/IndustryContext';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthErrorBoundary } from '@/components/AuthErrorBoundary';

function BeezeeLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleClearSession = () => {
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
      <SupabaseAuthProvider>
        <BusinessProfileProvider>
          <IndustryProvider>
            <ToastProvider>
              <QueryProvider>
                {children}
              </QueryProvider>
            </ToastProvider>
          </IndustryProvider>
        </BusinessProfileProvider>
      </SupabaseAuthProvider>
    </AuthErrorBoundary>
  );
}

export default function BeezeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BeezeeLayoutClient>{children}</BeezeeLayoutClient>;
}

