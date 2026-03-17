"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  disabled?: boolean;
  pullIndicatorHeight?: number;
}

export default function PullToRefresh({
  onRefresh,
  children,
  className = "",
  threshold = 80,
  disabled = false,
  pullIndicatorHeight = 60
}: PullToRefreshProps) {
  const {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    shouldRefresh,
    resetState
  } = usePullToRefresh({
    onRefresh,
    threshold,
    disabled
  });

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pointer-events-none"
        style={{
          height: `${pullIndicatorHeight}px`,
          transform: `translateY(${Math.max(0, pullDistance - pullIndicatorHeight)}px)`,
        }}
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200"
          animate={{
            scale: isPulling ? (shouldRefresh ? 1.1 : 1) : 0,
            opacity: isPulling ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <motion.div
            animate={{
              rotate: isRefreshing ? 360 : (shouldRefresh ? 180 : 0),
            }}
            transition={{
              duration: isRefreshing ? 1 : 0.3,
              ease: "linear",
              repeat: isRefreshing ? Infinity : 0
            }}
          >
            <RefreshCw 
              size={20} 
              className={`${shouldRefresh ? 'text-blue-600' : 'text-gray-400'}`}
            />
          </motion.div>
          <span className={`text-sm font-medium ${
            shouldRefresh ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {isRefreshing ? 'Refreshing...' : shouldRefresh ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        animate={{
          transform: isPulling 
            ? `translateY(${Math.min(pullDistance, threshold * 1.5)}px)` 
            : 'translateY(0)',
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      {isRefreshing && (
        <motion.div
          className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={24} className="text-blue-600" />
            </motion.div>
            <span className="text-sm font-medium text-gray-600">Refreshing...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
