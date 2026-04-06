"use client";

import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface UpdateToastProps {
  isVisible: boolean;
  version: string;
  onDismiss: () => void;
}

export default function UpdateToast({ isVisible, version, onDismiss }: UpdateToastProps) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[9999] animate-slide-in-right">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-[280px] max-w-[340px]">
        <div className="flex-shrink-0 text-green-600">
          <CheckCircle size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            App updated to {version}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
