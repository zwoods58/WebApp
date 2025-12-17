'use client'

import { useState, useEffect } from 'react'
import { Sparkles, CheckCircle2, Loader2, X, ExternalLink } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../../src/lib/supabase'

interface BuildingStep {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  message?: string
}

export default function BuildingPage() {
  const router = useRouter()
  const params = useParams()
  const draftId = params.draftId as string

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
  const [error, setError] = useState<string | null>(null)
  const [projectName, setProjectName] = useState<string>('')

  const loadProjectName = async () => {
    try {
      const { data } = await supabase
        .from('draft_projects')
        .select('business_name')
        .eq('id', draftId)
        .single()
      
      if (data) {
        setProjectName(data.business_name)
      }
    } catch (err) {
      console.error('Error loading project name:', err)
    }
  }

  const startBuilding = async () => {
    try {
      const response = await fetch('/api/ai-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start generation')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response stream')
      }

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
                setPreviewUrl(data.previewUrl)
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Generation failed')
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Building error:', error)
      setError(error.message || 'Failed to build website')
      setSteps(prev => prev.map(step => ({
        ...step,
        status: step.status === 'in_progress' ? 'error' : step.status
      })))
    }
  }

  const handleGoToDashboard = () => {
    router.push('/ai-builder/dashboard')
  }

  useEffect(() => {
    if (draftId) {
      startBuilding()
      loadProjectName()
    }
  }, [draftId])

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoToDashboard}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">{projectName || 'Building Your Website'}</h1>
            <p className="text-sm text-gray-400">AI Website Builder</p>
          </div>
        </div>
        {previewUrl && (
          <a
            href={previewUrl}
            rel="noopener noreferrer"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all flex items-center gap-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Open Preview
          </a>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-800 flex flex-col bg-gray-900">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-white text-sm">
                    {isComplete 
                      ? 'Your website is ready! Check the preview on the right.'
                      : 'I\'ll build your website step by step. This will take a few moments...'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    ) : step.status === 'in_progress' ? (
                      <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
                    ) : step.status === 'error' ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-lg p-4 ${
                      step.status === 'completed' ? 'bg-teal-900/30 border border-teal-700' :
                      step.status === 'in_progress' ? 'bg-gray-800' :
                      step.status === 'error' ? 'bg-red-900/30 border border-red-700' :
                      'bg-gray-800'
                    }`}>
                      <p className={`text-sm ${
                        step.status === 'completed' ? 'text-teal-400' :
                        step.status === 'in_progress' ? 'text-white' :
                        step.status === 'error' ? 'text-red-400' :
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

            {error && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <p className="text-red-400 text-sm font-semibold">
                      Error: {error}
                    </p>
                    <button
                      onClick={() => router.push('/ai-builder/dashboard')}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isComplete && !error && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-teal-900/30 border border-teal-700 rounded-lg p-4">
                    <p className="text-teal-400 text-sm font-semibold mb-3">
                      Your website is ready! Check the preview on the right.
                    </p>
                    <button
                      onClick={handleGoToDashboard}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all"
                    >
                      View in Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-gray-950">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400">Preview</h3>
            {previewUrl && (
              <a
                href={previewUrl}
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
              >
                Open in new tab
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          
          <div className="flex-1 bg-white relative">
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
                  {currentStep > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      {steps[currentStep]?.title}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
