/**
 * AI Fix Generation with Tool Calling
 * P2 Feature 16: AI Fix Generation Prompts
 */

import { ErrorContext } from '../error-analysis/error-context-builder'
import { FixSuggestion } from '../fix-validation/fix-validator'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

export interface AIFixRequest {
  error: Error
  context: ErrorContext
}

class AIFixGenerator {
  /**
   * Generate fix using AI with tool calling
   */
  async generateFix(context: ErrorContext): Promise<FixSuggestion> {
    const systemPrompt = this.getSystemPrompt()
    const userPrompt = this.buildFixPrompt(context)

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        temperature: 0.2, // Lower temperature for more consistent fixes
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        tools: [
          {
            name: 'apply_code_fix',
            description: 'Apply a code fix to resolve the error',
            input_schema: {
              type: 'object',
              properties: {
                fixType: {
                  type: 'string',
                  enum: ['replace', 'insert', 'delete', 'install_package', 'update_import'],
                  description: 'The type of fix to apply'
                },
                targetFile: {
                  type: 'string',
                  description: 'The file to modify'
                },
                oldCode: {
                  type: 'string',
                  description: 'The exact code to replace (must match exactly)'
                },
                newCode: {
                  type: 'string',
                  description: 'The fixed code'
                },
                explanation: {
                  type: 'string',
                  description: 'Why this fixes the error'
                },
                confidence: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1,
                  description: 'Confidence score (0.0-1.0)'
                }
              },
              required: ['fixType', 'targetFile', 'newCode', 'explanation', 'confidence']
            }
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()

    // Check for tool calls
    if (data.content && data.content[0]?.type === 'tool_use') {
      const toolCall = data.content[0]
      return this.parseToolCall(toolCall, context)
    }

    // Fallback to text response
    return this.parseTextResponse(data.content?.[0]?.text || '', context)
  }

  /**
   * Get comprehensive system prompt
   */
  private getSystemPrompt(): string {
    return `You are an expert code debugger and fixer. Your job is to analyze errors and generate precise fixes.

CRITICAL RULES:
1. Always provide complete, working code - never use placeholders or "..."
2. Maintain existing code style and patterns
3. Fix ONLY the error - don't refactor unrelated code
4. Provide clear explanations for each fix
5. If you can't fix it with high confidence, suggest investigation steps
6. Consider side effects of your changes
7. Prioritize fixes that are minimal and surgical

ERROR TYPES YOU HANDLE:
- Syntax errors
- Type errors (TypeScript)
- Import/export errors
- Runtime errors (undefined, null reference, etc.)
- Logic errors
- Performance issues
- Dependency conflicts

RESPONSE FORMAT:
Use the apply_code_fix tool to provide:
- fixType: The type of fix
- targetFile: The file to modify
- oldCode: The exact code to replace (must match exactly)
- newCode: The fixed code
- explanation: Why this fixes the error
- confidence: 0.0-1.0 score of fix confidence`
  }

  /**
   * Build fix prompt from context
   */
  private buildFixPrompt(context: ErrorContext): string {
    return `I need you to fix this error:

ERROR DETAILS:
Type: ${context.error.type}
Message: ${context.error.message}
${context.error.lineNumber ? `Line: ${context.error.lineNumber}` : ''}
${context.error.stack ? `\nStack Trace:\n${context.error.stack}` : ''}

CODE CONTEXT:
\`\`\`${context.codeContext.fileType}
${context.codeContext.relevantLines}
\`\`\`

FULL FILE:
\`\`\`${context.codeContext.fileType}
${context.codeContext.fileContent}
\`\`\`

PROJECT INFO:
Framework: ${context.projectContext.framework}
Dependencies: ${JSON.stringify(context.projectContext.dependencies, null, 2)}

${context.fixHistory.attemptedFixes.length > 0 ? `
PREVIOUS FIX ATTEMPTS (these didn't work):
${context.fixHistory.attemptedFixes.map(f => `- ${f.explanation}: ${f.result}`).join('\n')}
` : ''}

Analyze the error and provide a precise fix using the apply_code_fix tool.`
  }

  /**
   * Parse tool call response
   */
  private parseToolCall(toolCall: any, context: ErrorContext): FixSuggestion {
    const input = toolCall.input

    return {
      fixType: input.fixType,
      targetFile: input.targetFile || 'component.tsx',
      oldCode: input.oldCode,
      newCode: input.newCode,
      explanation: input.explanation,
      confidence: input.confidence || 0.8
    }
  }

  /**
   * Parse text response (fallback)
   */
  private parseTextResponse(text: string, context: ErrorContext): FixSuggestion {
    // Extract code from markdown blocks
    const codeBlockMatch = text.match(/```(?:tsx|ts|jsx|js)?\s*\n([\s\S]*?)\n```/)
    const fixedCode = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim()

    return {
      fixType: 'replace',
      targetFile: 'component.tsx',
      oldCode: context.codeContext.fileContent,
      newCode: fixedCode,
      explanation: 'AI-generated fix',
      confidence: 0.7
    }
  }
}

// Singleton instance
let aiFixGenerator: AIFixGenerator | null = null

export function getAIFixGenerator(): AIFixGenerator {
  if (!aiFixGenerator) {
    aiFixGenerator = new AIFixGenerator()
  }
  return aiFixGenerator
}





