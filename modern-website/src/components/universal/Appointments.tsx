"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/LanguageContext';
import { useAppointmentsTanStack, useTransactionsTanStack, useServicesTanStack } from '@/hooks';
import { Appointment } from '@/hooks/useAppointmentsTanStack';
import { Service } from '@/hooks/useServicesTanStack';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToast } from '@/hooks/useToast';
import { usePersistentStorage } from '@/hooks/usePersistentStorage';
import { formatCurrency, formatDate, getCurrency } from '@/utils/currency';
import { getStableDateString, getStableDisplayDate, isClient, getStableId } from '@/utils/stableDates';
import Header from './Header';
import BottomNav from './BottomNav';
import AddAppointmentModal from './AddAppointmentModal';
import { HydrationErrorBoundary } from '@/components/ErrorBoundary';

interface AppointmentsProps {
  industry: string;
  country: string;
}

export default function Appointments({ industry, country }: AppointmentsProps) {
  const { t } = useLanguage();
  const { business, loading: businessLoading } = useUnifiedAuth();
  
  const queryClient = useQueryClient();
  
  // Persistent storage backup for appointments
  const [persistentAppointments, setPersistentAppointments] = usePersistentStorage<any[]>(
    `appointments_${business?.id || 'default'}`, 
    []
  );
  
  // TanStack Query handles online/offline automatically
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  const { 
    data: appointments, 
    isLoading, 
    addAppointment, 
    deleteAppointment,
    updateAppointment,
    isPending,
    isOffline
  } = useAppointmentsTanStack({ businessId: business?.id, industry });
  
  const { data: services } = useServicesTanStack({ businessId: business?.id, industry });
  const { addTransaction } = useTransactionsTanStack({ businessId: business?.id, industry });

  // Remove business dependency checks to allow offline rendering

  // Helper functions with safe defaults for offline mode
  const getTodayAppointments = () => {
    if (!appointments || !Array.isArray(appointments)) return [];
    const today = getStableDateString();
    return appointments.filter((apt: Appointment) => apt.appointment_date === today);
  };

  const getUpcomingAppointments = () => {
    if (!appointments || !Array.isArray(appointments)) return [];
    const today = getStableDateString();
    return appointments.filter((apt: Appointment) => apt.appointment_date > today && apt.status === 'pending');
  };

  const getAppointmentsByStatus = (status: string) => {
    if (!appointments || !Array.isArray(appointments)) return [];
    return appointments.filter((apt: Appointment) => apt.status === status);
  };

  const getServiceById = (id: string) => {
    if (!services || !Array.isArray(services)) return null;
    return services.find((s: Service) => s.id === id);
  };

  // State
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCalendarAppointmentId, setLoadingCalendarAppointmentId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Component mounted ref to prevent state updates after unmount
  const isComponentMounted = React.useRef(true);

  // Track component lifecycle
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  // Initialize date AFTER mount to prevent hydration mismatch
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted && isComponentMounted.current) {
      setIsMounted(true);
      setCurrentDate(new Date());
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Navigation
  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => prev ? new Date(prev.getFullYear(), prev.getMonth() + direction, 1) : new Date());
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Filter appointments - add null check for appointments
  const filteredAppointments = (appointments || []).filter((apt: Appointment) => {
    const matchesSearch = !searchTerm || 
      apt.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || apt.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Handle appointment actions
  const handleAddAppointment = async (appointmentData: any) => {
    try {
      // Find the selected service to get its price
      const selectedService = services.find((s: Service) => s.id === appointmentData.service_id);
      const servicePrice = selectedService?.price || 0;
      
      console.log('📅 Creating appointment with price:', {
        serviceName: selectedService?.service_name,
        servicePrice,
        customerName: appointmentData.customer_name
      });
      
      // Add the appointment
      await addAppointment(appointmentData);
      
      // Automatic sync will be handled by useIndustryDataNew hook
      
      // Invalidate calendar query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['calendar', business?.id] });
      await queryClient.invalidateQueries({ queryKey: ['calendar'] });
      
      // Create a transaction for the appointment booking to show in recent activities
      if (servicePrice && servicePrice > 0) {
        await addTransaction({
          business_id: business?.id,
          industry,
          amount: servicePrice,
          currency: getCurrency(country),
          category: 'appointment_booking',
          description: `Appointment booked: ${appointmentData.service_name || 'service'} - ${appointmentData.customer_name || 'Customer'}`,
          customer_name: appointmentData.customer_name || 'Customer',
          payment_method: 'pending',
          transaction_date: appointmentData.appointment_date || getStableDateString(),
          metadata: {
            appointment_id: 'pending', // Will be updated with real ID after appointment is created
            service_name: appointmentData.service_name,
            appointment_date: appointmentData.appointment_date,
            appointment_time: appointmentData.appointment_time
          }
        });
      }
      
      setShowAddModal(false);
      setSelectedDate(null);
      showSuccess('Appointment created successfully');
    } catch (error) {
      console.error('Error adding appointment:', error);
      showError('Failed to create appointment');
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    if (loadingCalendarAppointmentId === appointmentId) return;
    
    setLoadingCalendarAppointmentId(appointmentId);
    try {
      if (!appointments) return;
      const appointment = appointments.find((apt: Appointment) => apt.id === appointmentId);
      if (!appointment || !business?.id) return;

      console.log('🔄 Starting appointment completion:', {
        appointmentId,
        serviceName: appointment.service_name,
        customerName: appointment.customer_name,
        price: appointment.metadata?.price,
        isOffline
      });

      // Update appointment status to completed
      await updateAppointment({ 
        id: appointmentId, 
        data: { 
          status: 'completed',
          updated_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
          updated_by: business?.id
        }
      });
      
      // Only proceed if component is still mounted
      if (!isComponentMounted.current) return;
      
      // Automatic sync will be handled by useIndustryDataNew hook
      
      // Invalidate calendar query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['calendar', business?.id] });
      await queryClient.invalidateQueries({ queryKey: ['calendar'] });
      
      // Create transaction for payment if price exists
      if (appointment.metadata?.price && appointment.metadata.price > 0) {
        const transactionData = {
          business_id: business.id,
          industry: industry,
          amount: appointment.metadata.price,
          currency: getCurrency(country),
          category: 'service_payment',
          description: `Payment for ${appointment.service_name || 'service'} - ${appointment.customer_name || 'Customer'}`,
          customer_name: appointment.customer_name || 'Customer',
          payment_method: 'cash',
          transaction_date: getStableDateString(),
          metadata: {
            appointment_id: appointmentId,
            service_name: appointment.service_name,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time
          }
        };
        
        console.log('💰 Creating service payment transaction:', transactionData);
        
        // TanStack Query handles online/offline automatically
        await addTransaction(transactionData);
        
        console.log('✅ Service payment transaction created successfully');
      } else {
        console.log('ℹ️ No price found for appointment, skipping transaction creation');
      }
      
      // Only show success if component is still mounted
      if (isComponentMounted.current) {
        showSuccess(t('calendar.complete_success', 'Appointment completed successfully'));
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      // Only show error if component is still mounted
      if (isComponentMounted.current) {
        showError(t('calendar.complete_error', 'Failed to complete appointment. Please try again.'));
      }
    } finally {
      // Only clear loading state if component is still mounted
      if (isComponentMounted.current) {
        setLoadingCalendarAppointmentId(null);
      }
    }
  };

  const handleCancelAppointment = async (appointmentId: string, reason?: string) => {
    if (loadingCalendarAppointmentId === appointmentId) return;
    
    setLoadingCalendarAppointmentId(appointmentId);
    try {
      // Update appointment status to cancelled
      await updateAppointment({ 
        id: appointmentId, 
        data: { 
          status: 'cancelled',
          updated_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
          notes: reason ? `Cancelled: ${reason}` : undefined
        }
      });
      
      // Only proceed if component is still mounted
      if (!isComponentMounted.current) return;
      
      // Automatic sync will be handled by useIndustryDataNew hook
      
      // Invalidate appointments query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['appointments', business?.id] });
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      // Only show success and close modal if component is still mounted
      if (isComponentMounted.current) {
        showSuccess('Appointment cancelled successfully');
        setShowCancelModal(false); // Close the modal after successful cancellation
        setAppointmentToCancel(null); // Clear the appointment to cancel
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Only show error if component is still mounted
      if (isComponentMounted.current) {
        showError('Failed to cancel appointment');
      }
    } finally {
      // Only clear loading state if component is still mounted
      if (isComponentMounted.current) {
        setLoadingCalendarAppointmentId(null);
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    setLoadingCalendarAppointmentId(appointmentId);
    try {
      await deleteAppointment(appointmentId);
      
      // Automatic sync will be handled by useIndustryDataNew hook
      
      // Invalidate appointments query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['appointments', business?.id] });
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      showSuccess('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showError('Failed to delete appointment');
    } finally {
      setLoadingCalendarAppointmentId(null);
    }
  };

  const handleViewDetails = (appointment: any) => {
    // Ensure appointment has all required fields with fallbacks
    const safeAppointment = {
      id: appointment.id || getStableId('temp'),
      customer_name: appointment.customer_name || 'Unknown Customer',
      appointment_date: appointment.appointment_date || appointment.date || getStableDateString(),
      status: appointment.status || 'pending',
      notes: appointment.notes || '',
      service_name: appointment.service_name || 'Service',
      metadata: appointment.metadata || {},
      appointment_time: appointment.appointment_time || 'All day'
    };
    
    setSelectedAppointment(safeAppointment);
    setShowDetailsModal(true);
  };

  // Sync appointments with localStorage
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted && isComponentMounted.current && appointments && appointments.length > 0) {
      setPersistentAppointments(appointments);
    }
    
    return () => {
      isMounted = false;
    };
  }, [appointments, setPersistentAppointments]);

  // Fallback from localStorage to IndexedDB
  useEffect(() => {
    let isMounted = true;
    let isRestoring = false;
    
    if (!appointments || appointments.length === 0) {
      if (persistentAppointments && persistentAppointments.length > 0 && !isRestoring && isComponentMounted.current) {
        isRestoring = true;
        const restoreAppointments = async () => {
          for (const appointment of persistentAppointments) {
            if (!isMounted || !isComponentMounted.current) break;
            try {
              await addAppointment(appointment);
            } catch (error) {
              console.error('Failed to restore appointment:', error);
            }
          }
        };
        restoreAppointments();
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [appointments, persistentAppointments]); // Removed addCalendarAppointment to prevent infinite loop

  // Periodic database sync to ensure data persistence
  useEffect(() => {
    if (!business?.id) return;

    const syncInterval = setInterval(async () => {
      try {
        const { syncManager } = await import('@/lib/sync-manager');
        await syncManager.requestSync('appointments-periodic');
        console.log('🔄 [Calendar] Periodic sync completed');
      } catch (error) {
        console.warn('⚠️ [Calendar] Periodic sync failed:', error);
      }
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(syncInterval);
  }, [business?.id]);

  // Get appointments for a specific date (exclude completed and cancelled from calendar view)
  const getAppointmentsForDate = (date: string) => {
    return filteredAppointments.filter((apt: Appointment) => 
      apt.appointment_date === date && 
      apt.status !== 'completed' && 
      apt.status !== 'cancelled'
    );
  };

  // Render calendar grid - Desktop view
  const renderCalendarGrid = () => {
    if (!currentDate) return null;
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 sm:h-20 md:h-24 lg:h-28 border border-gray-200"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = getAppointmentsForDate(dateStr);
      // Use stable date comparison to prevent hydration issues
      const today = new Date();
      const isToday = isClient() && today.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={`h-16 sm:h-20 md:h-24 lg:h-28 border border-gray-200 p-0.5 sm:p-1 md:p-2 cursor-pointer hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''} min-h-[60px] sm:min-h-[80px]`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="text-xs sm:text-sm md:text-base font-medium">{day}</div>
          <div className="space-y-0.5 sm:space-y-1">
            {dayAppointments.slice(0, 1).map((_: any, i: number) => (
              <div key={i} className="text-xs bg-blue-100 text-blue-800 rounded px-0.5 sm:px-1 py-0.5 truncate">
                {dayAppointments[i].service_name || 'Service'}
              </div>
            ))}
            {dayAppointments.length > 1 && (
              <div className="text-xs text-gray-500">+{dayAppointments.length - 1} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // Render mobile list view - for small screens
  const renderMobileCalendarList = () => {
    if (!currentDate) return null;
    const daysInMonth = getDaysInMonth(currentDate);
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = getAppointmentsForDate(dateStr);
      // Use stable date comparison to prevent hydration issues
      const today = new Date();
      const isToday = isClient() && today.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayName = isClient() ? dayDate.toLocaleDateString('en-US', { weekday: 'short' }) : dayDate.toUTCString().slice(0, 3);

      days.push(
        <div
          key={day}
          className={`bg-white rounded-lg border p-4 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{day}</span>
                <span className="text-sm text-gray-500">{dayName}</span>
                {isToday && (
                  <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">Today</span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {isClient() ? dayDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : `${dayDate.getMonth() + 1}/${dayDate.getFullYear()}`}
              </div>
            </div>
            <div className="text-right">
              {dayAppointments.length > 0 && (
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs rounded-full">
                  {dayAppointments.length}
                </span>
              )}
            </div>
          </div>
          
          {dayAppointments.length > 0 && (
            <div className="space-y-2">
              {dayAppointments.slice(0, 3).map((apt: Appointment) => (
                <div key={apt.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{apt.customer_name || 'No customer'}</div>
                    <div className="text-xs text-gray-600 truncate">{apt.service_name || 'Service'}</div>
                    <div className="text-xs text-gray-500">{apt.appointment_time || 'All day'}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {apt.status || 'pending'}
                  </span>
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-center text-xs text-gray-500 py-2">
                  +{dayAppointments.length - 3} more appointments
                </div>
              )}
            </div>
          )}
          
          {dayAppointments.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              <div className="text-sm">No appointments</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(dateStr);
                  setShowAddModal(true);
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                + {t('calendar.add_appointment_short', 'Add appointment')}
              </button>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Remove business loading check to allow offline rendering

  // Show loading state while checking storage or before mount
  const isComponentLoading = !isMounted || isLoading;
  
  if (isComponentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header industry={industry} country={country} />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('calendar.title', 'Calendar')}</h1>
            <button
              onClick={navigateToToday}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            >
              Today
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium text-center sm:text-left">
                {currentDate ? (isClient() ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`) : 'Loading...'}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={16} />
              {t('calendar.add_appointment', 'Add Appointment')}
            </button>
          </div>
        </div>

        {/* Filters - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
              >
                <option value="all">{t('common.all', 'All')}</option>
                <option value="scheduled">{t('calendar.scheduled', 'Scheduled')}</option>
                <option value="completed">{t('calendar.completed', 'Completed')}</option>
                <option value="cancelled">{t('calendar.cancelled', 'Cancelled')}</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search size={16} />
            <input
              type="text"
              placeholder={t('calendar.search_placeholder', 'Search appointments...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Calendar Grid - All Screen Sizes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 mb-6">
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center text-xs sm:text-sm font-medium text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {renderCalendarGrid()}
          </div>
        </div>

        {/* CalendarAppointments List - Mobile Responsive */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          
          {/* ===== UPCOMING APPOINTMENTS (PENDING) ===== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-orange-500" />
              Upcoming Appointments
              <span className="text-sm font-normal text-gray-500">
                ({filteredAppointments.filter(apt => apt.status === 'pending').length})
              </span>
            </h2>
            <div className="space-y-3">
              {filteredAppointments.filter(apt => apt.status === 'pending').length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <CalendarIcon size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No upcoming appointments</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Appointment
                  </button>
                </div>
              ) : (
                filteredAppointments
                  .filter(apt => apt.status === 'pending')
                  .sort((a: Appointment, b: Appointment) => {
                    const dateA = new Date(`${a.appointment_date} ${a.appointment_time || '00:00'}`);
                    const dateB = new Date(`${b.appointment_date} ${b.appointment_time || '00:00'}`);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((appointment: Appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-medium text-gray-900 truncate">
                              {appointment.customer_name || 'No customer'}
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              Scheduled
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              {appointment.service_name || 'Service'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock size={14} />
                              {formatDate(appointment.appointment_date)} at {appointment.appointment_time || 'All day'}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded mt-2">
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(appointment.id);
                            }}
                            disabled={loadingCalendarAppointmentId === appointment.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as Complete"
                          >
                            {loadingCalendarAppointmentId === appointment.id ? (
                              <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full" />
                            ) : (
                              <CheckCircle size={18} />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAppointmentToCancel(appointment.id);
                              setShowCancelModal(true);
                            }}
                            disabled={loadingCalendarAppointmentId === appointment.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Cancel appointment"
                          >
                            <XCircle size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(appointment);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(appointment.id);
                            }}
                            disabled={loadingCalendarAppointmentId === appointment.id}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                            title="Delete Appointment"
                          >
                            {loadingCalendarAppointmentId === appointment.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* ===== COMPLETED APPOINTMENTS ===== */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Completed Appointments
              <span className="text-sm font-normal text-gray-500">
                ({filteredAppointments.filter(apt => apt.status === 'completed').length})
              </span>
            </h2>
            <div className="space-y-3">
              {filteredAppointments.filter(apt => apt.status === 'completed').length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <CheckCircle size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No completed appointments</p>
                </div>
              ) : (
                filteredAppointments
                  .filter(apt => apt.status === 'completed')
                  .sort((a: Appointment, b: Appointment) => {
                    const dateA = new Date(`${a.appointment_date} ${a.appointment_time || '00:00'}`);
                    const dateB = new Date(`${b.appointment_date} ${b.appointment_time || '00:00'}`);
                    return dateB.getTime() - dateA.getTime(); // Most recent first
                  })
                  .map((appointment: Appointment) => (
                    <div key={appointment.id} className="border border-green-200 bg-green-50 rounded-lg p-4 opacity-85">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} className="text-green-600" />
                            <div className="font-medium text-gray-900 truncate">
                              {appointment.customer_name || 'No customer'}
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              {appointment.service_name || 'Service'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock size={14} />
                              {formatDate(appointment.appointment_date)} at {appointment.appointment_time || 'All day'}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-500 bg-white/50 p-2 rounded mt-2">
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(appointment);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(appointment.id);
                            }}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Appointment"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* ===== CANCELLED/NO-SHOW APPOINTMENTS ===== */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <XCircle size={20} className="text-red-500" />
              Cancelled Appointments
              <span className="text-sm font-normal text-gray-500">
                ({filteredAppointments.filter(apt => apt.status === 'cancelled' || apt.status === 'no-show').length})
              </span>
            </h2>
            <div className="space-y-3">
              {filteredAppointments.filter(apt => apt.status === 'cancelled' || apt.status === 'no-show').length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <XCircle size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No cancelled appointments</p>
                </div>
              ) : (
                filteredAppointments
                  .filter(apt => apt.status === 'cancelled' || apt.status === 'no-show')
                  .sort((a, b) => {
                    const dateA = new Date(`${a.appointment_date} ${a.appointment_time || '00:00'}`);
                    const dateB = new Date(`${b.appointment_date} ${b.appointment_time || '00:00'}`);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((appointment: Appointment) => (
                    <div key={appointment.id} className="border border-red-200 bg-red-50 rounded-lg p-4 opacity-85">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle size={16} className="text-red-600" />
                            <div className="font-medium text-gray-900 truncate line-through">
                              {appointment.customer_name || 'No customer'}
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              Cancelled
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600 line-through">
                              {appointment.service_name || 'Service'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock size={14} />
                              {formatDate(appointment.appointment_date)} at {appointment.appointment_time || 'All day'}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-500 bg-white/50 p-2 rounded mt-2">
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(appointment);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(appointment.id);
                            }}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Appointment"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add CalendarAppointment Modal */}
      
        {showAddModal && (
          <HydrationErrorBoundary>
            <AddAppointmentModal
              isOpen={showAddModal}
              onClose={() => {
                setShowAddModal(false);
                setSelectedDate(null);
              }}
              onSuccess={() => {
                setShowAddModal(false);
                setSelectedDate(null);
                // TanStack Query handles refetching automatically
              }}
              industry={industry}
              country={country}
            />
          </HydrationErrorBoundary>
        )}
      

      {/* Cancel CalendarAppointment Modal - Mobile Responsive */}
      
        {showCancelModal && appointmentToCancel && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowCancelModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">Cancel CalendarAppointment</h3>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to cancel this appointment?
                </p>
                {appointments && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-900">
                      {appointments.find((apt: Appointment) => apt.id === appointmentToCancel)?.customer_name || 'Customer'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {appointments.find((apt: Appointment) => apt.id === appointmentToCancel)?.service_name || 'Service'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointments.find((apt: Appointment) => apt.id === appointmentToCancel)?.appointment_date} at{' '}
                      {appointments.find((apt: Appointment) => apt.id === appointmentToCancel)?.appointment_time}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleCancelAppointment(appointmentToCancel)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  No, Keep
                </button>
              </div>
            </div>
          </div>
        )}
      

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">{t('appointments.details', 'Appointment Details')}</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">{t('appointments.customer', 'Customer')}</label>
                <p className="font-medium">{selectedAppointment.customer_name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">{t('appointments.date_time', 'Date & Time')}</label>
                <p className="font-medium">
                  {isClient() ? new Date(selectedAppointment.appointment_date).toLocaleDateString() : selectedAppointment.appointment_date} at {selectedAppointment.appointment_time || 'All day'}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">{t('appointments.status', 'Status')}</label>
                <p className="font-medium capitalize">
                  {(selectedAppointment.status as string) === 'cancelled' ? 'Cancelled' : 
                   (selectedAppointment.status as string) === 'completed' ? 'Completed' : 
                   (selectedAppointment.status as string) === 'no-show' ? 'No Show' : 'Scheduled'}
                </p>
              </div>
              
              {selectedAppointment.service_name && (
                <div>
                  <label className="text-sm text-gray-500">{t('appointments.service', 'Service')}</label>
                  <p className="font-medium">{selectedAppointment.service_name}</p>
                </div>
              )}
              
              {selectedAppointment.notes && (
                <div>
                  <label className="text-sm text-gray-500">{t('appointments.notes', 'Notes')}</label>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}
              
              {selectedAppointment.metadata?.price && (
                <div>
                  <label className="text-sm text-gray-500">{t('appointments.price', 'Price')}</label>
                  <p className="font-medium">{formatCurrency(selectedAppointment.metadata.price, country)}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                {t('appointments.close', 'Close')}
              </button>
              {(selectedAppointment.status as string) === 'pending' && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setAppointmentToCancel(selectedAppointment.id);
                    setShowCancelModal(true);
                  }}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
