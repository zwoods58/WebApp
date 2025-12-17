/**
 * Enhanced Code Editor Component
 * P0 Feature 1: Enhanced Code Editor
 * 
 * Monaco Editor with IntelliSense, multi-file tabs, diff editor, and more
 */

'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { X, FileText, Search, Settings, Maximize2, Minimize2 } from 'lucide-react'

interface File {
  id: string
  path: string
  content: string
  language: string
  isModified?: boolean
}

interface EnhancedCodeEditorProps {
  files: File[]
  onFileChange: (fileId: string, content: string) => void
  onFileClose?: (fileId: string) => void
  onFileCreate?: (path: string) => void
  theme?: 'vs-dark' | 'light'
  readOnly?: boolean
}

export default function EnhancedCodeEditor({
  files,
  onFileChange,
  onFileClose,
  onFileCreate,
  theme = 'vs-dark',
  readOnly = false
}: EnhancedCodeEditorProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(files[0]?.id || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on' as 'on' | 'off' | 'wordWrapColumn',
    minimap: true,
    lineNumbers: 'on' as 'on' | 'off' | 'relative',
    formatOnSave: true,
    formatOnType: true
  })

  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)

  const activeFile = files.find(f => f.id === activeFileId)

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Configure IntelliSense
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    })

    // Add React types
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' { export = React; }`,
      'react.d.ts'
    )

    // Keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      setShowSearch(true)
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, (e: any) => {
      e.preventDefault()
      if (editorSettings.formatOnSave && activeFile) {
        editor.getAction('editor.action.formatDocument')?.run()
      }
    })

    // Emmet support (basic)
    editor.addCommand(monaco.KeyCode.Tab, () => {
      const model = editor.getModel()
      const selection = editor.getSelection()
      if (model && selection) {
        const text = model.getValueInRange(selection)
        // Basic Emmet expansion (can be enhanced)
        if (text.match(/^div$/)) {
          editor.executeEdits('emmet', [{
            range: selection,
            text: '<div></div>'
          }])
        }
      }
    })
  }, [activeFile, editorSettings.formatOnSave])

  // Format code
  const formatCode = useCallback(() => {
    if (editorRef.current && activeFile) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
    }
  }, [activeFile])

  // Find and replace
  const handleFind = useCallback(() => {
    setShowSearch(true)
    if (editorRef.current) {
      editorRef.current.getAction('actions.find')?.run()
    }
  }, [])

  // Close file
  const handleCloseFile = useCallback((fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onFileClose) {
      onFileClose(fileId)
    }
    if (activeFileId === fileId && files.length > 1) {
      const nextFile = files.find(f => f.id !== fileId)
      setActiveFileId(nextFile?.id || null)
    }
  }, [activeFileId, files, onFileClose])

  return (
    <div className={`flex flex-col h-full bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {/* File Tabs */}
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t cursor-pointer transition-colors ${
                activeFileId === file.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm whitespace-nowrap">{file.path}</span>
              {file.isModified && <span className="w-2 h-2 bg-yellow-500 rounded-full" />}
              {onFileClose && files.length > 1 && (
                <button
                  onClick={(e) => handleCloseFile(file.id, e)}
                  className="ml-1 hover:bg-gray-600 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {onFileCreate && (
            <button
              onClick={() => onFileCreate('new-file.tsx')}
              className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-t"
            >
              + New File
            </button>
          )}
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleFind}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title="Find (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={formatCode}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title="Format Code"
          >
            Format
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme={theme}
            onChange={(value) => {
              if (activeFileId && value !== undefined) {
                onFileChange(activeFileId, value)
              }
            }}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              fontSize: editorSettings.fontSize,
              tabSize: editorSettings.tabSize,
              wordWrap: editorSettings.wordWrap,
              minimap: { enabled: editorSettings.minimap },
              lineNumbers: editorSettings.lineNumbers,
              formatOnPaste: editorSettings.formatOnType,
              formatOnType: editorSettings.formatOnType,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              acceptSuggestionOnCommitCharacter: true,
              acceptSuggestionOnEnter: 'on',
              snippetSuggestions: 'top',
              tabCompletion: 'on',
              wordBasedSuggestions: 'allDocuments',
              multiCursorModifier: 'ctrlCmd',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No file selected
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-12 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 z-10 min-w-[300px]">
          <h3 className="text-white font-semibold mb-4">Editor Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-gray-300 text-sm">Font Size</label>
              <input
                type="number"
                value={editorSettings.fontSize}
                onChange={(e) => setEditorSettings({ ...editorSettings, fontSize: parseInt(e.target.value) })}
                className="w-full mt-1 px-2 py-1 bg-gray-700 text-white rounded"
                min="10"
                max="24"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Tab Size</label>
              <input
                type="number"
                value={editorSettings.tabSize}
                onChange={(e) => setEditorSettings({ ...editorSettings, tabSize: parseInt(e.target.value) })}
                className="w-full mt-1 px-2 py-1 bg-gray-700 text-white rounded"
                min="1"
                max="8"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input
                  type="checkbox"
                  checked={editorSettings.minimap}
                  onChange={(e) => setEditorSettings({ ...editorSettings, minimap: e.target.checked })}
                />
                Show Minimap
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input
                  type="checkbox"
                  checked={editorSettings.formatOnSave}
                  onChange={(e) => setEditorSettings({ ...editorSettings, formatOnSave: e.target.checked })}
                />
                Format on Save
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input
                  type="checkbox"
                  checked={editorSettings.formatOnType}
                  onChange={(e) => setEditorSettings({ ...editorSettings, formatOnType: e.target.checked })}
                />
                Format on Type
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}





