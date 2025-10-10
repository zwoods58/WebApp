'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, Calendar, Target, Building, User, FileText } from 'lucide-react'

interface Deal {
  id: string
  title: string
  value: number
  stage: 'PROSPECT' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
  probability: number
  expectedCloseDate: string
  company: string
  contactPerson: string
  description?: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

interface DealFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void
  deal?: Deal | null
}

export default function DealFormModal({ isOpen, onClose, onSave, deal }: DealFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    value: 0,
    stage: 'PROSPECT' as Deal['stage'],
    probability: 0,
    expectedCloseDate: '',
    company: '',
    contactPerson: '',
    description: '',
    assignedTo: 'Sales Rep'
  })

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate,
        company: deal.company,
        contactPerson: deal.contactPerson,
        description: deal.description || '',
        assignedTo: deal.assignedTo
      })
    } else {
      setFormData({
        title: '',
        value: 0,
        stage: 'PROSPECT',
        probability: 0,
        expectedCloseDate: '',
        company: '',
        contactPerson: '',
        description: '',
        assignedTo: 'Sales Rep'
      })
    }
  }, [deal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' || name === 'probability' ? Number(value) : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {deal ? 'Edit Deal' : 'Add New Deal'}
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
            {/* Deal Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Deal Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter deal title"
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company *
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
                  required
                />
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contact Person *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Contact person name"
                  required
                />
              </div>
            </div>

            {/* Deal Value */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Deal Value ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Stage *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                >
                  <option value="PROSPECT">Prospect</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CLOSED_WON">Closed Won</option>
                  <option value="CLOSED_LOST">Closed Lost</option>
                </select>
              </div>
            </div>

            {/* Probability */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Probability (%) *
              </label>
              <input
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                className="input"
                placeholder="0"
                min="0"
                max="100"
                required
              />
            </div>

            {/* Expected Close Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Expected Close Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  name="expectedCloseDate"
                  value={formData.expectedCloseDate}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Assigned To
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="input"
              >
                <option value="Sales Rep">Sales Rep</option>
                <option value="Admin User">Admin User</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows={3}
              placeholder="Enter deal description..."
            />
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
              {deal ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}