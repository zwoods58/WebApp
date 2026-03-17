"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface GlobalRefreshOptions {
  clearCache?: boolean;
  refetchData?: boolean;
  showNotification?: boolean;
}

export function useGlobalRefresh() {
  const router = useRouter();

  const performGlobalRefresh = useCallback(async (options: GlobalRefreshOptions = {}) => {
    const {
      clearCache = true,
      refetchData = true,
      showNotification = true
    } = options;

    try {
      console.log('🔄 Performing global refresh...');

      // 1. Clear browser caches if requested
      if (clearCache) {
        // Clear service worker cache if available
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('✅ Cache cleared');
          } catch (error) {
            console.warn('⚠️ Failed to clear cache:', error);
          }
        }

        // Clear localStorage items that should be refreshed
        const keysToClear = ['cached_inventory', 'cached_sales', 'cached_customers'];
        keysToClear.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.warn(`Failed to clear ${key}:`, error);
          }
        });
      }

      // 2. Refetch data by triggering page refresh
      if (refetchData) {
        // Refresh Next.js page to re-fetch server-side data
        router.refresh();
        
        // Also trigger a soft refresh of dynamic data
        const refreshEvent = new CustomEvent('globalDataRefresh', {
          detail: { timestamp: Date.now(), source: 'pull-to-refresh' }
        });
        window.dispatchEvent(refreshEvent);
      }

      // 3. Show notification if requested
      if (showNotification) {
        // You can integrate with your toast/notification system here
        console.log('📱 App refreshed successfully');
        
        // Example: Show toast notification
        // toast.success('App refreshed successfully');
      }

      return { success: true, message: 'Global refresh completed' };

    } catch (error) {
      console.error('❌ Global refresh failed:', error);
      
      if (showNotification) {
        // Show error notification
        console.log('❌ Failed to refresh app');
        // toast.error('Failed to refresh app');
      }

      return { success: false, message: 'Global refresh failed', error };
    }
  }, [router]);

  const performSoftRefresh = useCallback(() => {
    // Trigger a soft refresh without full page reload
    const refreshEvent = new CustomEvent('softDataRefresh', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(refreshEvent);
    console.log('🔄 Soft refresh triggered');
  }, []);

  const performHardRefresh = useCallback(() => {
    // Force a hard page refresh
    window.location.reload();
    console.log('🔄 Hard refresh triggered');
  }, []);

  return {
    performGlobalRefresh,
    performSoftRefresh,
    performHardRefresh
  };
}
