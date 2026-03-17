import React from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface RefreshButtonProps {
  onRefresh: () => void;
  loading?: boolean;
  lastUpdated?: Date | null;
}

export function RefreshButton({ onRefresh, loading = false, lastUpdated }: RefreshButtonProps) {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex items-center gap-3">
      {lastUpdated && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Updated {formatLastUpdated(lastUpdated)}
        </span>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw
          size={16}
          className={loading ? 'animate-spin' : ''}
        />
        Refresh
      </motion.button>
    </div>
  );
}
