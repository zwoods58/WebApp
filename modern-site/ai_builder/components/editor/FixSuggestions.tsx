/**
 * Fix Suggestions Component
 * P1 Feature 12: Contextual Fix Suggestions
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Lightbulb, X, Check } from 'lucide-react'
import { FixSuggestion } from '../../lib/fix-validation/fix-validator'

interface FixSuggestionsProps {
  code: string
  onApplyFix: (fix: FixSuggestion) => void
  onDismiss: () => void
}

export default function FixSuggestions({
  code,
  onApplyFix,
  onDismiss
}: FixSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<FixSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    // Would get suggestions from AI or static analysis
    // For now, empty array
    setSuggestions([])
  }, [code])

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="absolute top-4 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-semibold">Fix Suggestions</h3>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedIndex === index
                ? 'border-blue-500 bg-blue-900/20'
                : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white text-sm font-semibold mb-1">
                  {suggestion.explanation}
                </p>
                <p className="text-gray-400 text-xs">
                  {suggestion.targetFile} • Confidence: {Math.round(suggestion.confidence * 100)}%
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onApplyFix(suggestion)
                }}
                className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Apply fix"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
        <span>Press Ctrl+. for more options</span>
        <span>{selectedIndex + 1} of {suggestions.length}</span>
      </div>
    </div>
  )
}





