/**
 * Code Diff Visualization Component
 * P2 Feature 18: Code Diff Visualization
 * 
 * Shows before/after code comparison
 */

'use client'

import React, { useState } from 'react'

interface CodeDiffProps {
  originalCode?: string
  modifiedCode?: string
  beforeCode?: string
  afterCode?: string
  language?: string
  theme?: string
  onClose?: () => void
}

export function CodeDiff({ beforeCode, afterCode, onClose }: CodeDiffProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')
  const [showDiff, setShowDiff] = useState(true)

  // Simple diff algorithm (line-by-line)
  const beforeLines = beforeCode.split('\n')
  const afterLines = afterCode.split('\n')
  
  const diffLines: Array<{
    type: 'added' | 'removed' | 'unchanged'
    beforeLine?: string
    afterLine?: string
    lineNumber: number
  }> = []

  const maxLines = Math.max(beforeLines.length, afterLines.length)
  
  for (let i = 0; i < maxLines; i++) {
    const beforeLine = beforeLines[i]
    const afterLine = afterLines[i]

    if (beforeLine === undefined && afterLine !== undefined) {
      diffLines.push({
        type: 'added',
        afterLine,
        lineNumber: i + 1
      })
    } else if (beforeLine !== undefined && afterLine === undefined) {
      diffLines.push({
        type: 'removed',
        beforeLine,
        lineNumber: i + 1
      })
    } else if (beforeLine === afterLine) {
      diffLines.push({
        type: 'unchanged',
        beforeLine,
        afterLine,
        lineNumber: i + 1
      })
    } else {
      diffLines.push({
        type: 'removed',
        beforeLine,
        lineNumber: i + 1
      })
      diffLines.push({
        type: 'added',
        afterLine,
        lineNumber: i + 1
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Code Changes</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'split' ? 'unified' : 'split')}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
              aria-label={`Switch to ${viewMode === 'split' ? 'unified' : 'split'} view`}
            >
              {viewMode === 'split' ? 'Unified' : 'Split'}
            </button>
            <button
              onClick={() => setShowDiff(!showDiff)}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
              aria-label={showDiff ? 'Show full code' : 'Show diff'}
            >
              {showDiff ? 'Full' : 'Diff'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                aria-label="Close diff view"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-auto p-4">
          {showDiff ? (
            viewMode === 'split' ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Before */}
                <div className="flex-1">
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 mb-2 rounded font-semibold text-sm">
                    Before
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-xs font-mono">
                    {diffLines.map((line, idx) => (
                      <div
                        key={idx}
                        className={line.type === 'removed' ? 'bg-red-900/50' : ''}
                      >
                        {line.beforeLine && (
                          <span className={line.type === 'removed' ? 'text-red-300' : 'text-gray-300'}>
                            {line.beforeLine}
                          </span>
                        )}
                      </div>
                    ))}
                  </pre>
                </div>

                {/* After */}
                <div className="flex-1">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 mb-2 rounded font-semibold text-sm">
                    After
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-xs font-mono">
                    {diffLines.map((line, idx) => (
                      <div
                        key={idx}
                        className={line.type === 'added' ? 'bg-green-900/50' : ''}
                      >
                        {line.afterLine && (
                          <span className={line.type === 'added' ? 'text-green-300' : 'text-gray-300'}>
                            {line.afterLine}
                          </span>
                        )}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto">
                <pre className="text-xs font-mono">
                  {diffLines.map((line, idx) => (
                    <div
                      key={idx}
                      className={`${
                        line.type === 'added'
                          ? 'bg-green-900/50 text-green-300'
                          : line.type === 'removed'
                          ? 'bg-red-900/50 text-red-300'
                          : 'text-gray-300'
                      }`}
                    >
                      {line.type === 'added' && '+'}
                      {line.type === 'removed' && '-'}
                      {line.type === 'unchanged' && ' '}
                      {' '}
                      {line.beforeLine || line.afterLine}
                    </div>
                  ))}
                </pre>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="bg-red-50 dark:bg-red-900/20 p-2 mb-2 rounded font-semibold text-sm">
                  Before
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-xs font-mono">
                  {before}
                </pre>
              </div>
              <div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 mb-2 rounded font-semibold text-sm">
                  After
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-xs font-mono">
                  {after}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <span className="text-red-600 dark:text-red-400">
              -{diffLines.filter(l => l.type === 'removed').length} lines
            </span>
            <span className="text-green-600 dark:text-green-400">
              +{diffLines.filter(l => l.type === 'added').length} lines
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {diffLines.filter(l => l.type === 'unchanged').length} unchanged
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}





