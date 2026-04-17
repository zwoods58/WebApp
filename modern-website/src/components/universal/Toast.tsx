"use client";

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    messageColor: 'text-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700'
  }
};

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;
  const [isVisible, setIsVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    // Trigger enter animation
    setIsVisible(true);
    
    if (duration > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgressWidth(prev => {
          const decrement = (100 / (duration / 50)); // Update every 50ms
          return Math.max(0, prev - decrement);
        });
      }, 50);

      // Auto-dismiss timer
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 200); // Allow exit animation to complete
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl shadow-lg p-4 min-w-[320px] max-w-[400px] relative overflow-hidden ${
        isVisible ? 'toast-enter' : 'toast-exit'
      }`}
    >
      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className={`absolute top-2 right-2 p-1 rounded-lg hover:bg-black/5 transition-colors ${config.iconColor}`}
      >
        <X size={16} />
      </button>

      {/* Content */}
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <Icon size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold text-sm ${config.titleColor} mb-1`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${config.messageColor} break-words`}>
            {message}
          </p>
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-1 ${config.iconColor} opacity-30 progress-bar`}
          style={{ width: `${progressWidth}%` }}
        />
      )}
    </div>
  );
}

// Toast container component
export interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

