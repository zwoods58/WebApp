import { useState, useCallback } from 'react';
import { ToastType } from '@/components/universal/Toast';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface UseToastReturn {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (message: string, title?: string, duration?: number) => void;
  showError: (message: string, title?: string, duration?: number) => void;
  showWarning: (message: string, title?: string, duration?: number) => void;
  showInfo: (message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = () => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
    };

    setToasts(prev => {
      // Keep only the last 3 toasts to prevent overflow
      const filtered = prev.slice(-2);
      return [...filtered, newToast];
    });
  }, []);

  const showSuccess = useCallback((message: string, title?: string, duration?: number) => {
    showToast({ type: 'success', message, title, duration });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string, duration?: number) => {
    showToast({ type: 'error', message, title, duration });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string, duration?: number) => {
    showToast({ type: 'warning', message, title, duration });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string, duration?: number) => {
    showToast({ type: 'info', message, title, duration });
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll,
  };
}
