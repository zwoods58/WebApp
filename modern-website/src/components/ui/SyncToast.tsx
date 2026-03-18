/**
 * Sync Toast Component
 * Shows notifications for sync completion and errors
 */

"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface SyncToastProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
  duration?: number;
  onClose?: () => void;
  onClick?: () => void;
}

const SyncToast: React.FC<SyncToastProps> = ({ 
  type,
  message,
  details,
  duration = 3000,
  onClose,
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-600'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      borderColor: 'border-red-600'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-500',
      textColor: 'text-white',
      borderColor: 'border-amber-600'
    }
  };

  const { icon: Icon, bgColor, textColor, borderColor } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[70] ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          <div className={`${bgColor} ${textColor} ${borderColor} border-2 rounded-lg shadow-2xl px-4 py-3 min-w-[280px] max-w-md`}>
            <div className="flex items-start gap-3">
              <Icon size={20} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{message}</p>
                {details && (
                  <p className="text-xs mt-1 opacity-90">{details}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SyncToast;
