// Export all hooks from a single index file
export { useTransactions } from './useTransactions';
export { useExpenses } from './useExpenses';
export { useCredit } from './useCredit';
export { useInventory } from './useInventory';
export { useServices } from './useServices';
export { useAppointments } from './useAppointments';
export { useTargets } from './useTargets';
export { useLanguageSafe } from './useLanguageSafe';
export { useAuth } from './useAuth';

// Real-time hooks
export { 
  useRealtime, 
  useTransactionsRealtime, 
  useInventoryRealtime, 
  useCreditRealtime, 
  useTargetsRealtime, 
  useBusinessRealtime 
} from './useRealtime';

// Utility hooks
export { useToast } from './useToast';
export { useTourTrigger } from './useTourTrigger';
export { usePullToRefresh } from './usePullToRefresh';
export { useGlobalRefresh } from './useGlobalRefresh';
export { useIndustryData } from './useIndustryData';
export { useNotifications, type Notification, type NotificationType } from './useNotifications';
