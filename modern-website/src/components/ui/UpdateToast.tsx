"use client";

import React, { useEffect, useState } from 'react';
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
    <div className="fixed bottom-20 right-4 z-[9999] animate-in slide-in-from-bottom-2">
      <div className="bg-green-100 border border-green-400 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[280px] max-w-[340px]">
        <div className="flex-shrink-0 text-green-600">
          <CheckCircle size={24} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-green-800">
            App Updated!
          </p>
          <p className="text-sm text-green-700">
            {version ? `Version ${version} is now live` : 'Latest version loaded'}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-green-200 transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} className="text-green-600" />
        </button>
      </div>
    </div>
  );
}
