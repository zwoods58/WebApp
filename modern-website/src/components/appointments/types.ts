export interface Appointment {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_contact?: string;
  service_id?: string;
  service_name?: string;
  appointment_date: string;
  appointment_time: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminder_sent?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  syncStatus?: 'synced' | 'pending' | 'conflict';
}

export interface AppointmentFormData {
  customerName: string;
  customerContact: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceId: string;
  notes: string;
}

export interface AppointmentFormErrors {
  customerName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  serviceId?: string;
}
