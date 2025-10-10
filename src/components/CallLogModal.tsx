'use client'

import { useState } from 'react'
import { X, Phone, Clock, FileText, Calendar } from 'lucide-react'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
}

interface CallLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (callData: {
    leadId: string
    duration: number
    outcome: 'INTERESTED' | 'NOT_INTERESTED' | 'CALLBACK' | 'VOICEMAIL' | 'NO_ANSWER' | 'WRONG_NUMBER'
    notes: string
    nextAction?: string
    nextFollowUpDate?: string
  }) => void
  lead: Lead | null
}

export default function CallLogModal({ isOpen, onClose, onSave, lead }: CallLogModalProps) {
  const [formData, setFormData] = useState({
    duration: 0,
    outcome: 'INTERESTED' as const,
    notes: '',
    nextAction: '',
    nextFollowUpDate: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lead) return

    onSave({
      leadId: lead.id,
      duration: formData.duration,
      outcome: formData.outcome,
      notes: formData.notes,
      nextAction: formData.nextAction || undefined,
      nextFollowUpDate: formData.nextFollowUpDate || undefined
    })

    // Reset form
    setFormData({
      duration: 0,
      outcome: 'INTERESTED',
      notes: '',
      nextAction: '',
      nextFollowUpDate: ''
    })
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value
    }))
  }

  if (!isOpen || !lead) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Log Call</h2>
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
            {/* Call Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Call Duration (minutes)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Call Outcome */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Call Outcome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  name="outcome"
                  value={formData.outcome}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                >
                  <option value="INTERESTED">Interested</option>
                  <option value="NOT_INTERESTED">Not Interested</option>
                  <option value="CALLBACK">Callback Requested</option>
                  <option value="VOICEMAIL">Voicemail Left</option>
                  <option value="NO_ANSWER">No Answer</option>
                  <option value="WRONG_NUMBER">Wrong Number</option>
                </select>
              </div>
            </div>

            {/* Call Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Call Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="input pl-10"
                  rows={3}
                  placeholder="What was discussed during the call..."
                  required
                />
              </div>
            </div>

            {/* Next Action */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Next Action
              </label>
              <input
                type="text"
                name="nextAction"
                value={formData.nextAction}
                onChange={handleChange}
                className="input"
                placeholder="What should be done next?"
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Follow-up Date (if needed)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  name="nextFollowUpDate"
                  value={formData.nextFollowUpDate}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
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
                Log Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
