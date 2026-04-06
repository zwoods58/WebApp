'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, User, Calendar, FileText, Trash2 } from 'lucide-react';
import { Appointment } from './types';
import { formatDate, getCurrency } from '@/utils/currency';

interface AppointmentDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  country: string;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AppointmentDetailsSheet({
  isOpen,
  onClose,
  appointment,
  country,
  onComplete,
  onCancel,
  onDelete
}: AppointmentDetailsSheetProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen || !appointment) return null;

  const portalRoot = typeof document !== 'undefined' 
    ? document.getElementById('modal-root') || document.body 
    : null;

  if (!portalRoot) return null;

  const formatTime = (time: string) => {
    if (!time) return 'All day';
    
    if (time.includes(':')) {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      const hour12 = hourNum % 12 || 12;
      const ampm = hourNum < 12 ? 'AM' : 'PM';
      return `${hour12}:${minute} ${ampm}`;
    }
    
    return time;
  };

  const getStatusColor = () => {
    const colors = {
      pending: 'text-blue-600 bg-blue-50',
      confirmed: 'text-purple-600 bg-purple-50',
      completed: 'text-green-600 bg-green-50',
      cancelled: 'text-gray-600 bg-gray-50',
      'no-show': 'text-red-600 bg-red-50'
    };
    return colors[appointment.status] || colors.pending;
  };

  const handleComplete = () => {
    onComplete?.(appointment.id);
    onClose();
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }
    onCancel?.(appointment.id);
    setShowCancelConfirm(false);
    setCancelReason('');
    onClose();
  };

  const handleDelete = () => {
    onDelete?.(appointment.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-2xl overflow-hidden"
        style={{ height: '85vh', maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div 
          className="flex-1 overflow-y-auto bg-white"
          style={{ 
            height: 'calc(85vh - 140px)',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="p-4 space-y-6">
            {/* Status Badge */}
            <div className="flex justify-center">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-base font-medium text-gray-900">{appointment.customer_name}</p>
                  {appointment.customer_contact && (
                    <p className="text-sm text-gray-600 mt-1">{appointment.customer_contact}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDate(appointment.appointment_date)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatTime(appointment.start_time || appointment.appointment_time)}
                    {appointment.end_time && ` - ${formatTime(appointment.end_time)}`}
                  </p>
                  {appointment.duration > 0 && (
                    <p className="text-sm text-gray-500 mt-1">Duration: {appointment.duration} minutes</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="text-base font-medium text-gray-900">{appointment.service_name || 'Service'}</p>
                  {appointment.metadata?.price && (
                    <p className="text-sm text-gray-600 mt-1">
                      {getCurrency(country)}{appointment.metadata.price}
                    </p>
                  )}
                </div>
              </div>

              {appointment.notes && (
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sync Status */}
            {appointment.syncStatus && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Sync Status: <span className="font-medium">{appointment.syncStatus}</span>
                </p>
              </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-900 mb-3">
                  Are you sure you want to delete this appointment?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Cancel Confirmation */}
            {showCancelConfirm && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900 mb-3">
                  Cancel this appointment?
                </p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation (optional)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-3"
                  rows={2}
                  style={{ fontSize: '16px' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setCancelReason('');
                    }}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {appointment.status === 'pending' && !showDeleteConfirm && !showCancelConfirm && (
          <div className="p-4 border-t border-gray-200 bg-white space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleComplete}
                className="flex-1 py-3 rounded-lg font-medium text-base bg-green-600 text-white hover:bg-green-700"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 py-3 rounded-lg font-medium text-base bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Cancel Appointment
              </button>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 rounded-lg font-medium text-base bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete Appointment
            </button>
          </div>
        )}

        {appointment.status !== 'pending' && !showDeleteConfirm && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 rounded-lg font-medium text-base bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete Appointment
            </button>
          </div>
        )}
      </div>
    </div>,
    portalRoot
  );
}
