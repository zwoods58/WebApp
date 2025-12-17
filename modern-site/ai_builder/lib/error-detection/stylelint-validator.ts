/**
 * Stylelint Validator for CSS/SCSS
 * P0 Feature 1: Complete Static Analysis Tools - Stylelint
 */

// Note: Stylelint requires server-side execution
// For client-side, use basic CSS validation

export interface StylelintResult {
  source: string
  warnings: StylelintWarning[]
  errored: boolean
}

export interface StylelintWarning {
  line: number
  column: number
  rule: string
  severity: 'error' | 'warning'
  text: string
  fixable?: boolean
}

/**
 * Validate CSS/SCSS code (server-side)
 * Requires: npm install stylelint
 */
export async function validateCSS(
  code: string,
  filePath: string,
  options: { autoFix?: boolean } = {}
): Promise<StylelintResult> {
  // Dynamic import to avoid bundling in client
  if (typeof window !== 'undefined') {
    // Client-side: return basic validation
    return validateCSSClient(code, filePath)
  }

  try {
    const stylelint = await import('stylelint')
    
    const result = await stylelint.default.lint({
      code,
      codeFilename: filePath,
      fix: options.autoFix || false,
      formatter: 'string'
    })

    return {
      source: result.output || code,
      warnings: result.results[0]?.warnings || [],
      errored: result.errored || false
    }
  } catch (error: any) {
    console.error('Stylelint validation error:', error)
    return {
      source: code,
      warnings: [{
        line: 1,
        column: 0,
        rule: 'stylelint-error',
        severity: 'error',
        text: error.message || 'Stylelint validation failed'
      }],
      errored: true
    }
  }
}

/**
 * Basic CSS validation (client-side)
 */
function validateCSSClient(code: string, filePath: string): StylelintResult {
  const warnings: StylelintWarning[] = []

  // Basic CSS syntax checks
  const lines = code.split('\n')
  
  lines.forEach((line, index) => {
    const lineNum = index + 1

    // Check for unmatched braces
    const openBraces = (line.match(/\{/g) || []).length
    const closeBraces = (line.match(/\}/g) || []).length
    
    if (openBraces !== closeBraces && line.trim()) {
      warnings.push({
        line: lineNum,
        column: 0,
        rule: 'css-syntax',
        severity: 'warning',
        text: 'Possible unmatched braces'
      })
    }

    // Check for missing semicolons (basic check)
    if (line.includes(':') && !line.includes(';') && !line.includes('{') && !line.trim().endsWith('}')) {
      warnings.push({
        line: lineNum,
        column: line.length,
        rule: 'css-syntax',
        severity: 'warning',
        text: 'Missing semicolon',
        fixable: true
      })
    }
  })

  return {
    source: code,
    warnings,
    errored: warnings.some(w => w.severity === 'error')
  }
}





