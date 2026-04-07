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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          opacity: 1
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
            {t('calendar.add_appointment', 'Add Appointment')}
          </h2>
          <button 
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Scrollable content */}
        <div 
          style={{ 
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Customer Name */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Customer Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} />
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Customer Contact */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Customer Contact
              </label>
              <input
                type="tel"
                value={formData.customerContact}
                onChange={(e) => setFormData(prev => ({ ...prev, customerContact: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
                placeholder="Phone number (optional)"
              />
            </div>

            {/* Date */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
                min={getStableDateString()}
              />
              {errors.date && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Start Time <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                  ))}
                </select>
                {errors.startTime && (
                  <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444' }}>{errors.startTime}</p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  End Time <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                  ))}
                </select>
                {errors.endTime && (
                  <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444' }}>{errors.endTime}</p>
                )}
              </div>
            </div>

            {/* Service */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Service <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.serviceId}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="">Select a service</option>
                {services?.map((service: Service) => (
                  <option key={service.id} value={service.id}>
                    {service.service_name} - {getCurrency(country)}{service.price}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#ef4444' }}>{errors.serviceId}</p>
              )}
              {services?.length === 0 && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#eab308' }}>
                  No services available. Please add services first.
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  resize: 'vertical'
                }}
                rows={3}
                placeholder="Additional notes or special requests..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '16px',
              border: 'none',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting || !services || services.length === 0}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '16px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              cursor: (submitting || !services || services.length === 0) ? 'not-allowed' : 'pointer',
              opacity: (submitting || !services || services.length === 0) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!submitting && services && services.length > 0) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting && services && services.length > 0) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            {submitting ? 'Creating...' : 'Add Appointment'}
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
