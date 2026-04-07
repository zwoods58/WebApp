'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Appointment } from './types';
import { useLanguage } from '@/hooks/LanguageContext';

interface CalendarViewProps {
  appointments: Appointment[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

export default function CalendarView({
  appointments,
  onDateSelect,
  selectedDate
}: CalendarViewProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  if (!mounted || !currentDate) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      if (!prev) return new Date();
      return new Date(prev.getFullYear(), prev.getMonth() + direction, 1);
    });
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(apt => 
      apt.appointment_date === dateStr && 
      apt.status !== 'completed' && 
      apt.status !== 'cancelled'
    );
  };

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 sm:h-20 border border-gray-100 bg-gray-50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayAppointments = getAppointmentsForDate(dateStr);
      const isTodayDate = isToday(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate === dateStr;

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(dateStr)}
          className={`h-16 sm:h-20 border border-gray-200 p-1 sm:p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isTodayDate ? 'bg-blue-50 border-blue-300' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-xs sm:text-sm font-medium ${isTodayDate ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </div>
            {dayAppointments.length > 0 && (
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {dayAppointments.length}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString(t('appointments.locale', 'en-US'), { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={navigateToToday}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('appointments.today_button', 'Today')}
          </button>
        </div>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {[t('appointments.sun', 'Sun'), t('appointments.mon', 'Mon'), t('appointments.tue', 'Tue'), t('appointments.wed', 'Wed'), t('appointments.thu', 'Thu'), t('appointments.fri', 'Fri'), t('appointments.sat', 'Sat')].map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
          <span>{t('appointments.today', 'Today')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          <span>{t('appointments.has_appointments', 'Has appointments')}</span>
        </div>
      </div>
    </div>
  );
}
