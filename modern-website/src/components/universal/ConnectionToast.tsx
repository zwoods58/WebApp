'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';

interface ConnectionToastProps {
  duration?: number; // Duration in milliseconds (default: 3000)
}

export function ConnectionToast({ duration = 3000 }: ConnectionToastProps) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastType('online');
      setShowToast(true);
      
      // Auto-hide after duration
      setTimeout(() => {
        setShowToast(false);
      }, duration);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastType('offline');
      setShowToast(true);
      
      // Auto-hide after duration
      setTimeout(() => {
        setShowToast(false);
      }, duration);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [duration]);

  if (!showToast) return null;

  const isOnlineToast = toastType === 'online';
  
  return (
    <div className="fixed top-24 right-4 z-[60] animate-slide-in-right">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all ${
        isOnlineToast 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {isOnlineToast ? (
          <Wifi size={20} className="animate-pulse" />
        ) : (
          <WifiOff size={20} className="animate-pulse" />
        )}
        <span className="font-medium text-sm">
          {isOnlineToast ? 'Online' : 'Offline'}
        </span>
        <button
          onClick={() => setShowToast(false)}
          className="ml-2 hover:opacity-80 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
