'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, formatDate, getCurrency } from '@/utils/currency';
import { useAppointmentsTanStack, useServicesTanStack, useTransactionsTanStack } from '@/hooks';
import { Appointment } from '@/hooks/useAppointmentsTanStack';
import { Service } from '@/hooks/useServicesTanStack';
import { getStableDateString, getStableTimeString, isClient, getStableId } from '@/utils/stableDates';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  industry: string;
  country: string;
  initialDate?: string;
}

interface FormData {
  customerName: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  notes: string;
}

interface FormErrors {
  customerName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  serviceId?: string;
}

export default function AddAppointmentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  industry, 
  country,
  initialDate 
}: AddAppointmentModalProps) {
  const { t } = useLanguage();
  const { business, loading: businessLoading } = useUnifiedAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  const { data: services } = useServicesTanStack({ businessId: business?.id, industry });
  const { addAppointment } = useAppointmentsTanStack({ businessId: business?.id, industry });
  const { addTransaction } = useTransactionsTanStack({ businessId: business?.id, industry });

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    serviceId: '',
    serviceName: '',
    servicePrice: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set initial date and mount state AFTER client-side render
  useEffect(() => {
    setIsMounted(true);
    if (initialDate) {
      setFormData(prev => ({ ...prev, date: initialDate }));
    } else {
      setFormData(prev => ({ ...prev, date: getStableDateString() }));
    }
  }, [initialDate]);

  // Mobile PWA body scroll prevention
  useEffect(() => {
    if (isOpen && isMounted) {
      // Prevent body scroll when modal is open (mobile PWA)
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Auto focus customer name input
      const timer = setTimeout(() => {
        const customerInput = document.querySelector('input[placeholder*="customer name"], input[placeholder*="Customer"]') as HTMLInputElement;
        if (customerInput) {
          customerInput.focus();
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
  }, [isOpen, isMounted]);

  // Generate time options in 5-minute increments (24-hour format for better sorting)
  const generate5MinTimeOptions = () => {
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

  // Format time for display (convert 24h to 12h format)
  const formatTimeForDisplay = (time24: string) => {
    const [hour, minute] = time24.split(':');
    const hourNum = parseInt(hour);
    const hour12 = hourNum % 12 || 12;
    const ampm = hourNum < 12 ? 'AM' : 'PM';
    return `${hour12}:${minute} ${ampm}`;
  };

  const getTodayDate = () => {
    return getStableDateString();
  };

  const timeOptions = generate5MinTimeOptions();
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = t('calendar.error.customer_name', 'Customer name is required');
    }
    
    if (!formData.date) {
      newErrors.date = t('calendar.error.date_required', 'Date is required');
    }
    
    if (!formData.startTime) {
      newErrors.startTime = t('calendar.error.start_time_required', 'Start time is required');
    }
    
    if (!formData.endTime) {
      newErrors.endTime = t('calendar.error.end_time_required', 'End time is required');
    }
    
    if (!formData.serviceId) {
      newErrors.serviceId = t('calendar.error.service_required', 'Please select a service');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (!business?.id) {
        showError(t('calendar.error.no_business', 'No business information available'));
        return;
      }
      
      const selectedService = services.find((s: Service) => s.id === formData.serviceId);
      const servicePrice = selectedService?.price || 0;
      
      console.log('📅 Creating appointment with price:', {
        serviceName: selectedService?.service_name,
        servicePrice,
        customerName: formData.customerName
      });
      
      const startTimeDisplay = formatTimeForDisplay(formData.startTime);
      const endTimeDisplay = formatTimeForDisplay(formData.endTime);
      
      const appointmentData = {
        customer_name: formData.customerName,
        appointment_date: formData.date,
        appointment_time: startTimeDisplay,
        end_time: endTimeDisplay,
        service_id: formData.serviceId,
        service_name: selectedService?.service_name || '',
        service_price: servicePrice,
        notes: formData.notes || '',
        business_id: business.id,
        industry,
        country,
        created_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
        updated_at: isClient() ? new Date().toISOString() : '2024-01-01T00:00:00.000Z',
        id: isClient() ? crypto.randomUUID() : getStableId('appointment')
      };
      
      await addAppointment(appointmentData);
      
      if (servicePrice && servicePrice > 0) {
        const transactionData = {
          business_id: business.id,
          industry,
          amount: servicePrice,
          currency: getCurrency(country),
          category: 'appointment_booking',
          description: `Appointment booked: ${selectedService?.service_name || 'service'} - ${formData.customerName || 'Customer'}`,
          customer_name: formData.customerName || 'Customer',
          payment_method: 'pending',
          transaction_date: getStableDateString(),
          metadata: {
            appointment_id: appointmentData.id,
            service_name: selectedService?.service_name,
            appointment_date: formData.date,
            appointment_time: startTimeDisplay
          }
        };
        
        await addTransaction(transactionData);
      }
      
      showSuccess(t('calendar.complete_success', 'Appointment created successfully'));
      onSuccess();
      onClose();
      
      setFormData({
        customerName: '',
        date: initialDate || '',
        startTime: '09:00',
        endTime: '10:00',
        serviceId: '',
        serviceName: '',
        servicePrice: 0,
        notes: ''
      });
      
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      showError(t('calendar.create_error', 'Failed to create appointment. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Prevent hydration errors by not rendering until mounted
  if (!isMounted) return null;
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* MODAL CONTAINER - FIXED SCROLLING */}
      <div
        className="bg-white rounded-t-2xl shadow-xl w-full"
        style={{
          height: '85vh',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          overflow: 'hidden' // Prevents modal from scrolling, only inner content scrolls
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('calendar.add_appointment', 'Add Appointment')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT - THIS WILL NOW SCROLL CORRECTLY */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="p-4 pb-6 space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('calendar.customer_name', 'Customer Name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('calendar.customer_name_placeholder', 'Enter customer name')}
                style={{ fontSize: '16px' }}
                required
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('calendar.date', 'Date')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: '16px' }}
                min={getTodayDate()}
                required
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
                  {t('calendar.start_time', 'Start Time')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: '16px' }}
                  required
                >
                  <option value="">{t('calendar.select_time', 'Select time')}</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
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
                  {t('calendar.end_time', 'End Time')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: '16px' }}
                  required
                >
                  <option value="">{t('calendar.select_time', 'Select time')}</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
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
                {t('calendar.select_service', 'Service')} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.serviceId}
                onChange={(e) => {
                  const selectedService = services?.find((s: Service) => s.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    serviceId: e.target.value,
                    serviceName: selectedService?.service_name || '',
                    servicePrice: selectedService?.price || 0
                  }));
                }}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: '16px' }}
                required
              >
                <option value="">{t('calendar.select_service', 'Select a service')}</option>
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
                {t('calendar.notes', 'Notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: '16px' }}
                rows={3}
                placeholder={t('calendar.notes_placeholder', 'Additional notes or special requests...')}
              />
            </div>
          </div>
        </div>

        {/* Footer with Buttons - ALWAYS VISIBLE */}
        <div className="p-4 pt-3 border-t border-gray-200 bg-white rounded-b-2xl shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 text-base"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={submitting || !services || services.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-base shadow-sm"
            >
              {submitting ? t('common.saving', 'Saving...') : t('calendar.book_appointment', 'Add Appointment')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}