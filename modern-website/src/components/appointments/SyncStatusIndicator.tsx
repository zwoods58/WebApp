'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { db } from '@/lib/database';
import { syncManager } from '@/lib/sync-manager';
import { getNetworkStatus } from '@/lib/network-status';
import { useLanguage } from '@/hooks/useLanguage';

interface SyncStatusIndicatorProps {
  businessId?: string;
}

export default function SyncStatusIndicator({ businessId }: { businessId?: string }) {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkStatus();
    
    const interval = setInterval(checkStatus, 3000);
    
    return () => clearInterval(interval);
  }, [businessId]);

  const checkStatus = async () => {
    const online = getNetworkStatus();
    setIsOnline(online);
    
    try {
      const count = businessId 
        ? await db.operations_queue.where('businessId').equals(businessId).and(op => op.status === 'pending').count()
        : await db.operations_queue.where('status').equals('pending').count();
      setPendingCount(count);
    } catch (error) {
      console.warn('Failed to get pending count:', error);
    }
    
    const syncStatus = syncManager.getStatus();
    setIsSyncing(syncStatus.isActive);
  };

  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    try {
      await syncManager.forceSyncNow('manual-trigger');
      await checkStatus();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!mounted) return null;

  if (!isOnline) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4">
        <div className="flex items-center gap-2">
          <WifiOff size={18} className="text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">{t('appointments.offline_mode', 'Offline Mode')}</p>
            <p className="text-xs text-amber-700">{t('appointments.offline_message', 'Changes will sync when you\'re back online')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
        <div className="flex items-center gap-2">
          <RefreshCw size={18} className="text-blue-600 animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">{t('appointments.syncing', 'Syncing...')}</p>
            <p className="text-xs text-blue-700">
              {pendingCount > 0 ? `${pendingCount} ${t('appointments.changes_remaining', 'changes remaining')}` : t('appointments.updating_data', 'Updating data')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">{t('appointments.pending_changes', 'Pending Changes')}</p>
            <p className="text-xs text-yellow-700">{pendingCount} {t('appointments.waiting_to_sync', 'changes waiting to sync')}</p>
          </div>
          <button
            onClick={handleManualSync}
            className="px-3 py-1 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            {t('appointments.sync_now', 'Sync Now')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
      <div className="flex items-center gap-2">
        <CheckCircle size={18} className="text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">{t('appointments.all_changes_saved', 'All Changes Saved')}</p>
          <p className="text-xs text-green-700">{t('appointments.data_up_to_date', 'Your data is up to date')}</p>
        </div>
        <Wifi size={18} className="text-green-600" />
      </div>
    </div>
  );
}

