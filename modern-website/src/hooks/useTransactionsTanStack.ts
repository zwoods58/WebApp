import { useIndustryData } from './useIndustryDataNew'

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
  
  // Use the new TanStack Query hook
  const { data, isLoading, addItem, deleteItem, isAdding, isDeleting, isPaused, error, refetch } = 
    useIndustryData<Transaction>(industry, country, 'transactions')

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
    isPaused, // Built-in offline state detection
    addTransaction: addItem,
    deleteTransaction: deleteItem,
    isAdding: isAdding || isDeleting, // Combined pending state
    error,
    refetch,
  }
}
