'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface UpdateNotificationProps {
  onUpdate?: () => void;
}

export function UpdateNotification({ onUpdate }: UpdateNotificationProps) {
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'downloading' | 'ready' | 'updated'>('idle');
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  // Check for updates every minute
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('[Update] Checked for updates');
          
          // Check if there's a waiting worker
          if (registration.waiting) {
            setShow(true);
            setUpdateStatus('ready');
            setWaitingWorker(registration.waiting);
          }
        }
      } catch (error) {
        console.error('[Update] Failed to check:', error);
      }
    };

    // Check immediately and every minute
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 60000);

    // Listen for new service workers
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShow(true);
              setUpdateStatus('ready');
              setWaitingWorker(newWorker);
            }
          });
        }
      });
    });

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATE_AVAILABLE') {
        setShow(true);
        setUpdateStatus('ready');
      }
      if (event.data?.type === 'SW_UPDATING') {
        setUpdateStatus('downloading');
      }
      if (event.data?.type === 'SW_UPDATED') {
        setUpdateStatus('updated');
        setTimeout(() => window.location.reload(), 1000);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    
    // Reload when controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    return () => {
      clearInterval(interval);
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const forceUpdate = async () => {
    setIsUpdating(true);
    setUpdateStatus('checking');
    
    try {
      // Method 1: Clear all caches first
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('[Update] Cleared all caches');
      
      // Method 2: Unregister and re-register service worker
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('[Update] Unregistered old service worker');
      }
      
      setUpdateStatus('downloading');
      
      // Method 3: Force refresh with cache busting
      setTimeout(() => {
        window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
      }, 500);
      
    } catch (error) {
      console.error('[Update] Force update failed:', error);
      setUpdateStatus('idle');
      setIsUpdating(false);
      
      // Fallback: simple reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const updateApp = () => {
    if (waitingWorker) {
      setIsUpdating(true);
      setUpdateStatus('downloading');
      
      // Send message to activate new worker
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Force reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      setShow(false);
      if (onUpdate) onUpdate();
    } else {
      forceUpdate();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-blue-600 text-white rounded-lg shadow-xl p-4 min-w-[280px]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {(isUpdating || updateStatus !== 'idle') ? (
              <RefreshCw size={20} className="animate-spin shrink-0" />
            ) : (
              <RefreshCw size={20} className="shrink-0" />
            )}
            <div>
              <h3 className="font-semibold text-sm">
                {updateStatus === 'checking' && 'Checking for updates...'}
                {updateStatus === 'downloading' && 'Downloading update...'}
                {updateStatus === 'ready' && 'Update Available'}
                {updateStatus === 'updated' && 'Update complete! Reloading...'}
                {updateStatus === 'idle' && 'Update Available'}
              </h3>
              <p className="text-xs opacity-90">
                {updateStatus === 'ready' && 'A new version is ready to install'}
                {updateStatus === 'downloading' && 'Getting the latest version...'}
                {updateStatus === 'updated' && 'App will reload automatically'}
              </p>
            </div>
          </div>
          {updateStatus === 'ready' && (
            <button
              onClick={() => setShow(false)}
              className="text-white/70 hover:text-white transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {updateStatus === 'ready' && (
          <button
            onClick={updateApp}
            className="mt-3 w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Update Now
          </button>
        )}
        {(updateStatus === 'checking' || updateStatus === 'downloading') && (
          <button
            disabled
            className="mt-3 w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            Updating...
          </button>
        )}
      </div>
    </div>
  );
}
