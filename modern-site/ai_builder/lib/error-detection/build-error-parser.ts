/**
 * Comprehensive Build Error Parser
 * P2 Feature 19: Comprehensive Build Error Parsing
 */

import { BuildError } from './build-analyzer'

export interface ParsedBuildError extends BuildError {
  filePath?: string
  lineNumber?: number
  columnNumber?: number
  modulePath?: string
  detailedMessage?: string
}

class BuildErrorParser {
  /**
   * Parse Webpack errors with detailed extraction
   */
  parseWebpackError(output: string): ParsedBuildError[] {
    const errors: ParsedBuildError[] = []

    // Pattern 1: ERROR in ./path/to/file.ts:line:column
    const detailedErrorRegex = /ERROR\s+in\s+(.+?):(\d+):(\d+)\s*\n([\s\S]*?)(?=\n\n|\nERROR|\nWARNING|$)/g
    let match

    while ((match = detailedErrorRegex.exec(output)) !== null) {
      errors.push({
        file: match[1].trim(),
        filePath: match[1].trim(),
        line: parseInt(match[2]),
        lineNumber: parseInt(match[2]),
        column: parseInt(match[3]),
        columnNumber: parseInt(match[3]),
        message: match[4].trim(),
        detailedMessage: match[4].trim(),
        type: 'build',
        severity: 'error',
        autoFixable: false
      })
    }

    // Pattern 2: Module build failed
    const moduleBuildFailedRegex = /Module build failed.*?\n([\s\S]*?)(?=\n\n|\nERROR|\n$)/g
    while ((match = moduleBuildFailedRegex.exec(output)) !== null) {
      const errorText = match[1].trim()
      const fileMatch = errorText.match(/\((.+?):(\d+):(\d+)\)/)
      
      errors.push({
        message: errorText,
        detailedMessage: errorText,
        file: fileMatch ? fileMatch[1] : undefined,
        filePath: fileMatch ? fileMatch[1] : undefined,
        line: fileMatch ? parseInt(fileMatch[2]) : undefined,
        lineNumber: fileMatch ? parseInt(fileMatch[2]) : undefined,
        column: fileMatch ? parseInt(fileMatch[3]) : undefined,
        columnNumber: fileMatch ? parseInt(fileMatch[3]) : undefined,
        type: 'build',
        severity: 'error',
        autoFixable: false
      })
    }

    return errors
  }

  /**
   * Parse Vite errors with detailed extraction
   */
  parseViteError(output: string): ParsedBuildError[] {
    const errors: ParsedBuildError[] = []

    // Pattern: [vite] error in /path/to/file.ts:line:column
    const viteErrorRegex = /\[vite\]\s+error\s+in\s+(.+?):(\d+):(\d+)\s*\n([\s\S]*?)(?=\n\[vite\]|\n$)/gi
    let match

    while ((match = viteErrorRegex.exec(output)) !== null) {
      errors.push({
        file: match[1].trim(),
        filePath: match[1].trim(),
        line: parseInt(match[2]),
        lineNumber: parseInt(match[2]),
        column: parseInt(match[3]),
        columnNumber: parseInt(match[3]),
        message: match[4].trim(),
        detailedMessage: match[4].trim(),
        type: 'build',
        severity: 'error',
        autoFixable: false
      })
    }

    return errors
  }

  /**
   * Extract file path from error message
   */
  extractFilePath(errorMessage: string): string | null {
    // Try various patterns
    const patterns = [
      /\((.+?):\d+:\d+\)/, // (file.ts:line:column)
      /at\s+(.+?):\d+:\d+/, // at file.ts:line:column
      /in\s+(.+?)\s*:/, // in file.ts:
      /['"](.+?\.(ts|tsx|js|jsx))['"]/ // "file.ts"
    ]

    for (const pattern of patterns) {
      const match = errorMessage.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  /**
   * Extract line and column numbers
   */
  extractLineColumn(errorMessage: string): { line?: number; column?: number } | null {
    const match = errorMessage.match(/:(\d+):(\d+)/)
    if (match) {
      return {
        line: parseInt(match[1]),
        column: parseInt(match[2])
      }
    }
    return null
  }
}

// Singleton instance
let buildErrorParser: BuildErrorParser | null = null

export function getBuildErrorParser(): BuildErrorParser {
  if (!buildErrorParser) {
    buildErrorParser = new BuildErrorParser()
  }
  return buildErrorParser
}





