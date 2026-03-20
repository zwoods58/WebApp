import { useIndustryData } from './useIndustryDataNew'

export interface Credit {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  amount_home?: number;
  exchange_rate?: number;
  due_date: string;
  date_given: string; // Required field from database
  status: 'outstanding' | 'partial' | 'paid' | 'overdue'; // Changed from 'pending' to 'outstanding'
  paid_amount?: number; // Amount paid so far for partial payments (defaults to 0)
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseCreditOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  status?: 'outstanding' | 'partial' | 'paid' | 'overdue'; // Changed from 'pending' to 'outstanding'
  customerName?: string;
  customerPhone?: string;
  startDate?: string;
  endDate?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useCreditTanStack(options: UseCreditOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Use the new TanStack Query hook
  const { 
    data, 
    isLoading, 
    addItem, 
    deleteItem, 
    updateItem,
    isAdding,
    isPaused,
    refetch
  } = useIndustryData(industry, country, 'credit')

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.status) {
    filteredData = filteredData.filter((c: any) => c.status === options.status)
  }
  
  if (options.customerName) {
    filteredData = filteredData.filter((c: any) => 
      c.customer_name?.toLowerCase().includes(options.customerName!.toLowerCase())
    )
  }
  
  if (options.customerPhone) {
    filteredData = filteredData.filter((c: any) => c.customer_phone === options.customerPhone)
  }
  
  if (options.startDate) {
    filteredData = filteredData.filter((c: any) => 
      new Date(c.due_date) >= new Date(options.startDate!)
    )
  }
  
  if (options.endDate) {
    filteredData = filteredData.filter((c: any) => 
      new Date(c.due_date) <= new Date(options.endDate!)
    )
  }

  return {
    data: filteredData as Credit[],
    isLoading,
    isOffline: isPaused,
    addCredit: addItem,
    deleteCredit: deleteItem,
    updateCredit: updateItem,
    isPending: isAdding,
    // Keep the same interface as the original hook
    error: null,
    refetch // Return the actual refetch function from useIndustryData
  }
}
