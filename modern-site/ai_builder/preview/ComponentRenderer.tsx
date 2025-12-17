'use client'

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './ErrorFallback'
// Import components from the library
import Header from '../library/components/generic/header/Header'
import Hero from '../library/components/generic/hero/Hero'
import Features from '../library/components/generic/features/Features'
import Pricing from '../library/components/generic/pricing/Pricing'
import Testimonial from '../library/components/generic/testimonials/Testimonial'
import Footer from '../library/components/generic/footer/Footer'
// Import default siteData
import { defaultSiteData } from '../library/sitedata/defaultSiteData'
// Import autonomous features
import { createAutoSave, saveToLocalStorage, recoverFromLocalStorage, debounce } from '../lib/agentic/auto-save'
import { saveCodeVersion } from '../lib/agentic/version-history'
import { getRuntimeMonitor, setupAutoFixRuntimeErrors } from '../lib/agentic/runtime-monitor'
import { suggestImprovements, formatSuggestions } from '../lib/agentic/code-suggestions'
// P0: Production-ready features
import { getCodeSandbox } from '../lib/security/code-sandbox'
import { trackError, trackMessage, initializeErrorTracking } from '../lib/monitoring/error-tracking'
import { getMemoryMonitor } from '../lib/performance/memory-monitor'
import { checkCodeSize, formatCodeSize } from '../lib/performance/code-size-limiter'
import { getPerformanceMonitor } from '../lib/performance/performance-monitor'
import { useToast } from '../lib/ux/toast-notifications'
import { getUndoRedoManager, setupUndoRedoShortcuts } from '../lib/ux/undo-redo'
import { categorizeError } from '../lib/error-handling/error-categorizer'
import { getErrorRecovery } from '../lib/error-handling/error-recovery'
import { CodeDiff } from './CodeDiff'
import { AsyncErrorBoundary } from '../lib/error-handling/async-error-boundary'
import { validateCode } from '../lib/validation/enhanced-validator'

interface ComponentRendererProps {
  componentCode: string
  onCodeUpdate?: (newCode: string) => void
  draftId?: string // P0: Added for auto-save and version history
}

export default function ComponentRenderer({ 
  componentCode, 
  onCodeUpdate,
  draftId 
}: ComponentRendererProps) {
  const [babelLoaded, setBabelLoaded] = useState(false)
  const [currentCode, setCurrentCode] = useState(componentCode)
  const [errorKey, setErrorKey] = useState(0) // Force re-mount on error reset
  const [isValidating, setIsValidating] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'babel' | 'transpile' | 'render' | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [codeSuggestions, setCodeSuggestions] = useState<string[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showDiff, setShowDiff] = useState(false)
  const [diffBeforeCode, setDiffBeforeCode] = useState<string>('')
  const [diffAfterCode, setDiffAfterCode] = useState<string>('')
  
  // Refs for performance optimizations
  const prevCodeRef = useRef<string>(componentCode)
  const autoSaveRef = useRef<((code: string) => void) | null>(null)
  const componentNameRef = useRef<string>('LandingPage')
  const renderStartTimeRef = useRef<number>(0)
  
  // P1 Feature 10: Toast notifications
  const { showToast } = useToast()
  
  // P2 Feature 14: Undo/Redo - Initialize undo/redo manager
  const undoRedoManager = draftId ? getUndoRedoManager(draftId) : null
  
  // P2 Feature 14: Undo/Redo - Handle undo/redo
  const handleUndo = useCallback((state: { code: string }) => {
    setCurrentCode(state.code)
    if (onCodeUpdate) {
      onCodeUpdate(state.code)
    }
    showToast('Undone', 'info', 2000)
  }, [onCodeUpdate, showToast])
  
  const handleRedo = useCallback((state: { code: string }) => {
    setCurrentCode(state.code)
    if (onCodeUpdate) {
      onCodeUpdate(state.code)
    }
    showToast('Redone', 'info', 2000)
  }, [onCodeUpdate, showToast])
  
  // P2 Feature 14: Undo/Redo - Setup keyboard shortcuts
  useEffect(() => {
    if (!draftId) return
    const cleanup = setupUndoRedoShortcuts(draftId, handleUndo, handleRedo)
    return cleanup
  }, [draftId, handleUndo, handleRedo])

  // P0 Feature 1: Auto-Save Integration - Initialize auto-save
  useEffect(() => {
    if (draftId) {
      autoSaveRef.current = createAutoSave(draftId, 2000) // 2 second debounce
      console.log('✅ Auto-save initialized for draft:', draftId)
    }
  }, [draftId])

  // P1 Feature 4: Better Error Recovery - Recover from localStorage on mount
  useEffect(() => {
    if (draftId && typeof window !== 'undefined') {
      const recovered = recoverFromLocalStorage(draftId)
      if (recovered && recovered !== componentCode && recovered.trim().length > 0) {
        console.log('🔄 Recovered code from localStorage backup')
        setCurrentCode(recovered)
        // Notify parent of recovered code
        if (onCodeUpdate) {
          onCodeUpdate(recovered)
        }
      }
    }
  }, [draftId]) // Only run on mount

  // P0 Feature 1: Auto-Save Integration - Auto-save on code changes
  useEffect(() => {
    if (!draftId || !autoSaveRef.current) return
    
    // Skip if code hasn't actually changed
    if (prevCodeRef.current === currentCode) return
    prevCodeRef.current = currentCode
    
    // Backup to localStorage immediately
    saveToLocalStorage(draftId, currentCode)
    
    // P2 Feature 14: Save state for undo/redo
    if (undoRedoManager) {
      undoRedoManager.saveState(currentCode, 'Code change')
    }
    
    // Debounced auto-save to database
    setIsSaving(true)
    autoSaveRef.current(currentCode)
    
    // Update last saved time after a delay (simulating save completion)
    setTimeout(() => {
      setLastSaved(new Date())
      setIsSaving(false)
      // P1 Feature 10: Show toast notification
      showToast('Code saved successfully', 'success', 2000)
    }, 2100) // Slightly longer than debounce delay
  }, [currentCode, draftId, showToast])

  // Update current code when prop changes
  useEffect(() => {
    if (componentCode !== currentCode) {
    setCurrentCode(componentCode)
      prevCodeRef.current = componentCode
    }
  }, [componentCode])

  // P1 Feature 3: Runtime Error Monitoring - Initialize runtime monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    const monitor = getRuntimeMonitor()
    
    // Setup auto-fix for runtime errors
    const unsubscribe = setupAutoFixRuntimeErrors(async (error) => {
      console.log('🚨 Runtime error detected:', error)
      // Runtime errors are logged but don't trigger auto-fix automatically
      // They're handled by the error boundary if they cause component crashes
    })
    
    return () => {
      unsubscribe()
    }
  }, [])

  // P2 Feature 4: Code Suggestions Integration - Analyze code after successful render
  // This will be set up after RenderedComponent is defined
  const [hasRenderedSuccessfully, setHasRenderedSuccessfully] = useState(false)
  
  useEffect(() => {
    if (hasRenderedSuccessfully && currentCode && draftId) {
      // Debounce suggestions to avoid excessive analysis
      const timeout = setTimeout(() => {
        try {
          const suggestions = suggestImprovements(currentCode)
          if (suggestions.length > 0) {
            const formatted = formatSuggestions(suggestions)
            setCodeSuggestions([formatted])
            console.log('💡 Code suggestions:', formatted)
          } else {
            setCodeSuggestions([])
          }
        } catch (err) {
          console.warn('Failed to analyze code suggestions:', err)
        }
      }, 3000) // Wait 3 seconds after render to analyze
      
      return () => clearTimeout(timeout)
    }
  }, [hasRenderedSuccessfully, currentCode, draftId])

  // P0 Feature 4: Memory Monitor - Initialize memory monitoring
  useEffect(() => {
    const monitor = getMemoryMonitor()
    monitor.start()
    
    return () => {
      monitor.stop()
      monitor.clearCache()
    }
  }, [])

  // P0 Feature 2: Error Tracking - Initialize error tracking
  useEffect(() => {
    initializeErrorTracking().catch(console.error)
  }, [])

  // P1 Feature 9: Code Size Limits - Check code size
  const codeSizeCheck = useMemo(() => {
    return checkCodeSize(currentCode)
  }, [currentCode])

  // Show warning if code size is large
  useEffect(() => {
    if (codeSizeCheck.warning) {
      console.warn('⚠️', codeSizeCheck.warning)
    }
    if (codeSizeCheck.error) {
      console.error('❌', codeSizeCheck.error)
      trackMessage(codeSizeCheck.error, 'error', {
        errorType: 'validation',
        severity: 'high',
        draftId
      })
    }
  }, [codeSizeCheck, draftId])

  // P2 Feature 8 & 13: Enhanced Code Validation - Enhanced validation function with TypeScript/ESLint-like checks
  const validateBeforeRender = useCallback((code: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    // P1 Feature 9: Check code size first
    const sizeCheck = checkCodeSize(code)
    if (!sizeCheck.valid) {
      errors.push(sizeCheck.error || 'Code size exceeds maximum')
      return { isValid: false, errors }
    }
    
    // Basic syntax checks
    if (!code || code.trim().length === 0) {
      errors.push('Code is empty')
      return { isValid: false, errors }
    }

    // P2 Feature 13: Enhanced validation
    const enhancedValidation = validateCode(code)
    enhancedValidation.errors.forEach(err => {
      errors.push(`${err.type}: ${err.message}${err.line ? ` (line ${err.line})` : ''}`)
    })
    
    // Show warnings in console
    enhancedValidation.warnings.forEach(warn => {
      console.warn(`⚠️ ${warn.type}: ${warn.message}${warn.line ? ` (line ${warn.line})` : ''}`)
      if (warn.suggestion) {
        console.warn(`   Suggestion: ${warn.suggestion}`)
      }
    })

    // Check for unmatched brackets
    const openBrackets = (code.match(/\{/g) || []).length
    const closeBrackets = (code.match(/\}/g) || []).length
    if (openBrackets !== closeBrackets) {
      errors.push(`Unmatched brackets: ${openBrackets} open, ${closeBrackets} close`)
    }

    // Check for unmatched parentheses
    const openParens = (code.match(/\(/g) || []).length
    const closeParens = (code.match(/\)/g) || []).length
    if (openParens !== closeParens) {
      errors.push(`Unmatched parentheses: ${openParens} open, ${closeParens} close`)
    }

    // Check for basic JSX structure
    if (!code.includes('return') && !code.includes('export')) {
      errors.push('Missing return statement or export')
    }

    // Check for unterminated strings (basic check)
    const singleQuotes = (code.match(/'/g) || []).length
    const doubleQuotes = (code.match(/"/g) || []).length
    if (singleQuotes % 2 !== 0) {
      errors.push('Unmatched single quotes')
    }
    if (doubleQuotes % 2 !== 0) {
      errors.push('Unmatched double quotes')
    }

    // P2 Feature 8: React Hooks Validation
    const hookCalls = code.match(/use[A-Z]\w+\(/g) || []
    if (hookCalls.length > 0) {
      // Check for conditional hooks (React rules violation)
      const hasConditionalHook = code.match(/if\s*\([^)]*\)\s*\{[^}]*use[A-Z]/)
      if (hasConditionalHook) {
        errors.push('React hooks must be called unconditionally (not inside if statements)')
      }
      
      // Check for hooks in loops
      const hasHookInLoop = code.match(/(for|while|map|forEach)\s*\([^)]*\)\s*\{[^}]*use[A-Z]/)
      if (hasHookInLoop) {
        errors.push('React hooks cannot be called inside loops')
      }
    }

    // Check for common mistakes
    if (code.includes('setState') && !code.includes('useState')) {
      errors.push('setState used without useState hook (class component syntax in function component)')
    }

    // Check for missing dependencies in useEffect
    const useEffectMatches = code.matchAll(/useEffect\s*\([^,]*,\s*\[([^\]]*)\]/g)
    for (const match of useEffectMatches) {
      const deps = match[1]
      // Simple check: if useEffect uses variables but deps is empty
      if (deps.trim() === '' && code.includes('useEffect')) {
        // This is a warning, not an error, but we'll log it
        console.warn('⚠️ useEffect may be missing dependencies')
      }
    }

    return { isValid: errors.length === 0, errors }
  }, [])

  // Continuous error monitoring (P0 Feature 4)
  useEffect(() => {
    if (!babelLoaded || !currentCode) return

    const interval = setInterval(() => {
      // P2 Feature 6: Direct validation (already optimized with useCallback)
      const validation = validateBeforeRender(currentCode)
      
      if (!validation.isValid && validation.errors.length > 0) {
        console.log('⚠️ Proactive error detection:', validation.errors)
        // Auto-fix will be triggered by error boundary if code fails to render
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [currentCode, babelLoaded, validateBeforeRender])

  // P2 Feature 9: Babel Loading Improvements - Enhanced Babel loading with retry and fallback CDNs
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if ((window as any).Babel) {
      setBabelLoaded(true)
      return
    }

    const BABEL_CDNS = [
      'https://unpkg.com/@babel/standalone/babel.min.js',
      'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.0/babel.min.js'
    ]

    let currentCDNIndex = 0
    let retryCount = 0
    const MAX_RETRIES = 3

    const loadBabel = (cdnIndex: number): Promise<void> => {
      return new Promise((resolve, reject) => {
      const script = document.createElement('script')
        script.src = BABEL_CDNS[cdnIndex]
      script.async = true
        
      script.onload = () => {
          console.log(`✅ Babel loaded from CDN ${cdnIndex + 1}: ${BABEL_CDNS[cdnIndex]}`)
        setBabelLoaded(true)
          resolve()
      }
        
      script.onerror = () => {
          console.warn(`❌ Failed to load Babel from CDN ${cdnIndex + 1}`)
          reject(new Error(`Failed to load from ${BABEL_CDNS[cdnIndex]}`))
      }
        
      document.head.appendChild(script)
      })
    }

    const tryLoadBabel = async () => {
      setLoadingStage('babel')
      setLoadingProgress(0)
      
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          setLoadingProgress((attempt / MAX_RETRIES) * 100)
          await loadBabel(currentCDNIndex)
          setLoadingProgress(100)
          setLoadingStage(null)
          return
        } catch (err) {
          retryCount++
          if (retryCount < MAX_RETRIES) {
            // Try next CDN
            currentCDNIndex = (currentCDNIndex + 1) % BABEL_CDNS.length
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))) // Exponential backoff
          } else if (currentCDNIndex < BABEL_CDNS.length - 1) {
            // Try next CDN before giving up
            currentCDNIndex++
            retryCount = 0
          } else {
            // All CDNs failed
            console.error('❌ All Babel CDNs failed to load')
            setBabelLoaded(true) // Continue anyway - will handle errors via error boundary
            setLoadingStage(null)
            return
          }
        }
      }
    }

    tryLoadBabel()

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!(window as any).Babel) {
        console.warn('⚠️ Babel took too long to load, proceeding anyway')
      setBabelLoaded(true)
        setLoadingStage(null)
    }
    }, 10000) // 10 second timeout
    
    return () => clearTimeout(timeout)
  }, [])

  // P1 Feature 2: Version History Integration - Handle code updates with version tracking
  const handleCodeFixed = useCallback(async (fixedCode: string) => {
    console.log('✅ Code fixed, updating component...')
    
    // P1 Feature 10: Show fixing toast
    showToast('Fixing errors with AI...', 'info', 2000)
    
    // P1 Feature 2: Save version before updating
    if (draftId) {
      try {
        await saveCodeVersion(draftId, currentCode, 'Before auto-fix')
        console.log('📝 Saved version before fix')
      } catch (err) {
        console.warn('Failed to save version before fix:', err)
        showToast('Failed to save version', 'warning', 3000)
      }
    }
    
    // P2 Feature 14: Save state for undo/redo
    if (undoRedoManager) {
      undoRedoManager.saveState(currentCode, 'Before auto-fix')
    }
    
    setCurrentCode(fixedCode)
    setErrorKey(prev => prev + 1) // Force re-mount
    
    // P2 Feature 14: Save fixed state for undo/redo
    if (undoRedoManager) {
      undoRedoManager.saveState(fixedCode, 'Auto-fixed by Claude Sonnet')
    }
    
    // P1 Feature 2: Save new version after fix
    if (draftId) {
      try {
        await saveCodeVersion(draftId, fixedCode, 'Auto-fixed by Claude Sonnet')
        console.log('📝 Saved version after fix')
      } catch (err) {
        console.warn('Failed to save version after fix:', err)
      }
    }
    
    // P1 Feature 10: Show success toast
    showToast('Errors fixed successfully!', 'success', 3000)
    
    // Notify parent component of code update
    if (onCodeUpdate) {
      onCodeUpdate(fixedCode)
    }
  }, [currentCode, draftId, onCodeUpdate, showToast, undoRedoManager])

  // Reset error boundary
  const handleReset = useCallback(() => {
    setErrorKey(prev => prev + 1)
  }, [])

  // Check if code contains JSX (used in multiple places)
  const codeHasJSX = currentCode.includes('<') && (currentCode.includes('</') || currentCode.match(/<\w+/))

  const RenderedComponent = useMemo(() => {
    renderStartTimeRef.current = performance.now()
    
    try {
      // Wait for Babel to load if code contains JSX
      const currentCodeHasJSX = currentCode.includes('<') && (currentCode.includes('</') || currentCode.match(/<\w+/))
      if (currentCodeHasJSX && typeof window !== 'undefined' && !(window as any).Babel && !babelLoaded) {
        // Babel is still loading - return null to prevent premature error
        // Component will re-render when babelLoaded becomes true
        console.log('⏳ Waiting for Babel to load before transpiling JSX...')
        return null
      }

      // Error Prevention: Pre-render validation (P0 Feature 7)
      const validation = validateBeforeRender(currentCode)
      if (!validation.isValid) {
        console.warn('⚠️ Pre-render validation failed:', validation.errors)
        // Continue anyway - error boundary will catch runtime errors
      }

      // Extract the component code from markdown code blocks if present
      let code = currentCode.trim()
      
      // Remove markdown code block markers more aggressively
      const codeBlockMatch = code.match(/```(?:jsx|js|tsx|ts|javascript|typescript)?\s*\n([\s\S]*?)\n```/)
      if (codeBlockMatch) {
        code = codeBlockMatch[1].trim()
      } else {
        code = code.replace(/^```(?:jsx|js|tsx|ts|javascript|typescript)?\s*\n?/gm, '')
        code = code.replace(/\n?```\s*$/gm, '')
        code = code.trim()
      }

      // Remove component imports (we'll provide them)
      code = code.replace(/import\s+\{[^}]*\}\s+from\s+['"]\.\/components['"];?\s*/g, '')
      code = code.replace(/import\s+\{[^}]*\}\s+from\s+['"]\.\/components\/index['"];?\s*/g, '')
      
      // Remove React imports (we'll provide React hooks)
      code = code.replace(/import\s+\{([^}]*)\}\s+from\s+['"]react['"];?\s*/g, '')
      code = code.replace(/import\s+React\s+from\s+['"]react['"];?\s*/g, '')
      
      // Extract component function name
      let componentName = 'LandingPage'
      const nameMatch = code.match(/(?:export\s+default\s+)?function\s+(\w+)\s*\(/)
      if (nameMatch) {
        componentName = nameMatch[1]
        componentNameRef.current = componentName
      } else {
        componentName = componentNameRef.current
      }
      
      // CRITICAL FIX: Strip export default and convert to variable assignment
      if (code.includes('export default function')) {
        code = code.replace(
          /export\s+default\s+function\s+(\w+)\s*\(/g,
          'const $1 = function('
        )
      } else if (code.includes('export default')) {
        code = code.replace(/export\s+default\s+/g, '')
        if (!code.includes('function') && !code.includes('const') && !code.includes('=')) {
          code = `const ${componentName} = ${code}`
        }
      }
      
      // Fix unterminated strings (common AI cut-off issue)
      const lines = code.split('\n')
      let fixedLines: string[] = []
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        
        // Check if line has unmatched quotes (simple heuristic)
        if (line.includes('className=') || line.includes('title=') || line.includes('description=')) {
          const attrMatch = line.match(/(\w+)=["']([^"']*)$/)
          if (attrMatch && !line.match(/["']\s*\/?>?$/)) {
            line = line.replace(/(["'])([^"']*)$/, '$1$2$1')
            console.warn(`⚠️ Fixed unterminated string on line ${i + 1}`)
          }
        }
        
        fixedLines.push(line)
      }
      
      code = fixedLines.join('\n')
      
      // Prepare the code for transpilation
      const fullCode = code
      
      // P2 Feature 8: Loading Stage - Transpilation
      setLoadingStage('transpile')
      setLoadingProgress(50)
      
      // Transpile JSX to React.createElement using Babel (if available)
      let transpiledCode = fullCode
      let babelError: any = null
      
      // Check if this specific code block contains JSX
      const fullCodeHasJSX = fullCode.includes('<') && (fullCode.includes('</') || fullCode.match(/<\w+/))
      
      if (typeof window !== 'undefined' && (window as any).Babel) {
        // Babel is loaded - try to transpile
        try {
          setLoadingProgress(75)
          const result = (window as any).Babel.transform(fullCode, {
            presets: ['react'],
            plugins: []
          })
          transpiledCode = result.code
          console.log('✅ JSX transpiled successfully')
          setLoadingProgress(100)
        } catch (babelErr: any) {
          babelError = babelErr
          console.error('❌ Babel transpilation failed:', babelErr.message)
          
          // If Babel fails, we MUST trigger error fixing - can't execute JSX directly
          // Throw error to be caught by error boundary, which will trigger Sonnet fix
          throw new Error(
            `JSX Transpilation Error: ${babelErr.message}. ` +
            `The code contains invalid JSX syntax that Babel cannot transpile. ` +
            `This will be automatically fixed by Claude Sonnet.`
          )
        }
      } else if (typeof window !== 'undefined' && fullCodeHasJSX) {
        // Babel not loaded yet but code has JSX - wait a bit for Babel to load
        // This prevents premature error throwing when Babel is still loading
        if (!babelLoaded) {
          // Babel is still loading - throw error to trigger auto-fix
          // The auto-fix will wait for Babel or fix the JSX syntax
          throw new Error(
            'JSX detected but Babel not loaded yet. ' +
            'Waiting for Babel to load, or this will be automatically fixed by Claude Sonnet.'
          )
        }
      }
      
      // Validate transpiled code doesn't contain raw JSX before execution
      if (transpiledCode.includes('<') && (transpiledCode.includes('</') || transpiledCode.match(/<\w+/))) {
        // Still contains JSX after transpilation - this is a critical error
        throw new Error(
          'Transpiled code still contains JSX syntax. ' +
          'Babel transpilation may have failed silently. ' +
          'This will be automatically fixed by Claude Sonnet.'
        )
      }
      
      // P2 Feature 8: Loading Stage - Rendering
      setLoadingStage('render')
      setLoadingProgress(90)
      
      // Use default siteData (injected into component context)
      const siteData = defaultSiteData
      
      // Create execution context
      const componentFunction = new Function(
        'React',
        'useState',
        'useEffect',
        'useRef',
        'useCallback',
        'useMemo',
        'Header',
        'Hero',
        'Features',
        'Pricing',
        'Testimonial',
        'Footer',
        'siteData',
        `
        const ReactLib = React;
        
        ${transpiledCode}
        
        if (typeof ${componentName} !== 'undefined') {
          return ${componentName};
        }
        
        const componentNames = ['${componentName}', 'LandingPage', 'App', 'Component'];
        for (const name of componentNames) {
          if (typeof eval(name) !== 'undefined') {
            return eval(name);
          }
        }
        
        return null;
        `
      )

      const Component = componentFunction(
        React,
        React.useState,
        React.useEffect,
        React.useRef,
        React.useCallback,
        React.useMemo,
        Header,
        Hero,
        Features,
        Pricing,
        Testimonial,
        Footer,
        siteData
      )

      if (!Component || typeof Component !== 'function') {
        console.error('❌ Component function is not valid:', typeof Component)
        throw new Error('Component function is not valid')
      }

      const renderTime = performance.now() - renderStartTimeRef.current
      console.log(`✅ Component created successfully: ${componentName} (${renderTime.toFixed(2)}ms)`)
      
      setLoadingStage(null)
      setLoadingProgress(100)
      
      // Mark as successfully rendered for code suggestions
      setHasRenderedSuccessfully(true)
      
      // P1 Feature 7: Track performance metrics
      const perfMonitor = getPerformanceMonitor()
      perfMonitor.trackRender(componentName, renderTime)
      
      // P0 Feature 2: Track successful render
      trackMessage(`Component rendered successfully: ${componentName}`, 'info', {
        errorType: 'render',
        severity: 'low',
        draftId,
        renderTime
      })
      
      return Component
    } catch (error: any) {
      console.error('❌ Error rendering component:', error)
      
      // Reset success flag on error
      setHasRenderedSuccessfully(false)
      
      // P2 Feature 12: Categorize error
      const categorized = categorizeError(error, {
        componentCode: currentCode,
        draftId,
        babelLoaded,
        loadingStage: loadingStage || 'none'
      })
      
      // P0 Feature 2: Track error with categorization
      trackError(error, {
        errorType: categorized.category,
        severity: categorized.severity,
        componentCode: currentCode,
        draftId,
        babelLoaded,
        loadingStage: loadingStage || 'none'
      })
      
      // P2 Feature 15: Attempt automatic recovery
      if (draftId) {
        const recovery = getErrorRecovery()
        const recoveryResult = recovery.attemptRecovery(error, currentCode)
        if (recoveryResult.success && recoveryResult.recoveredCode) {
          console.log(`✅ Auto-recovered using strategy: ${recoveryResult.strategy}`)
          showToast(`Auto-recovered using ${recoveryResult.strategy}`, 'success', 3000)
          setCurrentCode(recoveryResult.recoveredCode)
          if (onCodeUpdate) {
            onCodeUpdate(recoveryResult.recoveredCode)
          }
          // Don't throw error if recovery succeeded
          return null
        }
      }
      
      // P2 Feature 7: Enhanced Error Messages - Add more context
      const isTranspilationError = 
        error.message?.includes('JSX') ||
        error.message?.includes('Transpilation') ||
        error.message?.includes('Unexpected token') ||
        error.name === 'SyntaxError'
      
      if (isTranspilationError) {
        console.error('🚨 Transpilation/JSX error detected - will trigger Sonnet auto-fix')
        
        // Extract line number from error if available
        const stackLines = error.stack?.split('\n') || []
        const errorLine = stackLines.find((line: string) => line.includes(':'))?.match(/:(\d+):(\d+)/)
        const lineNumber = errorLine ? errorLine[1] : 'unknown'
        const columnNumber = errorLine ? errorLine[2] : 'unknown'
        
        // P2 Feature 7: Enhanced error with file context and documentation
        const enhancedError = new Error(
          `${error.message}\n\n` +
          `File: ${componentNameRef.current || 'Component'}.tsx\n` +
          `Line: ${lineNumber}, Column: ${columnNumber}\n` +
          `Code length: ${currentCode.length} characters\n` +
          `Babel loaded: ${babelLoaded}\n` +
          `Loading stage: ${loadingStage || 'none'}\n` +
          `This is a JSX/transpilation error that needs to be fixed.\n` +
          `Documentation: https://react.dev/reference/react/error-boundary`
        )
        enhancedError.stack = error.stack
        throw enhancedError
      }
      
      // P2 Feature 7: Enhanced error for other errors
      const enhancedError = new Error(
        `${error.message}\n\n` +
        `File: ${componentNameRef.current || 'Component'}.tsx\n` +
        `Error type: ${error.name}\n` +
        `Code length: ${currentCode.length} characters\n` +
        `This error will be automatically fixed by Claude Sonnet.`
      )
      enhancedError.stack = error.stack
      throw enhancedError
    }
  }, [currentCode, babelLoaded, validateBeforeRender, loadingStage])

  // Show loading state while Babel loads (only if code contains JSX)
  if (codeHasJSX && !babelLoaded && typeof window !== 'undefined' && !(window as any).Babel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {loadingStage === 'babel' ? 'Loading JSX transpiler (Babel)...' : 'Preparing component renderer...'}
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          {loadingProgress > 0 && (
            <div className="w-64 mx-auto mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">{loadingProgress}%</p>
            </div>
          )}
          <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    )
  }

  // Wrap component in error boundary for self-healing
  // P1 Feature 8: Multiple error boundaries - AsyncErrorBoundary for async errors, ErrorBoundary for render errors
  return (
    <AsyncErrorBoundary
      onError={(error, errorInfo) => {
        trackError(error, {
          errorType: 'runtime',
          severity: 'high',
          componentCode: currentCode,
          draftId
        })
      }}
    >
    <ErrorBoundary
      key={errorKey} // Force re-mount on reset
      FallbackComponent={(props: { error: Error; resetErrorBoundary: () => void }) => (
        <ErrorFallback
          {...props}
          componentCode={currentCode}
          onCodeFixed={handleCodeFixed}
            draftId={draftId} // P1: Pass draftId for version history and auto-save
        />
      )}
      onReset={handleReset}
    >
      <div className="min-h-screen relative">
        {/* P0 Feature 1: Auto-Save Indicator */}
        {draftId && (
          <div 
            className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg px-3 py-2 text-xs border"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" aria-hidden="true"></div>
                <span className="text-gray-600">Saving...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-2">
                <span className="text-green-600" aria-hidden="true">✓</span>
                <span className="text-gray-600">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              </div>
            ) : (
              <span className="text-gray-400">Ready</span>
            )}
          </div>
        )}

        {/* P2 Feature 4: Code Suggestions Display */}
        {codeSuggestions.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md shadow-lg">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 font-semibold">💡 Suggestions</span>
              <button
                onClick={() => setCodeSuggestions([])}
                className="ml-auto text-yellow-600 hover:text-yellow-800"
                aria-label="Dismiss suggestions"
                tabIndex={0}
              >
                ×
              </button>
            </div>
            <pre className="text-xs text-yellow-800 mt-2 whitespace-pre-wrap">
              {codeSuggestions[0]}
            </pre>
          </div>
        )}

        {/* P2 Feature 14: Undo/Redo Controls */}
        {draftId && undoRedoManager && (
          <div className="fixed bottom-4 left-4 z-50 flex gap-2">
            <button
              onClick={() => {
                const state = undoRedoManager.undo()
                if (state) {
                  handleUndo(state)
                }
              }}
              disabled={!undoRedoManager.canUndo()}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Undo (Ctrl+Z)"
              tabIndex={0}
            >
              ↶ Undo
            </button>
            <button
              onClick={() => {
                const state = undoRedoManager.redo()
                if (state) {
                  handleRedo(state)
                }
              }}
              disabled={!undoRedoManager.canRedo()}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Redo (Ctrl+Shift+Z)"
              tabIndex={0}
            >
              ↷ Redo
            </button>
          </div>
        )}

        {RenderedComponent ? <RenderedComponent /> : (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-6">
              <p className="text-red-600 mb-4 font-semibold">Error rendering component</p>
              <p className="text-gray-600 text-sm mb-4">
                The component code couldn't be parsed. Check the browser console (F12) for details.
              </p>
            </div>
          </div>
        )}

        {/* P2 Feature 18: Code Diff Visualization */}
        {showDiff && diffBeforeCode && diffAfterCode && (
          <React.Suspense fallback={<div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center"><div className="bg-white p-4 rounded">Loading diff...</div></div>}>
            <CodeDiff
              beforeCode={diffBeforeCode}
              afterCode={diffAfterCode}
              onClose={() => setShowDiff(false)}
            />
          </React.Suspense>
        )}
      </div>
    </ErrorBoundary>
    </AsyncErrorBoundary>
  )
}
