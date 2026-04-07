'use client';

import React from 'react';
import { Clock, User, CheckCircle, XCircle, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Appointment } from './types';
import { formatDate, formatCurrency, getCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';

interface AppointmentCardProps {
  appointment: Appointment;
  country: string;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onView?: (appointment: Appointment) => void;
  isLoading?: boolean;
}

export default function AppointmentCard({
  appointment,
  country,
  onComplete,
  onCancel,
  onView,
  isLoading = false
}: AppointmentCardProps) {
  const { t } = useLanguage();
  const getSyncStatusBadge = () => {
    if (appointment.syncStatus === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          <RefreshCw size={12} />
          Pending
        </span>
      );
    }
    if (appointment.syncStatus === 'conflict') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
          <AlertCircle size={12} />
          {t('appointments.sync_error', 'Error')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
        <CheckCircle size={12} />
        {t('appointments.synced', 'Synced')}
      </span>
    );
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { bg: 'bg-blue-100', text: 'text-blue-800', label: t('appointments.scheduled', 'Scheduled') },
      confirmed: { bg: 'bg-purple-100', text: 'text-purple-800', label: t('appointments.confirmed', 'Confirmed') },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: t('appointments.completed', 'Completed') },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: t('appointments.cancelled', 'Cancelled') },
      'no-show': { bg: 'bg-red-100', text: 'text-red-800', label: t('appointments.no_show', 'No Show') }
    };

    const config = statusConfig[appointment.status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatTime = (time: string) => {
    if (!time) return t('appointments.all_day', 'All day');
    
    // If it's in HH:MM:SS format, convert to 12-hour
    if (time.includes(':')) {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      const hour12 = hourNum % 12 || 12;
      const ampm = hourNum < 12 ? 'AM' : 'PM';
      return `${hour12}:${minute} ${ampm}`;
    }
    
    return time;
  };

  const showActions = appointment.status === 'pending' && !isLoading;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-gray-400 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 truncate">
              {appointment.customer_name || t('appointments.no_customer', 'No customer')}
            </h3>
          </div>
          {appointment.customer_contact && (
            <p className="text-sm text-gray-500 ml-6">{appointment.customer_contact}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 ml-2">
          {getStatusBadge()}
          {getSyncStatusBadge()}
        </div>
      </div>

      {/* Service Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700">✂️ {appointment.service_name || t('appointments.service', 'Service')}</span>
          {appointment.metadata?.price && (
            <span className="text-gray-600">
              - {getCurrency(country)}{appointment.metadata.price}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={14} className="flex-shrink-0" />
          <span>{formatDate(appointment.appointment_date)}</span>
          <span>at {formatTime(appointment.start_time || appointment.appointment_time)}</span>
        </div>

        {appointment.duration > 0 && (
          <div className="text-sm text-gray-500">
            ⏱️ {t('appointments.duration', 'Duration')}: {appointment.duration} {t('appointments.minutes', 'min')}
          </div>
        )}
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
          {appointment.notes}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onComplete?.(appointment.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <CheckCircle size={16} />
            {t('appointments.complete', 'Complete')}
          </button>
          <button
            onClick={() => onCancel?.(appointment.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <XCircle size={16} />
            {t('appointments.cancel', 'Cancel')}
          </button>
          <button
            onClick={() => onView?.(appointment)}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <Eye size={16} />
          </button>
        </div>
      )}

      {!showActions && appointment.status !== 'pending' && (
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={() => onView?.(appointment)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye size={16} />
            {t('appointments.view_details', 'View Details')}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <RefreshCw size={24} className="text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  );
}
