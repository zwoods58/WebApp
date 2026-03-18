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
import { useAppointments, useTransactions, useServices } from '@/hooks';
import { useBusiness } from '@/contexts/BusinessContext';
import { useOfflineData } from '@/hooks/useOfflineData';
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
  const { business, loading: businessLoading } = useBusiness();
  const { isOnline, isOfflineMode, pendingCount, addCalendarOperation, addCashOperation } = useOfflineData();
  const { 
    appointments, 
    loading, 
    addAppointment, 
    updateAppointment, 
    deleteAppointment,
    completeAppointment,
    cancelAppointment,
    getTodayAppointments,
    getUpcomingAppointments,
    getAppointmentsByStatus,
    refetch
  } = useAppointments({ businessId: business?.id, industry });
  
  const { addTransaction } = useTransactions({ businessId: business?.id });
  const { getServiceById } = useServices({ businessId: business?.id });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [completingAppointment, setCompletingAppointment] = useState<string | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  const handleCompleteAppointment = async (appointmentId: string) => {
    setCompletingAppointment(appointmentId);
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Get service details for pricing
      const service = appointment.service_id ? await getServiceById(appointment.service_id) : null;
      const servicePrice = service?.price || 0;

      if (isOnline) {
        // Try online first
        try {
          await completeAppointment(appointmentId, addTransaction, getServiceById);
          refetch(); // Refresh appointments in calendar
        } catch (onlineError) {
          console.warn('⚠️ Online completion failed, using offline mode:', onlineError);
          
          // Fall back to offline operations
          // Queue appointment completion
          addCalendarOperation('booking_update', {
            appointmentId: appointmentId,
            customerId: appointment.customer_name, // Use customer_name as customerId
            dateTime: new Date(`${appointment.appointment_date} ${appointment.appointment_time}`),
            service: appointment.service_name,
            duration: appointment.duration || 30,
            notes: appointment.notes,
            status: 'completed'
          });

          // Queue transaction if service has a price
          if (servicePrice > 0) {
            addCashOperation('sale', {
              amount: servicePrice,
              category: 'service_payment',
              description: `Payment for ${appointment.service_name} - ${appointment.customer_name}`,
              paymentMethod: 'cash',
              receiptNumber: `APT-${Date.now()}`
            });
          }

          console.log(`✅ Appointment completion queued for sync: ${appointment.service_name}`);
          // Optimistically update local state would go here
        }
      } else {
        // Offline mode - queue operations
        console.log('📴 Offline mode: Queueing appointment completion for later sync');
        
        // Queue appointment completion
        addCalendarOperation('booking_update', {
          appointmentId: appointmentId,
          customerId: appointment.customer_name, // Use customer_name as customerId
          dateTime: new Date(`${appointment.appointment_date} ${appointment.appointment_time}`),
          service: appointment.service_name,
          duration: appointment.duration || 30,
          notes: appointment.notes,
          status: 'completed'
        });

        // Queue transaction if service has a price
        if (servicePrice > 0) {
          addCashOperation('sale', {
            amount: servicePrice,
            category: 'service_payment',
            description: `Payment for ${appointment.service_name} - ${appointment.customer_name}`,
            paymentMethod: 'cash',
            receiptNumber: `APT-${Date.now()}`
          });
        }

        console.log(`✅ Appointment completion queued for sync: ${appointment.service_name}`);
        // Optimistically update local state would go here
      }
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      // You could add a toast notification here
    } finally {
      setCompletingAppointment(null);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    setShowCancelModal(appointmentId);
  };

  const handleConfirmCancel = async (appointmentId: string) => {
    setCancellingAppointment(appointmentId);
    try {
      await cancelAppointment(appointmentId);
      refetch(); // Refresh appointments in calendar
      setShowCancelModal(null); // Close modal
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      // You could add a toast notification here
    } finally {
      setCancellingAppointment(null);
    }
  };

  // Get calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointment_date === dateStr);
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const pendingAppointments = getAppointmentsByStatus('pending');

  const monthDays = getDaysInMonth(currentDate);
  const monthYearStr = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isLoading = loading || businessLoading;

  // Show message if business not set up
  if (!business && !businessLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg1)]">
        <Header industry={industry} country={country} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-6">
            <AlertCircle className="mx-auto mb-4 text-[var(--text-3)]" size={48} />
            <h3 className="text-lg font-semibold text-[var(--text-1)] mb-2">
              {t('calendar.setup_required', 'Business Setup Required')}
            </h3>
            <p className="text-[var(--text-3)]">
              {t('calendar.setup_message', 'Please set up your business profile first to use the calendar.')}
            </p>
          </div>
        </div>
        <BottomNav industry={industry} country={country} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg1)]">
      <Header 
        industry={industry}
        country={country}
      />

      <div className="pb-20 pt-20">
        {/* Offline Status Indicator */}
        {isOfflineMode && (
          <div className="px-4 mb-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-red-800">Offline Mode</div>
                <div className="text-xs text-red-600">All appointments will be synced when you're back online</div>
              </div>
              {pendingCount > 0 && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingCount}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="glass-strong rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-[var(--powder-dark)]" size={20} />
              <span className="text-sm text-[var(--text-3)]">{t('calendar.today', 'Today')}</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-1)]">{todayAppointments.length}</div>
            <div className="text-xs text-[var(--text-3)]">{t('calendar.appointments', 'Appointments')}</div>
          </div>
          
          <div className="glass-strong rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-orange-500" size={20} />
              <span className="text-sm text-[var(--text-3)]">{t('calendar.pending', 'Pending')}</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-1)]">{pendingAppointments.length}</div>
            <div className="text-xs text-[var(--text-3)]">{t('calendar.awaiting', 'Awaiting Confirmation')}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={20} />
            <input
              type="text"
              placeholder={t('calendar.search_placeholder', 'Search appointments...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] text-[var(--text-1)] placeholder-[var(--text-3)]"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] text-[var(--text-1)]"
            >
              <option value="all">{t('calendar.all_statuses', 'All Statuses')}</option>
              <option value="pending">{t('calendar.pending', 'Pending')}</option>
              <option value="confirmed">{t('calendar.confirmed', 'Confirmed')}</option>
              <option value="completed">{t('calendar.completed', 'Completed')}</option>
              <option value="cancelled">{t('calendar.cancelled', 'Cancelled')}</option>
            </select>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-2xl bg-[var(--powder-dark)] text-white font-medium"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Calendar View */}
        <div className="p-4">
          <div className="glass-strong rounded-2xl p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-xl hover:bg-[var(--powder)]/10 transition-colors"
              >
                <ChevronLeft size={20} className="text-[var(--text-1)]" />
              </button>
              
              <h3 className="text-lg font-bold text-[var(--text-1)]">{monthYearStr}</h3>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-xl hover:bg-[var(--powder)]/10 transition-colors"
              >
                <ChevronRight size={20} className="text-[var(--text-1)]" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-[var(--text-3)] py-2">
                  {t(`calendar.days.${day}`)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayAppointments = getAppointmentsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === day.toDateString();

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-xl p-1 relative transition-colors ${
                      isToday 
                        ? 'bg-[var(--powder-dark)]/20 border border-[var(--powder-dark)]' 
                        : isSelected 
                        ? 'bg-[var(--powder)]/20 border border-[var(--powder)]'
                        : 'hover:bg-[var(--powder)]/10'
                    }`}
                  >
                    <div className="text-sm text-[var(--text-1)]">{day.getDate()}</div>
                    {dayAppointments.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              dayAppointments[i]?.status === 'confirmed' ? 'bg-green-500' :
                              dayAppointments[i]?.status === 'pending' ? 'bg-orange-500' :
                              dayAppointments[i]?.status === 'completed' ? 'bg-blue-500' :
                              'bg-red-500'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-[var(--text-1)] mb-3">
            {selectedDate 
              ? formatDate(selectedDate.toISOString().split('T')[0])
              : t('calendar.upcoming', 'Upcoming Appointments')
            }
          </h3>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-[var(--text-3)]">
                {t('common.loading', 'Loading...')}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-3)]">
                {t('calendar.no_appointments', 'No appointments found')}
              </div>
            ) : (
              filteredAppointments.map(appointment => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-[var(--text-1)]">{appointment.customer_name}</h4>
                      <p className="text-sm text-[var(--text-2)]">{appointment.service_name}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                      appointment.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                      appointment.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {t(`calendar.status.${appointment.status}`, appointment.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-[var(--text-3)]">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{appointment.appointment_time}</span>
                    </div>
                    {appointment.duration && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{appointment.duration} min</span>
                      </div>
                    )}
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm text-[var(--text-3)] mt-2">{appointment.notes}</p>
                  )}
                  
                  {/* Action Buttons - Only show for pending and confirmed appointments */}
                  {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-soft)]">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleCompleteAppointment(appointment.id)}
                          disabled={completingAppointment === appointment.id || cancellingAppointment === appointment.id}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          <CheckCircle size={14} />
                          {completingAppointment === appointment.id 
                            ? t('common.completing', 'Completing...') 
                            : t('calendar.complete', 'Complete')
                          }
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancellingAppointment === appointment.id || completingAppointment === appointment.id}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          <XCircle size={14} />
                          {cancellingAppointment === appointment.id 
                            ? t('common.cancelling', 'Cancelling...') 
                            : t('calendar.cancel', 'Cancel')
                          }
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav industry={industry} country={country} />
      
      <AddAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => refetch()}
        industry={industry}
        country={country}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <XCircle className="text-red-600" size={24} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {t('calendar.cancel_appointment_title', 'Cancel Appointment')}
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              {t('calendar.cancel_appointment_message', 'Are you sure you want to cancel this appointment? This action cannot be undone.')}
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="text-sm text-gray-700">
                <div className="font-medium text-gray-900">
                  {appointments.find(apt => apt.id === showCancelModal)?.customer_name || 'Customer'}
                </div>
                <div className="text-xs text-gray-500">
                  {appointments.find(apt => apt.id === showCancelModal)?.service_name || 'Service'} • 
                  {' '}{appointments.find(apt => apt.id === showCancelModal)?.appointment_time || 'Time'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                disabled={cancellingAppointment !== null}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.keep', 'Keep Appointment')}
              </button>
              <button
                onClick={() => handleConfirmCancel(showCancelModal)}
                disabled={cancellingAppointment !== null}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancellingAppointment === showCancelModal ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('common.cancelling', 'Cancelling...')}
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    {t('calendar.confirm_cancel', 'Yes, Cancel')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
