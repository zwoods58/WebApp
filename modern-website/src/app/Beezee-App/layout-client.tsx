'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { RefreshCw } from 'lucide-react';
import { LanguageProvider } from '@/hooks/useLanguage';
import { SupabaseAuthProvider, useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { BusinessProfileProvider } from '@/contexts/BusinessProfileContext';
import { IndustryProvider, useIndustry } from '@/contexts/IndustryContext';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthErrorBoundary } from '@/components/AuthErrorBoundary';
import UpdatePrompt from '@/components/universal/UpdatePrompt';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

// Lazy load non-critical components for faster initial load
const BottomNav = lazy(() => import('@/components/universal/BottomNav'));
const ScrollToTop = lazy(() => import('@/components/universal/ScrollToTop'));
const PWAInstallPrompt = lazy(() => import('@/components/PWAInstallPrompt'));
const ConnectionToast = lazy(() => import('@/components/universal/ConnectionToast').then(mod => ({ default: mod.ConnectionToast })));

function BeezeeContentWithLanguage({ children }: { children: React.ReactNode }) {
  const { industry } = useIndustry();
  const pathname = usePathname();
  
  // Extract country from pathname for language provider
  const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
  const country = pathMatch?.[1] || '';
  
  return (
    <LanguageProvider industry={industry} country={country}>
      <BeezeeContent>{children}</BeezeeContent>
    </LanguageProvider>
  );
}

import { ReadOnlyBanner } from '@/components/subscription/ReadOnlyBanner';

function BeezeeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, business, isReadOnly } = useSupabaseAuth();
  
  // Add custom styles for animations (client-side only)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slide-in-from-right {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .animate-in.slide-in-from-right {
        animation: slide-in-from-right 0.3s ease-out;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in-right {
        animation: slideInRight 0.3s ease-out;
      }
    `;
    if (!document.head.querySelector('style[data-connection-toast]')) {
      style.setAttribute('data-connection-toast', 'true');
      document.head.appendChild(style);
    }
  }, []);

  // One-time cleanup of bad operations before sync starts
  useEffect(() => {
    import('@/lib/cleanup-bad-operations').then(({ cleanupBadOperations }) => {
      cleanupBadOperations().catch((err: any) => 
        console.error('[Layout] Cleanup failed:', err)
      );
    });
  }, []);

  // Suppress RSC 503 errors when offline
  useEffect(() => {
    const handleFetchError = (event: PromiseRejectionEvent) => {
      const response = event.reason?.response;
      if (response?.status === 503 && response?.headers?.get('X-Offline') === 'true') {
        console.log('[Layout] Suppressing offline RSC error');
        event.preventDefault();
      }
    };
    
    window.addEventListener('unhandledrejection', handleFetchError);
    return () => {
      window.removeEventListener('unhandledrejection', handleFetchError);
    };
  }, []);

  // Prefetch critical routes for faster navigation
  useEffect(() => {
    const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
    const country = pathMatch?.[1] || '';
    const industry = pathMatch?.[2] || '';

    // Don't prefetch if we don't have a valid country/industry yet
    if (!country || !industry) return;

    const basePath = `/Beezee-App/app/${country}/${industry}`;
    
    const routesToPrefetch = [
      `${basePath}`,
      `${basePath}/cash`,
      `${basePath}/credit`,
      `${basePath}/services`,
      `${basePath}/stock`,
      `${basePath}/more`,
      `${basePath}/settings`,
      `${basePath}/reports`,
      `${basePath}/transactions`,
    ];
    
    routesToPrefetch.forEach(route => router.prefetch(route));
    console.log('Prefetched navigation routes for:', basePath);
  }, [business?.id, router, pathname]);

  // Extract country and industry from pathname
  const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
  const country = pathMatch?.[1] || '';
  const industry = pathMatch?.[2] || '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ReadOnlyBanner />

      <Suspense fallback={null}>
        <ConnectionToast duration={3000} />
      </Suspense>
      
      <div key={pathname}>
        {children}
      </div>
      
      <UpdatePrompt />
      
      <Suspense fallback={null}>
        <PWAInstallPrompt />
      </Suspense>
      
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
}

export default function BeezeeLayoutClient({
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
      {/* ✅ FIX: Replaced UnifiedAuthProvider with SupabaseAuthProvider */}
      <SupabaseAuthProvider>
        <BusinessProfileProvider>
          <IndustryProvider>
            <ToastProvider>
              <BeezeeContentWithLanguage>{children}</BeezeeContentWithLanguage>
            </ToastProvider>
          </IndustryProvider>
        </BusinessProfileProvider>
      </SupabaseAuthProvider>
    </AuthErrorBoundary>
  );
}