'use client'

import { useState } from 'react'

export default function TestImport() {
  const [mode, setMode] = useState<'file' | 'text'>('file')

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Test Import Component</h2>
        <p className="text-slate-300 mb-4">This is a test component to verify deployment.</p>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setMode('file')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'file'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Paste from Google Sheets
          </button>
        </div>
        
        {mode === 'text' && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-white mb-2">Google Sheets Text Area</h3>
            <textarea
              placeholder="Paste your Google Sheets data here..."
              className="w-full h-32 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400"
            />
            <p className="text-sm text-slate-400 mt-2">
              ✅ Google Sheets text area is working! Mode: {mode}
            </p>
          </div>
        )}
        
        {mode === 'file' && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-white mb-2">File Upload</h3>
            <p className="text-slate-300">File upload mode selected.</p>
          </div>
        )}
      </div>
    </div>
  )
}


