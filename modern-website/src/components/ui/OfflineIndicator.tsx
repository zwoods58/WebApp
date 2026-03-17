/**
 * Offline Indicator Component
 * Shows sync status and pending items across all app features
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { useOfflineData } from '@/hooks/useOfflineData';
import { SyncStatus } from '@/types/offlineTypes';

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
  const { isOnline, syncStatus, pendingCount, forceSync, getPendingByFeature } = useOfflineData();
  const [expanded, setExpanded] = useState(false);
  const [showError, setShowError] = useState(false);

  // Auto-expand when going offline
  useEffect(() => {
    if (!isOnline) {
      setExpanded(true);
      setTimeout(() => setExpanded(false), 5000);
    }
  }, [isOnline]);

  // Show error notification
  useEffect(() => {
    if (syncStatus.errors.length > 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  }, [syncStatus.errors]);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (syncStatus.isSyncing) return 'text-yellow-500';
    if (pendingCount > 0) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} />;
    if (syncStatus.isSyncing) return <RefreshCw size={16} className="animate-spin" />;
    if (pendingCount > 0) return <Clock size={16} />;
    return <CheckCircle size={16} />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline Mode';
    if (syncStatus.isSyncing) return 'Syncing...';
    if (pendingCount > 0) return `${pendingCount} Pending`;
    return 'Synced';
  };

  const getFeatureStatus = (feature: keyof typeof syncStatus.featureStatus) => {
    const status = syncStatus.featureStatus[feature];
    const count = getPendingByFeature(feature);
    
    return {
      status,
      count,
      color: status === 'online' ? 'text-green-500' : 
             status === 'syncing' ? 'text-yellow-500' : 
             status === 'error' ? 'text-red-500' : 'text-orange-500',
      icon: status === 'online' ? CheckCircle : 
            status === 'syncing' ? RefreshCw : 
            status === 'error' ? AlertCircle : Clock
    };
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${getStatusColor()} ${className}`}>
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Status Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
        <div className={`bg-white border-b ${!isOnline ? 'border-red-200 bg-red-50' : pendingCount > 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>
                {pendingCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {pendingCount > 0 && isOnline && (
                  <button
                    onClick={forceSync}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Sync Now
                  </button>
                )}
                
                {(pendingCount > 0 || !isOnline) && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {expanded ? 'Hide' : 'Details'}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expanded && (pendingCount > 0 || !isOnline) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-gray-200"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                    {Object.entries(syncStatus.featureStatus).map(([feature, status]) => {
                      const featureData = getFeatureStatus(feature as keyof typeof syncStatus.featureStatus);
                      const Icon = featureData.icon;
                      
                      return (
                        <div key={feature} className="flex items-center gap-2">
                          <Icon size={12} className={featureData.color} />
                          <div>
                            <div className="font-medium capitalize">{feature}</div>
                            <div className={`${featureData.color}`}>
                              {featureData.count > 0 && `${featureData.count} pending`}
                              {featureData.count === 0 && status}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {syncStatus.errors.length > 0 && (
                    <div className="mt-3 p-2 bg-red-100 rounded text-red-700 text-xs">
                      <div className="font-medium mb-1">Sync Errors:</div>
                      {syncStatus.errors.slice(0, 3).map((error, index) => (
                        <div key={index} className="truncate">• {error}</div>
                      ))}
                      {syncStatus.errors.length > 3 && (
                        <div>...and {syncStatus.errors.length - 3} more</div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      <AnimatePresence>
        {showError && syncStatus.errors.length > 0 && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">Sync Error</div>
                <div className="text-sm opacity-90 mt-1">
                  Some items failed to sync. Please check your connection and try again.
                </div>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Mode Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-red-500 text-white"
          >
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <WifiOff size={16} />
                <span>You're offline. All changes will be saved and synced when you're back online.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineIndicator;
