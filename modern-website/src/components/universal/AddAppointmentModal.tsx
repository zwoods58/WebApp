"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { useServices, useAppointments } from '@/hooks';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToastContext } from '@/providers/ToastProvider';
import { supabase } from '@/lib/supabase';

type Service = {
  id: string;
  service_name: string;
  price?: number;
  category?: string;
  duration?: number;
};

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  industry: string;
  country: string;
}

interface FormData {
  customerName: string;
  customerContact: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

interface FormErrors {
  customerName?: string;
  serviceId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export default function AddAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  industry,
  country
}: AddAppointmentModalProps) {
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  const { data: services } = useServices({ industry, businessId: business?.id });
  const { addAppointment: addAppointment } = useAppointments({ industry, businessId: business?.id });
  const { showSuccess, showError } = useToastContext();

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerContact: '',
    serviceId: '',
    serviceName: '',
    servicePrice: 0,
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        customerName: '',
        customerContact: '',
        serviceId: '',
        serviceName: '',
        servicePrice: 0,
        date: '',
        startTime: '',
        endTime: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  // Generate time options in 5-minute increments
  const generate5MinTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const minuteStr = minute.toString().padStart(2, '0');
        const timeString = `${hour12}:${minuteStr} ${ampm}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generate5MinTimeOptions();

  // Time slot conflict detection
  const checkTimeConflict = async (date: string, startTime: string, endTime: string, excludeId = null) => {
    if (!business?.id) return false;
    
    try {
      let query = supabase
        .from('appointments')
        .select('id, start_time, end_time')
        .eq('business_id', business.id)
        .eq('appointment_date', date)
        .neq('status', 'cancelled');
      
      if (excludeId) {
        query = query.neq('id', excludeId);
      }
      
      const { data: existing } = await query;
      
      return existing?.some(apt => 
        (startTime >= apt.start_time && startTime < apt.end_time) ||
        (endTime > apt.start_time && endTime <= apt.end_time) ||
        (startTime <= apt.start_time && endTime >= apt.end_time)
      );
    } catch (error) {
      console.error('Error checking time conflict:', error);
      return false;
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleServiceChange = (serviceId: string) => {
    const selectedService = services.find((s: Service) => s.id === serviceId);
    setFormData(prev => ({
      ...prev,
      serviceId: serviceId,
      serviceName: selectedService?.service_name || '',
      servicePrice: selectedService?.price || 0
    }));
    if (errors.serviceId) {
      setErrors(prev => ({ ...prev, serviceId: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = t('calendar.error.customer_name', 'Customer name is required (min 2 characters)');
    }

    if (!formData.serviceId) {
      newErrors.serviceId = t('calendar.error.service', 'Please select a service');
    }

    if (!formData.date) {
      newErrors.date = t('calendar.error.date', 'Please select a date');
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = t('calendar.error.past_date', 'Date cannot be in the past');
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = t('calendar.error.time', 'Please select a start time');
    }

    if (!formData.endTime) {
      newErrors.endTime = t('calendar.error.time', 'Please select an end time');
    }

    if (formData.startTime && formData.endTime) {
      // Check if end time is after start time
      const startHour = parseInt(formData.startTime.split(':')[0]);
      const startMin = parseInt(formData.startTime.split(' ')[0].split(':')[1]);
      const startPeriod = formData.startTime.split(' ')[1];
      const endHour = parseInt(formData.endTime.split(':')[0]);
      const endMin = parseInt(formData.endTime.split(' ')[0].split(':')[1]);
      const endPeriod = formData.endTime.split(' ')[1];
      
      // Convert to 24-hour format for comparison
      const start24 = startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : (startPeriod === 'AM' && startHour === 12 ? 0 : startHour);
      const end24 = endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : (endPeriod === 'AM' && endHour === 12 ? 0 : endHour);
      
      if (start24 >= end24) {
        newErrors.endTime = t('calendar.error.time_order', 'End time must be after start time');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!business?.id) {
      showError(t('calendar.error.no_business', 'Business profile not found'));
      return;
    }

    // Find the selected service to get its price
    const selectedService = services.find((s: Service) => s.id === formData.serviceId);
    const servicePrice = selectedService?.price || 0;

    console.log('📅 Creating appointment:', {
      serviceName: selectedService?.service_name,
      servicePrice,
      customerName: formData.customerName
    });

    setSubmitting(true);
    try {
      // Check for time conflict first
      const hasConflict = await checkTimeConflict(formData.date, formData.startTime, formData.endTime);
      if (hasConflict) {
        showError('This time slot is already booked. Please select another time.');
        setSubmitting(false);
        return;
      }
      
      await addAppointment({
        business_id: business.id,
        industry,
        customer_name: formData.customerName.trim(),
        customer_contact: formData.customerContact.trim() || undefined,
        service_id: formData.serviceId,
        service_name: formData.serviceName,
        appointment_date: formData.date,
        appointment_time: `${formData.startTime} - ${formData.endTime}`,
        start_time: formData.startTime,
        end_time: formData.endTime,
        notes: formData.notes.trim() || undefined,
        status: 'pending',
        metadata: {
          price: formData.servicePrice,
          service_name: formData.serviceName
        }
      });
      
      showSuccess(t('calendar.appointment_added', 'Appointment added successfully'));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to add appointment:', error);
      showError(t('calendar.appointment_error', 'Failed to add appointment'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl"
        style={{
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
      {/* Drag Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1 bg-gray-300 rounded-full" />
      </div>
      
      {/* Header */}
      <div className="px-6 pb-3 border-b">
        <h2 className="text-xl font-semibold">{t('calendar.add_appointment', 'Add Appointment')}</h2>
      </div>
      
      {/* SCROLLABLE CONTENT - Enhanced smooth scrolling */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-4"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        {/* All form fields go here */}
        <div className="space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calendar.customer_name', 'Customer Name')} *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder={t('calendar.customer_name_placeholder', 'Enter customer name')}
              autoFocus
              required
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.customerName}
              </p>
            )}
          </div>
          
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calendar.select_date', 'Date')} *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
          
          {/* Start & End Time - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('calendar.start_time', 'Start Time')} *
              </label>
              <select
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t('calendar.select_time', 'Select time')}</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('calendar.end_time', 'End Time')} *
              </label>
              <select
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t('calendar.select_time', 'Select time')}</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
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
          
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calendar.select_service', 'Service')} *
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => {
                const selectedService = services.find(s => s.id === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  serviceId: e.target.value,
                  serviceName: selectedService?.service_name || '',
                  servicePrice: selectedService?.price || 0
                }));
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t('calendar.select_service', 'Select a service')}</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.service_name} - ${service.price}
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.serviceId}
              </p>
            )}
            {services.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">
                No services available. Please add services first.
              </p>
            )}
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calendar.notes', 'Notes')} ({t('common.optional', 'Optional')})
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder={t('calendar.notes_placeholder', 'Additional notes...')}
            />
          </div>
        </div>
      </div>
      
      {/* BUTTONS - Fixed at bottom, always visible */}
      <div className="p-6 border-t bg-white">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || services.length === 0}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-50"
          >
            {submitting ? t('common.saving', 'Saving...') : t('calendar.book_appointment', 'Save Appointment')}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
