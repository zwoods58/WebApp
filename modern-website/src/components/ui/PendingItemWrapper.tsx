/**
 * Pending Item Wrapper Component
 * Applies pending styling to wrapped content
 */

"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PendingItemWrapperProps {
  children: React.ReactNode;
  isPending: boolean;
  className?: string;
  showBorder?: boolean;
  reducedOpacity?: boolean;
}

const PendingItemWrapper: React.FC<PendingItemWrapperProps> = ({ 
  children,
  isPending,
  className = '',
  showBorder = true,
  reducedOpacity = true
}) => {
  if (!isPending) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative ${className}`}
    >
      <div 
        className={`
          ${reducedOpacity ? 'opacity-70' : ''}
          ${showBorder ? 'border-2 border-amber-300 rounded-lg' : ''}
          bg-amber-50/30
          transition-all duration-200
        `}
      >
        {children}
      </div>
      
      {/* Subtle pulsing overlay indicator */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-amber-400 rounded-lg pointer-events-none"
          style={{ zIndex: -1 }}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default PendingItemWrapper;
