'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToast } from '@/hooks/useToast';
import { useServicesTanStack } from '@/hooks';
import { Service } from '@/hooks/useServicesTanStack';
import { getCurrency } from '@/utils/currency';
import { getStableDateString, isClient, getStableId } from '@/utils/stableDates';
import { AppointmentFormData, AppointmentFormErrors } from './types';

interface CreateAppointmentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  industry: string;
  country: string;
  initialDate?: string;
}

export default function CreateAppointmentSheet({
  isOpen,
  onClose,
  onSubmit,
  industry,
  country,
  initialDate
}: CreateAppointmentSheetProps) {
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  const { showError } = useToast();
  const { data: services } = useServicesTanStack({ businessId: business?.id, industry });

  const [formData, setFormData] = useState<AppointmentFormData>({
    customerName: '',
    customerContact: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    serviceId: '',
    notes: ''
  });

  const [errors, setErrors] = useState<AppointmentFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (initialDate) {
      setFormData(prev => ({ ...prev, date: initialDate }));
    } else {
      setFormData(prev => ({ ...prev, date: getStableDateString() }));
    }
  }, [initialDate]);

  useEffect(() => {
    if (isOpen && mounted) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      const timer = setTimeout(() => {
        const input = document.querySelector('input[name="customerName"]') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [isOpen, mounted]);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        times.push(`${hourStr}:${minuteStr}`);
      }
    }
    return times;
  };

  const formatTimeDisplay = (time24: string) => {
    const [hour, minute] = time24.split(':');
    const hourNum = parseInt(hour);
    const hour12 = hourNum % 12 || 12;
    const ampm = hourNum < 12 ? 'AM' : 'PM';
    return `${hour12}:${minute} ${ampm}`;
  };

  const validateForm = (): boolean => {
    const newErrors: AppointmentFormErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Customer name must be at least 2 characters';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (formData.date < getStableDateString()) {
      newErrors.date = 'Date cannot be in the past';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (!formData.serviceId) {
      newErrors.serviceId = 'Please select a service';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }
    
    if (!business?.id) {
      showError('No business information available');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const selectedService = services?.find((s: Service) => s.id === formData.serviceId);
      const servicePrice = selectedService?.price || 0;
      
      const calculateDuration = (start: string, end: string): number => {
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return Math.max(0, endMinutes - startMinutes);
      };

      const appointmentData = {
        customer_name: formData.customerName.trim(),
        customer_contact: formData.customerContact.trim() || undefined,
        appointment_date: formData.date,
        appointment_time: formatTimeDisplay(formData.startTime),
        start_time: `${formData.startTime}:00`,
        end_time: `${formData.endTime}:00`,
        duration: calculateDuration(formData.startTime, formData.endTime),
        service_id: formData.serviceId,
        service_name: selectedService?.service_name || '',
        status: 'pending' as const,
        notes: formData.notes.trim() || '',
        business_id: business.id,
        industry,
        created_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
        updated_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
        created_by: business.id,
        updated_by: business.id,
        metadata: { price: servicePrice },
        id: isClient() ? crypto.randomUUID() : getStableId('appointment')
      };
      
      await onSubmit(appointmentData);
      
      // Reset form
      setFormData({
        customerName: '',
        customerContact: '',
        date: initialDate || getStableDateString(),
        startTime: '09:00',
        endTime: '10:00',
        serviceId: '',
        notes: ''
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      showError('Failed to create appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const portalRoot = typeof document !== 'undefined' 
    ? document.getElementById('modal-root') || document.body 
    : null;

  if (!portalRoot) return null;

  const timeOptions = generateTimeOptions();

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-white opacity-100"
      style={{ 
        backgroundColor: '#ffffff !important',
        opacity: '1 !important',
        backdropFilter: 'none !important',
        WebkitBackdropFilter: 'none !important'
      }}
    >
      <div
        className="w-full h-full bg-white overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: '#ffffff !important',
          opacity: '1 !important',
          backdropFilter: 'none !important',
          WebkitBackdropFilter: 'none !important'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('calendar.add_appointment', 'Add Appointment')}
          </h2>
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
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontSize: '16px' }}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Customer Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Customer Contact
              </label>
              <input
                type="tel"
                value={formData.customerContact}
                onChange={(e) => setFormData(prev => ({ ...prev, customerContact: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontSize: '16px' }}
                placeholder="Phone number (optional)"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontSize: '16px' }}
                min={getStableDateString()}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ fontSize: '16px' }}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                  ))}
                </select>
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.startTime}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ fontSize: '16px' }}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                  ))}
                </select>
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.serviceId}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontSize: '16px' }}
              >
                <option value="">Select a service</option>
                {services?.map((service: Service) => (
                  <option key={service.id} value={service.id}>
                    {service.service_name} - {getCurrency(country)}{service.price}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.serviceId}
                </p>
              )}
              {services?.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">
                  ⚠️ No services available. Please add services first.
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontSize: '16px' }}
                rows={3}
                placeholder="Additional notes or special requests..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 rounded-lg font-medium text-base bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting || !services || services.length === 0}
              className="flex-1 py-3 rounded-lg font-medium text-base bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Add Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
