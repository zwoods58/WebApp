/**
 * Offline Indicator Component
 * Shows sync status and pending items across all app features
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { getPendingCountByType, getQueueStats } from '@/utils/offlineQueue';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  className = '', 
  showDetails = false,
  compact = false 
}) => {
  const { isOnline } = useNetworkStatus();
  const [isClient, setIsClient] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});
  const [pendingCount, setPendingCount] = useState(0);

  // Ensure we're on client side before showing dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update pending counts from IndexedDB
  useEffect(() => {
    if (!isClient) return;

    const updateCounts = async () => {
      try {
        const counts = await getPendingCountByType();
        const stats = await getQueueStats();
        
        setPendingCounts(counts);
        setPendingCount(stats.pending);
      } catch (error) {
        console.error('Failed to get pending counts:', error);
      }
    };

    updateCounts();

    // Update counts every 2 seconds
    const interval = setInterval(updateCounts, 2000);
    return () => clearInterval(interval);
  }, [isClient]);

  // Show "Back online" banner when coming back online, then hide after 3 seconds
  useEffect(() => {
    if (isOnline && isClient) {
      setShowBackOnline(true);
      const timer = setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowBackOnline(false);
    }
  }, [isOnline, isClient]);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${!isOnline ? 'text-red-500' : 'text-green-500'} ${className}`}>
        {!isOnline ? <WifiOff size={16} /> : <Wifi size={16} />}
        <span className="text-xs font-medium">{!isOnline ? 'Offline' : 'Online'}</span>
      </div>
    );
  }

  // Don't render dynamic content on server to prevent hydration mismatch
  if (!isClient) {
    return null; // Don't render anything during SSR
  }

  return (
    <>
      {/* Offline Mode Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-red-500 text-white shadow-lg"
            style={{ zIndex: 60 }}
          >
            <div className="container mx-auto px-4 py-2">
              <div className="flex flex-col gap-2">
                {/* Main offline message */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowDetailedView(!showDetailedView)}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <WifiOff size={16} className="animate-pulse" />
                    <span>No connection - Working offline</span>
                    {pendingCount > 0 && (
                      <div className="flex items-center gap-1 ml-2 bg-red-600 px-2 py-0.5 rounded-full">
                        <Clock size={12} />
                        <span className="text-xs font-semibold">{pendingCount} pending</span>
                      </div>
                    )}
                  </div>
                  {pendingCount > 0 && (
                    <button className="p-1 hover:bg-red-600 rounded transition-colors">
                      {showDetailedView ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>

                {/* Detailed breakdown */}
                <AnimatePresence>
                  {showDetailedView && pendingCount > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs space-y-1 pl-6 pb-1"
                    >
                      {pendingCounts.cash > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Cash:</span>
                          <span>{pendingCounts.cash} items</span>
                        </div>
                      )}
                      {pendingCounts.inventory > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Inventory:</span>
                          <span>{pendingCounts.inventory} items</span>
                        </div>
                      )}
                      {pendingCounts.calendar > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Calendar:</span>
                          <span>{pendingCounts.calendar} items</span>
                        </div>
                      )}
                      {pendingCounts.credit > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Credit:</span>
                          <span>{pendingCounts.credit} items</span>
                        </div>
                      )}
                      {pendingCounts.beehive > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Beehive:</span>
                          <span>{pendingCounts.beehive} items</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Banner */}
      <AnimatePresence>
        {showBackOnline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-green-500 text-white shadow-lg"
            style={{ zIndex: 60 }}
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <Wifi size={16} />
                <span>Back online - Syncing data</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineIndicator;
