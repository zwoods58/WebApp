/**
 * Pending Status Badge Component
 * Shows sync status for items that are pending synchronization
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';

export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

interface PendingStatusBadgeProps {
  status?: SyncStatus;
  className?: string;
  compact?: boolean;
  showText?: boolean;
}

const PendingStatusBadge: React.FC<PendingStatusBadgeProps> = ({ 
  status = 'synced',
  className = '',
  compact = false,
  showText = true
}) => {
  if (status === 'synced' || !status) {
    return null; // Don't show anything for synced items
  }

  const getStatusConfig = (status: SyncStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-400',
          text: 'Pending'
        };
      case 'syncing':
        return {
          icon: Wifi,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          dotColor: 'bg-blue-400',
          text: 'Syncing'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-400',
          text: 'Error'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-400',
          text: 'Synced'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
        {showText && <span>{config.text}</span>}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color} ${className}`}
    >
      <Icon size={14} />
      {showText && <span>{config.text}</span>}
      
      {/* Animated dots for syncing status */}
      {status === 'syncing' && (
        <div className="flex gap-1">
          <motion.div
            className="w-1 h-1 rounded-full bg-current"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="w-1 h-1 rounded-full bg-current"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-1 h-1 rounded-full bg-current"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default PendingStatusBadge;
