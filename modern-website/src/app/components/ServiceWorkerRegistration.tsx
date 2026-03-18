'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      // For now, use a simple service worker registration
      // The offline functionality doesn't require service worker caching
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Check for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available, show update notification
                  console.log('🔄 New service worker available, refresh to update');
                }
              });
            }
          });
        })
        .catch((error) => {
          // Service worker registration failed, but don't break the app
          console.log('ℹ️ Service Worker not registered (offline mode will still work):', error.message);
        });

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_STATUS_UPDATE') {
          // Dispatch custom event for components to listen to
          window.dispatchEvent(new CustomEvent('sync-status-update', {
            detail: event.data.payload
          }));
        }
      });

      // Handle offline/online events
      const handleOnline = () => {
        console.log('🌐 Network connection restored');
        window.dispatchEvent(new CustomEvent('network-status-change', {
          detail: { isOnline: true }
        }));
      };

      const handleOffline = () => {
        console.log('📵 Network connection lost');
        window.dispatchEvent(new CustomEvent('network-status-change', {
          detail: { isOnline: false }
        }));
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Cleanup event listeners
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
