'use client'

import { useState, useEffect } from 'react'
import { X, Save, FileText } from 'lucide-react'

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  leadId: string
  leadName: string
  initialNotes?: string
  onSave: (notes: string) => void
}

export default function NotesModal({
  isOpen,
  onClose,
  leadId,
  leadName,
  initialNotes = '',
  onSave
}: NotesModalProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setNotes(initialNotes)
  }, [initialNotes])

  if (!isOpen) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(notes)
      onClose()
    } catch (error) {
      console.error('Error saving notes:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTimestamp = () => {
    const timestamp = new Date().toLocaleString()
    setNotes(prev => `${prev}\n\n[${timestamp}]\n`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Call Notes</h2>
              <p className="text-sm text-slate-400">{leadName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleAddTimestamp}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Timestamp
            </button>
          </div>
          
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your call notes here...

Example:
[10/13/2025 3:45 PM]
- Called lead, reached voicemail
- Left message about our services
- Follow up in 2 days

[10/15/2025 10:30 AM]
- Lead called back, interested in demo
- Scheduled appointment for 10/20
- Send proposal before meeting"
            className="w-full h-80 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          />
          
          <p className="mt-2 text-xs text-slate-400">
            Tip: Use timestamps to track your conversations and next steps
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  )
}

