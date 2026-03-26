'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerUpdate Component
 * 
 * Handles automatic updates when a new service worker version is available.
 * - Listens for SW update events
 * - Auto-reloads page to activate new version
 * - Checks for updates periodically (every 60 seconds)
 */
export default function ServiceWorkerUpdate() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Listen for service worker update available event
    const handleUpdateAvailable = () => {
      console.log('[SW] 🔄 New version available - reloading page...');
      
      // Optional: Show toast notification
      // You can add a toast library here if desired
      // toast.info('New version available. Updating...');
      
      // Reload page after short delay to activate new service worker
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    // Listen for SW activation message
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_ACTIVATED') {
        console.log('[SW] ✅ New service worker activated - reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);
    navigator.serviceWorker.addEventListener('message', handleMessage);

    // Check for updates periodically (every 60 seconds)
    const updateInterval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          console.log('[SW] 🔍 Checking for updates...');
          reg.update();
        }
      });
    }, 60000); // 60 seconds

    // Cleanup
    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      clearInterval(updateInterval);
    };
  }, []);

  return null; // This component doesn't render anything
}
