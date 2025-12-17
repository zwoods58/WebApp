/**
 * Error Categorizer - Categorize errors by type and severity
 * P2 Feature 12: Error Categorization
 * 
 * Categorizes errors for better debugging and handling
 */

export type ErrorCategory = 
  | 'syntax'
  | 'runtime'
  | 'network'
  | 'transpilation'
  | 'validation'
  | 'memory'
  | 'timeout'
  | 'unknown'

export enum ErrorSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum ErrorFixability {
  AUTO_FIXABLE = 'auto',
  GUIDED_FIX = 'guided',
  MANUAL_FIX = 'manual'
}

export type ErrorSeverityType = 'critical' | 'high' | 'medium' | 'low'

export interface CategorizedError {
  category: ErrorCategory
  severity: ErrorSeverityType
  fixability: ErrorFixability
  message: string
  originalError: Error
  context?: Record<string, any>
}

export interface ErrorPattern {
  pattern: RegExp | string
  category: ErrorCategory
  severity: ErrorSeverityType
  fixability: ErrorFixability
}

const ERROR_PATTERNS: ErrorPattern[] = [
  // Syntax errors
  {
    pattern: /SyntaxError|Unexpected token|Unexpected end|Missing|Expected/,
    category: 'syntax',
    severity: 'high',
    fixability: ErrorFixability.AUTO_FIXABLE
  },
  {
    pattern: /Unmatched|Unterminated|Missing closing/,
    category: 'syntax',
    severity: 'high',
    fixability: ErrorFixability.AUTO_FIXABLE
  },
  
  // Transpilation errors
  {
    pattern: /JSX|Transpilation|Babel|Unexpected token '<'/,
    category: 'transpilation',
    severity: 'high',
    fixability: ErrorFixability.AUTO_FIXABLE
  },
  
  // Runtime errors
  {
    pattern: /TypeError|ReferenceError|Cannot read|is not defined|is not a function/,
    category: 'runtime',
    severity: 'high',
    fixability: ErrorFixability.GUIDED_FIX
  },
  {
    pattern: /RangeError|Maximum call stack|out of range/,
    category: 'runtime',
    severity: 'critical',
    fixability: ErrorFixability.MANUAL_FIX
  },
  
  // Network errors
  {
    pattern: /Failed to fetch|NetworkError|timeout|ECONNREFUSED|ETIMEDOUT/,
    category: 'network',
    severity: 'medium',
    fixability: ErrorFixability.GUIDED_FIX
  },
  {
    pattern: /429|Rate limit|Too many requests/,
    category: 'network',
    severity: 'medium',
    fixability: ErrorFixability.AUTO_FIXABLE
  },
  
  // Memory errors
  {
    pattern: /out of memory|heap|memory limit|allocation failed/,
    category: 'memory',
    severity: 'critical',
    fixability: ErrorFixability.MANUAL_FIX
  },
  
  // Timeout errors
  {
    pattern: /timeout|timed out|execution timeout|exceeded.*time/,
    category: 'timeout',
    severity: 'medium',
    fixability: ErrorFixability.GUIDED_FIX
  },
  
  // Validation errors
  {
    pattern: /validation|invalid|malformed|does not match/,
    category: 'validation',
    severity: 'medium',
    fixability: ErrorFixability.AUTO_FIXABLE
  }
]

/**
 * Categorize an error
 */
export function categorizeError(error: Error, context?: Record<string, any>): CategorizedError {
  const errorMessage = error.message || ''
  const errorName = error.name || ''
  const fullText = `${errorName} ${errorMessage}`.toLowerCase()

  // Find matching pattern
  for (const pattern of ERROR_PATTERNS) {
    const regex = typeof pattern.pattern === 'string' 
      ? new RegExp(pattern.pattern, 'i')
      : pattern.pattern
    
    if (regex.test(fullText)) {
      return {
        category: pattern.category,
        severity: pattern.severity,
        fixability: pattern.fixability,
        message: errorMessage,
        originalError: error,
        context
      }
    }
  }

  // Default categorization
  let category: ErrorCategory = 'unknown'
  let severity: ErrorSeverityType = 'medium'
  let fixability: ErrorFixability = ErrorFixability.GUIDED_FIX

  // Try to infer from error name
  if (errorName.includes('Syntax')) {
    category = 'syntax'
    severity = 'high'
    fixability = ErrorFixability.AUTO_FIXABLE
  } else if (errorName.includes('Type') || errorName.includes('Reference')) {
    category = 'runtime'
    severity = 'high'
    fixability = ErrorFixability.GUIDED_FIX
  } else if (errorName.includes('Network') || errorName.includes('Fetch')) {
    category = 'network'
    severity = 'medium'
    fixability = ErrorFixability.GUIDED_FIX
  }

  return {
    category,
    severity,
    fixability,
    message: errorMessage,
    originalError: error,
    context
  }
}

/**
 * Group similar errors
 */
export function groupErrors(errors: CategorizedError[]): Map<string, CategorizedError[]> {
  const groups = new Map<string, CategorizedError[]>()

  for (const error of errors) {
    const key = `${error.category}-${error.severity}`
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(error)
  }

  return groups
}

/**
 * Get error statistics
 */
export function getErrorStatistics(errors: CategorizedError[]): {
  total: number
  byCategory: Record<ErrorCategory, number>
  bySeverity: Record<ErrorSeverity, number>
  mostCommon: ErrorCategory
  criticalCount: number
} {
  const byCategory: Record<ErrorCategory, number> = {
    syntax: 0,
    runtime: 0,
    network: 0,
    transpilation: 0,
    validation: 0,
    memory: 0,
    timeout: 0,
    unknown: 0
  }

  const bySeverity: Record<ErrorSeverityType, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  }

  for (const error of errors) {
    byCategory[error.category]++
    bySeverity[error.severity]++
  }

  const mostCommon = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])[0][0] as ErrorCategory

  return {
    total: errors.length,
    byCategory,
    bySeverity,
    mostCommon,
    criticalCount: bySeverity.critical
  }
}





