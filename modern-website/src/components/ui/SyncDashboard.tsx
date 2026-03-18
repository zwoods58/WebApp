"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Settings,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Database,
  Activity
} from 'lucide-react';

import { useOfflineData } from '@/hooks/useOfflineData';
import { conflictResolver } from '@/utils/conflictResolver';
import { getQueueStats, clearFailedActions, getPendingCountByType } from '@/utils/offlineQueue';

interface SyncDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SyncDashboard({ isOpen, onClose }: SyncDashboardProps) {
  const { isOnline, isOfflineMode, pendingCount } = useOfflineData();
  const [syncMetrics, setSyncMetrics] = useState<any>(null);
  const [networkQuality, setNetworkQuality] = useState<any>(null);
  const [conflictStats, setConflictStats] = useState<any>(null);
  const [queueStats, setQueueStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'conflicts' | 'settings'>('overview');

  useEffect(() => {
    if (isOpen) {
      refreshData();
      
      // Set up listener for sync status changes
      const handleSyncStatus = (status: string) => {
        console.log(`Sync status: ${status}`);
        refreshData();
      };
      
      // backgroundSyncService.addListener(handleSyncStatus);
      
      return () => {
        // backgroundSyncService.removeListener(handleSyncStatus);
      };
    }
  }, [isOpen]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // const metrics = backgroundSyncService.getMetrics();
      // const network = backgroundSyncService.getNetworkQuality();
      const conflicts = conflictResolver.getConflictStats();
      const queue = await getQueueStats();

      // setSyncMetrics(metrics);
      // setNetworkQuality(network);
      setConflictStats(conflicts);
      setQueueStats(queue);
    } catch (error) {
      console.error('Failed to refresh sync data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleForceSync = async () => {
    setIsRefreshing(true);
    try {
      // await backgroundSyncService.forceSync();
      await refreshData();
    } catch (error) {
      console.error('Force sync failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearFailedOperations = async () => {
    if (confirm('Are you sure you want to clear all failed operations?')) {
      await clearFailedActions();
      conflictResolver.clearConflictHistory();
      refreshData();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getConnectionStatusColor = () => {
    if (isOnline) {
      switch (networkQuality?.type) {
        case 'excellent': return 'text-green-600';
        case 'good': return 'text-blue-600';
        case 'poor': return 'text-yellow-600';
        default: return 'text-gray-600';
      }
    }
    return 'text-red-600';
  };

  const getConnectionStatusText = () => {
    if (isOnline) {
      return networkQuality?.type ? networkQuality.type.charAt(0).toUpperCase() + networkQuality.type.slice(1) : 'Good';
    }
    return 'Offline';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
                {isOnline ? <Wifi className={`w-5 h-5 ${getConnectionStatusColor()}`} /> : <WifiOff className="w-5 h-5 text-red-600" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sync Dashboard</h2>
                <p className="text-sm text-gray-500">
                  Status: <span className={`font-medium ${getConnectionStatusColor()}`}>
                    {getConnectionStatusText()}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'queue', label: 'Queue', icon: Database },
              { id: 'conflicts', label: 'Conflicts', icon: AlertCircle },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="overflow-y-auto max-h-[50vh]">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Pending Operations</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{queueStats?.pending || 0}</div>
                    <div className="text-xs text-blue-700">Waiting to sync</div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Successful Syncs</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{syncMetrics?.successfulOperations || 0}</div>
                    <div className="text-xs text-green-700">Total completed</div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">Failed Operations</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{queueStats?.failed || 0}</div>
                    <div className="text-xs text-red-700">Need attention</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Last Sync</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      {syncMetrics?.lastSyncTime 
                        ? new Date(syncMetrics.lastSyncTime).toLocaleTimeString()
                        : 'Never'
                      }
                    </div>
                    <div className="text-xs text-purple-700">
                      {syncMetrics?.lastSyncTime 
                        ? new Date(syncMetrics.lastSyncTime).toLocaleDateString()
                        : 'No sync yet'
                      }
                    </div>
                  </div>
                </div>

                {/* Network Quality */}
                {networkQuality && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Network Quality</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Type</div>
                        <div className="font-medium capitalize">{networkQuality.type}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Speed</div>
                        <div className="font-medium">{networkQuality.speed.toFixed(1)} Mbps</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Batch Size</div>
                        <div className="font-medium">{networkQuality.recommendedBatchSize}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleForceSync}
                    disabled={isRefreshing || !isOnline}
                    className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Force Sync
                  </button>
                  <button
                    onClick={handleClearFailedOperations}
                    className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Failed
                  </button>
                </div>
              </div>
            )}

            {/* Queue Tab */}
            {activeTab === 'queue' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Operation Queue</h3>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-2">
                    {['cash', 'inventory', 'calendar', 'credit', 'beehive'].map(feature => {
                      const pendingCount = queueStats?.byType?.[feature] || 0;
                      
                      return (
                        <div key={feature} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{feature}</span>
                            <span className="text-sm text-gray-600">{pendingCount} pending</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Conflicts Tab */}
            {activeTab === 'conflicts' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Conflict History</h3>
                
                {conflictStats && conflictStats.totalConflicts > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">Total Conflicts</div>
                        <div className="font-medium">{conflictStats.totalConflicts}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">Recent Conflicts</div>
                        <div className="font-medium">{conflictStats.recentConflicts.length}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {conflictStats.recentConflicts.slice(0, 5).map((conflict: any, index: number) => (
                        <div key={index} className="bg-yellow-50 p-3 rounded-lg text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{conflict.localOperation.feature}</span>
                            <span className="text-xs text-gray-500">
                              {formatTime(conflict.timestamp)}
                            </span>
                          </div>
                          <div className="text-gray-600">{conflict.conflictType}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No conflicts detected</p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Sync Settings</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Background Sync</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Background sync is automatically enabled when you're online.
                    </p>
                    <div className="text-sm text-gray-500">
                      Sync interval: 30 seconds
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Conflict Resolution</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Automatic conflict resolution is enabled with feature-specific strategies.
                    </p>
                    <div className="text-sm text-gray-500">
                      Financial data: Server wins
                      Inventory: Merge quantities
                      Calendar: Latest update wins
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Network Adaptation</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Sync automatically adapts to your network quality.
                    </p>
                    <div className="text-sm text-gray-500">
                      Current batch size: {networkQuality?.recommendedBatchSize || 20}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
