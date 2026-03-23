import { useIndustryDataNew } from './useIndustryDataNew'

export interface Target {
  id: string;
  business_id: string;
  industry: string;
  target_type: 'sales' | 'revenue' | 'customers' | 'profit' | 'custom';
  target_name: string;
  target_value: number;
  current_value: number;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  description?: string;
  metric_unit?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseTargetsOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  targetType?: 'sales' | 'revenue' | 'customers' | 'profit' | 'custom';
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useTargetsTanStack(options: UseTargetsOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Use the new TanStack Query hook with updated API
  const { data, isLoading, create, delete: deleteItem, isCreating, error, refetch } = 
    useIndustryDataNew({
      industry,
      country,
      table: 'targets',
      select: options.select,
    })

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.targetType) {
    filteredData = filteredData.filter((t: any) => t.target_type === options.targetType)
  }
  
  if (options.status) {
    filteredData = filteredData.filter((t: any) => t.status === options.status)
  }
  
  if (options.period) {
    filteredData = filteredData.filter((t: any) => t.period === options.period)
  }
  
  if (options.startDate) {
    filteredData = filteredData.filter((t: any) => 
      new Date(t.start_date) >= new Date(options.startDate!)
    )
  }
  
  if (options.endDate) {
    filteredData = filteredData.filter((t: any) => 
      new Date(t.end_date) <= new Date(options.endDate!)
    )
  }

  return {
    data: filteredData as Target[],
    isLoading,
    isOffline: !isLoading && data.length === 0,
    addTarget: create,
    deleteTarget: deleteItem,
    isPending: isCreating,
    error,
    refetch,
  }
}
