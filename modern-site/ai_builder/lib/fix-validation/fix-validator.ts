/**
 * Fix Validation System
 * P0 Feature 4: Fix Validation System
 */

import { getCodeValidator } from '../error-detection/static-analyzer'
import * as ts from 'typescript'

export interface FixSuggestion {
  fixType: 'replace' | 'insert' | 'delete' | 'install_package' | 'update_import'
  targetFile: string
  oldCode?: string
  newCode: string
  explanation: string
  confidence: number // 0.0 - 1.0
  position?: number
  package?: string
  version?: string
  oldImport?: string
  newImport?: string
}

export interface ValidationCheck {
  name: string
  passed: boolean
  critical: boolean
  message?: string
  autoFixable?: boolean
  autoFix?: () => Promise<void>
}

export interface ValidationResult {
  valid: boolean
  checks: ValidationCheck[]
  confidence: number
}

class FixValidator {
  private codeValidator = getCodeValidator()

  /**
   * Validate fix before application
   */
  async validateFix(
    fix: FixSuggestion,
    context: {
      fileContent: string
      fileType: string
      dependencies: Record<string, string>
    }
  ): Promise<ValidationResult> {
    const validations: ValidationCheck[] = []

    // 1. Syntax validation
    validations.push(await this.validateSyntax(fix, context))

    // 2. Type checking (if TypeScript)
    if (context.fileType === 'typescript' || context.fileType === 'tsx') {
      validations.push(await this.validateTypes(fix, context))
    }

    // 3. Import validation
    validations.push(await this.validateImports(fix, context))

    // 4. Logic validation (basic checks)
    validations.push(await this.validateLogic(fix, context))

    // 5. Style consistency
    validations.push(await this.validateStyle(fix, context))

    const allPassed = validations.every(v => v.passed)
    const criticalFailed = validations.some(v => !v.passed && v.critical)

    return {
      valid: allPassed && !criticalFailed,
      checks: validations,
      confidence: this.calculateConfidence(validations, fix.confidence)
    }
  }

  /**
   * Validate syntax
   */
  private async validateSyntax(
    fix: FixSuggestion,
    context: { fileContent: string; fileType: string }
  ): Promise<ValidationCheck> {
    try {
      // Parse with TypeScript compiler API
      const sourceFile = ts.createSourceFile(
        'temp.ts',
        fix.newCode,
        ts.ScriptTarget.Latest,
        true,
        context.fileType === 'tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      )

      // Check for syntax errors
      const syntaxErrors = sourceFile.parseDiagnostics || []

      if (syntaxErrors.length > 0) {
        return {
          name: 'Syntax Validation',
          passed: false,
          critical: true,
          message: `Syntax errors: ${syntaxErrors.map(e => e.messageText).join(', ')}`
        }
      }

      return {
        name: 'Syntax Validation',
        passed: true,
        critical: true
      }
    } catch (error: any) {
      return {
        name: 'Syntax Validation',
        passed: false,
        critical: true,
        message: `Syntax error: ${error.message}`
      }
    }
  }

  /**
   * Validate types
   */
  private async validateTypes(
    fix: FixSuggestion,
    context: { fileContent: string; fileType: string }
  ): Promise<ValidationCheck> {
    try {
      const sourceFile = ts.createSourceFile(
        'temp.ts',
        fix.newCode,
        ts.ScriptTarget.Latest,
        true,
        context.fileType === 'tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      )

      const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.React,
        strict: true
      }

      const host: ts.CompilerHost = {
        getSourceFile: () => sourceFile,
        writeFile: () => {},
        getCurrentDirectory: () => '',
        getDirectories: () => [],
        fileExists: () => true,
        readFile: () => '',
        getCanonicalFileName: (f) => f,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => '\n',
        getDefaultLibFileName: () => 'lib.d.ts'
      }

      const program = ts.createProgram(['temp.ts'], compilerOptions, host)
      const diagnostics = ts.getPreEmitDiagnostics(program)

      if (diagnostics.length > 0) {
        return {
          name: 'Type Validation',
          passed: false,
          critical: false,
          message: `Type errors: ${diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join(', ')}`
        }
      }

      return {
        name: 'Type Validation',
        passed: true,
        critical: false
      }
    } catch (error: any) {
      return {
        name: 'Type Validation',
        passed: false,
        critical: false,
        message: `Type validation error: ${error.message}`
      }
    }
  }

  /**
   * Validate imports
   */
  private async validateImports(
    fix: FixSuggestion,
    context: { dependencies: Record<string, string> }
  ): Promise<ValidationCheck> {
    const imports = this.extractImports(fix.newCode)
    const missingPackages: string[] = []

    for (const imp of imports) {
      // Check if package exists in dependencies
      const packageName = imp.split('/')[0]
      if (!context.dependencies[packageName] && !imp.startsWith('.')) {
        missingPackages.push(packageName)
      }
    }

    if (missingPackages.length > 0) {
      return {
        name: 'Import Validation',
        passed: false,
        critical: true,
        message: `Missing packages: ${missingPackages.join(', ')}`,
        autoFixable: true,
        autoFix: async () => {
          // Would install missing packages
          console.log(`Would install: ${missingPackages.join(', ')}`)
        }
      }
    }

    return {
      name: 'Import Validation',
      passed: true,
      critical: true
    }
  }

  /**
   * Validate logic (basic checks)
   */
  private async validateLogic(
    fix: FixSuggestion,
    context: { fileContent: string }
  ): Promise<ValidationCheck> {
    // Basic logic checks
    const checks: string[] = []

    // Check for infinite loops (basic pattern)
    if (fix.newCode.includes('while(true)') && !fix.newCode.includes('break')) {
      checks.push('Possible infinite loop detected')
    }

    // Check for undefined variables (basic check)
    const undefinedVars = fix.newCode.match(/\b(undefined|null)\b/g)
    if (undefinedVars && undefinedVars.length > 5) {
      checks.push('Many undefined/null references detected')
    }

    if (checks.length > 0) {
      return {
        name: 'Logic Validation',
        passed: false,
        critical: false,
        message: checks.join('; ')
      }
    }

    return {
      name: 'Logic Validation',
      passed: true,
      critical: false
    }
  }

  /**
   * Validate style consistency
   */
  private async validateStyle(
    fix: FixSuggestion,
    context: { fileContent: string }
  ): Promise<ValidationCheck> {
    // Check indentation consistency
    const originalIndent = this.detectIndentation(context.fileContent)
    const fixIndent = this.detectIndentation(fix.newCode)

    if (originalIndent !== fixIndent && originalIndent && fixIndent) {
      return {
        name: 'Style Validation',
        passed: false,
        critical: false,
        message: `Indentation mismatch: original uses ${originalIndent}, fix uses ${fixIndent}`
      }
    }

    return {
      name: 'Style Validation',
      passed: true,
      critical: false
    }
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    validations: ValidationCheck[],
    baseConfidence: number
  ): number {
    const passedChecks = validations.filter(v => v.passed).length
    const totalChecks = validations.length
    const validationScore = totalChecks > 0 ? passedChecks / totalChecks : 1

    // Combine base confidence with validation score
    return (baseConfidence * 0.7) + (validationScore * 0.3)
  }

  /**
   * Extract imports from code
   */
  private extractImports(code: string): string[] {
    const imports: string[] = []
    const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g
    let match

    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1])
    }

    return imports
  }

  /**
   * Detect indentation style
   */
  private detectIndentation(code: string): string | null {
    const lines = code.split('\n').filter(line => line.trim())
    if (lines.length === 0) return null

    const firstIndentedLine = lines.find(line => line.startsWith(' ') || line.startsWith('\t'))
    if (!firstIndentedLine) return null

    if (firstIndentedLine.startsWith('  ')) return 'spaces'
    if (firstIndentedLine.startsWith('\t')) return 'tabs'
    return null
  }
}

// Singleton instance
let fixValidator: FixValidator | null = null

export function getFixValidator(): FixValidator {
  if (!fixValidator) {
    fixValidator = new FixValidator()
  }
  return fixValidator
}





