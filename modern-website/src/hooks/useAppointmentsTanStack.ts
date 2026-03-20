import { useIndustryData } from './useIndustryDataNew'

export interface Appointment {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_contact?: string; // Changed from customer_phone to match database
  service_name?: string; // Changed from service_type to match database
  appointment_date: string;
  appointment_time: string; // Database has time type, will be string in TS
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'; // Changed from 'scheduled' to 'pending' to match database default
  notes?: string;
  reminder_sent?: boolean; // Note: does not exist in database
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseAppointmentsOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'; // Changed from 'scheduled' to 'pending'
  customerName?: string;
  customerPhone?: string; // Note: field is customer_contact in database
  serviceType?: string; // Note: field is service_name in database
  startDate?: string;
  endDate?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useAppointmentsTanStack(options: UseAppointmentsOptions = {}) {
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
    isPaused
  } = useIndustryData(industry, country, 'appointments')

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
  
  if (options.customerPhone) {
    filteredData = filteredData.filter((a: any) => a.customer_contact === options.customerPhone)
  }
  
  if (options.serviceType) {
    filteredData = filteredData.filter((a: any) => a.service_name === options.serviceType)
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
    data: filteredData as Appointment[],
    isLoading,
    isOffline: isPaused,
    addAppointment: addItem,
    deleteAppointment: deleteItem,
    updateAppointment: updateItem,
    isPending: isAdding,
    // Keep the same interface as the original hook
    error: null,
    refetch: () => {}, // TanStack Query handles this automatically
  }
}
