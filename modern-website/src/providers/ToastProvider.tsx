"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { ToastContainer, ToastProps } from '@/components/universal/Toast';
import { useToast, UseToastReturn } from '@/hooks/useToast';

interface ToastContextType extends UseToastReturn {}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toastHook = useToast();

  // Convert toasts to the format expected by ToastContainer
  const toastContainerProps: (ToastProps & { id: string })[] = toastHook.toasts.map(toast => ({
    ...toast,
    onClose: toastHook.removeToast
  }));

  return (
    <ToastContext.Provider value={toastHook}>
      {children}
      <ToastContainer toasts={toastContainerProps} onClose={toastHook.removeToast} />
    </ToastContext.Provider>
  );
}
