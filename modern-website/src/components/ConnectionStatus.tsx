// src/components/ConnectionStatus.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { onConnectionChange } from '@/lib/connection-manager';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Listen for connection changes
    const unsubscribe = onConnectionChange((online) => {
      setIsOnline(online);
      setStatusMessage(online ? 'Back online' : "You're offline");
      setShowStatusToast(true);
      
      // Clear existing timer
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
      
      // Auto-hide after 3 seconds
      statusTimerRef.current = setTimeout(() => {
        setShowStatusToast(false);
      }, 3000);
    });
    
    return () => {
      unsubscribe();
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, []);
  
  return (
    <div className="fixed bottom-20 right-4 z-[55] flex flex-col gap-2">
      {/* Status Toast (Online/Offline) */}
      {showStatusToast && (
        <div
          className={`${
            isOnline ? 'bg-green-600' : 'bg-red-600'
          } text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[200px] slide-in-up`}
        >
          {isOnline ? (
            <Wifi className="w-5 h-5 flex-shrink-0" />
          ) : (
            <WifiOff className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{statusMessage}</span>
        </div>
      )}
    </div>
  );
}

