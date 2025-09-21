'use client'

import { useState } from 'react'
import { Check, X, Trash2, Edit, Mail, Download, MoreHorizontal } from 'lucide-react'

interface BulkOperationsProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: (selected: boolean) => void
  onClearSelection: () => void
  onBulkAction: (action: string, items: string[]) => void
  availableActions?: Array<{
    id: string
    label: string
    icon: React.ComponentType<any>
    color: string
    confirmMessage?: string
  }>
  className?: string
}

export default function BulkOperations({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  onBulkAction,
  availableActions = [
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      color: 'text-red-600 hover:text-red-800',
      confirmMessage: 'Are you sure you want to delete the selected items?'
    },
    {
      id: 'edit',
      label: 'Edit Selected',
      icon: Edit,
      color: 'text-blue-600 hover:text-blue-800'
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: Mail,
      color: 'text-green-600 hover:text-green-800'
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: Download,
      color: 'text-purple-600 hover:text-purple-800'
    }
  ],
  className = ""
}: BulkOperationsProps) {
  const [showActions, setShowActions] = useState(false)

  const handleBulkAction = (actionId: string) => {
    const action = availableActions.find(a => a.id === actionId)
    if (!action) return

    if (action.confirmMessage) {
      if (!confirm(action.confirmMessage)) return
    }

    onBulkAction(actionId, selectedItems)
    setShowActions(false)
  }

  if (selectedItems.length === 0) {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={false}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Select all {totalItems} items
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedItems.length === totalItems}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm font-medium text-blue-900">
            {selectedItems.length} of {totalItems} items selected
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClearSelection}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </button>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Actions
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {availableActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleBulkAction(action.id)}
                        className={`w-full flex items-center px-4 py-2 text-sm ${action.color} hover:bg-gray-50`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
