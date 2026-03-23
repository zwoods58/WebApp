import { useIndustryDataNew } from './useIndustryDataNew'

export interface Service {
  id: string;
  business_id: string;
  industry: string;
  service_name: string;
  description?: string; // Note: does not exist in database
  category?: string; // Note: does not exist in database
  duration: number; // in minutes - Note: does not exist in database
  price: number; // Note: does not exist in database
  currency: string; // Note: does not exist in database
  is_active: boolean; // Note: does not exist in database
  requires_appointment: boolean; // Note: does not exist in database
  prerequisites?: string[]; // Note: does not exist in database
  materials_needed?: string[]; // Note: does not exist in database
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseServicesOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  category?: string;
  isActive?: boolean;
  requiresAppointment?: boolean;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useServicesTanStack(options: UseServicesOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Use the new TanStack Query hook with updated API
  const { 
    data, 
    isLoading, 
    create, 
    delete: deleteItem, 
    update,
    isCreating,
    error,
    refetch
  } = useIndustryDataNew({
    industry,
    country,
    table: 'services',
    select: options.select,
  })

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.category) {
    filteredData = filteredData.filter((s: any) => s.category === options.category)
  }
  
  if (options.isActive !== undefined) {
    filteredData = filteredData.filter((s: any) => s.is_active === options.isActive)
  }
  
  if (options.requiresAppointment !== undefined) {
    filteredData = filteredData.filter((s: any) => s.requires_appointment === options.requiresAppointment)
  }

  return {
    data: filteredData as Service[],
    isLoading,
    isOffline: !isLoading && data.length === 0,
    addService: create,
    deleteService: deleteItem,
    updateService: update,
    isPending: isCreating,
    error,
    refetch,
  }
}
