import { useIndustryDataNew } from './useIndustryDataNew'
import { getNetworkStatus } from '@/lib/network-status'
import { useState, useEffect } from 'react';

export interface Expense {
  id: string;
  business_id: string;
  industry: string;
  amount: number;
  currency: string;
  amount_home?: number;
  exchange_rate?: number;
  category: string;
  description?: string;
  supplier?: string; // Changed from vendor_name to match database
  payment_method?: string; // Note: does not exist in database
  expense_date: string;
  receipt_url?: string; // Note: does not exist in database
  is_recurring?: boolean; // Note: does not exist in database
  recurring_period?: 'daily' | 'weekly' | 'monthly' | 'yearly'; // Note: does not exist in database
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseExpensesOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  category?: string;
  vendorName?: string; // Note: field is supplier in database
  paymentMethod?: string; // Note: does not exist in database
  isRecurring?: boolean; // Note: does not exist in database
  startDate?: string;
  endDate?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useExpensesTanStack(options: UseExpensesOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Network status detection
  const [isOffline, setIsOffline] = useState(() => !getNetworkStatus());
  
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Expenses] Network status: ONLINE');
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      console.log('[Expenses] Network status: OFFLINE');
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
  const { data, isLoading, create, createAsync, delete: deleteItem, isCreating, error, refetch } = 
    useIndustryDataNew({
      industry,
      country,
      table: 'expenses',
      select: options.select,
      businessId: options.businessId,
    })

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.category) {
    filteredData = filteredData.filter((e: any) => e.category === options.category)
  }
  
  if (options.vendorName) {
    filteredData = filteredData.filter((e: any) => 
      e.supplier?.toLowerCase().includes(options.vendorName!.toLowerCase())
    )
  }
  
  if (options.paymentMethod) {
    filteredData = filteredData.filter((e: any) => e.payment_method === options.paymentMethod)
  }
  
  if (options.isRecurring !== undefined) {
    filteredData = filteredData.filter((e: any) => e.is_recurring === options.isRecurring)
  }
  
  if (options.startDate) {
    filteredData = filteredData.filter((e: any) => 
      new Date(e.expense_date) >= new Date(options.startDate!)
    )
  }
  
  if (options.endDate) {
    filteredData = filteredData.filter((e: any) => 
      new Date(e.expense_date) <= new Date(options.endDate!)
    )
  }

  return {
    data: filteredData as Expense[],
    isLoading,
    isOffline,
    addExpense: create,
    addExpenseAsync: createAsync,
    deleteExpense: deleteItem,
    isPending: isCreating,
    error,
    refetch,
  }
}
