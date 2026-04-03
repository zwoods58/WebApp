"use client";

import React from 'react';
import { Calendar, Clock, DollarSign, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { formatCurrency, formatDate } from '@/utils/currency';

interface AppointmentListProps {
  industry: string;
  country: string;
  appointments?: any[];
  onManageAppointments?: () => void;
  onScheduleAppointment?: () => void;
}

export default function AppointmentList({ 
  industry, 
  country, 
  appointments = [], 
  onManageAppointments,
  onScheduleAppointment 
}: AppointmentListProps) {
  const { t } = useLanguage();
  
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
          <h3 className="text-lg font-semibold text-gray-900">{t('calendar.appointments')}</h3>
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
                      {appointment.service_name || 'Service'} • {appointment.appointment_time || 'All day'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {(appointment.status as string) === 'cancelled' ? 'Cancelled' : 
                     (appointment.status as string) === 'completed' ? 'Completed' : 
                     (appointment.status as string) === 'no-show' ? 'No Show' : 'Scheduled'}
                  </span>
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
                      {new Date(appointment.appointment_date || appointment.date).toLocaleDateString()} • {appointment.appointment_time || 'All day'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {(appointment.status as string) === 'cancelled' ? 'Cancelled' : 
                     (appointment.status as string) === 'completed' ? 'Completed' : 
                     (appointment.status as string) === 'no-show' ? 'No Show' : 'Scheduled'}
                  </span>
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
          <p className="text-gray-400 text-xs">{t('calendar.schedule_first', 'Schedule your first appointment')}</p>
        </div>
      )}

      {/* Action Links */}
      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={onManageAppointments}
          className="flex-1 py-2 px-3 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
        >
          {t('calendar.manage_appointments')}
        </button>
        <button
          onClick={onScheduleAppointment}
          className="flex-1 py-2 px-3 bg-purple-500 text-white font-medium text-sm hover:bg-purple-600 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={16} />
          {t('calendar.add_appointment')}
        </button>
      </div>
    </div>
  );
}
