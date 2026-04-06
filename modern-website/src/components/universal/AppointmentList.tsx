"use client";

import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Plus, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { formatCurrency, formatDate } from '@/utils/currency';
import { useAppointmentsTanStack } from '@/hooks';

// Format time range for display (HH:MM:SS -> HH:MM AM/PM)
const formatTimeRange = (appointment: any): string => {
  if (appointment.start_time && appointment.end_time) {
    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      const hour12 = hourNum % 12 || 12;
      const ampm = hourNum < 12 ? 'AM' : 'PM';
      return `${hour12}:${minute} ${ampm}`;
    };
    return `${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}`;
  }
  return appointment.appointment_time || 'All day';
};

interface AppointmentListProps {
  industry: string;
  country: string;
  appointments?: any[];
  onManageAppointments?: () => void;
  onScheduleAppointment?: () => void;
  businessId?: string;
}

export default function AppointmentList({ 
  industry, 
  country, 
  appointments = [], 
  onManageAppointments,
  onScheduleAppointment,
  businessId
}: AppointmentListProps) {
  const { t } = useLanguage();
  const { deleteAppointment, updateAppointment } = useAppointmentsTanStack({ businessId, industry });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const handleEditAppointment = (appointmentId: string) => {
    // TODO: Implement edit modal - for now just log
    console.log('Edit appointment:', appointmentId);
  };
  
  // Filter and sort appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Filter appointments - ONLY show scheduled/pending, NOT completed
  const activeAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date || apt.date);
    aptDate.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    // Only include if status is NOT 'completed'
    const isNotCompleted = apt.status !== 'completed';
    const isUpcoming = aptDate >= today && aptDate <= nextWeek;
    
    return isNotCompleted && isUpcoming;
  });

  // Today's appointments (only scheduled, not completed)
  const todayAppointments = activeAppointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date || apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime();
  });

  // Upcoming appointments (only scheduled, not completed)
  const upcomingAppointments = activeAppointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date || apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() > today.getTime();
  }).sort((a, b) => {
    const dateA = new Date(a.appointment_date || a.date);
    const dateB = new Date(b.appointment_date || b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('appointments.appointments')}</h3>
          <p className="text-sm text-gray-500">{t('appointments.today_count', `${todayAppointments.length} today`)}</p>
        </div>
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Calendar className="text-purple-600" size={20} />
        </div>
      </div>

      {/* Appointment Items */}
      {todayAppointments.length > 0 ? (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">{t('appointments.today', 'Today')}</div>
          <div className="space-y-3">
            {todayAppointments.slice(0, 3).map((appointment, index) => (
              <div key={appointment.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {appointment.customer_name || appointment.title || t('appointments.untitled', 'Appointment')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.service_name || 'Service'} • {formatTimeRange(appointment)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {(appointment.status as string) === 'cancelled' ? 'Cancelled' : 
                     (appointment.status as string) === 'completed' ? 'Completed' : 
                     (appointment.status as string) === 'no-show' ? 'No Show' : 'Scheduled'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditAppointment(appointment.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit appointment"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(appointment.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete appointment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : upcomingAppointments.length > 0 ? (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">{t('appointments.upcoming', 'Upcoming')}</div>
          <div className="space-y-3">
            {upcomingAppointments.slice(0, 3).map((appointment, index) => (
              <div key={appointment.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {appointment.customer_name || appointment.title || t('appointments.untitled', 'Appointment')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.appointment_date || appointment.date).toLocaleDateString()} • {formatTimeRange(appointment)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {(appointment.status as string) === 'cancelled' ? 'Cancelled' : 
                     (appointment.status as string) === 'completed' ? 'Completed' : 
                     (appointment.status as string) === 'no-show' ? 'No Show' : 'Scheduled'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditAppointment(appointment.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit appointment"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(appointment.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete appointment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500 text-sm">{t('appointments.no_appointments', 'No upcoming appointments')}</p>
          <p className="text-gray-400 text-xs">{t('appointments.schedule_first', 'Schedule your first appointment')}</p>
        </div>
      )}

      {/* Action Links */}
      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={onManageAppointments}
          className="flex-1 py-2 px-3 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
        >
          {t('appointments.manage_appointments')}
        </button>
        <button
          onClick={onScheduleAppointment}
          className="flex-1 py-2 px-3 bg-purple-500 text-white font-medium text-sm hover:bg-purple-600 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={16} />
          {t('appointments.add_appointment')}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('common.delete_appointment', 'Delete Appointment')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('common.delete_confirm', 'Are you sure you want to delete this appointment? This action cannot be undone.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => handleDeleteAppointment(confirmDelete)}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('common.delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
