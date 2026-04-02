'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface UpdateNotificationProps {
  onUpdate?: () => void;
}

export function UpdateNotification({ onUpdate }: UpdateNotificationProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Check for updates every minute
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      });

      // Listen for new service worker waiting
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  // Listen for messages from service worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        setWaitingWorker(event.data.worker);
        setShowUpdate(true);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
      if (onUpdate) onUpdate();
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw size={20} className="animate-spin" />
            <div>
              <h3 className="font-semibold">Update Available!</h3>
              <p className="text-sm opacity-90">A new version is ready to install</p>
            </div>
          </div>
          <button
            onClick={() => setShowUpdate(false)}
            className="text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <button
          onClick={handleUpdate}
          className="mt-3 w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          Update Now
        </button>
      </div>
    </div>
  );
}
