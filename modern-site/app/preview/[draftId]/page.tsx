'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { ToastProvider } from '../../../ai_builder/lib/ux/toast-notifications'
import { ThemeProvider } from '../../../ai_builder/lib/theme/dark-mode'

// Dynamically import the component renderer from ai_builder/preview (client-side only)
// Fix: Ensure default export is properly handled for self-healing error boundary
const ComponentRenderer = dynamic(() => 
  import('../../../ai_builder/preview/ComponentRenderer').then(mod => ({ 
    default: mod.default || mod 
  })), 
  { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading preview...</p>
      </div>
    </div>
  )
  }
)

export default function PreviewPage() {
  const params = useParams()
  const draftId = params.draftId as string
  const [componentCode, setComponentCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Handle code updates from self-healing
  const handleCodeUpdate = async (newCode: string) => {
    try {
      // Update code in database
      const response = await fetch(`/api/ai-builder/preview-data/${draftId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentCode: newCode,
        }),
      })
      
      if (response.ok) {
        setComponentCode(newCode)
        console.log('✅ Code updated in database')
      }
    } catch (err) {
      console.error('Failed to update code in database:', err)
      // Still update local state even if DB update fails
      setComponentCode(newCode)
    }
  }

  useEffect(() => {
    async function loadPreview() {
      try {
        const response = await fetch(`/api/ai-builder/preview-data/${draftId}`)
        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.expired) {
            setError('Preview expired')
            setLoading(false)
            return
          }
          throw new Error('Failed to load preview')
        }
        const data = await response.json()
        setComponentCode(data.componentCode || data.htmlCode) // Fallback to htmlCode for backward compatibility
        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'Failed to load preview')
        setLoading(false)
      }
    }

    if (draftId) {
      loadPreview()
      
      // P0 Feature 3: Real-time preview updates via SSE
      const eventSource = new EventSource(`/api/ai-builder/live-preview?draftId=${draftId}`)
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'code_update' && data.code) {
            console.log('🔄 Real-time code update received')
            setComponentCode(data.code)
            // Code will auto-update via ComponentRenderer
          } else if (data.type === 'connected') {
            console.log('✅ Connected to live preview stream')
          } else if (data.type === 'heartbeat') {
            // Keep connection alive
          }
        } catch (e) {
          console.error('Error parsing SSE message:', e)
        }
      }
      
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        // Don't close on error - EventSource will auto-reconnect
      }
      
      return () => {
        eventSource.close()
      }
    }
  }, [draftId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview {error === 'Preview expired' ? 'Expired' : 'Error'}</h1>
          <p className="text-gray-600 mb-4">
            {error === 'Preview expired' 
              ? 'This preview link has expired. Please upgrade to Pro for unlimited preview access.'
              : error}
          </p>
          <a 
            href="/ai-builder/dashboard" 
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (!componentCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Preview not available</p>
          <a 
            href="/ai-builder/dashboard" 
            className="text-teal-600 hover:underline"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <ComponentRenderer 
          componentCode={componentCode} 
          onCodeUpdate={handleCodeUpdate}
          draftId={draftId}
        />
      </ToastProvider>
    </ThemeProvider>
  )
}
