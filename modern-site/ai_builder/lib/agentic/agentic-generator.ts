/**
 * Agentic Generator - Core engine for Cursor-style architecture
 * Uses tool-calling to generate structured file trees
 */

import { parseIntent, ProjectIntent } from './intent-parser'
import { VirtualFileSystem } from './virtual-filesystem'
import { lintVFS, formatLintErrorsForAI, LintResult } from './linting-loop'
import { checkCompilation, formatCompilationErrorsForAI, detectRuntimeErrors, CompilationError } from './compilation-checker'
import { getRecommendedModel, buildModelSpecificPrompt } from '../ai/model-router'
import { buildDependencyGraph, buildContextPrompt } from './context-awareness'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

export interface GenerationResult {
  success: boolean
  fileTree: { [path: string]: string }
  errors?: string[]
  lintResults?: Map<string, LintResult>
  compilationErrors?: CompilationError[]
  iterations: number
  compilationIterations?: number
}

export type ProgressCallback = (message: string, iteration?: number, totalIterations?: number) => void

/**
 * Build system prompt for agentic generation with tool-calling
 */
function buildAgenticSystemPrompt(intent: ProjectIntent, existingFiles: string[]): string {
  return `You are an expert Full-Stack Engineer with a Cursor-style agentic architecture. Your task is to generate a complete, production-ready project structure.

=== PROJECT INTENT ===
Project Type: ${intent.projectType}
Dependencies: ${intent.dependencies?.join(', ') || 'none'}
Files to Create: ${intent.operations?.filter(op => op.type === 'create').length || 0}
Files to Modify: ${intent.operations?.filter(op => op.type === 'modify').length || 0}

=== AVAILABLE TOOLS ===
You have access to these tools:
1. writeFile(path: string, content: string) - Create or update a file
2. createDirectory(path: string) - Create a directory structure

=== CRITICAL REQUIREMENTS ===
1. OUTPUT FORMAT: You MUST output a JSON object with this structure:
   {
     "files": [
       {
         "path": "src/components/LandingPage.tsx",
         "content": "// Full file content here"
       }
     ]
   }

2. FILE STRUCTURE: Create a proper React project structure:
   - src/components/ - React components
   - src/App.tsx or src/pages/ - Main app/page files
   - package.json - Dependencies and scripts
   - README.md - Project documentation
   - tailwind.config.js - If using Tailwind
   - tsconfig.json - TypeScript configuration

3. CODE QUALITY:
   - Use TypeScript for all .tsx/.ts files
   - Import components from './components' library
   - Use Tailwind CSS utility classes ONLY
   - No placeholder text - all content must be real
   - Keep components modular and under 200 lines
   - Use .map() for repeating elements

4. COMPONENT LIBRARY:
   Available components: Header, Hero, Features, Pricing, Testimonial, Footer
   Import like: import { Header, Hero } from './components'

=== EXISTING FILES ===
${existingFiles.length > 0 ? existingFiles.map(f => `- ${f}`).join('\n') : 'No existing files'}

=== OUTPUT INSTRUCTIONS ===
Return ONLY a valid JSON object with the "files" array. Each file must have "path" and "content" properties.
Do not include markdown code blocks or explanations - just the raw JSON.`
}

/**
 * Generate project using agentic architecture with tool-calling simulation
 */
export async function generateWithAgenticArchitecture(
  userPrompt: string,
  businessContext: {
    businessName?: string
    businessType?: string
    businessDescription?: string
    mustHavePages?: string[]
    preferredColors?: string
  },
  existingFiles: string[] = [],
  maxIterations: number = 3,
  progressCallback?: ProgressCallback
): Promise<GenerationResult> {
  const vfs = new VirtualFileSystem()
  let iterations = 0
  const errors: string[] = []
  
  try {
    // Step 1: Intent Parser
    const intent = parseIntent(userPrompt)
    
    // Step 2: Determine which model to use
    const fileCount = intent.operations?.length || 0
    const { model: selectedModel, config: modelConfig } = getRecommendedModel(
      userPrompt,
      {
        fileCount,
        taskType: fileCount > 10 ? 'refactor' : 'implementation'
      }
    )
    
    console.log(`🤖 Using ${modelConfig.name} for ${fileCount} files: ${modelConfig.role}`)
    
    // Step 3: Generate initial file tree using AI
    const baseSystemPrompt = buildAgenticSystemPrompt(intent, existingFiles)
    const systemPrompt = buildModelSpecificPrompt(selectedModel, baseSystemPrompt, {
      fileCount,
      isRefactor: fileCount > 10
    })
    
    const userPromptWithContext = `${userPrompt}

Business Context:
- Name: ${businessContext.businessName || 'Company'}
- Type: ${businessContext.businessType || 'General'}
- Description: ${businessContext.businessDescription || ''}
- Pages Needed: ${businessContext.mustHavePages?.join(', ') || 'Landing Page'}
- Colors: ${businessContext.preferredColors || 'Professional'}

Generate a complete project structure with all necessary files.`
    
    // P0 Feature 2: Streaming code generation
    const useStreaming = progressCallback !== undefined
    let aiResponse = ''
    
    if (useStreaming) {
      // Stream response token-by-token
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          max_tokens: 8192,
          system: systemPrompt,
          messages: [{
            role: 'user',
            content: userPromptWithContext
          }],
          stream: true // Enable streaming
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Claude API error: ${response.status} - ${errorText}`)
      }
      
      // Parse streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''
      let buffer = ''
      
      if (!reader) {
        throw new Error('Stream reader not available')
      }
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'content_block_delta' && data.delta?.text) {
                accumulatedText += data.delta.text
                // Stream code incrementally to UI
                progressCallback?.(`Generating code... (${accumulatedText.length} chars)`, 0, 1)
              }
              
              if (data.type === 'message_stop') {
                break
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
      
      // Use accumulated text as response
      aiResponse = accumulatedText.trim()
    } else {
      // Non-streaming fallback
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          max_tokens: 8192,
          system: systemPrompt,
          messages: [{
            role: 'user',
            content: userPromptWithContext
          }],
          response_format: { type: 'json_object' }
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Claude API error: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      aiResponse = data.content?.[0]?.text || ''
    }
    
    // Step 3: Parse structured JSON output (common for both streaming and non-streaming)
    let fileTree: { [path: string]: string } = {}
    
    try {
      // Extract JSON from response (might be wrapped in markdown)
      let jsonText = aiResponse.trim()
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }
      
      const parsed = JSON.parse(jsonText)
      
      if (parsed.files && Array.isArray(parsed.files)) {
        parsed.files.forEach((file: { path: string; content: string }) => {
          if (file.path && file.content) {
            fileTree[file.path] = file.content
            vfs.writeFile(file.path, file.content)
            // Stream file updates as they're parsed (if streaming enabled)
            if (useStreaming) {
              progressCallback?.(`Created file: ${file.path}`, 0, 1)
            }
          }
        })
      } else {
        throw new Error('Invalid JSON structure: missing "files" array')
      }
    } catch (parseError: any) {
      errors.push(`Failed to parse AI response as JSON: ${parseError.message}`)
      // Fallback: try to extract code blocks
      const codeBlockMatch = aiResponse.match(/```(?:json|jsx|tsx)?\n([\s\S]*?)\n```/)
      if (codeBlockMatch) {
        try {
          const parsed = JSON.parse(codeBlockMatch[1])
          if (parsed.files) {
            parsed.files.forEach((file: { path: string; content: string }) => {
              fileTree[file.path] = file.content
              vfs.writeFile(file.path, file.content)
            })
          }
        } catch (e) {
          errors.push('Could not parse AI response as structured JSON')
        }
      }
    }
    
    // Step 4: Comprehensive Error-Fixing Loop (Lint + Compilation)
    // This continues until BOTH linting AND compilation pass
    let allChecksPassed = false
    let fixIterations = 0
    const maxFixIterations = 10 // Increased for thorough fixing
    let finalLintResults: Map<string, LintResult> | undefined = undefined
    let finalCompilationErrors: CompilationError[] = []
    
    console.log('🔧 Starting error-fixing loop (lint + compilation)...')
    progressCallback?.('Starting error-fixing loop...', 0, maxFixIterations)
    
    while (!allChecksPassed && fixIterations < maxFixIterations) {
      fixIterations++
      iterations++
      
      console.log(`\n🔄 Fix iteration ${fixIterations}/${maxFixIterations}`)
      progressCallback?.(`Fixing errors (iteration ${fixIterations}/${maxFixIterations})...`, fixIterations, maxFixIterations)
      
      // Check linting
      progressCallback?.(`Checking code quality...`, fixIterations, maxFixIterations)
      const lintResults = await lintVFS(vfs)
      finalLintResults = lintResults.results
      
      // Check compilation (skip in serverless if needed)
      progressCallback?.(`Checking TypeScript compilation...`, fixIterations, maxFixIterations)
      const compilationResult = await checkCompilation(vfs)
      finalCompilationErrors = compilationResult.errors
      
      const hasLintErrors = lintResults.totalErrors > 0
      const hasCompilationErrors = compilationResult.errors.length > 0
      
      console.log(`  📊 Lint: ${lintResults.totalErrors} errors, ${lintResults.totalWarnings} warnings`)
      console.log(`  📊 Compilation: ${compilationResult.errors.length} errors, ${compilationResult.warnings.length} warnings`)
      
      const errorCount = lintResults.totalErrors + compilationResult.errors.length
      if (errorCount > 0) {
        progressCallback?.(`Found ${errorCount} errors, fixing with Sonnet 4.5...`, fixIterations, maxFixIterations)
      }
      
      // If both pass, we're done!
      if (!hasLintErrors && !hasCompilationErrors) {
        allChecksPassed = true
        console.log('✅ All checks passed!')
        break
      }
      
      // P1 Feature 8: Batch error fixing - collect ALL errors first
      let allErrorMessages = ''
      const allErrors: Array<{ type: string; file: string; message: string }> = []
      
      if (hasLintErrors) {
        const lintErrors = Array.from(lintResults.results.values())
          .flatMap(r => r.errors)
        const lintErrorMessages = formatLintErrorsForAI(lintErrors)
        allErrorMessages += `=== ESLINT ERRORS ===\n${lintErrorMessages}\n\n`
        
        // Collect for batch fixing
        lintErrors.forEach(err => {
          allErrors.push({
            type: 'lint',
            file: err.file,
            message: `${err.message} (${err.rule}) at line ${err.line}:${err.column}`
          })
        })
      }
      
      if (hasCompilationErrors) {
        const compilationErrorMessages = formatCompilationErrorsForAI(compilationResult.errors)
        allErrorMessages += `=== TYPESCRIPT COMPILATION ERRORS ===\n${compilationErrorMessages}\n\n`
        
        // Collect for batch fixing
        compilationResult.errors.forEach(err => {
          allErrors.push({
            type: 'compilation',
            file: err.file,
            message: `${err.message} (${err.code}) at line ${err.line}:${err.column}`
          })
        })
        
        // Add runtime error detection hints
        for (const error of compilationResult.errors) {
          const runtimeHint = detectRuntimeErrors(error.message)
          if (runtimeHint) {
            allErrorMessages += `\n⚠️ Runtime Error Detected (${runtimeHint.type}):\n`
            allErrorMessages += `Description: ${runtimeHint.description}\n`
            allErrorMessages += `Suggestions:\n${runtimeHint.suggestions.map(s => `  - ${s}`).join('\n')}\n\n`
          }
        }
      }
      
      // Batch fix: Fix ALL errors in one API call
      console.log(`  📦 Batch fixing ${allErrors.length} errors in one call...`)
      
      // P1 Feature 9: Add context awareness for error fixing
      const dependencyGraph = buildDependencyGraph(vfs)
      const filesWithErrors = new Set(allErrors.map(e => e.file))
      let contextInfo = ''
      
      // Add context for each file with errors
      for (const filePath of filesWithErrors) {
        const context = buildContextPrompt(filePath, vfs, dependencyGraph)
        if (context) {
          contextInfo += `\n${context}\n`
        }
      }
      
      // ALWAYS use Sonnet 4.5 for error fixing (fast and accurate)
      const { config: fixModelConfig } = getRecommendedModel('Fix all errors', {
          taskType: 'iteration',
        forceModel: 'sonnet' // Explicitly force Sonnet for all fixes
        })
      
      console.log(`  🤖 Using ${fixModelConfig.name} to fix errors...`)
      
      const fixPrompt = `${allErrorMessages}

=== FILE CONTEXT & DEPENDENCIES ===
${contextInfo}

=== CURRENT FILE TREE ===
${vfs.getFileTreeSummary()}

=== INSTRUCTIONS ===
Fix ALL errors (both ESLint and TypeScript compilation errors) in the code above.
Return the corrected files as JSON with this structure:
{
  "files": [
    {
      "path": "src/components/LandingPage.tsx",
      "content": "// Full corrected file content here"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Fix ALL errors - both linting and compilation
2. Ensure components use proper exports (export default for default exports)
3. Fix all import/export mismatches
4. Ensure TypeScript types are correct
5. Fix any lazy loading issues (ensure exports match imports)
6. Return ONLY valid JSON, no markdown code blocks`
        
        const fixResponse = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
          model: fixModelConfig.modelId, // Sonnet 4.5
            max_tokens: 8192,
          system: `You are an expert code fixer. Your job is to fix ALL errors (ESLint and TypeScript compilation) in the provided code. Be thorough and fix every single error. Return corrected files as JSON.`,
            messages: [
              {
                role: 'user',
              content: fixPrompt
              }
            ],
            response_format: { type: 'json_object' }
          })
        })
        
        if (fixResponse.ok) {
          const fixData = await fixResponse.json()
          const fixText = fixData.content?.[0]?.text || ''
          
          try {
          // Extract JSON from response
          let jsonText = fixText.trim()
          const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
            jsonText = jsonMatch[0]
          }
          
          const fixed = JSON.parse(jsonText)
          if (fixed.files && Array.isArray(fixed.files)) {
                // Update VFS with fixed files
            let filesUpdated = 0
                fixed.files.forEach((file: { path: string; content: string }) => {
              if (file.path && file.content) {
                  vfs.writeFile(file.path, file.content)
                  fileTree[file.path] = file.content
                filesUpdated++
              }
            })
            console.log(`  ✅ Updated ${filesUpdated} files`)
            progressCallback?.(`Fixed and updated ${filesUpdated} files`, fixIterations, maxFixIterations)
          } else {
            errors.push('Fix response missing "files" array')
            progressCallback?.(`⚠️ Fix response invalid - missing files array`, fixIterations, maxFixIterations)
            break
          }
        } catch (parseError: any) {
          errors.push(`Failed to parse fix response: ${parseError.message}`)
          console.error('❌ Failed to parse fix response:', parseError)
          progressCallback?.(`❌ Failed to parse fix response: ${parseError.message}`, fixIterations, maxFixIterations)
          break
        }
      } else {
        const errorText = await fixResponse.text()
        errors.push(`Fix request failed: ${fixResponse.status} - ${errorText}`)
        console.error('❌ Fix request failed:', fixResponse.status)
        progressCallback?.(`❌ Fix request failed: ${fixResponse.status}`, fixIterations, maxFixIterations)
        break
      }
    }
    
    if (!allChecksPassed) {
      const remainingErrors = lintResults.totalErrors + finalCompilationErrors.length
      errors.push(`Failed to fix all errors after ${fixIterations} iterations (${remainingErrors} errors remaining)`)
      console.error(`❌ Error fixing incomplete after ${fixIterations} iterations`)
      progressCallback?.(`⚠️ Could not fix all errors (${remainingErrors} remaining)`, fixIterations, maxFixIterations)
    } else {
      progressCallback?.(`✅ All errors fixed successfully!`, fixIterations, maxFixIterations)
    }
    
    return {
      success: allChecksPassed && errors.length === 0,
      fileTree: vfs.getFileTree(),
      errors: errors.length > 0 ? errors : undefined,
      lintResults: finalLintResults,
      compilationErrors: finalCompilationErrors.length > 0 ? finalCompilationErrors : undefined,
      iterations,
      compilationIterations: fixIterations
    }
    
  } catch (error: any) {
    return {
      success: false,
      fileTree: vfs.getFileTree(),
      errors: [error.message || 'Unknown error'],
      iterations
    }
  }
}
