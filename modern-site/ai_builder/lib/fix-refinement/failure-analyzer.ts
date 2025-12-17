/**
 * Failure Analyzer
 * P0 Feature 7: Iterative Fix Refinement - Failure Analysis
 */

import { FixAttempt } from './iterative-fix-engine'

export interface FailurePattern {
  type: string
  frequency: number
  examples: string[]
  suggestion: string
}

/**
 * Analyze failure patterns from fix attempts
 */
export function analyzeFailurePatterns(attempts: FixAttempt[]): FailurePattern[] {
  const patterns: Map<string, { count: number; examples: string[] }> = new Map()

  attempts.forEach(attempt => {
    if (!attempt.success && attempt.result.error) {
      const errorType = categorizeFailure(attempt.result.error)
      
      if (!patterns.has(errorType)) {
        patterns.set(errorType, { count: 0, examples: [] })
      }

      const pattern = patterns.get(errorType)!
      pattern.count++
      pattern.examples.push(attempt.result.error)
    }
  })

  const result: FailurePattern[] = []

  patterns.forEach((data, type) => {
    result.push({
      type,
      frequency: data.count,
      examples: data.examples.slice(0, 3), // Limit examples
      suggestion: getSuggestionForType(type)
    })
  })

  return result.sort((a, b) => b.frequency - a.frequency)
}

/**
 * Categorize failure type
 */
function categorizeFailure(error: string): string {
  const errorLower = error.toLowerCase()

  if (errorLower.includes('type') || errorLower.includes('typescript')) {
    return 'type_error'
  }
  if (errorLower.includes('dependency') || errorLower.includes('package')) {
    return 'dependency_error'
  }
  if (errorLower.includes('syntax')) {
    return 'syntax_error'
  }
  if (errorLower.includes('import') || errorLower.includes('module')) {
    return 'import_error'
  }
  if (errorLower.includes('runtime')) {
    return 'runtime_error'
  }
  if (errorLower.includes('logic')) {
    return 'logic_error'
  }

  return 'unknown_error'
}

/**
 * Get suggestion for failure type
 */
function getSuggestionForType(type: string): string {
  const suggestions: Record<string, string> = {
    type_error: 'Review type definitions and ensure proper TypeScript types',
    dependency_error: 'Check package.json for version conflicts and missing dependencies',
    syntax_error: 'Review syntax and ensure proper code structure',
    import_error: 'Verify import paths and ensure modules are installed',
    runtime_error: 'Check runtime logic and ensure proper error handling',
    logic_error: 'Review business logic and ensure correct implementation',
    unknown_error: 'Manual review recommended'
  }

  return suggestions[type] || suggestions.unknown_error
}





