'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { LanguageProvider } from '@/hooks/LanguageContext';
import { UnifiedAuthProvider, useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { BusinessProfileProvider } from '@/contexts/BusinessProfileContext';
import { ToastProvider } from '@/providers/ToastProvider';
import { AuthErrorBoundary } from '@/components/AuthErrorBoundary';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

// Lazy load non-critical components for faster initial load
const BottomNav = lazy(() => import('@/components/universal/BottomNav'));
const ScrollToTop = lazy(() => import('@/components/universal/ScrollToTop'));
const PWAInstallPrompt = lazy(() => import('@/components/PWAInstallPrompt'));
const ConnectionToast = lazy(() => import('@/components/universal/ConnectionToast').then(mod => ({ default: mod.ConnectionToast })));

// Add custom styles for animations (will be added in useEffect)

function BeezeeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { business } = useUnifiedAuth();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [updateShownForVersion, setUpdateShownForVersion] = useState<string | null>(null);
  
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
      // Check if this is a fetch error with our offline header
      const response = event.reason?.response;
      if (response?.status === 503 && response?.headers?.get('X-Offline') === 'true') {
        console.log('[Layout] Suppressing offline RSC error');
        event.preventDefault(); // Prevent unhandled rejection
      }
    };
    
    window.addEventListener('unhandledrejection', handleFetchError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleFetchError);
    };
  }, [])

  // ✅ Service Worker Update Detection (with loop prevention)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let hasShownUpdate = false;
      
      // Detect when a new service worker is waiting
      navigator.serviceWorker.ready.then((registration) => {
        // Check if there's already a waiting worker on mount
        if (registration.waiting && navigator.serviceWorker.controller && !hasShownUpdate) {
          console.log('[Layout] Update already waiting on mount');
          hasShownUpdate = true;
          setUpdateAvailable(true);
          setNewVersion('v32');
          setUpdateShownForVersion('v32');
        }
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller && !hasShownUpdate) {
                // New version is waiting - only show once
                console.log('[Layout] New version waiting to activate');
                hasShownUpdate = true;
                const versionId = `v32-${Date.now()}`;
                setUpdateAvailable(true);
                setNewVersion('v32');
                setUpdateShownForVersion(versionId);
              }
            });
          }
        });
      });
      
      // Check for updates periodically (every 2 hours, not every hour)
      const updateInterval = setInterval(() => {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg && !hasShownUpdate) {
            console.log('[Layout] 🔍 Periodic update check...');
            reg.update();
          }
        });
      }, 2 * 60 * 60 * 1000); // 2 hours
      
      return () => clearInterval(updateInterval);
    }
  }, []);
  
  // ✅ NEW: Handle update reload
  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
      
      // Reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      window.location.reload();
    }
  };
  
  // ✅ NEW: Dismiss update notification
  const handleDismissUpdate = () => {
    setUpdateAvailable(false);
    setNewVersion(null);
  };

  // Prefetch critical routes for faster navigation (NO API CALLS)
  useEffect(() => {
    if (!business?.id) return;
    
    // Extract country and industry from pathname for route prefetching
    const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
    const country = pathMatch?.[1] || '';
    const industry = pathMatch?.[2] || '';
    const basePath = `/Beezee-App/app/${country}/${industry}`;
    
    // Only prefetch routes, not API endpoints
    const routesToPrefetch = [
      `${basePath}`,
      `${basePath}/cash`,
      `${basePath}/credit`,
      `${basePath}/services`,
      `${basePath}/stock`,
      `${basePath}/calendar`,
      `${basePath}/more`,
      `${basePath}/settings`,
      `${basePath}/reports`,
      `${basePath}/transactions`,
    ];
    
    routesToPrefetch.forEach(route => {
      router.prefetch(route);
    });
    
    console.log('✅ Prefetched navigation routes for:', basePath);
  }, [business?.id, router, pathname]);

  // Extract country and industry from pathname
  const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
  const country = pathMatch?.[1] || '';
  const industry = pathMatch?.[2] || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection Toast Notification */}
      <Suspense fallback={null}>
        <ConnectionToast duration={3000} />
      </Suspense>
      
      {/* ✅ NEW: Update Available Banner */}
      {updateAvailable && (
        <div className="fixed top-12 left-0 right-0 z-50 mx-4">
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">
                New version {newVersion} available!
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={handleDismissUpdate}
                className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-800 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div key={pathname} className="pb-20">
        {children}
      </div>
      
      {/* PWA Install Prompt */}
      <Suspense fallback={null}>
        <PWAInstallPrompt />
      </Suspense>
      
      {/* Bottom Navigation - always show for app pages */}
      {country && industry && (
        <Suspense fallback={null}>
          <BottomNav industry={industry} country={country} />
        </Suspense>
      )}
      
      {/* Scroll to Top Button */}
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