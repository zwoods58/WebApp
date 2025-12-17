/**
 * P2 Feature 14: Intelligent Code Suggestions
 * Proactive code quality suggestions and improvements
 */

import { VirtualFileSystem } from './virtual-filesystem'
import { lintVFS, LintResult } from './linting-loop'
import { checkCompilation, CompilationError } from './compilation-checker'

export interface CodeSuggestion {
  type: 'improvement' | 'warning' | 'error' | 'best-practice'
  file: string
  line: number
  column: number
  message: string
  suggestion: string
  priority: 'low' | 'medium' | 'high'
  category: 'performance' | 'readability' | 'security' | 'maintainability' | 'type-safety'
}

/**
 * Analyze code and generate suggestions
 */
export async function analyzeCode(
  vfs: VirtualFileSystem
): Promise<CodeSuggestion[]> {
  const suggestions: CodeSuggestion[] = []

  // Get linting results
  const lintResults = await lintVFS(vfs)
  
  // Convert lint warnings to suggestions
  Array.from(lintResults.results.values()).forEach(result => {
    result.warnings.forEach(warning => {
      suggestions.push({
        type: 'warning',
        file: warning.file,
        line: warning.line,
        column: warning.column,
        message: warning.message,
        suggestion: `Consider fixing: ${warning.message}`,
        priority: 'medium',
        category: 'maintainability'
      })
    })
  })

  // Get compilation results
  const compilationResult = await checkCompilation(vfs)
  
  // Convert compilation warnings to suggestions
  compilationResult.warnings.forEach(warning => {
    suggestions.push({
      type: 'warning',
      file: warning.file,
      line: warning.line,
      column: warning.column,
      message: warning.message,
      suggestion: `TypeScript warning: ${warning.message}`,
      priority: 'medium',
      category: 'type-safety'
    })
  })

  // Analyze files for best practices
  const files = vfs.getAllFiles()
  files.forEach(file => {
    if (file.path.match(/\.(tsx|ts|jsx|js)$/)) {
      const fileSuggestions = analyzeFileForBestPractices(file.path, file.content)
      suggestions.push(...fileSuggestions)
    }
  })

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

/**
 * Analyze file for best practices
 */
function analyzeFileForBestPractices(
  filePath: string,
  content: string
): CodeSuggestion[] {
  const suggestions: CodeSuggestion[] = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const lineNum = index + 1

    // Check for console.log in production code
    if (line.includes('console.log') && !line.includes('//')) {
      suggestions.push({
        type: 'best-practice',
        file: filePath,
        line: lineNum,
        column: 0,
        message: 'console.log found in code',
        suggestion: 'Remove console.log statements or use a proper logging library',
        priority: 'low',
        category: 'maintainability'
      })
    }

    // Check for TODO comments
    if (line.match(/\/\/\s*TODO/i)) {
      suggestions.push({
        type: 'improvement',
        file: filePath,
        line: lineNum,
        column: 0,
        message: 'TODO comment found',
        suggestion: 'Address TODO comment or remove if no longer needed',
        priority: 'low',
        category: 'maintainability'
      })
    }

    // Check for long functions (simple heuristic)
    const functionMatches = content.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]{500,}/g)
    if (functionMatches) {
      suggestions.push({
        type: 'improvement',
        file: filePath,
        line: lineNum,
        column: 0,
        message: 'Large function detected',
        suggestion: 'Consider breaking this function into smaller, more focused functions',
        priority: 'medium',
        category: 'readability'
      })
    }

    // Check for inline styles (should use Tailwind)
    if (line.match(/style\s*=\s*\{/)) {
      suggestions.push({
        type: 'best-practice',
        file: filePath,
        line: lineNum,
        column: 0,
        message: 'Inline styles detected',
        suggestion: 'Consider using Tailwind CSS utility classes instead of inline styles',
        priority: 'low',
        category: 'maintainability'
      })
    }

    // Check for missing error handling
    if (line.match(/await\s+\w+\(/) && !content.includes('try') && !content.includes('catch')) {
      suggestions.push({
        type: 'improvement',
        file: filePath,
        line: lineNum,
        column: 0,
        message: 'Async operation without error handling',
        suggestion: 'Add try-catch block for error handling',
        priority: 'high',
        category: 'maintainability'
      })
    }

    // Check for hardcoded strings (should be constants)
    if (line.match(/['"]\w{20,}['"]/)) {
      suggestions.push({
        type: 'improvement',
        file: filePath,
        line: lineNum,
        column: 0,
        message: 'Long hardcoded string detected',
        suggestion: 'Consider extracting to a constant or configuration file',
        priority: 'low',
        category: 'maintainability'
      })
    }
  })

  return suggestions
}

/**
 * Generate improvement suggestions for specific code
 */
export function suggestImprovements(code: string): CodeSuggestion[] {
  const suggestions: CodeSuggestion[] = []
  const lines = code.split('\n')

  lines.forEach((line, index) => {
    const lineNum = index + 1

    // Performance suggestions
    if (line.includes('.map(') && line.includes('.map(')) {
      suggestions.push({
        type: 'improvement',
        file: 'current',
        line: lineNum,
        column: 0,
        message: 'Multiple map operations',
        suggestion: 'Consider combining multiple map operations into a single pass',
        priority: 'medium',
        category: 'performance'
      })
    }

    // Readability suggestions
    if (line.length > 120) {
      suggestions.push({
        type: 'improvement',
        file: 'current',
        line: lineNum,
        column: 0,
        message: 'Long line detected',
        suggestion: 'Consider breaking this line for better readability',
        priority: 'low',
        category: 'readability'
      })
    }

    // Type safety suggestions
    if (line.includes('any')) {
      suggestions.push({
        type: 'warning',
        file: 'current',
        line: lineNum,
        column: 0,
        message: 'TypeScript any type used',
        suggestion: 'Replace "any" with a specific type for better type safety',
        priority: 'medium',
        category: 'type-safety'
      })
    }
  })

  return suggestions
}

/**
 * Format suggestions for display
 */
export function formatSuggestions(suggestions: CodeSuggestion[]): string {
  if (suggestions.length === 0) {
    return 'No suggestions found. Code looks good! ✅'
  }

  let output = `Found ${suggestions.length} suggestion(s):\n\n`

  suggestions.slice(0, 10).forEach((suggestion, index) => {
    output += `${index + 1}. [${suggestion.priority.toUpperCase()}] ${suggestion.file}:${suggestion.line}\n`
    output += `   ${suggestion.message}\n`
    output += `   💡 ${suggestion.suggestion}\n\n`
  })

  if (suggestions.length > 10) {
    output += `... and ${suggestions.length - 10} more suggestions\n`
  }

  return output
}





