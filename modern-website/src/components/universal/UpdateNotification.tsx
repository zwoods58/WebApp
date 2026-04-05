'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

export function UpdateNotification() {
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          // Check if there's a waiting worker (update ready)
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShow(true);
          }
          
          // Check for updates from server
          await registration.update();
        }
      } catch (error) {
        console.error('[Update] Failed to check:', error);
      }
    };

    // More frequent mobile polling: every 10 seconds
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 10000); // 10 seconds for mobile

    // Listen for new service workers
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShow(true);
            }
          });
        }
      });
    });

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATE_AVAILABLE') {
        setShow(true);
      }
      if (event.data?.type === 'SW_UPDATE_STARTED') {
        setIsUpdating(true);
      }
      if (event.data?.type === 'SW_ACTIVATED') {
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    return () => {
      clearInterval(interval);
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const updateApp = () => {
    if (waitingWorker) {
      setIsUpdating(true);
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-blue-600 text-white rounded-lg shadow-xl p-4 min-w-[280px]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {isUpdating ? (
              <RefreshCw size={20} className="animate-spin shrink-0" />
            ) : (
              <RefreshCw size={20} className="shrink-0" />
            )}
            <div>
              <h3 className="font-semibold text-sm">
                {isUpdating ? 'Updating...' : 'Update Available'}
              </h3>
              <p className="text-xs opacity-90">
                {isUpdating ? 'Installing new version...' : 'A new version is ready'}
              </p>
            </div>
          </div>
          {!isUpdating && (
            <button
              onClick={() => setShow(false)}
              className="text-white/70 hover:text-white transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* THE UPDATE NOW BUTTON - ALWAYS VISIBLE WHEN NOT UPDATING */}
        {!isUpdating && (
          <button
            onClick={updateApp}
            className="mt-3 w-full bg-white text-blue-600 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Update Now
          </button>
        )}
        
        {isUpdating && (
          <button
            disabled
            className="mt-3 w-full bg-white/20 text-white py-2.5 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            Updating...
          </button>
        )}
      </div>
    </div>
  );
}
