/**
 * Enhanced Code Validation
 * P2 Feature 13: Enhanced Code Validation
 * 
 * TypeScript and ESLint-like validation
 */

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  type: 'syntax' | 'type' | 'lint' | 'security' | 'performance'
  message: string
  line?: number
  column?: number
  code?: string
  severity: 'error' | 'warning'
}

export interface ValidationWarning {
  type: 'best-practice' | 'performance' | 'accessibility'
  message: string
  line?: number
  suggestion?: string
}

class EnhancedValidator {
  /**
   * Validate code with enhanced checks
   */
  validate(code: string): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // 1. Syntax validation (already done in ComponentRenderer, but enhanced)
    this.validateSyntax(code, errors)

    // 2. Type-like validation (check for common type errors)
    this.validateTypes(code, errors, warnings)

    // 3. Lint-like validation (best practices)
    this.validateLinting(code, warnings)

    // 4. Security validation
    this.validateSecurity(code, errors)

    // 5. Performance validation
    this.validatePerformance(code, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Enhanced syntax validation
   */
  private validateSyntax(code: string, errors: ValidationError[]): void {
    const lines = code.split('\n')

    // Check for common syntax issues
    lines.forEach((line, index) => {
      // Unclosed template literals
      const backticks = (line.match(/`/g) || []).length
      if (backticks % 2 !== 0 && line.includes('${')) {
        errors.push({
          type: 'syntax',
          message: 'Unclosed template literal',
          line: index + 1,
          code: line.trim(),
          severity: 'error'
        })
      }

      // Unclosed JSX tags (simple check)
      const openTags = (line.match(/<\w+/g) || []).length
      const closeTags = (line.match(/<\/\w+>/g) || []).length
      if (openTags > closeTags && !line.includes('/>')) {
        // Potential unclosed tag (warning, not error - might be multi-line)
        warnings.push({
          type: 'best-practice',
          message: 'Potential unclosed JSX tag',
          line: index + 1,
          suggestion: 'Ensure all JSX tags are properly closed'
        })
      }
    })
  }

  /**
   * Type-like validation
   */
  private validateTypes(code: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Check for undefined variable usage
    const undefinedPattern = /\b(undefined|null)\s*\.\s*\w+/g
    const matches = code.matchAll(undefinedPattern)
    for (const match of matches) {
      warnings.push({
        type: 'best-practice',
        message: `Potential null/undefined access: ${match[0]}`,
        suggestion: 'Add null check before accessing property'
      })
    }

    // Check for missing return statements in functions
    const functionPattern = /function\s+\w+\s*\([^)]*\)\s*\{[^}]*\}/g
    const functions = code.matchAll(functionPattern)
    for (const match of functions) {
      const funcBody = match[0]
      if (!funcBody.includes('return') && !funcBody.includes('useEffect') && !funcBody.includes('useState')) {
        warnings.push({
          type: 'best-practice',
          message: 'Function may be missing return statement',
          suggestion: 'Ensure function returns a value if needed'
        })
      }
    }
  }

  /**
   * Lint-like validation
   */
  private validateLinting(code: string, warnings: ValidationWarning[]): void {
    const lines = code.split('\n')

    lines.forEach((line, index) => {
      // Check for console.log in production code (warning)
      if (line.includes('console.log') && !line.includes('//')) {
        warnings.push({
          type: 'best-practice',
          message: 'console.log found - consider removing for production',
          line: index + 1,
          suggestion: 'Use proper logging or remove console.log statements'
        })
      }

      // Check for unused variables (simple check)
      const varPattern = /(const|let|var)\s+(\w+)\s*=/g
      const varMatches = line.matchAll(varPattern)
      for (const match of varMatches) {
        const varName = match[2]
        // Check if variable is used elsewhere (simple check)
        const usageCount = (code.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length
        if (usageCount === 1) {
          warnings.push({
            type: 'best-practice',
            message: `Variable '${varName}' is declared but may not be used`,
            line: index + 1,
            suggestion: 'Remove unused variable or use it in your code'
          })
        }
      }

      // Check for == instead of ===
      if (line.includes(' == ') && !line.includes('===')) {
        warnings.push({
          type: 'best-practice',
          message: 'Use === instead of == for strict equality',
          line: index + 1,
          suggestion: 'Replace == with === for type-safe comparison'
        })
      }
    })
  }

  /**
   * Security validation
   */
  private validateSecurity(code: string, errors: ValidationError[]): void {
    // Check for dangerous patterns
    if (code.includes('eval(')) {
      errors.push({
        type: 'security',
        message: 'eval() is a security risk and should not be used',
        severity: 'error'
      })
    }

    if (code.includes('new Function(')) {
      errors.push({
        type: 'security',
        message: 'new Function() is a security risk',
        severity: 'error'
      })
    }

    if (code.includes('innerHTML') && !code.includes('DOMPurify')) {
      warnings.push({
        type: 'best-practice',
        message: 'innerHTML usage without sanitization is a security risk',
        suggestion: 'Use DOMPurify or React\'s built-in XSS protection'
      })
    }

    // Check for hardcoded secrets (basic check)
    const secretPattern = /(password|secret|api[_-]?key|token)\s*[:=]\s*['"][^'"]+['"]/gi
    if (secretPattern.test(code)) {
      errors.push({
        type: 'security',
        message: 'Potential hardcoded secret detected',
        severity: 'error'
      })
    }
  }

  /**
   * Performance validation
   */
  private validatePerformance(code: string, warnings: ValidationWarning[]): void {
    // Check for missing keys in map
    const mapPattern = /\.map\s*\(\s*\([^)]*\)\s*=>/g
    const mapMatches = code.matchAll(mapPattern)
    for (const match of mapMatches) {
      const mapCode = code.substring(match.index || 0, (match.index || 0) + 200)
      if (!mapCode.includes('key=') && !mapCode.includes('key:')) {
        warnings.push({
          type: 'performance',
          message: 'Array.map() without key prop can cause performance issues',
          suggestion: 'Add unique key prop to mapped elements'
        })
      }
    }

    // Check for inline functions in JSX (performance issue)
    const inlineFunctionPattern = /onClick\s*=\s*\{\s*\(\)\s*=>/g
    if (inlineFunctionPattern.test(code)) {
      warnings.push({
        type: 'performance',
        message: 'Inline functions in JSX can cause unnecessary re-renders',
        suggestion: 'Use useCallback or move function outside component'
      })
    }

    // Check for missing dependencies in useEffect
    const useEffectPattern = /useEffect\s*\(\s*\([^)]*\)\s*=>\s*\{[^}]*\},\s*\[\s*\]/g
    if (useEffectPattern.test(code)) {
      warnings.push({
        type: 'performance',
        message: 'useEffect with empty dependency array may be missing dependencies',
        suggestion: 'Review useEffect dependencies'
      })
    }
  }
}

// Singleton instance
let validator: EnhancedValidator | null = null

export function getEnhancedValidator(): EnhancedValidator {
  if (!validator) {
    validator = new EnhancedValidator()
  }
  return validator
}

export function validateCode(code: string): ValidationResult {
  const validator = getEnhancedValidator()
  return validator.validate(code)
}





