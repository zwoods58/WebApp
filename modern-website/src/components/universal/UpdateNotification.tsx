'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface UpdateNotificationProps {
  onUpdate?: () => void;
}

export function UpdateNotification({ onUpdate }: UpdateNotificationProps) {
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Function to check for updates
    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('[Update] Checked for updates');
        }
      } catch (error) {
        console.error('[Update] Failed to check:', error);
      }
    };

    // Check for updates EVERY 1 MINUTE (60000ms)
    const interval = setInterval(checkForUpdates, 60000);
    
    // Check immediately on mount
    checkForUpdates();

    // Check for existing waiting worker
    const checkWaitingWorker = async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShow(true);
      }
    };
    
    checkWaitingWorker();

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
    
    // Auto-refresh when controller changes
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
      
      // Send message to activate new worker
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Force reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      setShow(false);
      if (onUpdate) onUpdate();
    } else {
      // Fallback: force reload anyway
      window.location.reload();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-blue-600 text-white rounded-lg shadow-xl p-4 min-w-[280px]">
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
            onClick={updateApp}
            className="mt-3 w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Update Now
          </button>
        )}
      </div>
    </div>
  );
}
