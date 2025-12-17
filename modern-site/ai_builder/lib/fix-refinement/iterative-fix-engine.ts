/**
 * Iterative Fix Refinement Engine
 * P0 Feature 7: Iterative Fix Refinement
 */

import { FixSuggestion } from '../fix-validation/fix-validator'
import { getFixApplicator, ApplyResult } from '../fix-application/fix-applicator'
import { getErrorContextBuilder, ErrorContext } from '../error-analysis/error-context-builder'

export interface FixAttempt {
  attemptNumber: number
  fix: FixSuggestion
  result: ApplyResult
  success: boolean
  timestamp: Date
}

export interface FixResult {
  success: boolean
  finalFix?: FixSuggestion
  attempts: FixAttempt[]
  resolvedError?: Error
  unresolvedError?: Error
  recommendation?: string
}

class IterativeFixEngine {
  /**
   * Fix with retry and refinement
   */
  async fixWithRetry(
    error: Error,
    context: ErrorContext,
    maxAttempts: number = 3
  ): Promise<FixResult> {
    let attempt = 0
    const attemptHistory: FixAttempt[] = []

    while (attempt < maxAttempts) {
      attempt++

      console.log(`Fix attempt ${attempt}/${maxAttempts}`)

      // Generate fix with knowledge of previous attempts
      const fix = await this.generateFix({
        ...context,
        fixHistory: {
          attemptedFixes: attemptHistory,
          failedFixes: attemptHistory.filter(a => !a.success)
        }
      })

      // Apply and test
      const result = await getFixApplicator().applyFix(
        fix,
        context.projectContext.framework, // Would use projectId
        { createSnapshot: true, autoRollback: true }
      )

      attemptHistory.push({
        attemptNumber: attempt,
        fix,
        result,
        success: result.success || false,
        timestamp: new Date()
      })

      if (result.success) {
        return {
          success: true,
          finalFix: fix,
          attempts: attemptHistory,
          resolvedError: error
        }
      }

      // If test failed, analyze why and adjust context
      if (result.testResults) {
        context = await this.enrichContextWithFailure(
          context,
          result.testResults,
          fix
        )
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxAttempts) {
        await this.delay(Math.pow(2, attempt) * 1000)
      }
    }

    // All attempts failed
    return {
      success: false,
      attempts: attemptHistory,
      unresolvedError: error,
      recommendation: this.generateRecommendation(attemptHistory)
    }
  }

  /**
   * Generate fix (would call AI)
   */
  private async generateFix(context: ErrorContext): Promise<FixSuggestion> {
    // Would call AI fix generation API
    // For now, return mock fix
    return {
      fixType: 'replace',
      targetFile: 'component.tsx',
      oldCode: context.codeContext.fileContent,
      newCode: context.codeContext.fileContent + ' // Fixed',
      explanation: 'Applied fix based on error analysis',
      confidence: 0.8
    }
  }

  /**
   * Enrich context with failure information
   */
  private async enrichContextWithFailure(
    context: ErrorContext,
    testResults: any,
    failedFix: FixSuggestion
  ): Promise<ErrorContext> {
    return {
      ...context,
      fixHistory: {
        ...context.fixHistory,
        attemptedFixes: [
          ...context.fixHistory.attemptedFixes,
          {
            id: `attempt_${Date.now()}`,
            timestamp: new Date(),
            fixType: failedFix.fixType,
            explanation: failedFix.explanation,
            result: 'failed',
            error: testResults.tests
              .filter((t: any) => !t.passed)
              .map((t: any) => t.message)
              .join('; ')
          }
        ]
      }
    }
  }

  /**
   * Generate recommendation for manual fix
   */
  private generateRecommendation(attempts: FixAttempt[]): string {
    const commonFailures = this.analyzeFailurePatterns(attempts)

    if (commonFailures.includes('type_error')) {
      return 'This appears to be a complex type issue. Consider reviewing type definitions manually.'
    }

    if (commonFailures.includes('dependency_conflict')) {
      return 'There may be a dependency version conflict. Check package.json for incompatible versions.'
    }

    if (commonFailures.includes('logic_error')) {
      return 'The error may require understanding business logic. Manual review recommended.'
    }

    return 'Unable to auto-fix. Please review the error and fix manually.'
  }

  /**
   * Analyze failure patterns
   */
  private analyzeFailurePatterns(attempts: FixAttempt[]): string[] {
    const patterns: string[] = []

    attempts.forEach(attempt => {
      if (attempt.result.error) {
        const error = attempt.result.error.toLowerCase()
        if (error.includes('type')) patterns.push('type_error')
        if (error.includes('dependency')) patterns.push('dependency_conflict')
        if (error.includes('logic')) patterns.push('logic_error')
      }
    })

    return [...new Set(patterns)]
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Singleton instance
let iterativeFixEngine: IterativeFixEngine | null = null

export function getIterativeFixEngine(): IterativeFixEngine {
  if (!iterativeFixEngine) {
    iterativeFixEngine = new IterativeFixEngine()
  }
  return iterativeFixEngine
}





