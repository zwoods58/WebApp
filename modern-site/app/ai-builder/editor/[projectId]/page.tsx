'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../../src/lib/supabase'
import { getFastAccount, getFastUser, getFastAccessToken } from '../../../../src/lib/fast-auth'
import { canRegenerateDraft, hasFeatureAccess, hasCodeAccess as checkCodeAccess } from '../../../../src/lib/account-tiers'
import { 
  Send, Sparkles, Maximize2, Minimize2, RefreshCw, ArrowLeft, 
  Copy, Undo, Redo, Save, Settings, Monitor, Tablet, Smartphone,
  ZoomIn, ZoomOut, RotateCw, Download, Share2, Camera, Code, FileText,
  Search, HelpCircle, Command, X, CheckCircle2, AlertCircle, Info,
  Palette, Sun, Moon, ChevronRight, ChevronLeft, GripVertical,
  Eye, Github, Lock, Plus, Clock, Brain, Loader2, BookOpen,
  Globe, BarChart3, Database, Shield, Key, Users, Folder, Lightbulb,
  Terminal, Rocket, ChevronDown, Circle, Zap, TrendingUp, Calendar,
  Play, Square, ChevronUp, FileCode, Image, Video, Music, Archive,
  Filter, Layers, Package, Server, Cloud, Wifi, HardDrive, Cpu
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import UpgradeModal from '../../components/UpgradeModal'
import dynamic from 'next/dynamic'

// Dynamically import Monaco editor (client-side only)
const CodeEditor = dynamic(() => import('./components/CodeEditor'), { ssr: false })

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isThinking?: boolean
}

interface PlanStep {
  id: string
  text: string
  status: 'pending' | 'thinking' | 'completed'
}

interface StatusCard {
  id: string
  type: 'success' | 'info' | 'warning'
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  
  const [project, setProject] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'search'>('preview')
  const [chatWidth, setChatWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'project' | 'personal'>('project')
  const [isThinking, setIsThinking] = useState(false)
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([])
  const [showPlan, setShowPlan] = useState(false)
  const [statusCards, setStatusCards] = useState<StatusCard[]>([])
  const [showCodeViewer, setShowCodeViewer] = useState(false)
  const [codeContent, setCodeContent] = useState<string>('')
  const [showFileExplorer, setShowFileExplorer] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandSearch, setCommandSearch] = useState('')
  const [previewZoom, setPreviewZoom] = useState(100)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [regenerationCount, setRegenerationCount] = useState(0)
  const [previewExpiresAt, setPreviewExpiresAt] = useState<string | null>(null)
  const [terminalTab, setTerminalTab] = useState<'terminal' | 'problems' | 'output' | 'debug' | 'ports'>('terminal')
  const [projectStats, setProjectStats] = useState({ views: 0, edits: 0, lastModified: '' })
  const [showPaywall, setShowPaywall] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeContext, setUpgradeContext] = useState<'publish' | 'code' | 'terminal' | 'general'>('general')
  const [hasCodeAccess, setHasCodeAccess] = useState(false)
  const [editedCode, setEditedCode] = useState<string>('')
  const [currentFile, setCurrentFile] = useState<string>('index.html')
  const [fileContent, setFileContent] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<Array<{ htmlCode: string; timestamp: number }>>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [versions, setVersions] = useState<Array<{ id: string; created_at: string }>>([])
  const [showVersions, setShowVersions] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<Array<{ command: string; output: string; timestamp: number }>>([])
  const [assets, setAssets] = useState<Array<{ name: string; url: string; type: string; size?: number; uploadedAt?: string }>>([])
  const [seoData, setSeoData] = useState<any>(null)
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [pages, setPages] = useState<Array<{ id: string; name: string; slug: string; htmlCode?: string }>>([])
  const [currentPageId, setCurrentPageId] = useState<string>('index')
  const [showAssetLibrary, setShowAssetLibrary] = useState(false)
  const [uploadingAsset, setUploadingAsset] = useState(false)
  
  // Build progress state (bolt.new style)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildSteps, setBuildSteps] = useState<Array<{
    id: string
    title: string
    status: 'pending' | 'in_progress' | 'completed' | 'error'
    message?: string
  }>>([
    { id: '0', title: 'Analyzing your requirements', status: 'pending' },
    { id: '1', title: 'Designing your website structure', status: 'pending' },
    { id: '2', title: 'Generating HTML & CSS', status: 'pending' },
    { id: '3', title: 'Adding interactive features', status: 'pending' },
    { id: '4', title: 'Optimizing for mobile', status: 'pending' },
    { id: '5', title: 'Deploying preview', status: 'pending' },
  ])
  const [currentBuildStep, setCurrentBuildStep] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLIFrameElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const fileExplorerRef = useRef<HTMLDivElement>(null)

  // Suggested prompts
  const suggestedPrompts = [
    "Change the header color to blue",
    "Add a contact form",
    "Make the text larger",
    "Add a hero section",
    "Change the font style",
    "Add social media links",
    "Make it more modern",
    "Add a pricing section"
  ]

  // File structure (mock for now)
  const fileStructure = [
    { name: 'index.html', type: 'file', icon: FileCode },
    { name: 'styles.css', type: 'file', icon: FileCode },
    { name: 'script.js', type: 'file', icon: FileCode },
    { name: 'assets', type: 'folder', icon: Folder, children: [
      { name: 'images', type: 'folder', icon: Folder },
      { name: 'fonts', type: 'folder', icon: Folder }
    ]}
  ]

  useEffect(() => {
    loadProject()
  }, [projectId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking, planSteps])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = e.clientX
      if (newWidth >= 300 && newWidth <= 600) {
        setChatWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  useEffect(() => {
    if (projectId) {
      const saved = localStorage.getItem(`chat_history_${projectId}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setMessages(parsed)
        } catch (e) {
          console.error('Error loading chat history:', e)
        }
      }
    }
  }, [projectId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setShowShortcuts(true)
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false)
        setShowShortcuts(false)
        setShowSettings(false)
        setShowPaywall(null)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const startBuilding = async () => {
    if (isBuilding) return
    
    setIsBuilding(true)
    setBuildSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })))
    setCurrentBuildStep(0)
    
    // Add initial build message
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🚀 Starting to build your website... This will take a few moments.',
      timestamp: Date.now()
    }])

    try {
      const response = await fetch('/api/ai-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId: projectId }),
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
                setBuildSteps(prev => prev.map((step, idx) => {
                  if (idx === data.stepIndex) {
                    return {
                      ...step,
                      status: data.status,
                      message: data.message,
                    }
                  }
                  return step
                }))
                setCurrentBuildStep(data.stepIndex)
                
                // Add progress message to chat
                if (data.message) {
                  setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message,
                    timestamp: Date.now()
                  }])
                }
              } else if (data.type === 'preview') {
                setPreviewUrl(data.url)
              } else if (data.type === 'complete') {
                setIsBuilding(false)
                setBuildSteps(prev => prev.map(step => ({
                  ...step,
                  status: step.status === 'in_progress' ? 'completed' as const : step.status
                })))
                setPreviewUrl(data.previewUrl)
                
                // Reload project to get updated data
                loadProject()
                
                // Add completion message
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: '✅ Your website is ready! Check the preview on the right.',
                  timestamp: Date.now()
                }])
              } else if (data.type === 'error') {
                setIsBuilding(false)
                setBuildSteps(prev => prev.map(step => ({
                  ...step,
                  status: step.status === 'in_progress' ? 'error' as const : step.status
                })))
                const errorMessage = data.error || 'Generation failed'
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: `❌ Error: ${errorMessage}`,
                  timestamp: Date.now()
                }])
                // Don't throw - just show the error message
                return
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
              setIsBuilding(false)
              setBuildSteps(prev => prev.map(step => ({
                ...step,
                status: step.status === 'in_progress' ? 'error' as const : step.status
              })))
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Error: ${e instanceof Error ? e.message : 'Failed to parse response. Please check your API keys in .env.local'}`,
                timestamp: Date.now()
              }])
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Building error:', error)
      setIsBuilding(false)
      setBuildSteps(prev => prev.map(step => ({
        ...step,
        status: step.status === 'in_progress' ? 'error' as const : step.status
      })))
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${error.message || 'Failed to build website'}`,
        timestamp: Date.now()
      }])
    }
  }

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('draft_projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error

      setProject(data)
      setPreviewUrl(data.draft_url)
      setRegenerationCount(data.generation_count || 0)
      setPreviewExpiresAt(data.preview_expires_at)
      
      // Check if project needs generation (status is 'draft' or no draft_url)
      const needsGeneration = !data.draft_url || data.status === 'draft'
      
      if (needsGeneration && !isBuilding) {
        // Auto-start building
        console.log('🚀 Project needs generation, starting build...')
        startBuilding()
      }

      // FAST - Get account (cached, <5ms)
      const userAccount = await getFastAccount()
      console.log('⚡ Editor: Account loaded:', userAccount ? 'YES' : 'NO')
      setAccount(userAccount)

      // Check code access (Pro or Buyout)
      if (userAccount) {
        const codeAccess = await checkCodeAccess(userAccount.id, projectId)
        setHasCodeAccess(codeAccess)
      }

      // Load code content
      if (data.metadata?.html_code) {
        setCodeContent(data.metadata.html_code)
        setEditedCode(data.metadata.html_code)
      }

      // Load file content
      if (data.metadata?.files) {
        setFileContent(data.metadata.files)
      }

      // Load assets
      if (data.metadata?.assets) {
        setAssets(data.metadata.assets)
      }

      // Load SEO data
      if (data.metadata?.seo) {
        setSeoData(data.metadata.seo)
      }

      // Load pages
      if (data.metadata?.pages && data.metadata.pages.length > 0) {
        setPages(data.metadata.pages)
        const currentPage = data.metadata.pages.find((p: any) => p.id === (data.metadata.currentPage || 'index')) || data.metadata.pages[0]
        setCurrentPageId(currentPage.id)
        if (currentPage.htmlCode) {
          setEditedCode(currentPage.htmlCode)
          setCodeContent(currentPage.htmlCode)
        }
      } else {
        // Default: single page
        const defaultPage = {
          id: 'index',
          name: 'Home',
          slug: 'index',
          htmlCode: data.metadata?.html_code || ''
        }
        setPages([defaultPage])
        setCurrentPageId('index')
      }

      // Add status card for website ready
      if (data.draft_url) {
        setStatusCards([
          {
            id: 'website-ready',
            type: 'success',
            title: 'Website configured!',
            message: 'Your website is ready to use. You can now make changes by typing below.',
            action: {
              label: 'View Documentation',
              onClick: () => window.open('https://docs.atarwebb.com', '_blank')
            }
          }
        ])
      }

      if (data.metadata?.user_prompt && messages.length === 0) {
        setMessages([
          { 
            role: 'user', 
            content: data.metadata.user_prompt,
            timestamp: Date.now()
          },
          { 
            role: 'assistant', 
            content: `I've created your website based on: "${data.metadata.user_prompt}". You can now make changes by typing below!`,
            timestamp: Date.now()
          }
        ])
      }

      // Set project stats
      setProjectStats({
        views: data.metadata?.views || 0,
        edits: data.generation_count || 0,
        lastModified: data.updated_at || data.created_at
      })

      setLoading(false)
    } catch (error) {
      console.error('Error loading project:', error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      // FAST - Get access token from cache (no network call)
      const accessToken = getFastAccessToken()
      if (!accessToken) {
        alert('Please log in to save')
        return
      }

      const htmlCode = editedCode || project?.metadata?.html_code || ''
      
      const response = await fetch('/api/ai-builder/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          projectId,
          htmlCode,
          files: fileContent,
          metadata: {
            ...project?.metadata,
            seo: seoData
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setSaveStatus('saved')
        localStorage.setItem(`chat_history_${projectId}`, JSON.stringify(messages))
        
        // Add to history
        setHistory(prev => [...prev.slice(0, historyIndex + 1), { htmlCode, timestamp: Date.now() }])
        setHistoryIndex(prev => prev + 1)
        
        setTimeout(() => setSaveStatus('saved'), 2000)
      } else {
        setSaveStatus('unsaved')
        alert('Failed to save')
      }
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('unsaved')
      alert('Error saving project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      const prevState = history[prevIndex]
      setEditedCode(prevState.htmlCode)
      setHistoryIndex(prevIndex)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      const nextState = history[nextIndex]
      setEditedCode(nextState.htmlCode)
      setHistoryIndex(nextIndex)
    }
  }

  const handlePublish = async () => {
    try {
      const accessToken = getFastAccessToken()
      if (!accessToken) {
        alert('Please log in to publish')
        return
      }

      const response = await fetch('/api/ai-builder/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          projectId
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Published successfully! URL: ${data.deploymentUrl}`)
        // Reload project to get deployment URL
        loadProject()
      } else {
        alert(data.error || 'Failed to publish')
      }
    } catch (error) {
      console.error('Publish error:', error)
      alert('Error publishing project')
    }
  }

  const handleScreenshot = async () => {
    try {
      if (!previewRef.current) return

      // Use html2canvas or similar library
      // For now, show alert
      alert('Screenshot functionality requires html2canvas library. Install with: npm install html2canvas')
    } catch (error) {
      console.error('Screenshot error:', error)
    }
  }

  const loadVersions = async () => {
    try {
      const accessToken = getFastAccessToken()
      if (!accessToken) return

      const response = await fetch(`/api/ai-builder/versions?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const data = await response.json()
      if (data.versions) {
        setVersions(data.versions)
      }
    } catch (error) {
      console.error('Error loading versions:', error)
    }
  }

  const restoreVersion = async (versionId: string) => {
    try {
      const accessToken = getFastAccessToken()
      if (!accessToken) return

      const response = await fetch('/api/ai-builder/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          projectId,
          versionId
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Version restored successfully')
        loadProject()
        setShowVersions(false)
      }
    } catch (error) {
      console.error('Error restoring version:', error)
    }
  }

  const handlePlan = async () => {
    if (!inputMessage.trim()) return
    
    setShowPlan(true)
    setIsThinking(true)
    
    // Create plan steps
    const steps: PlanStep[] = [
      { id: '1', text: 'Analyzing your request...', status: 'thinking' },
      { id: '2', text: 'Designing website structure', status: 'pending' },
      { id: '3', text: 'Generating HTML and CSS', status: 'pending' },
      { id: '4', text: 'Adding interactive elements', status: 'pending' },
      { id: '5', text: 'Optimizing for performance', status: 'pending' },
      { id: '6', text: 'Finalizing preview', status: 'pending' }
    ]
    
    setPlanSteps(steps)
    
    // Simulate plan execution
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPlanSteps(prev => prev.map((step, idx) => 
        idx === i 
          ? { ...step, status: 'completed' as const }
          : idx === i + 1 && i + 1 < prev.length
          ? { ...step, status: 'thinking' as const }
          : step
      ))
    }
    
    setIsThinking(false)
    // Then execute the actual generation
    handleSendMessage(inputMessage)
  }

  const handleSendMessage = async (prompt?: string) => {
    const messageToSend = prompt || inputMessage.trim()
    if (!messageToSend || isGenerating) return

    if (account?.account_tier === 'default_draft') {
      const canRegenerate = await canRegenerateDraft(account.id, projectId)
      if (!canRegenerate) {
        setUpgradeContext('general')
        setShowUpgradeModal(true)
        return
      }
    }

    setInputMessage('')
    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMessage])
    setIsGenerating(true)
    setIsThinking(true)

    const updatedMessages = [...messages, userMessage]
    localStorage.setItem(`chat_history_${projectId}`, JSON.stringify(updatedMessages))

    try {
      const response = await fetch('/api/ai-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId: projectId, userPrompt: messageToSend })
      })

      if (!response.ok) throw new Error('Generation failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''
      let currentMessageId = Date.now()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'complete' && data.url) {
                  setIsThinking(false)
                  setPreviewUrl(data.url)
                  assistantMessage = 'Website updated successfully! Check the preview on the right.'
                  
                  // Update status card
                  setStatusCards(prev => [...prev.filter(c => c.id !== 'update-success'), {
                    id: 'update-success',
                    type: 'success',
                    title: 'Update complete!',
                    message: 'Your website has been updated successfully.'
                  }])
                } else if (data.message) {
                  assistantMessage += data.message
                  setMessages(prev => {
                    const lastMsg = prev[prev.length - 1]
                    if (lastMsg?.role === 'assistant' && lastMsg.timestamp === currentMessageId) {
                      return prev.slice(0, -1).concat([{ ...lastMsg, content: assistantMessage, isThinking: false }])
                    }
                    return prev
                  })
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      setIsThinking(false)
      const assistantMsg: Message = {
        role: 'assistant',
        content: assistantMessage || 'Website updated!',
        timestamp: currentMessageId
      }
      setMessages(prev => {
        const filtered = prev.filter(m => m.timestamp !== currentMessageId)
        return [...filtered, assistantMsg]
      })
      
      const finalMessages = [...messages, userMessage, assistantMsg]
      localStorage.setItem(`chat_history_${projectId}`, JSON.stringify(finalMessages))
      setRegenerationCount(prev => prev + 1)
      setProjectStats(prev => ({ ...prev, edits: prev.edits + 1, lastModified: new Date().toISOString() }))
    } catch (error) {
      console.error('Error generating:', error)
      setIsThinking(false)
      const errorMsg: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error updating your website. Please try again.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // Show toast
  }

  const extractCodeFromMessage = (content: string): string | null => {
    const codeMatch = content.match(/```[\s\S]*?```/g)
    if (codeMatch) {
      return codeMatch[0].replace(/```/g, '').trim()
    }
    return null
  }

  const getDaysRemaining = () => {
    if (!previewExpiresAt) return null
    const days = Math.ceil((new Date(previewExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      default: return '100%'
    }
  }

  // Helper functions for code restrictions
  const getVisibleCode = (code: string, hasAccess: boolean) => {
    if (hasAccess || hasFeatureAccess(account, 'live_deployment')) {
      return code
    }
    const lines = code.split('\n')
    return lines.slice(0, 100).join('\n')
  }

  const getCodePreview = (code: string, hasAccess: boolean) => {
    if (hasAccess || hasFeatureAccess(account, 'live_deployment')) {
      return null // No blur needed
    }
    const lines = code.split('\n')
    if (lines.length > 100) {
      return lines.slice(100).join('\n') // Remaining code for blur
    }
    return null
  }

  const canCopyCode = () => {
    return hasCodeAccess || hasFeatureAccess(account, 'live_deployment')
  }

  const commands = [
    { id: 'save', label: 'Save Changes', icon: Save, action: handleSave },
    { id: 'code', label: 'Toggle Code Viewer', icon: Code, action: () => setShowCodeViewer(!showCodeViewer) },
    { id: 'files', label: 'Toggle File Explorer', icon: Folder, action: () => setShowFileExplorer(!showFileExplorer) },
    { id: 'terminal', label: 'Open Terminal', icon: Terminal, action: () => {
      if (!hasFeatureAccess(account, 'live_deployment')) {
        setUpgradeContext('terminal')
        setShowUpgradeModal(true)
      } else {
        setShowTerminal(true)
      }
    }},
    { id: 'preview', label: 'Toggle Preview', icon: Eye, action: () => setViewMode('preview') },
    { id: 'settings', label: 'Open Settings', icon: Settings, action: () => setShowSettings(true) },
  ]

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(commandSearch.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div 
          ref={chatContainerRef}
          className="bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col"
          style={{ width: `${chatWidth}px` }}
        >
          {/* Top Bar */}
          <div className="h-12 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img 
                src="/favicom.png" 
                alt="AtarWebb Logo" 
                className="w-6 h-6 object-contain flex-shrink-0"
                style={{ filter: 'brightness(0) invert(1)' } as React.CSSProperties}
              />
              <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0"></div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-white font-medium truncate">{project?.business_name || 'Project'}</span>
              <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
              
              {/* Page Switcher */}
              {pages.length > 1 && (
                <div className="flex items-center gap-1 ml-4 border-l border-[#2a2a2a] pl-4">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setCurrentPageId(page.id)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        currentPageId === page.id
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                      }`}
                    >
                      {page.name}
                    </button>
                  ))}
                  {hasFeatureAccess(account, 'live_deployment') && (
                    <button
                      onClick={() => {
                        const pageName = prompt('Enter page name:')
                        if (pageName) {
                          // TODO: Implement createPage function
                          console.log('Create page:', pageName, pageName.toLowerCase().replace(/\s+/g, '-'))
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded"
                      title="Add Page"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAssetLibrary(!showAssetLibrary)}
                className="p-1.5 hover:bg-[#2a2a2a] rounded"
                title="Asset Library"
              >
                <Image className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 hover:bg-[#2a2a2a] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <Undo className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 hover:bg-[#2a2a2a] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <Redo className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || saveStatus === 'saved'}
                className="px-3 py-1.5 text-xs bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowVersions(true)
                  loadVersions()
                }}
                className="p-1.5 hover:bg-[#2a2a2a] rounded"
                title="Version History"
              >
                <Clock className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Status Cards */}
            {statusCards.map(card => (
              <div
                key={card.id}
                className={`rounded-lg p-4 border ${
                  card.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
                  card.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {card.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />}
                  {card.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />}
                  {card.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold mb-1 ${
                      card.type === 'success' ? 'text-green-400' :
                      card.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {card.title}
                    </h4>
                    <p className="text-xs text-gray-300 mb-2">{card.message}</p>
                    {card.action && (
                      <button
                        onClick={card.action.onClick}
                        className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        {card.action.label}
                      </button>
                    )}
                  </div>
                  <button onClick={() => setStatusCards(prev => prev.filter(c => c.id !== card.id))}>
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}

            {/* Build Progress (bolt.new style) */}
            {isBuilding && (
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                      <p className="text-white text-sm font-medium mb-1">Building your website...</p>
                      <p className="text-gray-400 text-xs">This will take a few moments</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 ml-12">
                  {buildSteps.map((step) => (
                    <div key={step.id} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
                      <div className="flex-1 min-w-0">
                        <div className={`rounded-lg p-3 ${
                          step.status === 'completed' ? 'bg-teal-500/10 border border-teal-500/20' :
                          step.status === 'in_progress' ? 'bg-[#2a2a2a] border border-[#3a3a3a]' :
                          step.status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                          'bg-[#1a1a1a] border border-[#2a2a2a]'
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
              </div>
            )}

            {/* Plan Steps */}
            {showPlan && planSteps.length > 0 && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-semibold text-white">Plan</h3>
                </div>
                <div className="space-y-2">
                  {planSteps.map((step, idx) => (
                    <div key={step.id} className="flex items-start gap-2">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : step.status === 'thinking' ? (
                        <Loader2 className="w-4 h-4 text-teal-400 animate-spin flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        step.status === 'completed' ? 'text-gray-300' :
                        step.status === 'thinking' ? 'text-teal-400' :
                        'text-gray-500'
                      }`}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.length === 0 && !isThinking && !showPlan && (
              <div className="flex items-center justify-center h-full px-4">
                <div className="text-center w-full max-w-md">
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
                    <img 
                      src="/favicom.png" 
                      alt="AtarWebb Logo" 
                      className="w-12 h-12 object-contain"
                      style={{ filter: 'brightness(0) invert(1)' } as React.CSSProperties}
                    />
                  </div>
                  <p className="text-white text-base mb-6 font-medium">Start a conversation to edit your website</p>
                  
                  {/* Suggested Prompts */}
                  <div className="grid grid-cols-2 gap-3">
                    {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="px-4 py-3 text-sm text-left bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a] hover:border-[#4a4a4a] transition-all text-gray-300 hover:text-white"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => {
              const codeBlock = extractCodeFromMessage(msg.content)
              return (
                <div key={idx} className="space-y-2">
                  {msg.role === 'user' ? (
                    <div className="bg-[#2a2a2a] rounded-lg p-3 text-sm text-gray-300 break-words">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white italic">atarwebb</span>
                      </div>
                      <div className="text-sm text-gray-300 leading-relaxed break-words prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                        {codeBlock && (
                          <button
                            onClick={() => handleCopyCode(codeBlock)}
                            className="mt-2 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Code
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Thinking Indicator */}
            {isThinking && !showPlan && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white italic">atarwebb</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Brain className="w-4 h-4 animate-pulse" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Regeneration Counter */}
          {account?.account_tier === 'default_draft' && (
            <div className="mx-4 mb-2 px-3 py-2 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Regenerations</span>
                <span className={`font-semibold ${
                  regenerationCount >= 2 ? 'text-orange-400' : 'text-gray-300'
                }`}>
                  {regenerationCount} / 3
                </span>
              </div>
            </div>
          )}

          {/* Preview Expiration */}
          {account?.account_tier === 'default_draft' && previewExpiresAt && (
            <div className="mx-4 mb-2 px-3 py-2 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Preview expires in</span>
                <span className="font-semibold text-yellow-400">
                  {getDaysRemaining()} days
                </span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-[#2a2a2a] flex-shrink-0">
            <div className="relative">
              <button className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#2a2a2a] flex items-center justify-center z-10 transition-colors">
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="How can AtarWebb help you today? (or /command)"
                className="w-full pl-12 pr-28 py-3 bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                disabled={isGenerating}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-[#1a1a1a] rounded transition-colors">
                  Select
                </button>
                <button 
                  onClick={handlePlan}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-[#1a1a1a] rounded flex items-center gap-1 transition-colors"
                >
                  <Clock className="w-3 h-3" />
                  Plan
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isGenerating || !inputMessage.trim()}
                  className="w-8 h-8 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          onMouseDown={() => setIsResizing(true)}
          className="w-1 bg-[#0a0a0a] hover:bg-teal-500 cursor-col-resize transition-colors"
        />

        {/* File Explorer Sidebar */}
        {showFileExplorer && (
          <div ref={fileExplorerRef} className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-white">Files</span>
              </div>
              <button onClick={() => setShowFileExplorer(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {/* Pages Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-xs text-gray-400 font-medium">Pages</span>
                  {hasFeatureAccess(account, 'live_deployment') && (
                    <button
                      onClick={() => {
                        const pageName = prompt('Enter page name:')
                        if (pageName) {
                          // TODO: Implement createPage function
                          console.log('Create page:', pageName, pageName.toLowerCase().replace(/\s+/g, '-'))
                        }
                      }}
                      className="p-1 hover:bg-[#2a2a2a] rounded"
                      title="Add Page"
                    >
                      <Plus className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
                {pages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => setCurrentPageId(page.id)}
                    className={`py-1.5 px-2 rounded cursor-pointer flex items-center justify-between mb-1 group ${
                      currentPageId === page.id ? 'bg-teal-600/20 text-teal-400' : 'hover:bg-[#2a2a2a] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileCode className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{page.name}</span>
                    </div>
                    {hasFeatureAccess(account, 'live_deployment') && pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement deletePage function
                          console.log('Delete page:', page.id)
                        }}
                        className="p-1 hover:bg-[#3a3a3a] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Files Section */}
              <div className="border-t border-[#2a2a2a] pt-2">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-xs text-gray-400 font-medium">Files</span>
                  {hasFeatureAccess(account, 'live_deployment') && (
                    <button
                      onClick={async () => {
                        const fileName = prompt('Enter file name:')
                        if (!fileName) return
                        
                        try {
                          const accessToken = getFastAccessToken()
                          if (!accessToken) return

                          await fetch('/api/ai-builder/files', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                              projectId,
                              filePath: fileName,
                              content: '',
                              action: 'create'
                            })
                          })

                          loadProject()
                        } catch (error) {
                          console.error('Error creating file:', error)
                        }
                      }}
                      className="p-1 hover:bg-[#2a2a2a] rounded"
                      title="New File"
                    >
                      <Plus className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
                {Object.keys(fileContent).length > 0 ? (
                Object.keys(fileContent).map((fileName, idx) => {
                  const Icon = FileCode
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentFile(fileName)
                        setEditedCode(fileContent[fileName])
                        setViewMode('code')
                        setShowCodeViewer(true)
                      }}
                      className={`py-1 px-2 hover:bg-[#2a2a2a] rounded cursor-pointer flex items-center gap-2 ${
                        currentFile === fileName ? 'bg-[#2a2a2a]' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300 flex-1">{fileName}</span>
                      {hasFeatureAccess(account, 'live_deployment') && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (!confirm(`Delete ${fileName}?`)) return

                            try {
                              const accessToken = getFastAccessToken()
                              if (!accessToken) return

                              await fetch('/api/ai-builder/files', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${accessToken}`
                                },
                                body: JSON.stringify({
                                  projectId,
                                  filePath: fileName,
                                  action: 'delete'
                                })
                              })

                              loadProject()
                            } catch (error) {
                              console.error('Error deleting file:', error)
                            }
                          }}
                          className="p-1 hover:bg-[#3a3a3a] rounded"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-sm text-gray-400 p-4 text-center">
                  {fileStructure.map((file, idx) => {
                    const Icon = file.icon
                    return (
                      <div key={idx} className="py-1 px-2 hover:bg-[#2a2a2a] rounded cursor-pointer flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{file.name}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              </div>
            </div>
            {!hasFeatureAccess(account, 'live_deployment') && (
              <div className="p-4 border-t border-[#2a2a2a]">
                <button
                  onClick={() => {
                    setUpgradeContext('code')
                    setShowUpgradeModal(true)
                  }}
                  className="w-full px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
                >
                  Upgrade to Pro to Edit Files
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Panel - Preview/Code */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          {/* Top Bar */}
          <div className="h-12 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${viewMode === 'code' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
              >
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Code</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${viewMode === 'preview' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </button>
              <button
                onClick={() => setViewMode('search')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${viewMode === 'search' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Search</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-[#2a2a2a] rounded transition-colors">
                <Github className="w-4 h-4 text-gray-400" />
              </button>
              <button 
                onClick={() => {
                  if (!hasFeatureAccess(account, 'live_deployment')) {
                    setUpgradeContext('publish')
                    setShowUpgradeModal(true)
                  } else {
                    handlePublish()
                  }
                }}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Rocket className="w-4 h-4" />
                Publish
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
            </div>
          </div>

          {/* Preview Controls */}
          {viewMode === 'preview' && (
            <div className="h-10 bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}
                  title="Desktop"
                >
                  <Monitor className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}
                  title="Tablet"
                >
                  <Tablet className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}
                  title="Mobile"
                >
                  <Smartphone className="w-4 h-4 text-gray-400" />
                </button>
                <div className="w-px h-6 bg-[#2a2a2a] mx-2"></div>
                <button
                  onClick={() => setPreviewZoom(prev => Math.max(50, prev - 10))}
                  className="p-1.5 hover:bg-[#2a2a2a] rounded"
                >
                  <ZoomOut className="w-4 h-4 text-gray-400" />
                </button>
                <span className="text-xs text-gray-400 min-w-[3rem] text-center">{previewZoom}%</span>
                <button
                  onClick={() => setPreviewZoom(prev => Math.min(200, prev + 10))}
                  className="p-1.5 hover:bg-[#2a2a2a] rounded"
                >
                  <ZoomIn className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => previewRef.current?.contentWindow?.location.reload()}
                  className="p-1.5 hover:bg-[#2a2a2a] rounded ml-2"
                >
                  <RotateCw className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {isGenerating && (
                  <div className="flex items-center gap-2 text-xs text-teal-400">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Updating...</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!hasFeatureAccess(account, 'live_deployment')) {
                      setUpgradeContext('general')
                      setShowUpgradeModal(true)
                    } else {
                      // Screenshot functionality
                    }
                  }}
                  className="p-1.5 hover:bg-[#2a2a2a] rounded"
                  title="Screenshot"
                >
                  <Camera className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/api/preview/${projectId}`
                    navigator.clipboard.writeText(shareUrl)
                  }}
                  className="p-1.5 hover:bg-[#2a2a2a] rounded"
                  title="Share Preview"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-[#0a0a0a] relative">
            {viewMode === 'preview' ? (
              previewUrl ? (
                <div className="h-full flex items-center justify-center p-4">
                  <div
                    style={{
                      width: getPreviewWidth(),
                      transform: `scale(${previewZoom / 100})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <iframe
                      ref={previewRef}
                      src={previewUrl}
                      className="w-full border-0 rounded-lg shadow-2xl"
                      style={{ height: previewMode === 'desktop' ? '100vh' : '667px' }}
                      title="Website Preview"
                    />
                  </div>
                </div>
              ) : isBuilding ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-teal-400 animate-spin mx-auto mb-4" />
                    <p className="text-white text-sm font-medium mb-2">Generating your website...</p>
                    {buildSteps[currentBuildStep] && (
                      <p className="text-gray-400 text-xs">
                        {buildSteps[currentBuildStep].title}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                      <img 
                        src="/favicom.png" 
                        alt="AtarWebb Logo" 
                        className="w-12 h-12 object-contain"
                        style={{ filter: 'brightness(0) invert(1)' } as React.CSSProperties}
                      />
                    </div>
                    <p className="text-gray-400 text-sm">Your preview will appear here</p>
                  </div>
                </div>
              )
            ) : viewMode === 'code' ? (
              <div className="h-full flex flex-col">
                {showCodeViewer ? (
                  <>
                    <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-teal-400" />
                        <span className="text-sm font-semibold text-white">Code Viewer</span>
                        {!hasFeatureAccess(account, 'live_deployment') && (
                          <span className="text-xs text-gray-500">(Read-only)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (!hasFeatureAccess(account, 'live_deployment')) {
                              setUpgradeContext('code')
                              setShowUpgradeModal(true)
                            } else {
                              // Enable editing
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-[#2a2a2a] text-gray-300 rounded hover:bg-[#3a3a3a]"
                        >
                          {hasFeatureAccess(account, 'live_deployment') ? 'Edit' : 'Upgrade to Edit'}
                        </button>
                        <button onClick={() => setShowCodeViewer(false)}>
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      {codeContent || editedCode ? (
                        <>
                          {hasFeatureAccess(account, 'live_deployment') ? (
                            <CodeEditor
                              value={editedCode || codeContent}
                              onChange={(value) => {
                                setEditedCode(value || '')
                                setSaveStatus('unsaved')
                              }}
                              language="html"
                              readOnly={false}
                              theme="vs-dark"
                            />
                          ) : (
                            <>
                              <div className="h-full overflow-auto p-4">
                                <pre className="text-xs text-gray-300 bg-[#0a0a0a] p-4 rounded-lg overflow-x-auto">
                                  <code>{getVisibleCode(codeContent, hasCodeAccess)}</code>
                                </pre>
                                {getCodePreview(codeContent, hasCodeAccess) && (
                                  <div className="relative mt-4">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] blur-sm pointer-events-none" />
                                    <div className="relative p-4 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-lg border border-[#2a2a2a]">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Lock className="w-4 h-4 text-yellow-400" />
                                        <p className="text-sm text-gray-300">
                                          Upgrade to Pro or Buyout to view full code
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            setUpgradeContext('code')
                                            setShowUpgradeModal(true)
                                          }}
                                          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
                                        >
                                          Upgrade to Pro
                                        </button>
                                        <button
                                          onClick={() => {
                                            setUpgradeContext('code')
                                            setShowUpgradeModal(true)
                                          }}
                                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                                        >
                                          Purchase Buyout
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-sm text-gray-400">No code available</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-[#2a2a2a]">
                      <button
                        onClick={() => {
                          if (canCopyCode() && codeContent) {
                            navigator.clipboard.writeText(codeContent)
                          } else {
                            setUpgradeContext('code')
                            setShowUpgradeModal(true)
                          }
                        }}
                        disabled={!canCopyCode()}
                        className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                          canCopyCode()
                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        {canCopyCode() ? 'Copy Code' : 'Upgrade to Copy Code'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm mb-4">Code viewer is available</p>
                      <button
                        onClick={() => setShowCodeViewer(true)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                      >
                        View Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm mb-4">Search functionality</p>
                  <div className="max-w-md mx-auto">
                    <input
                      type="text"
                      placeholder="Search files, code, content..."
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="h-10 bg-[#1a1a1a] border-t border-[#2a2a2a] flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFileExplorer(!showFileExplorer)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>AtarWebb</span>
              </button>
              <button 
                onClick={() => {
                  if (!hasFeatureAccess(account, 'live_deployment')) {
                    setUpgradeContext('publish')
                    setShowUpgradeModal(true)
                  } else {
                    handlePublish()
                  }
                }}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Rocket className="w-4 h-4" />
                <span>Publish Output</span>
              </button>
              <button 
                onClick={() => {
                  if (!hasFeatureAccess(account, 'live_deployment')) {
                    setUpgradeContext('terminal')
        setShowUpgradeModal(true)
                  } else {
                    setShowTerminal(!showTerminal)
                  }
                }}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  showTerminal ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Terminal</span>
                {showTerminal && <Circle className="w-2 h-2 fill-green-500 text-green-500" />}
              </button>
              <button className="w-6 h-6 flex items-center justify-center hover:bg-[#2a2a2a] rounded transition-colors">
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button className="hover:text-gray-400 flex items-center gap-1 transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span>Help Center</span>
              </button>
              <button className="hover:text-gray-400 transition-colors">
                <span>Join our Community</span>
              </button>
            </div>
          </div>

          {/* Terminal Panel */}
          {showTerminal && hasFeatureAccess(account, 'live_deployment') && (
            <div className="h-64 bg-[#0a0a0a] border-t border-[#2a2a2a] flex flex-col">
              <div className="h-8 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center gap-1 px-2">
                {['problems', 'output', 'debug', 'terminal', 'ports'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setTerminalTab(tab as any)}
                    className={`px-3 py-1 text-xs rounded ${
                      terminalTab === tab ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-gray-300 flex flex-col">
                {terminalTab === 'terminal' && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto mb-4 space-y-2">
                      {terminalOutput.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="text-green-400">$ {item.command}</div>
                          <div className="text-gray-300 whitespace-pre-wrap">{item.output}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 border-t border-[#2a2a2a] pt-2">
                      <span className="text-green-400">$</span>
                      <input
                        type="text"
                        onKeyPress={async (e) => {
                          if (e.key === 'Enter') {
                            const command = e.currentTarget.value
                            if (!command.trim()) return
                            
                            e.currentTarget.value = ''
                            
                            try {
                              const accessToken = getFastAccessToken()
                              if (!accessToken) return

                              const response = await fetch('/api/ai-builder/terminal', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${accessToken}`
                                },
                                body: JSON.stringify({
                                  projectId,
                                  command
                                })
                              })

                              const data = await response.json()
                              setTerminalOutput(prev => [...prev, {
                                command,
                                output: data.output || 'Command executed',
                                timestamp: Date.now()
                              }])
                            } catch (error) {
                              setTerminalOutput(prev => [...prev, {
                                command,
                                output: 'Error executing command',
                                timestamp: Date.now()
                              }])
                            }
                          }
                        }}
                        className="flex-1 bg-transparent border-none outline-none text-gray-300"
                        placeholder="Enter command..."
                      />
                    </div>
                  </div>
                )}
                {terminalTab === 'output' && (
                  <div className="text-gray-400">Build output will appear here...</div>
                )}
                {terminalTab === 'problems' && (
                  <div className="text-gray-400">No problems found</div>
                )}
                {terminalTab === 'debug' && (
                  <div className="text-gray-400">Debug console</div>
                )}
                {terminalTab === 'ports' && (
                  <div>
                    <div className="text-gray-300">→ Local: http://localhost:3000/</div>
                    <div className="text-gray-500 mt-1">→ Network: use --host to expose</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-32" onClick={() => setShowCommandPalette(false)}>
          <div className="w-full max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <Command className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {filteredCommands.map(cmd => {
                const Icon = cmd.icon
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action()
                      setShowCommandPalette(false)
                      setCommandSearch('')
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] rounded-lg text-sm text-gray-300 flex items-center gap-3"
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span>{cmd.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        projectId={projectId}
        context={upgradeContext}
      />

      {/* Asset Library Panel */}
      {showAssetLibrary && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#1a1a1a] border-l border-[#2a2a2a] z-50 flex flex-col shadow-2xl">
          <div className="p-4 border-b border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Asset Library</h3>
              <button onClick={() => setShowAssetLibrary(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <label className="block">
              <input
                type="file"
                accept="image/*,font/*,.woff,.woff2,.ttf,.otf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // TODO: Implement uploadAsset function
                    console.log('Upload asset:', file)
                  }
                }}
                className="hidden"
              />
              <div className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium text-center cursor-pointer flex items-center justify-center gap-2">
                {uploadingAsset ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Upload Asset
                  </>
                )}
              </div>
            </label>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {assets.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {assets.map((asset, idx) => (
                  <div
                    key={idx}
                    className="bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#3a3a3a] cursor-pointer group relative"
                    onClick={() => {
                      // TODO: Implement insertAsset function
                      console.log('Insert asset:', asset.url, asset.type)
                    }}
                  >
                    {asset.type.startsWith('image/') ? (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-24 bg-[#1a1a1a] rounded mb-2 flex items-center justify-center">
                        <FileCode className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="text-xs text-gray-300 truncate">{asset.name}</div>
                    {asset.size && (
                      <div className="text-xs text-gray-500 mt-1">
                        {(asset.size / 1024).toFixed(1)} KB
                      </div>
                    )}
                    <div className="absolute inset-0 bg-teal-600/0 group-hover:bg-teal-600/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-teal-400 font-medium">Click to Insert</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No assets uploaded yet</p>
                <p className="text-xs mt-2">Upload images, fonts, or other files</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowVersions(false)}>
          <div className="w-full max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Version History</h3>
              <button onClick={() => setShowVersions(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {versions.length > 0 ? (
                <div className="space-y-2">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="p-3 bg-[#2a2a2a] rounded-lg flex items-center justify-between hover:bg-[#3a3a3a] cursor-pointer"
                      onClick={() => restoreVersion(version.id)}
                    >
                      <div>
                        <div className="text-sm text-white font-medium">
                          Version from {new Date(version.created_at).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {version.id === 'current' ? 'Current version' : 'Previous version'}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          restoreVersion(version.id)
                        }}
                        className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No version history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="fixed inset-y-0 right-0 w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] z-50 flex flex-col shadow-2xl">
          <div className="p-4 border-b border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-[#2a2a2a] rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSettingsTab('project')}
                className={`flex-1 px-3 py-2 rounded transition-colors ${settingsTab === 'project' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Project
              </button>
              <button
                onClick={() => setSettingsTab('personal')}
                className={`flex-1 px-3 py-2 rounded transition-colors ${settingsTab === 'personal' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Personal
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {settingsTab === 'project' ? (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Project Settings</div>
                <button className="w-full flex items-center gap-3 px-3 py-2 bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Settings className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-white">General</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Domains & Hosting</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <BarChart3 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Analytics</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Database className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Database</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Authentication</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Code className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Server Functions</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Key className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Secrets</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">User Management</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Folder className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">File Storage</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Lightbulb className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Knowledge</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Backups</span>
                </button>
                <div className="border-t border-[#2a2a2a] my-4"></div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Personal Settings</div>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Settings className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">General</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Subscription & Tokens</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-left transition-colors">
                  <Folder className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Applications</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-[#2a2a2a] rounded-lg text-white text-sm transition-colors">
                      Dark
                    </button>
                    <button className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-gray-400 text-sm hover:border-[#3a3a3a] transition-colors">
                      Light
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Statistics</label>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Views</span>
                      <span className="text-white font-semibold">{projectStats.views}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Edits</span>
                      <span className="text-white font-semibold">{projectStats.edits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Modified</span>
                      <span className="text-white font-semibold">
                        {projectStats.lastModified ? new Date(projectStats.lastModified).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowShortcuts(false)}>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                <span className="text-gray-300">Save</span>
                <kbd className="px-2 py-1 bg-[#0a0a0a] rounded text-gray-400">Cmd/Ctrl + S</kbd>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                <span className="text-gray-300">Command Palette</span>
                <kbd className="px-2 py-1 bg-[#0a0a0a] rounded text-gray-400">Cmd/Ctrl + K</kbd>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                <span className="text-gray-300">Show Shortcuts</span>
                <kbd className="px-2 py-1 bg-[#0a0a0a] rounded text-gray-400">Cmd/Ctrl + /</kbd>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                <span className="text-gray-300">Toggle Code Viewer</span>
                <kbd className="px-2 py-1 bg-[#0a0a0a] rounded text-gray-400">Cmd/Ctrl + E</kbd>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                <span className="text-gray-300">Toggle File Explorer</span>
                <kbd className="px-2 py-1 bg-[#0a0a0a] rounded text-gray-400">Cmd/Ctrl + B</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
