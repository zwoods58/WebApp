"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  customer_name: string;
  customer_contact: string;
  service_id: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  notes: string;
}

interface FormErrors {
  customer_name?: string;
  service_id?: string;
  appointment_date?: string;
  appointment_time?: string;
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
    customer_name: '',
    customer_contact: '',
    service_id: '',
    service_name: '',
    appointment_date: '',
    appointment_time: '',
    duration: 60,
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        customer_name: '',
        customer_contact: '',
        service_id: '',
        service_name: '',
        appointment_date: '',
        appointment_time: '',
        duration: 60,
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  // Generate time slots (24-hour basis, 15-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
      service_id: serviceId,
      service_name: selectedService?.service_name || '',
      duration: selectedService?.duration || 60
    }));
    if (errors.service_id) {
      setErrors(prev => ({ ...prev, service_id: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customer_name.trim() || formData.customer_name.trim().length < 2) {
      newErrors.customer_name = t('calendar.error.customer_name', 'Customer name is required (min 2 characters)');
    }

    if (!formData.service_id) {
      newErrors.service_id = t('calendar.error.service', 'Please select a service');
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = t('calendar.error.date', 'Please select a date');
    } else {
      const selectedDate = new Date(formData.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointment_date = t('calendar.error.past_date', 'Date cannot be in the past');
      }
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = t('calendar.error.time', 'Please select a time');
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
    const selectedService = services.find((s: Service) => s.id === formData.service_id);
    const servicePrice = selectedService?.price || 0;

    console.log('📅 Creating appointment:', {
      serviceName: selectedService?.service_name,
      servicePrice,
      customerName: formData.customer_name
    });

    setSubmitting(true);
    try {
      await addAppointment({
        business_id: business.id,
        industry,
        customer_name: formData.customer_name.trim(),
        customer_contact: formData.customer_contact.trim() || undefined,
        service_id: formData.service_id,
        service_name: formData.service_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        duration: formData.duration,
        notes: formData.notes.trim() || undefined,
        status: 'pending',
        metadata: {
          price: servicePrice,
          service_name: formData.service_name
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
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-xl"
        />

        {/* Modal - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-100/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/20"
        >
          {/* Apple-style Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-8 sm:w-16" />
            <h2 className="text-lg sm:text-lg font-semibold text-black">
              {t('calendar.add_appointment', 'Add Appointment')}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-gray-200/50 hover:bg-gray-300/50 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-black" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('calendar.customer_name', 'Customer Name')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" size={20} />
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${
                    errors.customer_name ? 'border-red-500' : 'border-gray-300'
                  } text-black placeholder-black/50 text-base sm:text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.customer_name && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.customer_name}
                </p>
              )}
            </div>

            {/* Customer Contact */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('calendar.customer_contact', 'Contact')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" size={20} />
                <input
                  type="text"
                  value={formData.customer_contact}
                  onChange={(e) => handleInputChange('customer_contact', e.target.value)}
                  className="w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 text-black placeholder-black/50 text-base sm:text-sm"
                  placeholder="+254 700 000 000"
                />
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('calendar.select_service', 'Select Service')} *
              </label>
              <select
                value={formData.service_id}
                onChange={(e) => handleServiceChange(e.target.value)}
                className={`w-full px-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${
                  errors.service_id ? 'border-red-500' : 'border-gray-300'
                } text-black text-base sm:text-sm`}
              >
                <option value="">{t('calendar.select_service', 'Select Service')}</option>
                {services.map((service: Service) => (
                  <option key={service.id} value={service.id}>
                    {service.service_name} {service.price ? `- ${service.price}` : ''}
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.service_id}
                </p>
              )}
              {services.length === 0 && (
                <p className="mt-1 text-sm text-black/50">
                  {t('calendar.no_services', 'No services available. Please add services first.')}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('calendar.select_date', 'Select Date')} *
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" size={20} />
                <input
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                  min={getTodayDate()}
                  className={`w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${
                    errors.appointment_date ? 'border-red-500' : 'border-gray-300'
                  } text-black text-base sm:text-sm`}
                />
              </div>
              {errors.appointment_date && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.appointment_date}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('calendar.select_time', 'Select Time')} *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" size={20} />
                <select
                  value={formData.appointment_time}
                  onChange={(e) => handleInputChange('appointment_time', e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${
                    errors.appointment_time ? 'border-red-500' : 'border-gray-300'
                  } text-black text-base sm:text-sm`}
                >
                  <option value="">{t('calendar.select_time', 'Select Time')}</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              {errors.appointment_time && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.appointment_time}
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('calendar.duration_minutes', 'Duration (minutes)')}
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                min="15"
                max="480"
                step="15"
                className="w-full px-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 text-black text-base sm:text-sm"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('calendar.notes', 'Notes')}
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-black/50" size={20} />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 text-black placeholder-black/50 resize-none text-base sm:text-sm"
                  placeholder={t('calendar.notes_placeholder', 'Any special requests or notes...')}
                />
              </div>
            </div>

            {/* Action Buttons - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 sm:py-3 bg-gray-200/50 text-black font-medium rounded-xl hover:bg-gray-300/50 transition-colors text-base sm:text-sm"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting || services.length === 0}
                className="flex-1 px-6 py-4 sm:py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
              >
                {submitting 
                  ? t('common.saving', 'Saving...') 
                  : t('calendar.book_appointment', 'Book Appointment')
                }
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
