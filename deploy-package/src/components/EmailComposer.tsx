'use client'

import { useState } from 'react'
import { X, Send, Mail, Users, AlertCircle, CheckCircle } from 'lucide-react'
import NotificationService from '@/lib/notification-service'

interface EmailComposerProps {
  isOpen: boolean
  onClose: () => void
  recipients: Array<{
    id: string
    name: string
    email: string
  }>
  template?: 'project_update' | 'invoice' | 'welcome' | 'custom'
  subject?: string
  message?: string
}

export default function EmailComposer({
  isOpen,
  onClose,
  recipients,
  template = 'custom',
  subject = '',
  message = ''
}: EmailComposerProps) {
  const [formData, setFormData] = useState({
    subject: subject || '',
    message: message || '',
    template: template,
    selectedRecipients: recipients.map(r => r.id)
  })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const notificationService = new NotificationService()

  const templates = {
    project_update: {
      subject: 'Project Status Update',
      message: 'We wanted to update you on the status of your project. Please check your client portal for the latest information.'
    },
    invoice: {
      subject: 'New Invoice Available',
      message: 'A new invoice has been generated for your account. Please log in to your client portal to view and pay the invoice.'
    },
    welcome: {
      subject: 'Welcome to AtarWebb Solutions!',
      message: 'Thank you for choosing AtarWebb Solutions! We\'re excited to work with you and help your business grow with our web development services.'
    },
    custom: {
      subject: '',
      message: ''
    }
  }

  const handleTemplateChange = (templateType: string) => {
    const template = templates[templateType as keyof typeof templates]
    setFormData(prev => ({
      ...prev,
      template: templateType as 'project_update' | 'invoice' | 'welcome' | 'custom',
      subject: template.subject,
      message: template.message
    }))
  }

  const handleRecipientToggle = (recipientId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRecipients: prev.selectedRecipients.includes(recipientId)
        ? prev.selectedRecipients.filter(id => id !== recipientId)
        : [...prev.selectedRecipients, recipientId]
    }))
  }

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      selectedRecipients: recipients.map(r => r.id)
    }))
  }

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      selectedRecipients: []
    }))
  }

  const handleSend = async () => {
    if (formData.selectedRecipients.length === 0) {
      setResult({ success: false, message: 'Please select at least one recipient' })
      return
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      setResult({ success: false, message: 'Please fill in both subject and message' })
      return
    }

    setSending(true)
    setResult(null)

    try {
      const selectedRecipients = recipients.filter(r => formData.selectedRecipients.includes(r.id))
      
      const notifications = selectedRecipients.map(recipient => ({
        type: formData.template as any,
        recipient_email: recipient.email,
        recipient_name: recipient.name,
        subject: formData.subject,
        message: formData.message,
        metadata: { template: formData.template },
        priority: 'medium' as const
      }))

      const result = await notificationService.sendBulkNotifications(notifications)
      
      if (result.success) {
        setResult({ 
          success: true, 
          message: `Successfully sent ${result.results.filter(r => r.success).length} of ${notifications.length} emails` 
        })
        
        // Reset form after successful send
        setTimeout(() => {
          onClose()
          setFormData({
            subject: '',
            message: '',
            template: 'custom',
            selectedRecipients: []
          })
          setResult(null)
        }, 2000)
      } else {
        setResult({ 
          success: false, 
          message: 'Failed to send emails. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Error sending emails:', error)
      setResult({ 
        success: false, 
        message: 'An error occurred while sending emails' 
      })
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send Email</h2>
              <p className="text-gray-600">Compose and send emails to selected recipients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Email Template</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => handleTemplateChange(key)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    formData.template === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium capitalize">{key.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {template.subject || 'Custom template'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Recipients</label>
              <div className="flex space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {recipients.map((recipient) => (
                <label key={recipient.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={formData.selectedRecipients.includes(recipient.id)}
                    onChange={() => handleRecipientToggle(recipient.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{recipient.name}</div>
                    <div className="text-sm text-gray-500">{recipient.email}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {formData.selectedRecipients.length} of {recipients.length} recipients selected
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter email subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter your message"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Result Message */}
          {result && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.message}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || formData.selectedRecipients.length === 0}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
