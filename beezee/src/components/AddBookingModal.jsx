import { useState, useRef, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, MapPin, FileText, Mic, Info, Repeat, StopCircle } from 'lucide-react';
import VoiceBookingRecorder from './VoiceBookingRecorder';
import { useTranslation } from 'react-i18next';

/**
 * Add Booking Modal Component
 * Bottom sheet modal for adding client bookings/appointments
 */
export default function AddBookingModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData = null // For edit mode
}) {
  const isEditMode = !!initialData;
  const { t } = useTranslation();
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [recurrence, setRecurrence] = useState('none'); // none, daily, weekly, monthly
  const [recurrenceUntil, setRecurrenceUntil] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const modalRef = useRef(null);
  const clientNameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode: pre-fill with existing data
        setClientName(initialData.client_name || '');
        setClientPhone(initialData.client_phone || '');
        setClientEmail(initialData.client_email || '');
        setAppointmentDate(initialData.appointment_date || '');
        setAppointmentTime(initialData.appointment_time || '');
        setService(initialData.service || '');
        setLocation(initialData.location || '');
        setNotes(initialData.notes || '');
        setRecurrence(initialData.recurrence_frequency || 'none');
        setRecurrenceUntil(initialData.recurrence_until || '');
        setShowVoiceRecorder(false); // disable voice in edit mode
      } else {
        // Add mode: set defaults
        const today = new Date().toISOString().split('T')[0];
        setAppointmentDate(today);
        const nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        setAppointmentTime(nextHour.toTimeString().slice(0, 5));
        setShowVoiceRecorder(false);
        setRecurrence('none');
        setRecurrenceUntil('');
      }
      
      setTimeout(() => {
        clientNameInputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      // Reset form when closing
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setService('');
      setLocation('');
      setNotes('');
      setShowVoiceRecorder(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialData]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartY(e.touches ? e.touches[0].clientY : e.clientY);
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = currentY - dragStartY;
    if (diff > 100) {
      onClose();
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !appointmentDate || !appointmentTime) {
      return;
    }
    onSubmit({
      client_name: clientName,
      client_phone: clientPhone || null,
      client_email: clientEmail || null,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      service: service || null,
      location: location || null,
      notes: notes || null,
      status: 'scheduled',
      recurrence_frequency: recurrence === 'none' ? null : recurrence,
      recurrence_until: recurrenceUntil || null,
    });
    // Reset form
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setService('');
    setLocation('');
    setNotes('');
  };

  const handleVoiceBookingCreated = async (bookingData) => {
    // If we have all required fields, save directly
    if (bookingData.client_name && bookingData.appointment_date && bookingData.appointment_time) {
      try {
        await onSubmit({
          ...bookingData,
          status: 'scheduled',
        });
        setShowVoiceRecorder(false);
        onClose();
      } catch (error) {
        console.error('Error saving voice booking:', error);
        // Fallback to pre-filling form
        setClientName(bookingData.client_name || '');
        setClientPhone(bookingData.client_phone || '');
        setClientEmail(bookingData.client_email || '');
        setAppointmentDate(bookingData.appointment_date || '');
        setAppointmentTime(bookingData.appointment_time || '');
        setService(bookingData.service || '');
        setLocation(bookingData.location || '');
        setNotes(bookingData.notes || '');
        setShowVoiceRecorder(false);
      }
    } else {
      // Pre-fill form
      setClientName(bookingData.client_name || '');
      setClientPhone(bookingData.client_phone || '');
      setClientEmail(bookingData.client_email || '');
      setAppointmentDate(bookingData.appointment_date || '');
      setAppointmentTime(bookingData.appointment_time || '');
      setService(bookingData.service || '');
      setLocation(bookingData.location || '');
      setNotes(bookingData.notes || '');
      setShowVoiceRecorder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="transaction-entry-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        <div
          className="modal-drag-handle"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDrag}
          onTouchMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchEnd={handleDragEnd}
        />
        
        <div className="modal-header-section">
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label={t('common.cancel', 'Close modal')}
          >
            <X size={24} />
          </button>
          <h2 id="booking-modal-title" className="modal-title flex-1 text-center flex items-center justify-center gap-2">
            <Calendar size={28} className="modal-title-icon" />
            {isEditMode ? t('bookings.editBooking', 'Edit Booking') : t('bookings.addBooking', 'Add Booking')}
          </h2>
          <button
            type="submit"
            form="booking-form"
            className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!clientName || !appointmentDate || !appointmentTime}
          >
            {isEditMode ? t('common.update', 'Update') : t('common.save', 'Save')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          {/* Voice Option (only for Add mode) */}
          {!isEditMode && (
            <div className="form-field">
              <button
                type="button"
                onClick={() => setShowVoiceRecorder(true)}
                className="voice-prompt-button w-full"
              >
                <Mic size={24} />
                <span>{t('bookings.useVoice', 'Use Voice to Add Booking')}</span>
              </button>
              {showVoiceRecorder && (
                <div className="mt-4">
                  <VoiceBookingRecorder
                    onBookingCreated={handleVoiceBookingCreated}
                    onCancel={() => setShowVoiceRecorder(false)}
                    type="booking"
                  />
                </div>
              )}
            </div>
          )}

          {/* Client Name */}
          <div className="form-field">
            <label htmlFor="clientName" className="form-label">
              <User size={16} className="inline mr-2" />
              {t('bookings.clientName', 'Client Name')} *
            </label>
            <input
              id="clientName"
              ref={clientNameInputRef}
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={t('bookings.enterClientName', 'Enter client name')}
              className="description-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="form-field">
              <label htmlFor="appointmentDate" className="form-label">
                <Calendar size={16} className="inline mr-2" />
                {t('common.date', 'Date')} *
              </label>
              <input
                id="appointmentDate"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="description-input"
                required
              />
            </div>

            {/* Time */}
            <div className="form-field">
              <label htmlFor="appointmentTime" className="form-label">
                <Clock size={16} className="inline mr-2" />
                {t('common.dueTime', 'Time')} *
              </label>
              <input
                id="appointmentTime"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="description-input"
                required
              />
            </div>
          </div>

          {/* Service */}
          <div className="form-field">
            <label htmlFor="service" className="form-label">
              <FileText size={16} className="inline mr-2" />
              {t('common.service', 'Service')}
            </label>
            <input
              id="service"
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder={t('common.servicePlaceholder', 'e.g., Consultation, Haircut')}
              className="description-input"
            />
          </div>

          {/* Location */}
          <div className="form-field">
            <label htmlFor="location" className="form-label">
              <MapPin size={16} className="inline mr-2" />
              {t('common.location', 'Location')}
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('common.locationPlaceholder', 'Enter address')}
              className="description-input"
            />
          </div>

          {/* Recurrence */}
          <div className="form-field">
            <label className="form-label">
              <Repeat size={16} className="inline mr-2" />
              {t('common.repeat', 'Repeat')}
            </label>
            <div className="category-pills">
              {['none', 'daily', 'weekly', 'monthly'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`category-pill ${recurrence === r ? 'active' : ''}`}
                  onClick={() => setRecurrence(r)}
                >
                  {t(`common.${r}`, r.charAt(0).toUpperCase() + r.slice(1))}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-field">
            <label htmlFor="notes" className="form-label">
              <FileText size={16} className="inline mr-2" />
              {t('common.notes', 'Notes')}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('common.notesPlaceholder', 'Add details...')}
              className="description-input"
              rows={3}
            />
          </div>

        </form>
      </div>
    </>
  );
}
