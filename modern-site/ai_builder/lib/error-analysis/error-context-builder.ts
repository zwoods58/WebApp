/**
 * Comprehensive Error Context Gathering
 * P0 Feature 3: Comprehensive Error Context Gathering
 */

import { getSupabaseClient } from '../supabase/client-db'

export interface ErrorContext {
  error: {
    type: string
    message: string
    stack?: string
    lineNumber?: number
    columnNumber?: number
  }
  codeContext: {
    fileContent: string
    relevantLines: string
    fileType: string
    imports: string[]
  }
  projectContext: {
    framework: string
    dependencies: Record<string, string>
    otherFiles: FileSnapshot[]
    recentChanges: Change[]
  }
  fixHistory: {
    attemptedFixes: Fix[]
    failedFixes: Fix[]
  }
}

export interface FileSnapshot {
  path: string
  content: string
  language: string
}

export interface Change {
  file: string
  type: 'create' | 'update' | 'delete'
  timestamp: Date
  diff?: string
}

export interface Fix {
  id: string
  timestamp: Date
  fixType: string
  explanation: string
  result: 'success' | 'failed' | 'partial'
  error?: string
}

class ErrorContextBuilder {
  /**
   * Build comprehensive error context
   */
  async buildContext(
    error: Error,
    projectId: string,
    filePath?: string
  ): Promise<ErrorContext> {
    const file = filePath ? await this.getFileFromError(error, projectId, filePath) : null
    const project = await this.getProject(projectId)

    return {
      error: {
        type: error.name || 'Error',
        message: error.message,
        stack: error.stack,
        lineNumber: this.extractLineNumber(error),
        columnNumber: this.extractColumnNumber(error)
      },
      codeContext: {
        fileContent: file?.content || '',
        relevantLines: file ? this.extractRelevantLines(file.content, this.extractLineNumber(error)) : '',
        fileType: file?.language || 'typescript',
        imports: file ? this.extractImports(file.content) : []
      },
      projectContext: {
        framework: project.framework || 'react',
        dependencies: project.dependencies || {},
        otherFiles: await this.getRelatedFiles(file, project),
        recentChanges: await this.getRecentChanges(projectId)
      },
      fixHistory: {
        attemptedFixes: await this.getAttemptedFixes(error, projectId),
        failedFixes: await this.getFailedFixes(error, projectId)
      }
    }
  }

  /**
   * Get file from error
   */
  private async getFileFromError(
    error: Error,
    projectId: string,
    filePath?: string
  ): Promise<FileSnapshot | null> {
    if (!filePath) {
      // Try to extract file path from stack trace
      const stackMatch = error.stack?.match(/at .+ \((.+):(\d+):(\d+)\)/)
      if (stackMatch) {
        filePath = stackMatch[1]
      }
    }

    if (!filePath) {
      return null
    }

    try {
      const supabase = getSupabaseClient()
      const { data: draft } = await supabase
        .from('draft_projects')
        .select('metadata')
        .eq('id', projectId)
        .single()

      if (!draft) {
        return null
      }

      const fileTree = draft.metadata?.file_tree || {}
      const content = fileTree[filePath] || ''

      return {
        path: filePath,
        content,
        language: this.detectLanguage(filePath)
      }
    } catch (error) {
      console.error('Failed to get file:', error)
      return null
    }
  }

  /**
   * Get project information
   */
  private async getProject(projectId: string): Promise<{
    framework: string
    dependencies: Record<string, string>
  }> {
    try {
      const supabase = getSupabaseClient()
      const { data: draft } = await supabase
        .from('draft_projects')
        .select('metadata')
        .eq('id', projectId)
        .single()

      if (!draft) {
        return { framework: 'react', dependencies: {} }
      }

      const fileTree = draft.metadata?.file_tree || {}
      const packageJsonContent = fileTree['package.json'] || '{}'
      
      let packageJson: any = {}
      try {
        packageJson = JSON.parse(packageJsonContent)
      } catch {}

      // Detect framework from dependencies
      let framework = 'react'
      if (packageJson.dependencies?.next) {
        framework = 'nextjs'
      } else if (packageJson.dependencies?.vue) {
        framework = 'vue'
      } else if (packageJson.dependencies?.svelte) {
        framework = 'svelte'
      }

      return {
        framework,
        dependencies: {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        }
      }
    } catch (error) {
      console.error('Failed to get project:', error)
      return { framework: 'react', dependencies: {} }
    }
  }

  /**
   * Extract relevant lines around error
   */
  private extractRelevantLines(code: string, lineNumber?: number, context: number = 10): string {
    if (!lineNumber) {
      return code.substring(0, 1000) // Return first 1000 chars if no line number
    }

    const lines = code.split('\n')
    const start = Math.max(0, lineNumber - context)
    const end = Math.min(lines.length, lineNumber + context)

    return lines
      .slice(start, end)
      .map((line, idx) => {
        const actualLine = start + idx + 1
        const marker = actualLine === lineNumber ? '→ ' : '  '
        return `${marker}${actualLine}: ${line}`
      })
      .join('\n')
  }

  /**
   * Extract imports from code
   */
  private extractImports(code: string): string[] {
    const imports: string[] = []
    const importRegex = /import\s+(?:.*?\s+from\s+)?['"](.+?)['"]/g
    let match

    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1])
    }

    return imports
  }

  /**
   * Get related files
   */
  private async getRelatedFiles(
    file: FileSnapshot | null,
    project: { framework: string; dependencies: Record<string, string> }
  ): Promise<FileSnapshot[]> {
    if (!file) {
      return []
    }

    // Get files that import or are imported by this file
    const relatedFiles: FileSnapshot[] = []

    try {
      const supabase = getSupabaseClient()
      const { data: draft } = await supabase
        .from('draft_projects')
        .select('metadata')
        .single()

      if (!draft) {
        return []
      }

      const fileTree = draft.metadata?.file_tree || {}
      const imports = this.extractImports(file.content)

      // Find files that match import paths
      for (const importPath of imports) {
        // Try to find matching file
        for (const [path, content] of Object.entries(fileTree)) {
          if (path.includes(importPath) || importPath.includes(path)) {
            relatedFiles.push({
              path,
              content: typeof content === 'string' ? content : '',
              language: this.detectLanguage(path)
            })
          }
        }
      }
    } catch (error) {
      console.error('Failed to get related files:', error)
    }

    return relatedFiles.slice(0, 5) // Limit to 5 related files
  }

  /**
   * Get recent changes
   */
  private async getRecentChanges(projectId: string): Promise<Change[]> {
    try {
      const supabase = getSupabaseClient()
      const { data: versions } = await supabase
        .from('code_versions')
        .select('*')
        .eq('draft_id', projectId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (!versions) {
        return []
      }

      return versions.map((v: any) => ({
        file: 'component.tsx', // Would extract from version metadata
        type: 'update' as const,
        timestamp: new Date(v.created_at),
        diff: v.description
      }))
    } catch (error) {
      console.error('Failed to get recent changes:', error)
      return []
    }
  }

  /**
   * Get attempted fixes
   */
  private async getAttemptedFixes(error: Error, projectId: string): Promise<Fix[]> {
    // Would query fix_history table
    // For now, return empty array
    return []
  }

  /**
   * Get failed fixes
   */
  private async getFailedFixes(error: Error, projectId: string): Promise<Fix[]> {
    // Would query fix_history table for failed fixes
    return []
  }

  /**
   * Extract line number from error
   */
  private extractLineNumber(error: Error): number | undefined {
    const stackMatch = error.stack?.match(/\(.+?:(\d+):(\d+)\)/)
    return stackMatch ? parseInt(stackMatch[1]) : undefined
  }

  /**
   * Extract column number from error
   */
  private extractColumnNumber(error: Error): number | undefined {
    const stackMatch = error.stack?.match(/\(.+?:(\d+):(\d+)\)/)
    return stackMatch ? parseInt(stackMatch[2]) : undefined
  }

  /**
   * Detect language from file path
   */
  private detectLanguage(filePath: string): string {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      return 'tsx'
    }
    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
      return 'typescript'
    }
    if (filePath.endsWith('.css')) {
      return 'css'
    }
    if (filePath.endsWith('.scss') || filePath.endsWith('.sass')) {
      return 'scss'
    }
    return 'text'
  }
}

// Singleton instance
let errorContextBuilder: ErrorContextBuilder | null = null

export function getErrorContextBuilder(): ErrorContextBuilder {
  if (!errorContextBuilder) {
    errorContextBuilder = new ErrorContextBuilder()
  }
  return errorContextBuilder
}





