"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/LanguageContext';
import { useAppointments } from '@/hooks';
import { useBusiness } from '@/contexts/BusinessContext';
import { formatDate } from '@/utils/currency';

interface HomepageCalendarProps {
  industry: string;
  country: string;
}

// Industries that use calendar
const CALENDAR_INDUSTRIES = ['salon', 'transport', 'tailor', 'freelance', 'repairs'];

export default function HomepageCalendar({ industry, country }: HomepageCalendarProps) {
  const { t } = useLanguage();
  const { business } = useBusiness();
  const { 
    appointments, 
    loading, 
    getTodayAppointments, 
    getUpcomingAppointments,
    refetch
  } = useAppointments({ businessId: business?.id, industry });

  // Don't render if industry doesn't use calendar
  if (!CALENDAR_INDUSTRIES.includes(industry)) {
    return null;
  }

  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments().slice(0, 3); // Next 3 appointments

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 border border-[var(--border)]"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-[var(--bg2)] rounded-lg mb-4 w-32"></div>
          <div className="space-y-3">
            <div className="h-16 bg-[var(--bg2)] rounded-lg"></div>
            <div className="h-16 bg-[var(--bg2)] rounded-lg"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card p-5 border border-[var(--border)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--powder)]/15 rounded-xl flex items-center justify-center">
            <CalendarIcon className="text-[var(--powder-dark)]" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-1)]">{t('calendar.upcoming_appointments', 'Upcoming Appointments')}</h3>
            <p className="text-sm text-[var(--text-3)]">{t('calendar.manage_schedule', 'Manage your schedule')}</p>
          </div>
        </div>
        
        <Link 
          href={`/Beezee-App/app/${country}/${industry}/calendar`}
          className="flex items-center gap-1 text-[var(--powder-dark)] font-medium text-sm hover:bg-[var(--powder)]/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          {t('common.view_all', 'View All')}
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-[var(--text-3)]" />
            <span className="text-sm font-semibold text-[var(--text-3)] uppercase">
              {t('calendar.today', 'Today')} ({todayAppointments.length})
            </span>
          </div>
          <div className="space-y-2">
            {todayAppointments.slice(0, 2).map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-[var(--bg2)] rounded-xl border border-[var(--border-soft)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[var(--text-1)] text-sm">{appointment.customer_name}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">{appointment.service_name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--powder-dark)] bg-[var(--powder)]/15 px-2 py-1 rounded-lg">
                      {appointment.appointment_time}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                      appointment.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {t(`calendar.status.${appointment.status}`, appointment.status)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {todayAppointments.length > 2 && (
              <div className="text-center py-2">
                <span className="text-xs text-[var(--text-3)]">
                  +{todayAppointments.length - 2} {t('calendar.more_today', 'more today')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && todayAppointments.length === 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon size={16} className="text-[var(--text-3)]" />
            <span className="text-sm font-semibold text-[var(--text-3)] uppercase">
              {t('calendar.next_appointments', 'Next Appointments')}
            </span>
          </div>
          <div className="space-y-2">
            {upcomingAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-[var(--bg2)] rounded-xl border border-[var(--border-soft)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[var(--text-1)] text-sm">{appointment.customer_name}</div>
                    <div className="text-xs text-[var(--text-3)] mt-0.5">{appointment.service_name}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-[var(--text-3)]">
                      {formatDate(appointment.appointment_date)}
                    </span>
                    <span className="text-xs font-medium text-[var(--powder-dark)] bg-[var(--powder)]/15 px-2 py-1 rounded-lg">
                      {appointment.appointment_time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--bg2)] rounded-full flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="text-[var(--text-3)]" size={24} />
          </div>
          <div className="text-[var(--text-1)] font-medium mb-1">
            {t('calendar.no_appointments', 'No appointments yet')}
          </div>
          <div className="text-sm text-[var(--text-3)]">
            {t('calendar.book_first', 'Book your first appointment to get started')}
          </div>
        </div>
      )}

      {/* Quick Action */}
      <Link 
        href={`/Beezee-App/app/${country}/${industry}/calendar`}
        className="w-full mt-4 py-3 bg-[var(--powder-dark)] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[var(--powder)] transition-colors"
      >
        <CalendarIcon size={18} />
        {t('calendar.manage_appointments', 'Manage Appointments')}
      </Link>
    </motion.div>
  );
}
