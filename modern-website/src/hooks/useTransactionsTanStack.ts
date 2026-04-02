import { useIndustryDataNew } from './useIndustryDataNew'
import { getNetworkStatus } from '@/lib/network-status'
import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  business_id: string;
  industry: string;
  amount: number;
  category?: string;
  description?: string;
  customer_name?: string;
  payment_method?: string;
  transaction_date: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'cancelled';
}

export interface UseTransactionsOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  category?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useTransactionsTanStack(options: UseTransactionsOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Network status detection
  const [isOffline, setIsOffline] = useState(() => !getNetworkStatus());
  
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Transactions] Network status: ONLINE');
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      console.log('[Transactions] Network status: OFFLINE');
      setIsOffline(true);
    };
    
    // Set initial state
    setIsOffline(!getNetworkStatus());
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Use the new TanStack Query hook with updated API
  const { data, isLoading, create, createAsync, delete: deleteItem, isCreating, isDeleting, error, refetch } = 
    useIndustryDataNew({
      industry,
      country,
      table: 'transactions',
      select: options.select,
      businessId: options.businessId,
    })

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.category) {
    filteredData = filteredData.filter((t: any) => t.category === options.category)
  }
  
  if (options.paymentMethod) {
    filteredData = filteredData.filter((t: any) => t.payment_method === options.paymentMethod)
  }
  
  if (options.startDate) {
    filteredData = filteredData.filter((t: any) => 
      new Date(t.transaction_date) >= new Date(options.startDate!)
    )
  }
  
  if (options.endDate) {
    filteredData = filteredData.filter((t: any) => 
      new Date(t.transaction_date) <= new Date(options.endDate!)
    )
  }

  return {
    data: filteredData as Transaction[],
    isLoading,
    isOffline,
    addTransaction: create,
    addTransactionAsync: createAsync,
    deleteTransaction: deleteItem,
    isAdding: isCreating || isDeleting, // Combined pending state
    error,
    refetch,
  }
}
