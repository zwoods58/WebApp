'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AlertCircle, Sparkles, Code2, RefreshCw } from 'lucide-react'
// Import autonomous features for ErrorFallback integration
import { saveCodeVersion } from '../lib/agentic/version-history'
import { saveToLocalStorage } from '../lib/agentic/auto-save'
// P0: Production-ready features
import { checkRateLimit } from '../lib/security/rate-limiter'
import { trackError, trackMessage } from '../lib/monitoring/error-tracking'
import { getNetworkHandler } from '../lib/network/network-handler'
import { getPerformanceMonitor } from '../lib/performance/performance-monitor'
import { useToast } from '../lib/ux/toast-notifications'
// New auto-fix features
import { categorizeError } from '../lib/error-handling/error-categorizer'
import { getErrorRecovery } from '../lib/error-handling/error-recovery'
import { getErrorContextBuilder } from '../lib/error-analysis/error-context-builder'
import { getIterativeFixEngine } from '../lib/fix-refinement/iterative-fix-engine'
import { getFixApplicator } from '../lib/fix-application/fix-applicator'
import { getFixHistoryManager } from '../lib/fix-history/fix-history-manager'
import AutoFixProposal from '../components/fix-proposal/AutoFixProposal'
import { FixSuggestion } from '../lib/fix-validation/fix-validator'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
  componentCode: string
  onCodeFixed?: (fixedCode: string) => void
  autoFix?: boolean // Feature 1: Auto-fix without user interaction
  draftId?: string // P1: Added for version history and auto-save integration
}

export function ErrorFallback({ 
  error, 
  resetErrorBoundary, 
  componentCode,
  onCodeFixed,
  autoFix = true, // Default to auto-fix enabled
  draftId // P1: For version history and auto-save
}: ErrorFallbackProps) {
  const [isFixing, setIsFixing] = useState(false)
  const [fixStatus, setFixStatus] = useState<'idle' | 'fixing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isSilentMode, setIsSilentMode] = useState(false)
  const [proposedFix, setProposedFix] = useState<FixSuggestion | null>(null)
  const [showFixProposal, setShowFixProposal] = useState(false)
  const hasAutoFixed = useRef(false) // Track if we've already auto-fixed
  const lastErrorRef = useRef<string>('') // Track last error to detect changes
  const MAX_RETRIES = 3
  
  // P1 Feature 10: Toast notifications
  const { showToast } = useToast()

  // Feature 1: Auto-fix without user interaction with silent mode
  useEffect(() => {
    // P2 Feature 12: Categorize error
    const categorized = categorizeError(error, {
      componentCode: componentCode.substring(0, 500),
      draftId
    })
    
    // P0 Feature 2: Track error occurrence with categorization
    trackError(error, {
      errorType: categorized.category,
      severity: categorized.severity,
      componentCode: componentCode.substring(0, 500), // Limit code size in tracking
      draftId,
      errorMessage: error.message,
      stackTrace: error.stack
    })
    
    // P2 Feature 15: Attempt automatic recovery before AI fix
    const recovery = getErrorRecovery()
    const recoveryResult = recovery.attemptRecovery(error, componentCode)
    if (recoveryResult.success && recoveryResult.recoveredCode) {
      console.log(`✅ Auto-recovered using strategy: ${recoveryResult.strategy}`)
      showToast(`Auto-recovered using ${recoveryResult.strategy}`, 'success', 3000)
      if (onCodeFixed) {
        onCodeFixed(recoveryResult.recoveredCode)
      }
      return // Don't proceed with AI fix if recovery succeeded
    }
    
    // Reset auto-fix flag when error changes (new error = new fix attempt)
    const currentErrorKey = `${error.message}-${error.stack?.substring(0, 50) || ''}`
    if (error && currentErrorKey !== lastErrorRef.current) {
      // New error detected - reset auto-fix flag
      hasAutoFixed.current = false
      lastErrorRef.current = currentErrorKey
      setFixStatus('idle') // Reset status for new error
    }
    
    if (autoFix && error && !isFixing && !hasAutoFixed.current && fixStatus === 'idle') {
      hasAutoFixed.current = true
      setIsSilentMode(true) // Hide UI during auto-fix
      console.log('🤖 Auto-fixing error silently...')
      handleAIFixWithRetry()
    }
  }, [error, autoFix, isFixing, fixStatus, componentCode, draftId])

  // Reset auto-fix flag when error boundary resets (successful fix)
  useEffect(() => {
    // When component successfully renders, reset the flag for next error
    if (fixStatus === 'success') {
      setTimeout(() => {
        hasAutoFixed.current = false
        lastErrorRef.current = '' // Clear last error reference
      }, 2000) // Reset after successful fix
    }
  }, [fixStatus])

  // Retry logic with exponential backoff
  const handleAIFixWithRetry = async (attempt: number = 0): Promise<boolean> => {
    if (attempt >= MAX_RETRIES) {
      setIsSilentMode(false) // Show UI if all retries failed
      setFixStatus('error')
      setErrorMessage(`Failed to fix after ${MAX_RETRIES} attempts`)
      return false
    }

    setIsFixing(true)
    setFixStatus('fixing')
    setRetryCount(attempt)
    setErrorMessage(null)

    try {
      // P0 Feature 3: Rate limiting - Check before API call
      if (draftId) {
        const rateLimit = await checkRateLimit(draftId)
        if (!rateLimit.allowed) {
          const errorMsg = `Rate limit exceeded. Please wait ${rateLimit.retryAfter}s before trying again.`
          setErrorMessage(errorMsg)
          setFixStatus('error')
          setIsFixing(false)
          setIsSilentMode(false)
          showToast(errorMsg, 'warning', 5000)
          trackMessage('Rate limit exceeded', 'warning', {
            errorType: 'network',
            severity: 'medium',
            draftId,
            retryAfter: rateLimit.retryAfter
          })
          return false
        }
      }
      
      // P0 Feature 2: Track fix attempt
      trackMessage(`Attempting to fix error (attempt ${attempt + 1}/${MAX_RETRIES})`, 'info', {
        errorType: 'runtime',
        severity: 'medium',
        draftId,
        errorMessage: error.message,
        attempt: attempt + 1
      })
      
      // P1 Feature 6: Use network handler for offline support
      const networkHandler = getNetworkHandler()
      const apiStartTime = performance.now()
      
      // Build comprehensive error context
      const contextBuilder = getErrorContextBuilder()
      const errorContext = await contextBuilder.buildContext(
        error,
        draftId || 'unknown',
        'component.tsx'
      )

      const response = await networkHandler.fetch('/api/ai-builder/fix-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentCode,
          errorMessage: error.message,
          stackTrace: error.stack,
          retryAttempt: attempt,
          errorContext, // Include comprehensive context
          categorizedError: categorizeError(error, { componentCode, draftId })
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fix error')
      }

      const data = await response.json()
      
      // If structured fix is returned, use new fix application system
      if (data.fix && draftId) {
        const fixSuggestion: FixSuggestion = data.fix
        
        // Show fix proposal if confidence is low or user preference
        if (fixSuggestion.confidence < 0.7) {
          setProposedFix(fixSuggestion)
          setShowFixProposal(true)
          setIsFixing(false)
          setIsSilentMode(false)
          return false // Wait for user approval
        }
        
        // Apply fix using new safe application system
        const fixApplicator = getFixApplicator()
        const result = await fixApplicator.applyFix(
          fixSuggestion,
          draftId,
          {
            createSnapshot: true,
            autoRollback: true
          }
        )
        
        if (result.success && result.appliedFix) {
          // Record fix in history
          const fixHistoryManager = getFixHistoryManager()
          await fixHistoryManager.recordFixAttempt(
            draftId,
            error,
            fixSuggestion,
            true,
            attempt + 1
          )
          
          // Use fixed code from result
          if (result.appliedFix.operations[0]?.newContent) {
            data.fixedCode = result.appliedFix.operations[0].newContent
          }
        } else {
          // Fallback to old method if new system fails
          console.warn('New fix system failed, falling back to old method')
        }
      }
      
      if (data.fixedCode) {
        const apiResponseTime = performance.now() - apiStartTime
        
        console.log(`✅ Error fixed successfully using ${data.model || 'Claude Sonnet'}`)
        console.log(`📝 Fixed code length: ${data.fixedCode.length} characters`)
        
        // P1 Feature 7: Track API performance
        const perfMonitor = getPerformanceMonitor()
        perfMonitor.trackApi('/api/ai-builder/fix-error', apiResponseTime)
        
        setFixStatus('success')
        
        // P0 Feature 2: Track successful fix
        trackMessage('Error fixed successfully', 'info', {
          errorType: 'runtime',
          severity: 'low',
          draftId,
          attempt: attempt + 1,
          model: data.model || 'Claude Sonnet',
          apiResponseTime
        })
        
        // P1 Feature 10: Show success toast
        showToast('Error fixed successfully!', 'success', 3000)
        
        // P1 Feature 2: Save version history before updating (if draftId provided)
        if (draftId) {
          try {
            await saveCodeVersion(draftId, componentCode, `Before auto-fix (attempt ${attempt + 1})`)
            console.log('📝 Saved version before fix')
          } catch (err) {
            console.warn('Failed to save version before fix:', err)
            showToast('Failed to save version', 'warning', 2000)
          }
        }
        
        // P0 Feature 1: Immediate localStorage backup
        if (draftId) {
          saveToLocalStorage(draftId, data.fixedCode)
        }
        
        // Call the callback to update the code (this saves to database via handleCodeUpdate)
        if (onCodeFixed) {
          console.log('🔄 Calling onCodeFixed callback to update code...')
          onCodeFixed(data.fixedCode)
        } else {
          console.warn('⚠️ No onCodeFixed callback provided - code won\'t be saved')
        }
        
        // P1 Feature 2: Save version history after fix (if draftId provided)
        if (draftId) {
          try {
            await saveCodeVersion(draftId, data.fixedCode, `Auto-fixed by Claude Sonnet (attempt ${attempt + 1})`)
            console.log('📝 Saved version after fix')
          } catch (err) {
            console.warn('Failed to save version after fix:', err)
          }
        }
        
        // Reset error boundary after a short delay to allow code update to propagate
        setTimeout(() => {
          console.log('🔄 Resetting error boundary with fixed code...')
          resetErrorBoundary()
          setIsSilentMode(false)
        }, 1000) // Increased delay to ensure code update propagates
        
        return true
      } else {
        throw new Error('No fixed code returned from API')
      }
    } catch (err: any) {
      console.error(`Error fixing failed (attempt ${attempt + 1}/${MAX_RETRIES}):`, err)
      
        // P0 Feature 2: Track fix failure
      trackError(err instanceof Error ? err : new Error(String(err)), {
        errorType: 'network',
        severity: attempt >= MAX_RETRIES - 1 ? 'high' : 'medium',
        draftId,
        errorMessage: error.message,
        attempt: attempt + 1
      })
      
      // Record failed fix attempt in history
      if (draftId) {
        const fixHistoryManager = getFixHistoryManager()
        await fixHistoryManager.recordFixAttempt(
          draftId,
          error,
          {
            fixType: 'replace',
            targetFile: 'component.tsx',
            newCode: componentCode,
            explanation: 'Fix attempt failed',
            confidence: 0
          },
          false,
          attempt + 1
        )
      }
      
      // Exponential backoff before retry
      if (attempt < MAX_RETRIES - 1) {
        const backoffDelay = 1000 * Math.pow(2, attempt) // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, backoffDelay))
        return handleAIFixWithRetry(attempt + 1)
      } else {
        setIsSilentMode(false) // Show UI on final failure
      setFixStatus('error')
        const errorMsg = err.message || 'Failed to fix error'
        setErrorMessage(errorMsg)
        // P1 Feature 10: Show error toast
        showToast(`Failed to fix error: ${errorMsg}`, 'error', 5000)
        return false
      }
    } finally {
      setIsFixing(false)
    }
  }

  const handleAIFix = async () => {
    setIsSilentMode(false) // Manual fix shows UI
    await handleAIFixWithRetry(0)
  }

  // Extract error location from stack trace if available
  const getErrorLocation = () => {
    if (!error.stack) return null
    
    // Try to extract file and line number from stack trace
    const stackMatch = error.stack.match(/at\s+(.+?):(\d+):(\d+)/)
    if (stackMatch) {
      return {
        file: stackMatch[1],
        line: stackMatch[2],
        column: stackMatch[3],
      }
    }
    return null
  }

  const errorLocation = getErrorLocation()

  // Silent mode: Show minimal loading indicator instead of full error UI
  if (isSilentMode && (isFixing || fixStatus === 'fixing')) {
    const progressPercentage = ((retryCount + 1) / MAX_RETRIES) * 100
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm mb-2">
            {retryCount > 0 ? `Auto-fixing errors (attempt ${retryCount + 1}/${MAX_RETRIES})...` : 'Auto-fixing errors with Claude Sonnet...'}
          </p>
          {/* Progress indicator */}
          <div className="w-64 mx-auto mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-1">{Math.round(progressPercentage)}%</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl border border-red-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-xl font-bold">Component Error Detected</h2>
        </div>

        {/* Error Details */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Error Message</h3>
                <p className="text-red-800 text-sm font-mono">{error.message}</p>
              </div>
            </div>
          </div>

          {/* Error Location */}
          {errorLocation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Code2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Error Location</h3>
                  <p className="text-yellow-800 text-sm font-mono">
                    {errorLocation.file}:{errorLocation.line}:{errorLocation.column}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Code Snippet */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Code Snippet (First 500 chars)
            </h3>
            <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-48 font-mono">
              {componentCode.substring(0, 500)}
              {componentCode.length > 500 && '\n\n... (truncated)'}
            </pre>
          </div>

          {/* Fix Proposal (if low confidence) */}
          {showFixProposal && proposedFix && (
            <AutoFixProposal
              fix={proposedFix}
              onAccept={async (fix) => {
                setShowFixProposal(false)
                if (draftId) {
                  const fixApplicator = getFixApplicator()
                  const result = await fixApplicator.applyFix(fix, draftId, {
                    createSnapshot: true,
                    autoRollback: true
                  })
                  if (result.success && result.appliedFix?.operations[0]?.newContent) {
                    if (onCodeFixed) {
                      onCodeFixed(result.appliedFix.operations[0].newContent)
                    }
                    setTimeout(() => resetErrorBoundary(), 1000)
                  }
                }
              }}
              onReject={() => {
                setShowFixProposal(false)
                setIsSilentMode(false)
              }}
            />
          )}

          {/* Status Messages */}
          {fixStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Code fixed successfully! Reloading component...
              </p>
            </div>
          )}

          {fixStatus === 'error' && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Fix failed: {errorMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAIFix}
              disabled={isFixing || fixStatus === 'fixing'}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              aria-label={isFixing || fixStatus === 'fixing' ? 'Fixing errors with AI' : 'Fix errors with AI'}
              aria-busy={isFixing || fixStatus === 'fixing'}
              aria-live="polite"
              tabIndex={0}
            >
              {isFixing || fixStatus === 'fixing' ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Fixing with Claude Sonnet 4.5...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  <span>Fix Errors with AI</span>
                </>
              )}
            </button>

            <button
              onClick={resetErrorBoundary}
              disabled={isFixing || fixStatus === 'fixing'}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Retry rendering component"
              aria-disabled={isFixing || fixStatus === 'fixing'}
              tabIndex={0}
            >
              Retry
            </button>
          </div>

          {/* Stack Trace (Collapsible) */}
          {error.stack && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium mb-2">
                View Stack Trace
              </summary>
              <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-64 font-mono">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}


