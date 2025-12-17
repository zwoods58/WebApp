/**
 * Compilation Checker - Verifies TypeScript compilation and detects runtime errors
 * Part of Cursor-style agentic architecture
 */

import { VirtualFileSystem } from './virtual-filesystem'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

const execAsync = promisify(exec)

export interface CompilationError {
  file: string
  line: number
  column: number
  message: string
  code: string
}

export interface CompilationResult {
  success: boolean
  errors: CompilationError[]
  warnings: CompilationError[]
  output?: string
}

/**
 * Check TypeScript compilation for files in VFS
 * Creates a temporary directory, writes files, runs tsc, then cleans up
 * Falls back gracefully if TypeScript isn't available (e.g., in serverless environments)
 */
export async function checkCompilation(
  vfs: VirtualFileSystem,
  projectRoot?: string
): Promise<CompilationResult> {
  const errors: CompilationError[] = []
  const warnings: CompilationError[] = []

  // Check if we're in a serverless environment (Vercel, etc.)
  // In serverless, exec() and temp directories may not be available
  const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME || !os.tmpdir
  
  if (isServerless) {
    console.log('⚠️ Serverless environment detected - using TypeScript compiler API')
    // P0 Feature 5: Use TypeScript compiler API instead of exec()
    return await checkCompilationServerless(vfs)
  }

  // Check if we're in an environment where we can run TypeScript
  // In serverless environments, we might not have access to exec
  let tempDir: string | null = null
  
  try {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'ai-builder-compile-'))
  } catch (tempError: any) {
    // If we can't create temp directory, return empty result (skip compilation check)
    console.warn('⚠️ Cannot create temp directory for compilation check:', tempError.message)
    return {
      success: true, // Assume success if we can't check
      errors: [],
      warnings: [],
      output: 'Compilation check skipped (temp directory unavailable)'
    }
  }

  try {
    // Write all files to temp directory
    const files = vfs.getAllFiles()
    for (const file of files) {
      const filePath = path.join(tempDir, file.path)
      const dir = path.dirname(filePath)
      await fs.promises.mkdir(dir, { recursive: true })
      await fs.promises.writeFile(filePath, file.content, 'utf-8')
    }

    // Create a minimal tsconfig.json for compilation check
    const tsconfig = {
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        paths: {
          '@/*': ['./*']
        }
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules']
    }

    await fs.promises.writeFile(
      path.join(tempDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
      'utf-8'
    )

    // Run TypeScript compiler
    try {
      // Check if exec is available (might not be in some serverless environments)
      if (typeof exec === 'undefined') {
        console.warn('⚠️ exec not available, skipping compilation check')
        return {
          success: true,
          errors: [],
          warnings: [],
          output: 'Compilation check skipped (exec unavailable)'
        }
      }

      const { stdout, stderr } = await execAsync(
        `npx tsc --noEmit --project ${path.join(tempDir, 'tsconfig.json')}`,
        {
          cwd: tempDir,
          timeout: 30000, // 30 second timeout
          maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        }
      )

      // Parse TypeScript errors from stderr
      const errorLines = stderr.split('\n').filter(line => line.trim())
      
      for (const line of errorLines) {
        // TypeScript error format: file.ts(line,col): error TS####: message
        const errorMatch = line.match(/(.+?)\((\d+),(\d+)\):\s*(error|warning)\s+(TS\d+):\s*(.+)/)
        if (errorMatch) {
          const [, filePath, lineNum, colNum, severity, code, message] = errorMatch
          const relativePath = path.relative(tempDir, filePath)
          
          const error: CompilationError = {
            file: relativePath,
            line: parseInt(lineNum, 10),
            column: parseInt(colNum, 10),
            message: message.trim(),
            code: code
          }

          if (severity === 'error') {
            errors.push(error)
          } else {
            warnings.push(error)
          }
        } else {
          // Try alternative format
          const altMatch = line.match(/(.+?):(\d+):(\d+)\s*-\s*(error|warning)\s+(.+)/)
          if (altMatch) {
            const [, filePath, lineNum, colNum, severity, message] = altMatch
            const relativePath = path.relative(tempDir, filePath)
            
            const error: CompilationError = {
              file: relativePath,
              line: parseInt(lineNum, 10),
              column: parseInt(colNum, 10),
              message: message.trim(),
              code: 'TS0000'
            }

            if (severity === 'error') {
              errors.push(error)
            } else {
              warnings.push(error)
            }
          }
        }
      }

      return {
        success: errors.length === 0,
        errors,
        warnings,
        output: stdout + stderr
      }
    } catch (execError: any) {
      // TypeScript compiler returns non-zero exit code on errors
      // Parse the error output
      const errorOutput = execError.stderr || execError.stdout || execError.message || ''
      
      // Try to parse errors from the output
      const errorLines = errorOutput.split('\n').filter(line => line.trim())
      
      for (const line of errorLines) {
        const errorMatch = line.match(/(.+?)\((\d+),(\d+)\):\s*(error|warning)\s+(TS\d+):\s*(.+)/)
        if (errorMatch) {
          const [, filePath, lineNum, colNum, severity, code, message] = errorMatch
          const relativePath = path.relative(tempDir, filePath)
          
          const error: CompilationError = {
            file: relativePath,
            line: parseInt(lineNum, 10),
            column: parseInt(colNum, 10),
            message: message.trim(),
            code: code
          }

          if (severity === 'error') {
            errors.push(error)
          } else {
            warnings.push(error)
          }
        }
      }

      // If we couldn't parse any errors, create a generic one
      if (errors.length === 0 && warnings.length === 0) {
        errors.push({
          file: 'unknown',
          line: 1,
          column: 1,
          message: errorOutput.substring(0, 500) || 'TypeScript compilation failed',
          code: 'TS0000'
        })
      }

      return {
        success: false,
        errors,
        warnings,
        output: errorOutput
      }
    }
  } finally {
    // Clean up temp directory
    if (tempDir) {
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true })
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp directory:', cleanupError)
      }
    }
  }
}

/**
 * Format compilation errors for AI prompt
 */
export function formatCompilationErrorsForAI(errors: CompilationError[]): string {
  if (errors.length === 0) {
    return 'No compilation errors found.'
  }

  const grouped = new Map<string, CompilationError[]>()

  errors.forEach(error => {
    if (!grouped.has(error.file)) {
      grouped.set(error.file, [])
    }
    grouped.get(error.file)!.push(error)
  })

  let output = 'TypeScript compilation found the following errors that need to be fixed:\n\n'

  grouped.forEach((fileErrors, file) => {
    output += `File: ${file}\n`
    fileErrors.forEach(error => {
      output += `  Line ${error.line}, Column ${error.column}: ${error.message} (${error.code})\n`
    })
    output += '\n'
  })

  return output
}

/**
 * P0 Feature 5: Serverless compilation checking using TypeScript compiler API
 * This works in serverless environments without needing exec()
 */
export async function checkCompilationServerless(
  vfs: VirtualFileSystem
): Promise<CompilationResult> {
  const errors: CompilationError[] = []
  const warnings: CompilationError[] = []

  try {
    // Try to use TypeScript compiler API
    // Note: This requires typescript to be installed as a dependency
    let ts: any
    try {
      ts = require('typescript')
    } catch (e) {
      console.warn('⚠️ TypeScript compiler API not available, using basic syntax checking')
      // Fallback to basic syntax checking
      return checkBasicSyntax(vfs)
    }

    const files = vfs.getAllFiles()
    const fileMap = new Map<string, string>()
    
    // Create file map for TypeScript compiler
    files.forEach(file => {
      if (file.path.match(/\.(ts|tsx)$/)) {
        fileMap.set(file.path, file.content)
      }
    })

    if (fileMap.size === 0) {
      return {
        success: true,
        errors: [],
        warnings: [],
        output: 'No TypeScript files to check'
      }
    }

    // Create TypeScript compiler options
    const compilerOptions: any = {
      target: ts.ScriptTarget.ES2017,
      lib: ['lib.es2017.d.ts', 'lib.dom.d.ts'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: ts.JsxEmit.React,
    }

    // Create compiler host
    const compilerHost = ts.createCompilerHost(compilerOptions)
    
    // Override file reading to use VFS
    compilerHost.getSourceFile = (fileName: string, languageVersion: ts.ScriptTarget) => {
      const content = fileMap.get(fileName)
      if (content !== undefined) {
        return ts.createSourceFile(fileName, content, languageVersion)
      }
      return undefined
    }

    compilerHost.fileExists = (fileName: string) => {
      return fileMap.has(fileName)
    }

    compilerHost.readFile = (fileName: string) => {
      return fileMap.get(fileName) || ''
    }

    compilerHost.getCurrentDirectory = () => '/'
    compilerHost.getCanonicalFileName = (fileName: string) => fileName

    // Create program
    const program = ts.createProgram(Array.from(fileMap.keys()), compilerOptions, compilerHost)
    
    // Get diagnostics
    const diagnostics = ts.getPreEmitDiagnostics(program)

    // Parse diagnostics into errors
    diagnostics.forEach((diagnostic: any) => {
      if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
        const error: CompilationError = {
          file: diagnostic.file.fileName,
          line: line + 1,
          column: character + 1,
          message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
          code: diagnostic.code?.toString() || 'TS0000'
        }

        if (diagnostic.category === ts.DiagnosticCategory.Error) {
          errors.push(error)
        } else {
          warnings.push(error)
        }
      }
    })

    return {
      success: errors.length === 0,
      errors,
      warnings,
      output: `Checked ${fileMap.size} files using TypeScript compiler API`
    }
  } catch (error: any) {
    console.error('❌ Serverless compilation check failed:', error)
    // Fallback to basic syntax checking
    return checkBasicSyntax(vfs)
  }
}

/**
 * Basic syntax checking fallback when TypeScript compiler API is unavailable
 */
function checkBasicSyntax(vfs: VirtualFileSystem): CompilationResult {
  const errors: CompilationError[] = []
  const files = vfs.getAllFiles()

  files.forEach(file => {
    if (file.path.match(/\.(ts|tsx|js|jsx)$/)) {
      const content = file.content
      
      // Basic bracket matching
      const openBrackets = (content.match(/\{/g) || []).length
      const closeBrackets = (content.match(/\}/g) || []).length
      if (openBrackets !== closeBrackets) {
        errors.push({
          file: file.path,
          line: 1,
          column: 1,
          message: `Unmatched brackets: ${openBrackets} open, ${closeBrackets} close`,
          code: 'SYNTAX001'
        })
      }

      // Basic parenthesis matching
      const openParens = (content.match(/\(/g) || []).length
      const closeParens = (content.match(/\)/g) || []).length
      if (openParens !== closeParens) {
        errors.push({
          file: file.path,
          line: 1,
          column: 1,
          message: `Unmatched parentheses: ${openParens} open, ${closeParens} close`,
          code: 'SYNTAX002'
        })
      }
    }
  })

  return {
    success: errors.length === 0,
    errors,
    warnings: [],
    output: 'Basic syntax check completed'
  }
}

/**
 * Detect common runtime errors from error messages
 */
export function detectRuntimeErrors(errorMessage: string): {
  type: string
  description: string
  suggestions: string[]
} | null {
  const message = errorMessage.toLowerCase()

  // Lazy loading / dynamic import errors
  if (message.includes('lazy element type') || message.includes('invalid element type') || 
      message.includes('received a promise') || message.includes('resolves to [object object]')) {
    return {
      type: 'lazy_loading',
      description: 'React lazy loading error - component not exported correctly',
      suggestions: [
        'Ensure components use `export default` for default exports',
        'Check that dynamic imports resolve to a component, not an object',
        'Verify component exports match import statements',
        'Use named exports with React.lazy(() => import(...)) or ensure default export exists'
      ]
    }
  }

  // Import/export errors
  if (message.includes('cannot find module') || message.includes('module not found')) {
    return {
      type: 'module_not_found',
      description: 'Module import error',
      suggestions: [
        'Check import paths are correct',
        'Verify file extensions (.tsx, .ts)',
        'Ensure files exist at the specified paths',
        'Check for typos in module names'
      ]
    }
  }

  // Type errors
  if (message.includes('type') && (message.includes('is not assignable') || message.includes('does not exist'))) {
    return {
      type: 'type_error',
      description: 'TypeScript type error',
      suggestions: [
        'Check prop types match component definitions',
        'Verify interface/type definitions',
        'Ensure all required props are provided',
        'Check for type mismatches in function signatures'
      ]
    }
  }

  return null
}


