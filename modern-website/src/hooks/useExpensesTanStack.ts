import { useIndustryData } from './useIndustryDataNew'

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
  
  // Use the new TanStack Query hook
  const { data, isLoading, addItem, deleteItem, isAdding, isPaused } = 
    useIndustryData(industry, country, 'expenses')

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
    isOffline: isPaused,
    addExpense: addItem,
    deleteExpense: deleteItem,
    isPending: isAdding,
    // Keep the same interface as the original hook
    error: null,
    refetch: () => {}, // TanStack Query handles this automatically
  }
}
