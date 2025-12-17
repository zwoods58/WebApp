/**
 * Linting Loop - Runs ESLint on generated code and sends errors back to AI for auto-correction
 * Part of Cursor-style agentic architecture
 */

import { ESLint } from 'eslint'
import { VirtualFileSystem } from './virtual-filesystem'

export interface LintError {
  file: string
  line: number
  column: number
  message: string
  rule: string
  severity: 'error' | 'warning'
}

export interface LintResult {
  success: boolean
  errors: LintError[]
  warnings: LintError[]
  fixed: boolean
}

/**
 * Create ESLint instance with React/TypeScript configuration
 */
function createESLint(): ESLint {
  return new ESLint({
    fix: true // Auto-fix when possible
    // Uses project's .eslintrc.json by default
  })
}

/**
 * Lint a single file
 */
export async function lintFile(
  filePath: string,
  content: string,
  eslint?: ESLint
): Promise<LintResult> {
  const lint = eslint || createESLint()
  
  try {
    const results = await lint.lintText(content, { filePath })
    const result = results[0]
    
    if (!result) {
      return {
        success: true,
        errors: [],
        warnings: [],
        fixed: false
      }
    }
    
    const errors: LintError[] = []
    const warnings: LintError[] = []
    
    result.messages.forEach(msg => {
      const lintError: LintError = {
        file: filePath,
        line: msg.line,
        column: msg.column || 0,
        message: msg.message,
        rule: msg.ruleId || 'unknown',
        severity: msg.severity === 2 ? 'error' : 'warning'
      }
      
      if (lintError.severity === 'error') {
        errors.push(lintError)
      } else {
        warnings.push(lintError)
      }
    })
    
    return {
      success: errors.length === 0,
      errors,
      warnings,
      fixed: result.output !== undefined && result.output !== content
    }
  } catch (error: any) {
    // If ESLint fails to parse (e.g., syntax errors), return as error
    return {
      success: false,
      errors: [{
        file: filePath,
        line: 1,
        column: 0,
        message: error.message || 'ESLint parsing failed',
        rule: 'syntax-error',
        severity: 'error'
      }],
      warnings: [],
      fixed: false
    }
  }
}

/**
 * Lint all files in VFS
 */
export async function lintVFS(vfs: VirtualFileSystem): Promise<{
  results: Map<string, LintResult>
  totalErrors: number
  totalWarnings: number
  allFixed: boolean
}> {
  const eslint = createESLint()
  const files = vfs.getAllFiles()
  const results = new Map<string, LintResult>()
  
  let totalErrors = 0
  let totalWarnings = 0
  let allFixed = true
  
  for (const file of files) {
    // Only lint TypeScript/JavaScript files
    if (!file.path.match(/\.(ts|tsx|js|jsx)$/)) {
      continue
    }
    
    const result = await lintFile(file.path, file.content, eslint)
    results.set(file.path, result)
    
    totalErrors += result.errors.length
    totalWarnings += result.warnings.length
    
    if (!result.success) {
      allFixed = false
    }
    
    // Update VFS with fixed content if auto-fix was applied
    if (result.fixed) {
      const fixedContent = await eslint.loadFormatter('stylish')
      // Note: ESLint's fix is applied in-place, we need to re-read
      // For now, we'll rely on the AI to fix based on error messages
    }
  }
  
  return {
    results,
    totalErrors,
    totalWarnings,
    allFixed: allFixed && totalErrors === 0
  }
}

/**
 * Format lint errors for AI prompt
 */
export function formatLintErrorsForAI(errors: LintError[]): string {
  if (errors.length === 0) {
    return 'No linting errors found.'
  }
  
  const grouped = new Map<string, LintError[]>()
  
  errors.forEach(error => {
    if (!grouped.has(error.file)) {
      grouped.set(error.file, [])
    }
    grouped.get(error.file)!.push(error)
  })
  
  let output = 'ESLint found the following errors that need to be fixed:\n\n'
  
  grouped.forEach((fileErrors, file) => {
    output += `File: ${file}\n`
    fileErrors.forEach(error => {
      output += `  Line ${error.line}, Column ${error.column}: ${error.message} (${error.rule})\n`
    })
    output += '\n'
  })
  
  return output
}
