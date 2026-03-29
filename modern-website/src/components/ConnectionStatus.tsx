// src/components/ConnectionStatus.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { onConnectionChange } from '@/lib/connection-manager';
import { db } from '@/lib/database';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const [showPendingToast, setShowPendingToast] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const previousPendingCount = useRef(0);
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { business } = useUnifiedAuth();
  
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
  
  useEffect(() => {
    // Check pending operations
    const checkPending = async () => {
      if (business?.id) {
        const count = await db.getPendingCount(business.id);
        setPendingCount(count);
        
        // Show pending toast only when count increases
        if (count > previousPendingCount.current && count > 0) {
          setShowPendingToast(true);
          
          // Clear existing timer
          if (pendingTimerRef.current) {
            clearTimeout(pendingTimerRef.current);
          }
          
          // Auto-hide after 3 seconds
          pendingTimerRef.current = setTimeout(() => {
            setShowPendingToast(false);
          }, 3000);
        }
        
        previousPendingCount.current = count;
      }
    };
    
    checkPending();
    const interval = setInterval(checkPending, 10000);
    
    return () => {
      clearInterval(interval);
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
      }
    };
  }, [business?.id]);
  
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
      
      {/* Pending Toast (Yellow) */}
      {showPendingToast && pendingCount > 0 && (
        <div className="bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[200px] slide-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            {pendingCount} pending {pendingCount === 1 ? 'change' : 'changes'}
          </span>
        </div>
      )}
    </div>
  );
}
