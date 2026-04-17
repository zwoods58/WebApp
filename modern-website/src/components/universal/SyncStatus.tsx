/**
 * Sync Status Component
 * Shows users the current synchronization status
 */

import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { SyncStatus } from '@/lib/data-manager';

interface SyncStatusProps {
  syncStatus: SyncStatus;
  onForceSync?: () => void;
  compact?: boolean;
}

export default function SyncStatusComponent({ 
  syncStatus, 
  onForceSync, 
  compact = false 
}: SyncStatusProps) {
  const { isOnline, lastSync, pendingOperations, hasErrors } = syncStatus;

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} className="text-gray-500" />;
    if (hasErrors) return <AlertCircle size={16} className="text-red-500" />;
    if (pendingOperations > 0) return <RefreshCw size={16} className="text-yellow-500 animate-spin" />;
    return <CheckCircle size={16} className="text-green-500" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (hasErrors) return 'Sync Error';
    if (pendingOperations > 0) return `Syncing (${pendingOperations})`;
    return 'Synced';
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-gray-500';
    if (hasErrors) return 'text-red-500';
    if (pendingOperations > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - lastSync.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        {getStatusIcon()}
        <span className={getStatusColor()}>{getStatusText()}</span>
        {isOnline && onForceSync && (
          <button
            onClick={onForceSync}
            className="text-blue-500 hover:text-blue-700"
            title="Force sync"
          >
            <RefreshCw size={12} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi size={20} className="text-green-500" /> : <WifiOff size={20} className="text-gray-500" />}
          <h3 className="font-semibold text-gray-900">Sync Status</h3>
        </div>
        {isOnline && onForceSync && (
          <button
            onClick={onForceSync}
            disabled={pendingOperations === 0}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={pendingOperations > 0 ? 'animate-spin' : ''} />
            Force Sync
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? <Cloud size={16} className="text-green-500" /> : <CloudOff size={16} className="text-gray-500" />}
            <span className="text-sm text-gray-600">Connection</span>
          </div>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Sync Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm text-gray-600">Status</span>
          </div>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Pending Operations */}
        {pendingOperations > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-yellow-500 animate-spin" />
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <span className="text-sm font-medium text-yellow-600">
              {pendingOperations} items
            </span>
          </div>
        )}

        {/* Last Sync */}
        {lastSync && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm text-gray-600">Last sync</span>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {formatLastSync()}
            </span>
          </div>
        )}

        {/* Error Status */}
        {hasErrors && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm text-gray-600">Errors</span>
            </div>
            <span className="text-sm font-medium text-red-600">
              Sync failed
            </span>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {isOnline ? (
            hasErrors ? 
              "Some changes couldn't be synced. Try forcing sync or check your connection." :
              pendingOperations > 0 ?
                "Changes are being synced to the cloud. This may take a moment." :
              "All your changes are saved and synced to the cloud."
          ) : (
            "You're currently offline. Changes will be saved locally and synced when you're back online."
          )}
        </p>
      </div>
    </div>
  );
}

