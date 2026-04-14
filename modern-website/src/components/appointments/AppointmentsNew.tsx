'use client';

import React, { useState, useEffect } from 'react';
import { Plus, List, Calendar as CalendarIcon, Search, Filter } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/LanguageContext';
import { useAppointmentsTanStack, useTransactionsTanStack } from '@/hooks';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, getCurrency } from '@/utils/currency';
import { getStableDateString, isClient } from '@/utils/stableDates';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import SyncStatusIndicator from './SyncStatusIndicator';
import CalendarView from './CalendarView';
import AppointmentCard from './AppointmentCard';
import CreateAppointmentSheet from './CreateAppointmentSheet';
import AppointmentDetailsSheet from './AppointmentDetailsSheet';
import { Appointment } from './types';

interface AppointmentsNewProps {
  industry: string;
  country: string;
}

export default function AppointmentsNew({ industry, country }: AppointmentsNewProps) {
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { 
    data: appointments, 
    isLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    isOffline
  } = useAppointmentsTanStack({ businessId: business?.id, industry });

  const { addTransaction } = useTransactionsTanStack({ businessId: business?.id, industry });

  // State
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [loadingAppointmentId, setLoadingAppointmentId] = useState<string | null>(null);

  // Filter appointments
  const filteredAppointments = (appointments || []).filter((apt: Appointment) => {
    const matchesSearch = !searchTerm || 
      apt.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || apt.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Group appointments by status
  const pendingAppointments = filteredAppointments.filter((apt: Appointment) => apt.status === 'pending');
  const completedAppointments = filteredAppointments.filter((apt: Appointment) => apt.status === 'completed');
  const cancelledAppointments = filteredAppointments.filter((apt: Appointment) => apt.status === 'cancelled');

  const handleCreateAppointment = async (appointmentData: any) => {
    try {
      console.log('📅 Creating appointment:', appointmentData);
      
      await addAppointment(appointmentData);
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['appointments', business?.id] });
      
      // Create transaction if price exists
      if (appointmentData.metadata?.price && appointmentData.metadata.price > 0) {
        await addTransaction({
          business_id: business?.id,
          industry,
          amount: appointmentData.metadata.price,
          currency: getCurrency(country),
          category: 'appointment_booking',
          description: `Appointment: ${appointmentData.service_name} - ${appointmentData.customer_name}`,
          customer_name: appointmentData.customer_name,
          payment_method: 'pending',
          transaction_date: appointmentData.appointment_date,
          metadata: {
            appointment_id: appointmentData.id,
            service_name: appointmentData.service_name,
            appointment_date: appointmentData.appointment_date,
            appointment_time: appointmentData.appointment_time
          }
        });
      }
      
      setShowCreateSheet(false);
      setSelectedDate(null);
      showSuccess(t('appointments.create_success', 'Appointment created successfully'));
      
      console.log('✅ Appointment created and saved');
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      showError(t('appointments.create_error', 'Failed to create appointment. Please try again.'));
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    if (loadingAppointmentId === appointmentId) return;
    
    setLoadingAppointmentId(appointmentId);
    try {
      const appointment = appointments?.find((apt: Appointment) => apt.id === appointmentId);
      if (!appointment || !business?.id) return;

      console.log('🔄 Completing appointment:', appointmentId);

      await updateAppointment({ 
        id: appointmentId, 
        data: { 
          status: 'completed',
          updated_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
          updated_by: business.id
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ['appointments', business.id] });
      
      // Create payment transaction
      if (appointment.metadata?.price && appointment.metadata.price > 0) {
        await addTransaction({
          business_id: business.id,
          industry,
          amount: appointment.metadata.price,
          currency: getCurrency(country),
          category: 'service_payment',
          description: `Payment: ${appointment.service_name} - ${appointment.customer_name}`,
          customer_name: appointment.customer_name,
          payment_method: 'cash',
          transaction_date: getStableDateString(),
          metadata: {
            appointment_id: appointmentId,
            service_name: appointment.service_name,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time
          }
        });
      }
      
      showSuccess(t('appointments.complete_success', 'Appointment completed successfully'));
      console.log('✅ Appointment completed');
    } catch (error) {
      console.error('❌ Error completing appointment:', error);
      showError(t('appointments.complete_error', 'Failed to complete appointment'));
    } finally {
      setLoadingAppointmentId(null);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (loadingAppointmentId === appointmentId) return;
    
    setLoadingAppointmentId(appointmentId);
    try {
      console.log('🔄 Cancelling appointment:', appointmentId);

      await updateAppointment({ 
        id: appointmentId, 
        data: { 
          status: 'cancelled',
          updated_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
          updated_by: business?.id
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ['appointments', business?.id] });
      
      showSuccess(t('appointments.cancel_success', 'Appointment cancelled successfully'));
      console.log('✅ Appointment cancelled');
    } catch (error) {
      console.error('❌ Error cancelling appointment:', error);
      showError(t('appointments.cancel_error', 'Failed to cancel appointment'));
    } finally {
      setLoadingAppointmentId(null);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    setLoadingAppointmentId(appointmentId);
    try {
      console.log('🔄 Deleting appointment:', appointmentId);

      await updateAppointment({ 
        id: appointmentId, 
        data: { 
          deleted_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
          deleted_by: business?.id,
          updated_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z'
        }
      });
      
      await queryClient.invalidateQueries({ queryKey: ['appointments', business?.id] });
      
      showSuccess(t('appointments.delete_success', 'Appointment deleted successfully'));
      console.log('✅ Appointment deleted');
    } catch (error) {
      console.error('❌ Error deleting appointment:', error);
      showError(t('appointments.delete_error', 'Failed to delete appointment'));
    } finally {
      setLoadingAppointmentId(null);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowCreateSheet(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t('appointments.loading', 'Loading appointments...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header industry={industry} country={country} />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Page Header */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => setShowCreateSheet(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">{t('appointments.add_appointment', 'Add Appointment')}</span>
          </button>
        </div>

        {/* Sync Status */}
        <SyncStatusIndicator businessId={business?.id} />

        {/* View Toggle & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* View Toggle */}
          <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                view === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={18} />
              <span className="text-sm font-medium">{t('appointments.list_view', 'List')}</span>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                view === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CalendarIcon size={18} />
              <span className="text-sm font-medium">{t('appointments.calendar_view', 'Calendar')}</span>
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder={t('appointments.search_placeholder', 'Search appointments...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="outline-none text-sm bg-transparent"
              style={{ fontSize: '16px' }}
            >
              <option value="all">{t('appointments.all_statuses', 'All Status')}</option>
              <option value="pending">{t('appointments.pending', 'Pending')}</option>
              <option value="completed">{t('appointments.completed', 'Completed')}</option>
              <option value="cancelled">{t('appointments.cancelled', 'Cancelled')}</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        {view === 'calendar' ? (
          <CalendarView
            appointments={filteredAppointments}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        ) : (
          <div className="space-y-6">
            {/* Pending Appointments */}
            {pendingAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  {t('appointments.upcoming', 'Upcoming')} ({pendingAppointments.length})
                </h2>
                <div className="space-y-3">
                  {pendingAppointments.map((appointment: Appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      country={country}
                      onComplete={handleCompleteAppointment}
                      onCancel={handleCancelAppointment}
                      onView={setSelectedAppointment}
                      isLoading={loadingAppointmentId === appointment.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Appointments */}
            {completedAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {t('appointments.completed', 'Completed')} ({completedAppointments.length})
                </h2>
                <div className="space-y-3">
                  {completedAppointments.map((appointment: Appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      country={country}
                      onView={setSelectedAppointment}
                      isLoading={loadingAppointmentId === appointment.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Appointments */}
            {cancelledAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                  {t('appointments.cancelled', 'Cancelled')} ({cancelledAppointments.length})
                </h2>
                <div className="space-y-3">
                  {cancelledAppointments.map((appointment: Appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      country={country}
                      onView={setSelectedAppointment}
                      isLoading={loadingAppointmentId === appointment.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredAppointments.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <CalendarIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('appointments.no_appointments_found', 'No appointments found')}</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? t('appointments.adjust_filters', 'Try adjusting your filters') 
                    : t('appointments.get_started', 'Get started by creating your first appointment')}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <button
                    onClick={() => setShowCreateSheet(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    {t('appointments.add_appointment', 'Add Appointment')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav industry={industry} country={country} />

      {/* Modals */}
      <CreateAppointmentSheet
        isOpen={showCreateSheet}
        onClose={() => {
          setShowCreateSheet(false);
          setSelectedDate(null);
        }}
        onSubmit={handleCreateAppointment}
        industry={industry}
        country={country}
        initialDate={selectedDate || undefined}
      />

      <AppointmentDetailsSheet
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        country={country}
        onComplete={handleCompleteAppointment}
        onCancel={handleCancelAppointment}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
}
