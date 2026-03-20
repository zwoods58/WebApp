"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filter,
  Search
} from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { useAppointmentsTanStack, useTransactionsTanStack, useServicesTanStack } from '@/hooks';
import { Appointment } from '@/hooks/useAppointmentsTanStack';
import { Service } from '@/hooks/useServicesTanStack';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, formatDate } from '@/utils/currency';
import Header from './Header';
import BottomNav from './BottomNav';
import AddAppointmentModal from './AddAppointmentModal';

interface CalendarProps {
  industry: string;
  country: string;
}

export default function Calendar({ industry, country }: CalendarProps) {
  const { t } = useLanguage();
  const { business, loading: businessLoading } = useUnifiedAuth();
  
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

  // Show error if business is not available
  if (!businessLoading && !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Business information not available</div>
          <p className="text-gray-600">Please sign in to access the calendar</p>
        </div>
      </div>
    );
  }

  // Helper functions
  const getTodayAppointments = () => {
    if (!appointments) return [];
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((apt: Appointment) => apt.appointment_date === today);
  };

  const getUpcomingAppointments = () => {
    if (!appointments) return [];
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((apt: Appointment) => apt.appointment_date > today && apt.status === 'pending');
  };

  const getAppointmentsByStatus = (status: string) => {
    if (!appointments) return [];
    return appointments.filter((apt: Appointment) => apt.status === status);
  };

  const getServiceById = (id: string) => {
    if (!services) return null;
    return services.find((s: Service) => s.id === id);
  };

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Navigation
  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
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
      
      // Create a transaction for the appointment booking to show in recent activities
      if (servicePrice && servicePrice > 0) {
        await addTransaction({
          business_id: business?.id,
          industry,
          amount: servicePrice,
          category: 'appointment_booking',
          description: `Appointment booked: ${appointmentData.service_name || 'service'} - ${appointmentData.customer_name || 'Customer'}`,
          customer_name: appointmentData.customer_name || 'Customer',
          payment_method: 'pending',
          transaction_date: appointmentData.appointment_date || new Date().toISOString().split('T')[0],
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
      // TanStack Query handles refetching automatically
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
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
      updateAppointment({ 
        id: appointmentId, 
        updates: { 
          status: 'completed',
          updated_at: new Date().toISOString()
        }
      });
      
      // Create transaction for payment if price exists
      if (appointment.metadata?.price && appointment.metadata.price > 0) {
        const transactionData = {
          business_id: business.id,
          industry: industry,
          amount: appointment.metadata.price,
          category: 'service_payment',
          description: `Payment for ${appointment.service_name || 'service'} - ${appointment.customer_name || 'Customer'}`,
          customer_name: appointment.customer_name || 'Customer',
          payment_method: 'cash',
          transaction_date: new Date().toISOString().split('T')[0],
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
      
      showSuccess(t('calendar.complete_success', 'Appointment completed successfully'));
    } catch (error) {
      console.error('Error completing appointment:', error);
      showError(t('calendar.complete_error', 'Failed to complete appointment. Please try again.'));
    }
  };

  const handleCancelAppointment = async (appointmentId: string, reason?: string) => {
    try {
      // Update appointment status to cancelled
      updateAppointment({ 
        id: appointmentId, 
        updates: { 
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          notes: reason ? `Cancelled: ${reason}` : undefined
        }
      });
      showSuccess('Appointment cancelled successfully');
      setShowCancelModal(false); // Close the modal after successful cancellation
      setAppointmentToCancel(null); // Clear the appointment to cancel
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      showError('Failed to cancel appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId);
      // TanStack Query handles refetching automatically
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

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
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

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
    const daysInMonth = getDaysInMonth(currentDate);
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = getAppointmentsForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });

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
                {dayDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
                + Add appointment
              </button>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Calendar</h1>
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
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
              Add Appointment
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
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search appointments..."
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

        {/* Appointments List - Mobile Responsive */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-orange-500" />
            Pending Appointments
            <span className="text-sm font-normal text-gray-500">
              ({filteredAppointments.filter(apt => apt.status === 'pending').length})
            </span>
          </h2>
          <div className="space-y-3">
            {filteredAppointments.filter(apt => apt.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <CalendarIcon size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 text-center">No appointments found</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add First Appointment
                </button>
              </div>
            ) : (
              filteredAppointments
                .sort((a, b) => {
                  const dateA = new Date(`${a.appointment_date} ${a.appointment_time || '00:00'}`);
                  const dateB = new Date(`${b.appointment_date} ${b.appointment_time || '00:00'}`);
                  return dateA.getTime() - dateB.getTime();
                })
                .map((appointment: Appointment) => {
                  // Show completed appointments in mini format
                  if (appointment.status === 'completed') {
                    return (
                      <div key={appointment.id} className="border border-green-200 bg-green-50 rounded-lg p-2 opacity-75">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <span className="text-sm font-medium text-green-800 truncate">
                                {appointment.customer_name || 'No customer'}
                              </span>
                              <span className="px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                Completed
                              </span>
                            </div>
                            <div className="text-xs text-green-600 truncate">
                              {appointment.service_name || 'Service'} • {formatDate(appointment.appointment_date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Regular display for pending/cancelled appointments
                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-medium text-gray-900 truncate">
                              {appointment.customer_name || 'No customer'}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                              appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.status || 'pending'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="truncate">{appointment.service_name || 'Service'}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock size={14} />
                              {formatDate(appointment.appointment_date)} at {appointment.appointment_time || 'All day'}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-1">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleCompleteAppointment(appointment.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Complete appointment"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setAppointmentToCancel(appointment.id);
                                  setShowCancelModal(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel appointment"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete appointment"
                          >
                            <AlertCircle size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {showAddModal && (
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
        )}
      </AnimatePresence>

      {/* Cancel Appointment Modal - Mobile Responsive */}
      <AnimatePresence>
        {showCancelModal && appointmentToCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Cancel Appointment</h3>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
