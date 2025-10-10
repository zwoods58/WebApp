'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, Upload, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react'

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (consultation: any) => void
  selectedService?: {
    name: string
    price: number
    description: string
    tier: string
  } | null
}

interface ConsultationFormData {
  name: string
  email: string
  phone: string
  company: string
  projectDetails: string
  preferredDate: string
  preferredTime: string
  uploadedFile: File | null
}

export default function ConsultationModal({ isOpen, onClose, onSuccess, selectedService }: ConsultationModalProps) {
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDetails: '',
    preferredDate: '',
    preferredTime: '',
    uploadedFile: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectDetails: '',
        preferredDate: '',
        preferredTime: '',
        uploadedFile: null
      })
      setIsSubmitting(false)
      setIsSuccess(false)
      setFormSubmitted(false)
    }
  }, [isOpen])

  // Generate time slots for 7am-5pm Central Time
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 7; hour <= 17; hour++) {
      const time12 = hour > 12 ? hour - 12 : hour
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const timeString = `${time12}:00 ${ampm} CT`
      slots.push({ value: `${hour}:00`, label: timeString })
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Generate next 30 days for date selection
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      const displayDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      dates.push({ value: dateString, label: displayDate })
    }
    return dates
  }

  const dateOptions = generateDateOptions()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, uploadedFile: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isSubmitting || isSuccess) {
      console.log('Form already submitted or in success state')
      return
    }
    
    console.log('Form submitted with data:', formData)
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.preferredDate || !formData.preferredTime) {
      alert('Please fill in all required fields (Name, Email, Preferred Date, and Preferred Time)')
      return
    }
    
    // Additional validation
    if (formData.name.trim() === '' || formData.email.trim() === '') {
      alert('Name and Email cannot be empty')
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }
    
    console.log('Validation passed, submitting...')
    setFormSubmitted(true)
    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('company', formData.company)
      submitData.append('projectDetails', formData.projectDetails)
      submitData.append('preferredDate', formData.preferredDate)
      submitData.append('preferredTime', formData.preferredTime)
      
      // Add selected service information
      if (selectedService) {
        submitData.append('serviceType', selectedService.name)
        submitData.append('serviceTier', selectedService.tier)
        submitData.append('servicePrice', selectedService.price.toString())
        submitData.append('serviceDescription', selectedService.description)
      }
      
      if (formData.uploadedFile) {
        submitData.append('uploadedFile', formData.uploadedFile)
      }

      console.log('Submitting consultation request...')

      // Submit consultation request
      const response = await fetch('/api/consultation/submit', {
        method: 'POST',
        body: submitData
        // Don't set Content-Type - let FormData set it automatically with boundary
      })

      console.log('Response status:', response.status)
      
          if (response.ok) {
            const result = await response.json()
            console.log('Consultation submitted successfully!')
            setIsSuccess(true)
            setTimeout(() => {
              onSuccess(result.consultation)
              onClose()
            }, 2000)
          } else {
            let errorMessage = 'Failed to submit consultation request'
            try {
              // Clone the response to read it safely
              const responseClone = response.clone()
              const errorData = await responseClone.json()
              errorMessage = errorData.error || errorMessage
            } catch (jsonError) {
              // If response is not JSON, get the text from the original response
              try {
                const errorText = await response.text()
                errorMessage = errorText || `Server error: ${response.status} ${response.statusText}`
              } catch (textError) {
                errorMessage = `Server error: ${response.status} ${response.statusText}`
              }
            }
            throw new Error(errorMessage)
          }
    } catch (error) {
      console.error('Error submitting consultation:', error)
      alert(`Failed to submit consultation request: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Schedule Consultation</h3>
                <p className="text-sm text-gray-500">Let's discuss your project</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
              {isSuccess && formSubmitted ? (
              // Success State
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation Scheduled!</h3>
                <p className="text-gray-600">
                  Thank you! We'll contact you soon to confirm your consultation time.
                </p>
              </div>
            ) : (
              // Consultation Form
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Details</label>
                  <textarea
                    name="projectDetails"
                    value={formData.projectDetails}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                  />
                </div>



                {/* Preferred Time */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Preferred Consultation Time
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                      <select
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a date</option>
                        {dateOptions.map((date) => (
                          <option key={date.value} value={date.value}>
                            {date.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    * All times are in Central Time (Dallas, Texas). We'll confirm the exact time with you.
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Quote PDF (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload the quote PDF you received to help us prepare for your consultation.
                    <br />
                    <span className="text-amber-600 font-medium">Maximum file size: 4MB</span>
                    <br />
                    <span className="text-sm text-gray-400">
                      For larger files, please email us directly at admin@atarwebb.com
                    </span>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-5 w-5" />
                      <span>Schedule Consultation</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
