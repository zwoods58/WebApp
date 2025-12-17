/**
 * Enhanced Live Preview Component
 * P0 Feature 2: Enhanced Live Preview
 * 
 * Preview with bundling, console capture, network inspection, and responsive breakpoints
 */

'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Monitor, Tablet, Smartphone, Terminal, Network, X, Maximize2 } from 'lucide-react'
import { bundleCode } from '../../lib/preview/bundler'
import { getConsoleCapture, ConsoleMessage } from '../../lib/preview/console-capture'
import { getNetworkInspector, NetworkRequest } from '../../lib/preview/network-inspector'

interface EnhancedPreviewProps {
  code: string
  files?: Record<string, string>
  theme?: 'light' | 'dark'
  onError?: (error: Error) => void
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile'
type PanelType = 'console' | 'network' | null

export default function EnhancedPreview({
  code,
  files = {},
  theme = 'dark',
  onError
}: EnhancedPreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop')
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([])
  const [bundledCode, setBundledCode] = useState<string>('')
  const [isBundling, setIsBundling] = useState(false)
  const [bundleError, setBundleError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const consoleCapture = getConsoleCapture()
  const networkInspector = typeof window !== 'undefined' ? getNetworkInspector() : null

  // Bundle code when it changes
  useEffect(() => {
    const bundle = async () => {
      setIsBundling(true)
      setBundleError(null)

      try {
        const allFiles = {
          'index.tsx': code,
          ...files
        }

        const result = await bundleCode({
          entryPoint: 'index.tsx',
          files: allFiles,
          format: 'iife',
          minify: false,
          sourcemap: true
        })

        if (result.errors.length > 0) {
          setBundleError(result.errors.map(e => e.text).join('\n'))
          onError?.(new Error(result.errors[0].text))
        } else {
          setBundledCode(result.code)
        }
      } catch (error: any) {
        setBundleError(error.message)
        onError?.(error)
      } finally {
        setIsBundling(false)
      }
    }

    bundle()
  }, [code, files, onError])

  // Setup console capture
  useEffect(() => {
    if (typeof window === 'undefined') return

    consoleCapture.start()
    const unsubscribe = consoleCapture.onMessage((message) => {
      setConsoleMessages(prev => [...prev, message].slice(-100)) // Keep last 100
    })

    return () => {
      unsubscribe()
      consoleCapture.stop()
    }
  }, [])

  // Setup network inspector
  useEffect(() => {
    if (typeof window === 'undefined' || !networkInspector) return

    networkInspector.start()
    const unsubscribe = networkInspector.onRequest((request) => {
      setNetworkRequests(prev => [...prev, request].slice(-100)) // Keep last 100
    })

    return () => {
      unsubscribe()
      networkInspector.stop()
    }
  }, [])

  // Inject bundled code into iframe
  useEffect(() => {
    if (!bundledCode || !iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    // Clear previous content
    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          ${bundledCode}
        </script>
      </body>
      </html>
    `)
    iframeDoc.close()
  }, [bundledCode])

  const previewWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  }

  const clearConsole = useCallback(() => {
    consoleCapture.clear()
    setConsoleMessages([])
  }, [])

  const clearNetwork = useCallback(() => {
    if (networkInspector) {
      networkInspector.clear()
      setNetworkRequests([])
    }
  }, [networkInspector])

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {/* Responsive Breakpoints */}
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Desktop (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode('tablet')}
            className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Console Toggle */}
          <button
            onClick={() => setActivePanel(activePanel === 'console' ? null : 'console')}
            className={`px-3 py-1.5 rounded text-sm ${
              activePanel === 'console' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Terminal className="w-4 h-4 inline mr-1" />
            Console ({consoleMessages.length})
          </button>

          {/* Network Toggle */}
          <button
            onClick={() => setActivePanel(activePanel === 'network' ? null : 'network')}
            className={`px-3 py-1.5 rounded text-sm ${
              activePanel === 'network' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Network className="w-4 h-4 inline mr-1" />
            Network ({networkRequests.length})
          </button>

          {isBundling && (
            <span className="text-yellow-400 text-sm">Bundling...</span>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 flex items-center justify-center bg-gray-800 p-4 overflow-auto">
          <div
            style={{
              width: previewWidths[previewMode],
              maxWidth: '100%',
              height: '100%',
              border: '1px solid #374151',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Preview"
            />
          </div>
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <h3 className="text-white font-semibold">
                {activePanel === 'console' ? 'Console' : 'Network'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={activePanel === 'console' ? clearConsole : clearNetwork}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {activePanel === 'console' ? (
                <div className="space-y-1">
                  {consoleMessages.length === 0 ? (
                    <div className="text-gray-500 text-sm">No console messages</div>
                  ) : (
                    consoleMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`text-xs font-mono p-2 rounded ${
                          msg.type === 'error'
                            ? 'bg-red-900/20 text-red-300'
                            : msg.type === 'warn'
                            ? 'bg-yellow-900/20 text-yellow-300'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">[{msg.type.toUpperCase()}]</span>
                          <span>{msg.message}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {networkRequests.length === 0 ? (
                    <div className="text-gray-500 text-sm">No network requests</div>
                  ) : (
                    networkRequests.map((req) => (
                      <div
                        key={req.id}
                        className={`p-2 rounded text-xs ${
                          req.error || (req.status && req.status >= 400)
                            ? 'bg-red-900/20 border border-red-700'
                            : 'bg-gray-800 border border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded ${
                              req.method === 'GET'
                                ? 'bg-blue-600'
                                : req.method === 'POST'
                                ? 'bg-green-600'
                                : 'bg-gray-600'
                            } text-white text-xs`}
                          >
                            {req.method}
                          </span>
                          <span className="text-gray-300 truncate flex-1">{req.url}</span>
                          {req.status && (
                            <span
                              className={`px-2 py-0.5 rounded ${
                                req.status >= 400 ? 'bg-red-600' : 'bg-green-600'
                              } text-white text-xs`}
                            >
                              {req.status}
                            </span>
                          )}
                        </div>
                        {req.duration && (
                          <div className="text-gray-500 mt-1">{req.duration}ms</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bundle Error Display */}
      {bundleError && (
        <div className="bg-red-900/20 border-t border-red-700 p-4">
          <div className="text-red-300 text-sm font-mono whitespace-pre-wrap">
            {bundleError}
          </div>
        </div>
      )}
    </div>
  )
}





