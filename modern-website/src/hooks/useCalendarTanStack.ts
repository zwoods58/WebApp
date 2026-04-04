import { useIndustryDataNew } from './useIndustryDataNew'

export interface CalendarAppointment {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_contact?: string;
  service_name?: string;
  appointment_date: string;
  appointment_time: string;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminder_sent?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseCalendarOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  customerName?: string;
  customerContact?: string;
  serviceName?: string;
  startDate?: string;
  endDate?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useCalendarTanStack(options: UseCalendarOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Use the new TanStack Query hook with calendar table
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
    table: 'calendar',
    select: options.select,
  })

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.status) {
    filteredData = filteredData.filter((a: any) => a.status === options.status)
  }
  
  if (options.customerName) {
    filteredData = filteredData.filter((a: any) => 
      a.customer_name?.toLowerCase().includes(options.customerName!.toLowerCase())
    )
  }
  
  if (options.customerContact) {
    filteredData = filteredData.filter((a: any) => a.customer_contact === options.customerContact)
  }
  
  if (options.serviceName) {
    filteredData = filteredData.filter((a: any) => a.service_name === options.serviceName)
  }
  
  if (options.startDate) {
    filteredData = filteredData.filter((a: any) => 
      new Date(a.appointment_date) >= new Date(options.startDate!)
    )
  }
  
  if (options.endDate) {
    filteredData = filteredData.filter((a: any) => 
      new Date(a.appointment_date) <= new Date(options.endDate!)
    )
  }

  return {
    data: filteredData as CalendarAppointment[],
    isLoading,
    isOffline: !isLoading && data.length === 0,
    addCalendarAppointment: create,
    deleteCalendarAppointment: deleteItem,
    updateCalendarAppointment: update,
    isPending: isCreating,
    error,
    refetch,
  }
}

export default useCalendarTanStack;
