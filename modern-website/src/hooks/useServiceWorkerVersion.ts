'use client';

import { useEffect, useState, useCallback } from 'react';

export function useServiceWorkerVersion() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    setIsSupported(true);

    // Get existing registration
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      setRegistration(reg);

      // Check if there's already a waiting worker
      if (reg.waiting) {
        setIsUpdateAvailable(true);
      }

      // Listen for new service worker installing
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version is ready and waiting
            setIsUpdateAvailable(true);
          }
        });
      });
    });

    // Listen for controller change (update applied)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    // Poll for updates every 60 seconds
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update();
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const applyUpdate = useCallback(() => {
    if (!registration?.waiting) return;
    // Tell the waiting service worker to take control
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [registration]);

  return {
    isUpdateAvailable,
    isSupported,
    applyUpdate,
  };
}
