"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const PULL_THRESHOLD = 80;

  const handleDragEnd = async (event: any, info: any) => {
    if (info.offset.y > PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Haptic feedback
      }
      controls.start({ y: 50, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      }
    } else {
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden touch-pan-y">
      {/* Refresh Indicator */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none z-10" style={{ height: '50px' }}>
        <motion.div
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
          className="w-8 h-8 rounded-full border-2 border-[var(--powder-dark)] border-t-transparent flex items-center justify-center bg-white shadow-md"
          style={{ opacity: useMotionValue(0) }} // Could tie opacity to drag distance
        />
      </div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="w-full h-full z-20 relative bg-[var(--bg)]"
      >
        {children}
      </motion.div>
    </div>
  );
};
