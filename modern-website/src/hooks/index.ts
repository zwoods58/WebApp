// Export all hooks from a central location
export { useToast } from './useToast';
export { useLanguage } from './useLanguage';
export { useServiceWorkerVersion } from './useServiceWorkerVersion';
export { usePersistentStorage } from './usePersistentStorage';
export { useGlobalRefresh } from './useGlobalRefresh';
export { useServices } from './useServices';

// TanStack hooks
export { 
  useTransactionsTanStack, 
  type Transaction, 
  type UseTransactionsTanStackProps, 
  type UseTransactionsTanStackReturn 
} from './useTransactionsTanStack';

export { 
  useExpensesTanStack, 
  type Expense, 
  type UseExpensesTanStackProps, 
  type UseExpensesTanStackReturn 
} from './useExpensesTanStack';

export { 
  useCreditTanStack, 
  type Credit, 
  type UseCreditTanStackProps, 
  type UseCreditTanStackReturn 
} from './useCreditTanStack';

export { 
  useCreditItems, 
  calculateTotalOwed,
  applyPaymentFIFO,
  type CreditItem, 
  type UseCreditItemsProps, 
  type UseCreditItemsReturn 
} from './useCreditItems';

export { 
  useTargetsTanStack, 
  type Target, 
  type UseTargetsTanStackProps, 
  type UseTargetsTanStackReturn 
} from './useTargetsTanStack';

export { 
  useServicesTanStack, 
  type Service, 
  type UseServicesTanStackProps, 
  type UseServicesTanStackReturn 
} from './useServicesTanStack';

export { 
  useAppointmentsTanStack, 
  type Appointment, 
  type UseAppointmentsTanStackProps, 
  type UseAppointmentsTanStackReturn 
} from './useAppointmentsTanStack';

export { 
  useInventoryTanStack, 
  type Inventory, 
  type UseInventoryTanStackProps, 
  type UseInventoryTanStackReturn 
} from './useInventoryTanStack';

// Notification types and hook
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  business_id: string;
}

export type NotificationType = 
  | 'money_in' 
  | 'money_out' 
  | 'low_inventory' 
  | 'credit_due' 
  | 'target_achieved' 
  | 'business_setup';

export interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  unreadCount?: number;
}

// Mock notification hook - replace with actual implementation
export function useNotifications(): UseNotificationsReturn {
  return {
    notifications: [],
    loading: false,
    markAsRead: async (id: string) => {},
    markAllAsRead: async () => {},
    deleteNotification: async (id: string) => {},
    refreshNotifications: async () => {},
    unreadCount: 0
  };
}

