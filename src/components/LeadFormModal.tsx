'use client'

import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, Building, Briefcase, Target, FileText } from 'lucide-react'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  source?: string
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'CLOSED_WON' | 'CLOSED_LOST'
  score: number
  notes?: string
  createdAt: string
  updatedAt: string
}

interface LeadFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (lead: Lead) => void
  lead?: Lead | null
}

export default function LeadFormModal({ isOpen, onClose, onSave, lead }: LeadFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    source: 'Manual Entry',
    status: 'NEW' as Lead['status'],
    score: 50,
    notes: ''
  })

  useEffect(() => {
    if (lead) {
      setFormData({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        title: lead.title || '',
        source: lead.source || 'Manual Entry',
        status: lead.status,
        score: lead.score,
        notes: lead.notes || ''
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        source: 'Manual Entry',
        status: 'NEW',
        score: 50,
        notes: ''
      })
    }
  }, [lead])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const leadData: Lead = {
      ...formData,
      id: lead?.id || Date.now().toString(),
      createdAt: lead?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    onSave(leadData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'score' ? Number(value) : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                First Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="First name"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Company name"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Job title"
                />
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Source
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="input"
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Event">Event</option>
                <option value="Manual Entry">Manual Entry</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input pl-10"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="CLOSED_WON">Closed Won</option>
                  <option value="CLOSED_LOST">Closed Lost</option>
                </select>
              </div>
            </div>

            {/* Score */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lead Score (0-100)
              </label>
              <input
                type="number"
                name="score"
                value={formData.score}
                onChange={handleChange}
                className="input"
                placeholder="50"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes
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
                placeholder="Enter lead notes..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
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
              {lead ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}