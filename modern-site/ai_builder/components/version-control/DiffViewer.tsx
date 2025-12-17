/**
 * Diff Viewer Component
 * P1 Feature 10: Enhanced Version Control - Diff Viewer
 */

'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, GitBranch, GitMerge, X } from 'lucide-react'
import DiffEditor from '../editor/DiffEditor'

interface Version {
  id: string
  version: number
  code: string
  description?: string
  createdAt: Date
}

interface DiffViewerProps {
  versions: Version[]
  currentVersion: number
  onRestore?: (version: number) => void
  onClose?: () => void
}

export default function DiffViewer({
  versions,
  currentVersion,
  onRestore,
  onClose
}: DiffViewerProps) {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')

  const currentVersionData = versions.find(v => v.version === currentVersion)
  const selectedVersionData = selectedVersion
    ? versions.find(v => v.version === selectedVersion)
    : null

  const handleCompare = (version: number) => {
    setSelectedVersion(version)
  }

  const handleRestore = () => {
    if (selectedVersion && onRestore) {
      onRestore(selectedVersion)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-white font-semibold">Version History</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'split' ? 'unified' : 'split')}
            className="px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            {viewMode === 'split' ? 'Unified' : 'Split'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Version List */}
        <div className="w-64 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                onClick={() => handleCompare(version.version)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  version.version === currentVersion
                    ? 'bg-blue-900/30 border border-blue-700'
                    : selectedVersion === version.version
                    ? 'bg-gray-800 border border-gray-600'
                    : 'bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">v{version.version}</span>
                  {version.version === currentVersion && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                {version.description && (
                  <p className="text-gray-400 text-xs mt-1">{version.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(version.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Diff View */}
        <div className="flex-1 flex flex-col">
          {selectedVersionData && currentVersionData ? (
            <>
              <div className="px-4 py-2 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-semibold">v{selectedVersion}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                    <span className="text-green-400 font-semibold">v{currentVersion}</span>
                  </div>
                </div>
                <button
                  onClick={handleRestore}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Restore This Version
                </button>
              </div>
              <div className="flex-1">
                <DiffEditor
                  originalCode={selectedVersionData.code}
                  modifiedCode={currentVersionData.code}
                  language="typescript"
                  theme="vs-dark"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a version to compare
            </div>
          )}
        </div>
      </div>
    </div>
  )
}





