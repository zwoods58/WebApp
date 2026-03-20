// Export all hooks from a single index file
// Old hooks removed - replaced with TanStack Query versions

// Core hooks
export { useLanguageSafe } from './useLanguageSafe';
export { useUnifiedAuth } from '../contexts/UnifiedAuthContext';

// New TanStack Query hooks
export { useTransactionsTanStack } from './useTransactionsTanStack';
export { useExpensesTanStack } from './useExpensesTanStack';
export { useCreditTanStack } from './useCreditTanStack';
export { useInventoryTanStack } from './useInventoryTanStack';
export { useServicesTanStack } from './useServicesTanStack';
export { useAppointmentsTanStack } from './useAppointmentsTanStack';
export { useTargetsTanStack } from './useTargetsTanStack';
export { useBeehiveTanStack } from './useBeehiveTanStack';

// Backward compatibility aliases - redirect old hook names to new TanStack versions
export { useServicesTanStack as useServices } from './useServicesTanStack';
export { useCreditTanStack as useCredit } from './useCreditTanStack';
export { useInventoryTanStack as useInventory } from './useInventoryTanStack';
export { useTransactionsTanStack as useTransactions } from './useTransactionsTanStack';
export { useExpensesTanStack as useExpenses } from './useExpensesTanStack';
export { useAppointmentsTanStack as useAppointments } from './useAppointmentsTanStack';

// Missing hooks - create stub exports to prevent build errors
// These hooks don't exist anymore but components are still importing them
export const useOffline = () => ({ isOnline: true, isOffline: false });
export const useTransactionsOld = () => ({ data: [], isLoading: false, error: null });

// Signup hooks
export { useSignup } from './useSignup';
export { useSignupValidation } from './useSignupValidation';
export { useBusinessCreation } from './useBusinessCreation';

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
export { useIndustryData as useIndustryDataNew } from './useIndustryDataNew'; // Alias for compatibility
export { useNotifications, type Notification, type NotificationType } from './useNotifications';
