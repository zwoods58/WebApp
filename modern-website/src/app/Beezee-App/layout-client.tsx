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
const UpdateModal = lazy(() => import('@/components/ui/UpdateModal'));

// Add custom styles for animations (will be added in useEffect)

function BeezeeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { business } = useUnifiedAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>('v105');
  const [laterPressedTime, setLaterPressedTime] = useState<number | null>(null);
  
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

  // Check if 24 hours have passed since "Later" was pressed
  const shouldShowUpdateModal = () => {
    const laterPressedTime = localStorage.getItem('update-later-timestamp');
    if (!laterPressedTime) return true;
    
    const hoursPassed = (Date.now() - parseInt(laterPressedTime)) / (1000 * 60 * 60);
    return hoursPassed >= 24;
  };

  // Handle "Later" button press
  const handleLater = () => {
    localStorage.setItem('update-later-timestamp', Date.now().toString());
    setShowUpdateModal(false);
  };

  // Clear old caches and reload app
  const clearOldCachesAndReload = async () => {
    try {
      // Clear all existing caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      // Clear localStorage update timer
      localStorage.removeItem('update-later-timestamp');
      
      // Update app version in localStorage
      if (newVersion) {
        localStorage.setItem('app-version', newVersion);
      }
      
      // Reload app with fresh cache
      window.location.reload();
    } catch (error) {
      console.error('Cache clear failed:', error);
      // Force reload anyway
      window.location.reload();
    }
  };

  // Handle "Update Now" button press
  const handleUpdateNow = async () => {
    console.log('[Layout] User clicked Update Now');
    setIsUpdating(true);
    
    try {
      // 1. Get service worker registration
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration?.waiting) {
        // 2. Tell waiting service worker to activate
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // 3. Listen for controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // 4. Clear old caches and reload with new version
          clearOldCachesAndReload();
        });
      } else {
        // 5. Force service worker update check
        if (registration) {
          await registration.update();
          
          // 6. Check if new version found
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              clearOldCachesAndReload();
            });
          } else {
            // 7. No waiting worker, just reload to get latest from Vercel
            clearOldCachesAndReload();
          }
        } else {
          // No registration, just reload
          clearOldCachesAndReload();
        }
      }
    } catch (error) {
      console.error('Update failed:', error);
      // Fallback: just reload
      clearOldCachesAndReload();
    }
  };

  // Initialize current version from localStorage
  useEffect(() => {
    const storedVersion = localStorage.getItem('app-version');
    if (storedVersion) {
      setCurrentVersion(storedVersion);
    }
    
    // Load later timestamp from localStorage
    const laterTime = localStorage.getItem('update-later-timestamp');
    if (laterTime) {
      setLaterPressedTime(parseInt(laterTime));
    }
  }, []);

  // ✅ UNIFIED Update Detection System (Service Worker + API)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    
    let updateCheckInterval: NodeJS.Timeout;
    
    const checkForUpdate = async () => {
      // Check if we should show modal (24-hour cooldown)
      if (!shouldShowUpdateModal()) return;
      
      try {
        // 1. Check service worker for waiting update
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting && navigator.serviceWorker.controller) {
            console.log('[Layout] 🎉 Service worker update available');
            setNewVersion('v106'); // This should come from the service worker
            setShowUpdateModal(true);
            return;
          }
        }
        
        // 2. Fallback: Check API for version
        try {
          const response = await fetch('/api/version-check');
          const data = await response.json();
          
          const currentStoredVersion = localStorage.getItem('app-version') || 'v105';
          
          if (data.version && data.version !== currentStoredVersion) {
            console.log('[Layout] 🎉 New version detected via API:', data.version);
            setNewVersion(data.version);
            setShowUpdateModal(true);
          }
        } catch (apiError) {
          // API might not exist, that's okay
          console.log('[Layout] API version check not available');
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
      if (!document.hidden && shouldShowUpdateModal()) checkForUpdate();
    };
    
    const handleOnline = () => {
      if (shouldShowUpdateModal()) checkForUpdate();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      clearInterval(updateCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [currentVersion]);

  // Remove manual update triggers since we're removing the More page check

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
      
      {/* ✅ NEW: Update Modal */}
      <Suspense fallback={null}>
        <UpdateModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateNow}
          onLater={handleLater}
          isUpdating={isUpdating}
          currentVersion={currentVersion}
          newVersion={newVersion || 'v106'}
        />
      </Suspense>
      
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