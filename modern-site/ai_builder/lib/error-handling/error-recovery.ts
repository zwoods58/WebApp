/**
 * Error Recovery Strategies
 * P2 Feature 15: Error Recovery Strategies
 * 
 * Multiple recovery strategies and pattern matching
 */

import { categorizeError, CategorizedError, ErrorCategory } from './error-categorizer'

export interface RecoveryStrategy {
  name: string
  category: ErrorCategory[]
  apply: (error: CategorizedError, code: string) => string | null
  priority: number // Higher priority = tried first
}

export interface RecoveryResult {
  success: boolean
  recoveredCode?: string
  strategy?: string
  error?: Error
}

class ErrorRecovery {
  private strategies: RecoveryStrategy[] = []

  constructor() {
    this.registerDefaultStrategies()
  }

  /**
   * Register a recovery strategy
   */
  registerStrategy(strategy: RecoveryStrategy): void {
    this.strategies.push(strategy)
    // Sort by priority (highest first)
    this.strategies.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Register default recovery strategies
   */
  private registerDefaultStrategies(): void {
    // Strategy 1: Fix unmatched brackets
    this.registerStrategy({
      name: 'fix-unmatched-brackets',
      category: ['syntax'],
      priority: 10,
      apply: (error, code) => {
        const openBrackets = (code.match(/\{/g) || []).length
        const closeBrackets = (code.match(/\}/g) || []).length
        
        if (openBrackets > closeBrackets) {
          // Add missing closing brackets
          const missing = openBrackets - closeBrackets
          return code + '\n' + '}'.repeat(missing)
        } else if (closeBrackets > openBrackets) {
          // Remove extra closing brackets (simple approach)
          let fixed = code
          const extra = closeBrackets - openBrackets
          for (let i = 0; i < extra; i++) {
            fixed = fixed.replace(/\}/, '')
          }
          return fixed
        }
        
        return null
      }
    })

    // Strategy 2: Fix unmatched parentheses
    this.registerStrategy({
      name: 'fix-unmatched-parentheses',
      category: ['syntax'],
      priority: 9,
      apply: (error, code) => {
        const openParens = (code.match(/\(/g) || []).length
        const closeParens = (code.match(/\)/g) || []).length
        
        if (openParens > closeParens) {
          const missing = openParens - closeParens
          return code + ')'.repeat(missing)
        } else if (closeParens > openParens) {
          let fixed = code
          const extra = closeParens - openParens
          for (let i = 0; i < extra; i++) {
            fixed = fixed.replace(/\)/, '')
          }
          return fixed
        }
        
        return null
      }
    })

    // Strategy 3: Fix unterminated strings
    this.registerStrategy({
      name: 'fix-unterminated-strings',
      category: ['syntax'],
      priority: 8,
      apply: (error, code) => {
        const lines = code.split('\n')
        const fixed: string[] = []
        
        for (const line of lines) {
          let fixedLine = line
          
          // Check for unterminated double quotes
          const doubleQuotes = (line.match(/"/g) || []).length
          if (doubleQuotes % 2 !== 0 && line.includes('=')) {
            // Try to fix by adding closing quote
            if (!line.endsWith('"')) {
              fixedLine = line + '"'
            }
          }
          
          // Check for unterminated single quotes
          const singleQuotes = (line.match(/'/g) || []).length
          if (singleQuotes % 2 !== 0 && line.includes('=')) {
            if (!line.endsWith("'")) {
              fixedLine = line + "'"
            }
          }
          
          fixed.push(fixedLine)
        }
        
        const result = fixed.join('\n')
        return result !== code ? result : null
      }
    })

    // Strategy 4: Fix common JSX issues
    this.registerStrategy({
      name: 'fix-jsx-issues',
      category: ['transpilation'],
      priority: 7,
      apply: (error, code) => {
        let fixed = code
        
        // Fix self-closing tags
        fixed = fixed.replace(/<(\w+)([^>]*)\s*>\s*<\/\1>/g, '<$1$2 />')
        
        // Fix missing closing tags (simple cases)
        const openTags = code.match(/<(\w+)[^>]*>/g) || []
        const closeTags = code.match(/<\/(\w+)>/g) || []
        
        if (openTags.length > closeTags.length) {
          // Try to add missing closing tags (simplified)
          // This is a basic implementation - AI fix is better
          return null
        }
        
        return fixed !== code ? fixed : null
      }
    })

    // Strategy 5: Remove problematic code patterns
    this.registerStrategy({
      name: 'remove-problematic-patterns',
      category: ['runtime', 'syntax'],
      priority: 5,
      apply: (error, code) => {
        let fixed = code
        
        // Remove eval() calls (security risk)
        if (code.includes('eval(')) {
          fixed = fixed.replace(/eval\s*\([^)]*\)/g, 'null')
        }
        
        // Remove Function constructor (security risk)
        if (code.includes('new Function(')) {
          // This is tricky - might need AI fix
          return null
        }
        
        return fixed !== code ? fixed : null
      }
    })
  }

  /**
   * Attempt to recover from error
   */
  attemptRecovery(error: Error, code: string): RecoveryResult {
    const categorized = categorizeError(error)
    
    // Find applicable strategies
    const applicableStrategies = this.strategies.filter(
      strategy => strategy.category.includes(categorized.category) || 
                  strategy.category.includes('unknown')
    )

    // Try each strategy in priority order
    for (const strategy of applicableStrategies) {
      try {
        const recoveredCode = strategy.apply(categorized, code)
        
        if (recoveredCode && recoveredCode !== code) {
          return {
            success: true,
            recoveredCode,
            strategy: strategy.name
          }
        }
      } catch (err) {
        // Strategy failed, try next one
        continue
      }
    }

    // No strategy worked
    return {
      success: false,
      error: new Error('No recovery strategy succeeded')
    }
  }

  /**
   * Get available strategies for error category
   */
  getStrategiesForCategory(category: ErrorCategory): RecoveryStrategy[] {
    return this.strategies.filter(
      strategy => strategy.category.includes(category) || 
                  strategy.category.includes('unknown')
    )
  }
}

// Singleton instance
let errorRecovery: ErrorRecovery | null = null

export function getErrorRecovery(): ErrorRecovery {
  if (!errorRecovery) {
    errorRecovery = new ErrorRecovery()
  }
  return errorRecovery
}





