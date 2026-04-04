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

  // ✅ Enhanced Update Detection (Service Worker + Vercel API)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      
      // Detect when a new service worker is waiting
      navigator.serviceWorker.ready.then((registration) => {
        // Check if there's already a waiting worker on mount
        if (registration.waiting && navigator.serviceWorker.controller && !hasShownUpdate) {
          console.log('[Layout] Update already waiting on mount');
          setHasShownUpdate(true);
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
                setHasShownUpdate(true);
                const versionId = `v32-${Date.now()}`;
                setUpdateAvailable(true);
                setNewVersion('v32');
                setUpdateShownForVersion(versionId);
              }
            });
          }
        });
      });
      
      // Enhanced: Check for updates frequently (30 seconds instead of 2 hours)
      const updateInterval = setInterval(async () => {
        if (!hasShownUpdate) {
          // 1. Service worker update check
          navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
              console.log('[Layout] 🔍 Periodic service worker update check...');
              reg.update();
            }
          });
          
          // 2. Vercel API version check for immediate detection
          try {
            console.log('[Layout] 🔍 Checking Vercel API for updates...');
            const response = await fetch('/api/version-check');
            const data = await response.json();
            
            const currentVersion = localStorage.getItem('app-version');
            const apiVersion = data.version;
            
            if (apiVersion && apiVersion !== currentVersion) {
              console.log('[Layout] � New version detected via Vercel API:', apiVersion);
              setHasShownUpdate(true);
              setUpdateAvailable(true);
              setNewVersion(apiVersion);
              setUpdateShownForVersion(apiVersion);
              localStorage.setItem('app-version', apiVersion);
            } else {
              console.log('[Layout] ✅ Version up to date:', apiVersion);
            }
          } catch (error) {
            console.log('[Layout] ⚠️ API check failed, using service worker only:', error);
          }
        }
      }, 30000); // 30 seconds instead of 2 hours
      
      return () => clearInterval(updateInterval);
    }
  }, []);

  // ✅ NEW: Handle manual update triggers from More page
  useEffect(() => {
    const handleManualUpdateCheck = (event: CustomEvent) => {
      console.log('[Layout] Manual update check triggered:', event.detail);
      
      // Force immediate update check
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
          
          // Check for waiting worker after update
          setTimeout(() => {
            if (registration.waiting && !updateShownForVersion) {
              console.log('[Layout] Update found after manual check');
              setUpdateAvailable(true);
              setNewVersion(`manual-${Date.now()}`);
              setUpdateShownForVersion(`manual-${Date.now()}`);
            } else if (!registration.waiting) {
              // Check Vercel API as fallback
              fetch('/api/version-check')
                .then(response => response.json())
                .then(data => {
                  const currentVersion = localStorage.getItem('app-version');
                  if (data.version !== currentVersion) {
                    setUpdateAvailable(true);
                    setNewVersion(data.version);
                    setUpdateShownForVersion(data.version);
                    localStorage.setItem('app-version', data.version);
                  }
                })
                .catch(error => {
                  console.log('[Layout] Manual API check failed:', error);
                });
            }
          }, 1000);
        });
      }
    };
    
    window.addEventListener('TRIGGER_UPDATE_CHECK', handleManualUpdateCheck as EventListener);
    
    return () => {
      window.removeEventListener('TRIGGER_UPDATE_CHECK', handleManualUpdateCheck as EventListener);
    };
  }, [updateShownForVersion]);

  // ✅ NEW: Smart Update Triggers (3x faster detection)
  useEffect(() => {
    const checkForUpdates = async () => {
      if (!hasShownUpdate) {
        console.log('[Layout] 🚀 Smart trigger: checking for updates...');
        
        // 1. Service worker update check
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) {
            reg.update();
          }
        });
        
        // 2. Vercel API check for immediate detection
        try {
          const response = await fetch('/api/version-check');
          const data = await response.json();
          
          const currentVersion = localStorage.getItem('app-version');
          const apiVersion = data.version;
          
          if (apiVersion && apiVersion !== currentVersion) {
            console.log('[Layout] 🚀 Smart trigger: New version detected:', apiVersion);
            setUpdateAvailable(true);
            setNewVersion(apiVersion);
            setUpdateShownForVersion(apiVersion);
            localStorage.setItem('app-version', apiVersion);
          }
        } catch (error) {
          console.log('[Layout] Smart trigger: API check failed');
        }
      }
    };

    // 1. Check when app becomes visible (Page Visibility API)
    const handleVisibilityChange = () => {
      if (!document.hidden && !hasShownUpdate) {
        console.log('[Layout] 👁️ App became visible, checking for updates...');
        checkForUpdates();
      }
    };

    // 2. Check when network status changes
    const handleOnline = () => {
      console.log('[Layout] 🌐 App came online, checking for updates...');
      checkForUpdates();
    };

    // 3. Debounced check on user interaction
    let interactionTimeout: NodeJS.Timeout;
    const handleUserInteraction = () => {
      if (!hasShownUpdate) {
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(checkForUpdates, 2000); // 2 seconds after interaction
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    // User interaction events (debounced)
    ['click', 'scroll', 'keydown'].forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      ['click', 'scroll', 'keydown'].forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
      clearTimeout(interactionTimeout);
    };
  }, [hasShownUpdate, updateShownForVersion]);
  
  // ✅ OPTIMIZED: Handle update reload (5x faster)
  const handleUpdate = () => {
    console.log('[Layout] 🚀 Update button clicked - starting fast update...');
    
    // Immediate visual feedback
    setUpdating(true);
    setUpdateStatus('activating');
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          console.log('[Layout] 📡 Sending SKIP_WAITING message...');
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Listen for activation to reload immediately
          const handleControllerChange = () => {
            console.log('[Layout] ✅ Service worker activated, reloading immediately...');
            window.location.reload();
          };
          
          navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange, { once: true });
          
          // Fallback reload with minimal delay (100ms instead of 500ms)
          setTimeout(() => {
            console.log('[Layout] ⚡ Fallback reload after 100ms...');
            if (!window.location.reload()) {
              window.location.href = window.location.href;
            }
          }, 100); // 5x faster!
        } else {
          console.log('[Layout] ⚡ No waiting worker, reloading immediately...');
          window.location.reload();
        }
      }).catch(error => {
        console.error('[Layout] ❌ Service worker error:', error);
        window.location.reload();
      });
    } else {
      console.log('[Layout] ⚡ No service worker, reloading immediately...');
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