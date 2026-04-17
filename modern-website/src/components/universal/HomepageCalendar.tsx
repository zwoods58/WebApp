"use client";

import React, { useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppointmentsTanStack } from '@/hooks';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { formatDate } from '@/utils/currency';

type Appointment = {
  id: string;
  customer_name?: string;
  service_name?: string;
  appointment_time: string;
  start_time?: string;
  end_time?: string;
  appointment_date: string;
  status?: string;
};

// Format time range for display (HH:MM:SS -> HH:MM AM/PM)
const formatTimeRange = (appointment: Appointment): string => {
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
  return appointment.appointment_time;
};

interface HomepageCalendarProps {
  industry: string;
  country: string;
}

// Industries that use calendar
const CALENDAR_INDUSTRIES = ['salon', 'transport', 'tailor', 'freelance', 'repairs'];

export default function HomepageCalendar({ industry, country }: HomepageCalendarProps) {
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  const { 
    data: appointments, 
    isLoading, 
    refetch
  } = useAppointmentsTanStack({ businessId: business?.id, industry });

  // Helper functions to filter appointments by status
  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((apt: Appointment) => apt.appointment_date >= today && apt.status === 'pending');
  };

  const getCompletedAppointments = () => {
    return appointments.filter((apt: Appointment) => apt.status === 'completed');
  };

  const getCancelledAppointments = () => {
    return appointments.filter((apt: Appointment) => apt.status === 'cancelled' || apt.status === 'no-show');
  };

  // Don't render if industry doesn't use calendar
  if (!CALENDAR_INDUSTRIES.includes(industry)) {
    return null;
  }

  const upcomingAppointments = getUpcomingAppointments().slice(0, 3); // Next 3 appointments
  const completedAppointments = getCompletedAppointments().slice(0, 2); // Last 2 completed
  const cancelledAppointments = getCancelledAppointments().slice(0, 2); // Last 2 cancelled
  
  // Debug appointment changes
  useEffect(() => {
    console.log('📅 Homepage Calendar Updated:', {
      totalAppointments: appointments?.length || 0,
      upcomingAppointments: upcomingAppointments.length,
      completedAppointments: completedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      timestamp: new Date().toISOString()
    });
  }, [appointments, upcomingAppointments, completedAppointments, cancelledAppointments]);

  if (isLoading) {
    return (
      <div className="fade-in">
        <div className="animate-pulse">
          <div className="h-6 bg-[var(--bg2)] rounded-lg mb-4 w-32"></div>
          <div className="space-y-3">
            <div className="h-16 bg-[var(--bg2)] rounded-lg"></div>
            <div className="h-16 bg-[var(--bg2)] rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--powder)]/15 rounded-xl flex items-center justify-center">
            <CalendarIcon className="text-[var(--powder-dark)]" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-1)]">{t('appointments.upcoming_appointments', 'Upcoming Appointments')}</h3>
            <p className="text-sm text-[var(--text-3)]">{t('appointments.manage_schedule', 'Manage your schedule')}</p>
          </div>
        </div>
        
        <Link 
          href={`/Beezee-App/app/${country}/${industry}/appointments`}
          className="flex items-center gap-1 text-[var(--powder-dark)] font-medium text-sm hover:bg-[var(--powder)]/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          {t('common.view_all', 'View All')}
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* ===== UPCOMING APPOINTMENTS ===== */}
      {upcomingAppointments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-[var(--text-3)] uppercase">
              Upcoming ({upcomingAppointments.length})
            </span>
          </div>
          <div className="space-y-2">
            {upcomingAppointments.map((appointment: Appointment) => (
              <div key={appointment.id} className="fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[var(--text-1)] text-sm">{appointment.customer_name}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">{appointment.service_name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--powder-dark)] bg-[var(--powder)]/15 px-2 py-1 rounded-lg">
                      {formatTimeRange(appointment)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-500/20 text-blue-500">
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== COMPLETED APPOINTMENTS ===== */}
      {completedAppointments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-[var(--text-3)] uppercase">
              Completed ({completedAppointments.length})
            </span>
          </div>
          <div className="space-y-2">
            {completedAppointments.map((appointment: Appointment) => (
              <div key={appointment.id} className="fade-in opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[var(--text-1)] text-sm line-through">{appointment.customer_name}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">{appointment.service_name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      {formatDate(appointment.appointment_date)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-500/20 text-green-500">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== CANCELLED APPOINTMENTS ===== */}
      {cancelledAppointments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm font-semibold text-[var(--text-3)] uppercase">
              Cancelled ({cancelledAppointments.length})
            </span>
          </div>
          <div className="space-y-2">
            {cancelledAppointments.map((appointment: Appointment) => (
              <div key={appointment.id} className="fade-in opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[var(--text-1)] text-sm line-through">{appointment.customer_name}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">{appointment.service_name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                      {formatDate(appointment.appointment_date)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-500/20 text-red-500">
                      Cancelled
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {upcomingAppointments.length === 0 && completedAppointments.length === 0 && cancelledAppointments.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--bg2)] rounded-full flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="text-[var(--text-3)]" size={24} />
          </div>
          <div className="text-[var(--text-1)] font-medium mb-1">
            {t('appointments.no_appointments', 'No appointments yet')}
          </div>
          <div className="text-sm text-[var(--text-3)]">
            {t('appointments.book_first', 'Book your first appointment to get started')}
          </div>
        </div>
      )}

      {/* Quick Action */}
      <Link 
        href={`/Beezee-App/app/${country}/${industry}/appointments`}
        className="w-full mt-4 py-3 bg-[var(--powder-dark)] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[var(--powder)] transition-colors"
      >
        <CalendarIcon size={18} />
        {t('appointments.manage_appointments', 'Manage Appointments')}
      </Link>
    </div>
  );
}

