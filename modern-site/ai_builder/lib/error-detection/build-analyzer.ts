/**
 * Build Error Detection System
 * P0 Feature 2: Build Error Detection System
 * 
 * Webpack/Vite error parsing, dependency errors, import errors
 */

export interface BuildError {
  file?: string
  module?: string
  message: string
  type: 'build' | 'import' | 'dependency' | 'syntax' | 'unknown'
  severity: 'error' | 'warning'
  line?: number
  column?: number
  autoFixable: boolean
  suggestedFix?: {
    action: 'install_package' | 'update_import' | 'fix_syntax' | 'update_dependency'
    package?: string
    import?: string
    newImport?: string
  }
}

class BuildAnalyzer {
  /**
   * Parse build output for errors
   */
  parseBuildErrors(output: string): BuildError[] {
    const errors: BuildError[] = []

    // Parse Webpack errors
    const webpackErrors = this.parseWebpackErrors(output)
    errors.push(...webpackErrors)

    // Parse Vite errors
    const viteErrors = this.parseViteErrors(output)
    errors.push(...viteErrors)

    // Parse import errors
    const importErrors = this.parseImportErrors(output)
    errors.push(...importErrors)

    // Parse dependency errors
    const dependencyErrors = this.parseDependencyErrors(output)
    errors.push(...dependencyErrors)

    return errors
  }

  /**
   * Parse Webpack errors
   */
  private parseWebpackErrors(output: string): BuildError[] {
    const errors: BuildError[] = []

    // Webpack error pattern: ERROR in ./path/to/file.ts
    const webpackErrorRegex = /ERROR in (.+?)\n([\s\S]*?)(?=\n\n|\nERROR|\nWARNING|$)/g
    let match

    while ((match = webpackErrorRegex.exec(output)) !== null) {
      const file = match[1].trim()
      const message = match[2].trim()

      // Extract line/column if present
      const lineMatch = message.match(/\((\d+):(\d+)\)/)
      const line = lineMatch ? parseInt(lineMatch[1]) : undefined
      const column = lineMatch ? parseInt(lineMatch[2]) : undefined

      errors.push({
        file,
        message,
        type: 'build',
        severity: 'error',
        line,
        column,
        autoFixable: false
      })
    }

    return errors
  }

  /**
   * Parse Vite errors
   */
  private parseViteErrors(output: string): BuildError[] {
    const errors: BuildError[] = []

    // Vite error pattern: [vite] error in /path/to/file.ts:line:column
    const viteErrorRegex = /\[vite\]\s+error\s+in\s+(.+?):(\d+):(\d+)\s*\n([\s\S]*?)(?=\n\[vite\]|\n$)/gi
    let match

    while ((match = viteErrorRegex.exec(output)) !== null) {
      const file = match[1].trim()
      const line = parseInt(match[2])
      const column = parseInt(match[3])
      const message = match[4].trim()

      errors.push({
        file,
        message,
        type: 'build',
        severity: 'error',
        line,
        column,
        autoFixable: false
      })
    }

    return errors
  }

  /**
   * Parse import/module errors
   */
  private parseImportErrors(output: string): BuildError[] {
    const errors: BuildError[] = []

    // Module not found pattern
    const moduleNotFoundRegex = /Module not found: (?:Error: )?Can't resolve ['"](.+?)['"]/g
    let match

    while ((match = moduleNotFoundRegex.exec(output)) !== null) {
      const module = match[1]

      errors.push({
        module,
        message: `Missing module: ${module}`,
        type: 'import',
        severity: 'error',
        autoFixable: true,
        suggestedFix: {
          action: 'install_package',
          package: module
        }
      })
    }

    // Import path errors
    const importPathRegex = /Cannot find module ['"](.+?)['"]/g
    while ((match = importPathRegex.exec(output)) !== null) {
      const importPath = match[1]

      errors.push({
        message: `Cannot find module: ${importPath}`,
        type: 'import',
        severity: 'error',
        autoFixable: false
      })
    }

    return errors
  }

  /**
   * Parse dependency errors
   */
  private parseDependencyErrors(output: string): BuildError[] {
    const errors: BuildError[] = []

    // Peer dependency warnings
    const peerDepRegex = /peer dependency (.+?) is not installed/g
    let match

    while ((match = peerDepRegex.exec(output)) !== null) {
      const packageName = match[1]

      errors.push({
        message: `Peer dependency missing: ${packageName}`,
        type: 'dependency',
        severity: 'warning',
        autoFixable: true,
        suggestedFix: {
          action: 'install_package',
          package: packageName
        }
      })
    }

    // Version conflict errors
    const versionConflictRegex = /version conflict.*?([^\s]+)\s+vs\s+([^\s]+)/g
    while ((match = versionConflictRegex.exec(output)) !== null) {
      const package1 = match[1]
      const package2 = match[2]

      errors.push({
        message: `Version conflict: ${package1} vs ${package2}`,
        type: 'dependency',
        severity: 'error',
        autoFixable: false
      })
    }

    return errors
  }

  /**
   * Auto-fix import error by installing package
   */
  async autoFixImportError(error: BuildError): Promise<boolean> {
    if (error.type === 'import' && error.autoFixable && error.suggestedFix?.package) {
      try {
        // This would call the package manager to install
        // For now, return success (actual implementation would call installPackageTool)
        console.log(`Would install package: ${error.suggestedFix.package}`)
        return true
      } catch (err) {
        console.error('Failed to auto-fix import error:', err)
        return false
      }
    }
    return false
  }
}

// Singleton instance
let buildAnalyzer: BuildAnalyzer | null = null

export function getBuildAnalyzer(): BuildAnalyzer {
  if (!buildAnalyzer) {
    buildAnalyzer = new BuildAnalyzer()
  }
  return buildAnalyzer
}





