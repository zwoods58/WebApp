/**
 * Auto Fix Proposal Component
 * P1 Feature 8: User Feedback Loop - Fix Presentation UI
 */

'use client'

import React, { useState } from 'react'
import { AlertCircle, CheckCircle, X, Eye, EyeOff, Sparkles } from 'lucide-react'
import { CodeDiff } from '../../preview/CodeDiff'
import { FixSuggestion } from '../../lib/fix-validation/fix-validator'

interface AutoFixProposalProps {
  fix: FixSuggestion
  onAccept: (fix: FixSuggestion) => void
  onReject: (fix: FixSuggestion) => void
  onModify?: (fix: FixSuggestion) => void
}

export default function AutoFixProposal({
  fix,
  onAccept,
  onReject,
  onModify
}: AutoFixProposalProps) {
  const [showingDiff, setShowingDiff] = useState(true)
  const [rating, setRating] = useState<number | null>(null)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Proposed Fix</h3>
            <p className="text-gray-400 text-sm">
              {fix.fixType} • {fix.targetFile}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(fix.confidence)} bg-gray-700/50`}>
          {getConfidenceBadge(fix.confidence)} Confidence ({Math.round(fix.confidence * 100)}%)
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-4">
        <p className="text-gray-300">{fix.explanation}</p>
      </div>

      {/* Diff Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowingDiff(!showingDiff)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          {showingDiff ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showingDiff ? 'Hide' : 'Show'} Code Diff
        </button>
      </div>

      {/* Diff Viewer */}
      {showingDiff && fix.oldCode && (
        <div className="mb-4 border border-gray-700 rounded-lg overflow-hidden">
          <CodeDiff
            originalCode={fix.oldCode}
            modifiedCode={fix.newCode}
            language="typescript"
          />
        </div>
      )}

      {/* Warning for low confidence */}
      {fix.confidence < 0.7 && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm">Medium Confidence Fix</p>
              <p className="text-yellow-300/80 text-sm mt-1">
                This fix has medium confidence. Please review carefully before applying.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onAccept(fix)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Apply Fix
        </button>
        {onModify && (
          <button
            onClick={() => onModify(fix)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Modify
          </button>
        )}
        <button
          onClick={() => onReject(fix)}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
      </div>

      {/* Rating (optional) */}
      {rating !== null && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Rate this fix:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}





