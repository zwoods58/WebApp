'use client'

import { useState, useEffect } from 'react'
import { Sparkles, CheckCircle2, Loader2, X } from 'lucide-react'

interface BuildingStep {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  message?: string
}

interface BuildingInterfaceProps {
  draftId: string
  onComplete: (previewUrl: string) => void
  onError: (error: string) => void
}

export default function BuildingInterface({ draftId, onComplete, onError }: BuildingInterfaceProps) {
  const [steps, setSteps] = useState<BuildingStep[]>([
    { id: '1', title: 'Analyzing your requirements', status: 'pending' },
    { id: '2', title: 'Designing your website structure', status: 'pending' },
    { id: '3', title: 'Generating HTML & CSS', status: 'pending' },
    { id: '4', title: 'Adding interactive features', status: 'pending' },
    { id: '5', title: 'Optimizing for mobile', status: 'pending' },
    { id: '6', title: 'Deploying preview', status: 'pending' },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    startBuilding()
  }, [draftId])

  const startBuilding = async () => {
    try {
      // Start generation process
      const response = await fetch('/api/ai-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId }),
      })

      if (!response.ok) {
        throw new Error('Failed to start generation')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response stream')
      }

      // Stream the generation progress
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'step') {
                // Update step status
                setSteps(prev => prev.map((step, idx) => {
                  if (idx === data.stepIndex) {
                    return {
                      ...step,
                      status: data.status,
                      message: data.message,
                    }
                  }
                  return step
                }))
                setCurrentStep(data.stepIndex)
              } else if (data.type === 'preview') {
                setPreviewUrl(data.url)
              } else if (data.type === 'complete') {
                setIsComplete(true)
                setSteps(prev => prev.map(step => ({
                  ...step,
                  status: step.status === 'in_progress' ? 'completed' : step.status
                })))
                onComplete(data.previewUrl)
              } else if (data.type === 'error') {
                throw new Error(data.message)
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Building error:', error)
      onError(error.message || 'Failed to build website')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex">
      {/* Left Panel - Chat/Progress */}
      <div className="w-1/2 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Building Your Website</h2>
            <button className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* AI Assistant Message */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white text-sm">
                  I'll build your website step by step. This will take a few moments...
                </p>
              </div>
            </div>
          </div>

          {/* Building Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                  ) : step.status === 'in_progress' ? (
                    <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className={`text-sm ${
                      step.status === 'completed' ? 'text-teal-400' :
                      step.status === 'in_progress' ? 'text-white' :
                      'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    {step.message && (
                      <p className="text-xs text-gray-500 mt-1">{step.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-teal-900/30 border border-teal-700 rounded-lg p-4">
                  <p className="text-teal-400 text-sm font-semibold">
                    Your website is ready! Check the preview on the right.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 flex flex-col bg-gray-950">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-400">Preview</h3>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 text-sm"
            >
              Open in new tab →
            </a>
          )}
        </div>
        
        <div className="flex-1 bg-white">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Website Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Generating preview...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


