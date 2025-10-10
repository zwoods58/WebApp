'use client'

import { useState } from 'react'
import { X, Calendar, Clock, Video, Phone, MapPin } from 'lucide-react'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
}

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (appointmentData: {
    leadId: string
    appointmentDate: string
    appointmentTime: string
    appointmentType: 'PHONE' | 'VIDEO' | 'IN_PERSON'
    notes?: string
  }) => void
  lead: Lead | null
}

export default function AppointmentModal({ isOpen, onClose, onSave, lead }: AppointmentModalProps) {
  const [formData, setFormData] = useState<{
    appointmentDate: string
    appointmentTime: string
    appointmentType: 'PHONE' | 'VIDEO' | 'IN_PERSON'
    notes: string
  }>({
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'PHONE',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lead) return

    onSave({
      leadId: lead.id,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      appointmentType: formData.appointmentType,
      notes: formData.notes || undefined
    })

    // Reset form
    setFormData({
      appointmentDate: '',
      appointmentTime: '',
      appointmentType: 'PHONE',
      notes: ''
    })
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen || !lead) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">{lead.firstName} {lead.lastName}</h3>
            <p className="text-slate-300">{lead.company}</p>
            {lead.phone && <p className="text-slate-400">📞 {lead.phone}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Appointment Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Appointment Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Appointment Time */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Appointment Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Appointment Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, appointmentType: 'PHONE' }))}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.appointmentType === 'PHONE'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Phone className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-xs">Phone</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, appointmentType: 'VIDEO' }))}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.appointmentType === 'VIDEO'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Video className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-xs">Video</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, appointmentType: 'IN_PERSON' }))}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.appointmentType === 'IN_PERSON'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <MapPin className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-xs">In-Person</div>
                </button>
              </div>
            </div>

            {/* Appointment Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Appointment Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input"
                rows={3}
                placeholder="Any notes about the appointment..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
