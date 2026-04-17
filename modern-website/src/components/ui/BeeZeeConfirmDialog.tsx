"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface BeeZeeConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const beezeeColors = {
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    button: 'bg-red-600 hover:bg-red-700',
    buttonDisabled: 'bg-red-300'
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    title: 'text-orange-900',
    button: 'bg-orange-600 hover:bg-orange-700',
    buttonDisabled: 'bg-orange-300'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    button: 'bg-blue-600 hover:bg-blue-700',
    buttonDisabled: 'bg-blue-300'
  }
};

export function BeeZeeConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  onConfirm,
  onCancel,
  isLoading = false
}: BeeZeeConfirmDialogProps) {
  if (!isOpen) return null;

  const colors = beezeeColors[type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200">
        {/* Header */}
        <div className={`${colors.bg} ${colors.border} border-b px-5 py-4`}>
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 ${colors.icon}`}>
              <AlertTriangle size={20} />
            </div>
            <h3 className={`font-semibold text-base ${colors.title}`}>
              {title}
            </h3>
          </div>
        </div>
        
        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        
        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoading ? colors.buttonDisabled : colors.button
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple hook for showing confirmations
export function useBeeZeeConfirm() {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const confirm = React.useCallback((
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      cancelText?: string;
      type?: 'danger' | 'warning' | 'info';
    }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
        type: options?.type || 'danger',
        onConfirm: () => {
          setDialog(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setDialog(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const DialogComponent = React.useCallback(() => {
    return (
      <BeeZeeConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        type={dialog.type}
        onConfirm={dialog.onConfirm!}
        onCancel={dialog.onCancel!}
        isLoading={dialog.isLoading}
      />
    );
  }, [dialog]);

  return { confirm, DialogComponent };
}

// Export a simple function for quick confirmations
export async function beezeeConfirm(
  title: string,
  message: string,
  options?: {
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }
): Promise<boolean> {
  return new Promise((resolve) => {
    // Create a temporary container for the dialog
    const container = document.createElement('div');
    document.body.appendChild(container);

    const cleanup = () => {
      document.body.removeChild(container);
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    // This would need to be rendered properly in a React app
    // For now, fallback to browser confirm as a quick implementation
    const result = window.confirm(`${title}\n\n${message}`);
    cleanup();
    resolve(result);
  });
}

