/**
 * Diff Editor Component
 * Shows side-by-side code comparison
 */

'use client'

import React from 'react'
import Editor from '@monaco-editor/react'

interface DiffEditorProps {
  originalCode: string
  modifiedCode: string
  language?: string
  theme?: 'vs-dark' | 'light'
  onClose?: () => void
}

export default function DiffEditor({
  originalCode,
  modifiedCode,
  language = 'typescript',
  theme = 'vs-dark',
  onClose
}: DiffEditorProps) {
  return (
    <div className="h-full w-full relative">
      <Editor
        height="100%"
        language={language}
        theme={theme}
        original={originalCode}
        modified={modifiedCode}
        options={{
          readOnly: true,
          renderSideBySide: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          diffWordWrap: 'on',
          renderIndicators: true,
          originalEditable: false,
          modifiedEditable: false
        }}
      />
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-3 py-1.5 bg-gray-800 text-white rounded hover:bg-gray-700 z-10"
        >
          Close Diff
        </button>
      )}
    </div>
  )
}





