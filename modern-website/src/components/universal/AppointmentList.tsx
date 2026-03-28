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
  
  // Filter appointments for today
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('calendar.appointments')}</h3>
          <p className="text-sm text-gray-500">{todayAppointments.length} {t('common.today')}</p>
        </div>
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Calendar className="text-purple-600" size={20} />
        </div>
      </div>

      {/* Appointment Items */}
      {todayAppointments.length > 0 ? (
        <div className="space-y-3 mb-4">
          {todayAppointments.slice(0, 3).map((appointment, index) => (
            <div key={appointment.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {appointment.service_name} - {appointment.customer_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {appointment.appointment_time} - {appointment.duration || 30} min
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">
                  {formatCurrency(appointment.price || 0, country)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(appointment.appointment_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500 text-sm">{t('calendar.no_appointments')}</p>
          <p className="text-gray-400 text-xs">{t('calendar.schedule_first')}</p>
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
