/**
 * Fix Preview Component
 * P2 Feature 23: Fix Preview System
 */

'use client'

import React, { useState } from 'react'
import { CheckCircle, X, Eye } from 'lucide-react'
import { CodeDiff } from '../../preview/CodeDiff'
import { FixSuggestion } from '../../lib/fix-validation/fix-validator'

interface FixPreviewProps {
  fix: FixSuggestion
  onApply: (fix: FixSuggestion) => void
  onReject: () => void
  onClose: () => void
}

export default function FixPreview({
  fix,
  onApply,
  onReject,
  onClose
}: FixPreviewProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-xl">Preview Fix</h2>
            <p className="text-gray-400 text-sm mt-1">{fix.explanation}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'split' ? 'unified' : 'split')}
              className="px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              {viewMode === 'split' ? 'Unified' : 'Split'} View
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diff Viewer */}
        <div className="flex-1 overflow-hidden">
          {fix.oldCode ? (
            <CodeDiff
              originalCode={fix.oldCode}
              modifiedCode={fix.newCode}
              language="typescript"
            />
          ) : (
            <div className="p-6 text-gray-400">
              <p>No previous code to compare</p>
              <pre className="mt-4 bg-gray-800 p-4 rounded overflow-auto">
                <code>{fix.newCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Confidence: <span className="text-white font-semibold">{Math.round(fix.confidence * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onReject}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onApply(fix)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Apply Fix
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}





