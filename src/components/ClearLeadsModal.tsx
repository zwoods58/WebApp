'use client'

import { useState } from 'react'
import { AlertTriangle, X, Trash2 } from 'lucide-react'

interface ClearLeadsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  leadCount: number
}

export default function ClearLeadsModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  leadCount 
}: ClearLeadsModalProps) {
  const [isClearing, setIsClearing] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsClearing(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error clearing leads:', error)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-red-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">Clear All Leads</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            disabled={isClearing}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-300 mb-4">
            Are you sure you want to clear all leads? This action cannot be undone.
          </p>
          
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-400 mb-2">
              <Trash2 className="h-4 w-4" />
              <span className="font-medium">Warning</span>
            </div>
            <p className="text-red-300 text-sm">
              This will permanently delete <strong>{leadCount} leads</strong> from the system.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isClearing}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isClearing}
            className="btn-danger flex-1 flex items-center justify-center space-x-2"
          >
            {isClearing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Clearing...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Clear All Leads</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
