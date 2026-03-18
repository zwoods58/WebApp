/**
 * Pending Item Badge Component
 * Shows a "Pending" badge for items waiting to sync
 */

"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PendingItemBadgeProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

const PendingItemBadge: React.FC<PendingItemBadgeProps> = ({ 
  className = '',
  showIcon = true,
  size = 'sm',
  tooltip = 'Waiting to sync'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-semibold ${sizeClasses[size]} ${className}`}
      title={tooltip}
    >
      {showIcon && (
        <Clock 
          size={iconSizes[size]} 
          className="animate-pulse" 
        />
      )}
      <span>Pending</span>
    </motion.div>
  );
};

export default PendingItemBadge;
