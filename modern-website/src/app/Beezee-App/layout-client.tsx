'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { RefreshCw } from 'lucide-react';
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
  const [isUpdating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'activating' | 'complete'>('idle');
  const [hasShownUpdate, setHasShownUpdate] = useState(false);
  
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

  // ✅ UNIFIED Update Detection System (Service Worker + API)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    
    let updateCheckInterval: NodeJS.Timeout;
    
    const checkForUpdate = async () => {
      if (hasShownUpdate) return;
      
      try {
        // 1. Check service worker for waiting update
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting && navigator.serviceWorker.controller) {
            console.log('[Layout] 🎉 Service worker update available');
            setUpdateAvailable(true);
            setNewVersion('v105');
            setHasShownUpdate(true);
            return;
          }
        }
        
        // 2. Fallback: Check API for version
        const response = await fetch('/api/version-check');
        const data = await response.json();
        
        const currentVersion = localStorage.getItem('app-version') || 'v104';
        
        if (data.version && data.version !== currentVersion) {
          console.log('[Layout] 🎉 New version detected via API:', data.version);
          setUpdateAvailable(true);
          setNewVersion(data.version);
          setHasShownUpdate(true);
          localStorage.setItem('app-version', data.version);
        }
      } catch (error) {
        console.error('[Layout] Update check failed:', error);
      }
    };
    
    // Initial check
    checkForUpdate();
    
    // Periodic check every 30 seconds
    updateCheckInterval = setInterval(checkForUpdate, 30000);
    
    // Smart triggers
    const handleVisibilityChange = () => {
      if (!document.hidden) checkForUpdate();
    };
    
    const handleOnline = () => {
      checkForUpdate();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      clearInterval(updateCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [hasShownUpdate]);

  // ✅ Handle manual update triggers from More page
  useEffect(() => {
    const handleManualCheck = async () => {
      console.log('[Layout] Manual update check triggered');
      setHasShownUpdate(false); // Allow banner to show again
      
      // Trigger immediate check
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
            setNewVersion('v105');
            setHasShownUpdate(true);
            return;
          }
        }
        
        // Fallback to API check
        const response = await fetch('/api/version-check');
        const data = await response.json();
        const currentVersion = localStorage.getItem('app-version') || 'v104';
        
        if (data.version !== currentVersion) {
          setUpdateAvailable(true);
          setNewVersion(data.version);
          setHasShownUpdate(true);
          localStorage.setItem('app-version', data.version);
        }
      } catch (error) {
        console.error('[Layout] Manual check failed:', error);
      }
    };
    
    window.addEventListener('TRIGGER_UPDATE_CHECK', handleManualCheck);
    
    return () => {
      window.removeEventListener('TRIGGER_UPDATE_CHECK', handleManualCheck);
    };
  }, []);

  // ✅ Handle update reload
  const handleUpdate = async () => {
    console.log('[Layout] User clicked Update Now');
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration?.waiting) {
        // Tell waiting SW to skip waiting and activate
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[Layout] New service worker activated, reloading...');
          window.location.reload();
        });
      } else {
        // No waiting worker, just reload to get new version
        console.log('[Layout] No waiting worker, forcing reload...');
        window.location.reload();
      }
    } catch (error) {
      console.error('[Layout] Update failed:', error);
      // Force reload anyway
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
      
      {/* ✅ ENHANCED: Update Available Banner with Loading States */}
      {updateAvailable && (
        <div className="fixed top-12 left-0 right-0 z-50 mx-4">
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isUpdating ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <div>
                <h3 className="font-semibold text-sm">
                  {isUpdating ? 'Updating...' : 'Update Available'}
                </h3>
                <p className="text-xs opacity-90">
                  {isUpdating 
                    ? 'Installing new version...' 
                    : `New version ${newVersion} available!`
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isUpdating ? (
                <button
                  onClick={handleUpdate}
                  className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  Update Now
                </button>
              ) : (
                <button
                  disabled
                  className="bg-white/20 text-white px-3 py-1 rounded-md text-sm cursor-not-allowed"
                >
                  Updating...
                </button>
              )}
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