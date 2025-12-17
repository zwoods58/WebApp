/**
 * Context Gatherer - Helper utilities for gathering error context
 * P0 Feature 3: Comprehensive Error Context Gathering
 */

export interface CodeContext {
  before: string[]
  errorLine: string
  after: string[]
  fullFile: string
}

/**
 * Gather code context around error line
 */
export function gatherCodeContext(
  code: string,
  lineNumber: number,
  contextLines: number = 10
): CodeContext {
  const lines = code.split('\n')
  const start = Math.max(0, lineNumber - contextLines - 1)
  const end = Math.min(lines.length, lineNumber + contextLines)

  return {
    before: lines.slice(start, lineNumber - 1),
    errorLine: lines[lineNumber - 1] || '',
    after: lines.slice(lineNumber, end),
    fullFile: code
  }
}

/**
 * Extract function/component context
 */
export function extractFunctionContext(code: string, lineNumber: number): string {
  const lines = code.split('\n')
  const targetLine = lines[lineNumber - 1] || ''

  // Find function/component start
  let start = lineNumber - 1
  while (start > 0 && !lines[start].match(/^\s*(function|const|export|class)\s+/)) {
    start--
  }

  // Find function/component end
  let end = lineNumber
  let braceCount = 0
  while (end < lines.length) {
    const line = lines[end]
    braceCount += (line.match(/\{/g) || []).length
    braceCount -= (line.match(/\}/g) || []).length

    if (braceCount === 0 && start < end) {
      break
    }
    end++
  }

  return lines.slice(start, end + 1).join('\n')
}

/**
 * Extract import statements
 */
export function extractImports(code: string): Array<{
  default?: string
  named: string[]
  from: string
  line: number
}> {
  const imports: Array<{
    default?: string
    named: string[]
    from: string
    line: number
  }> = []

  const lines = code.split('\n')
  
  lines.forEach((line, index) => {
    const importMatch = line.match(/import\s+(?:(.+?)\s+from\s+)?['"](.+?)['"]/)
    if (importMatch) {
      const importsPart = importMatch[1] || ''
      const from = importMatch[2]

      // Parse default import
      const defaultMatch = importsPart.match(/^(\w+)(?:\s*,)?/)
      const defaultImport = defaultMatch ? defaultMatch[1] : undefined

      // Parse named imports
      const namedMatch = importsPart.match(/\{([^}]+)\}/)
      const namedImports = namedMatch
        ? namedMatch[1].split(',').map(i => i.trim())
        : []

      imports.push({
        default: defaultImport,
        named: namedImports,
        from,
        line: index + 1
      })
    }
  })

  return imports
}

/**
 * Detect framework from code
 */
export function detectFramework(code: string, dependencies: Record<string, string>): string {
  // Check dependencies first
  if (dependencies.next) return 'nextjs'
  if (dependencies.vue) return 'vue'
  if (dependencies.svelte) return 'svelte'
  if (dependencies.react) return 'react'

  // Check code patterns
  if (code.includes('use client') || code.includes('use server')) {
    return 'nextjs'
  }
  if (code.includes('defineComponent') || code.includes('setup()')) {
    return 'vue'
  }
  if (code.includes('export default') && code.includes('React')) {
    return 'react'
  }

  return 'react' // Default
}





