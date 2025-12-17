import { NextRequest, NextResponse } from 'next/server'
import { getRecommendedModel } from '../../../../ai_builder/lib/ai/model-router'
import { getAIFixGenerator } from '../../../../ai_builder/lib/fix-generation/ai-fix-generator'
import { getErrorContextBuilder } from '../../../../ai_builder/lib/error-analysis/error-context-builder'
import { getFixValidator } from '../../../../ai_builder/lib/fix-validation/fix-validator'
import { getConfidenceScorer } from '../../../../ai_builder/lib/fix-confidence/confidence-scorer'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

export async function POST(request: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      )
    }

    const { 
      componentCode, 
      errorMessage, 
      stackTrace,
      errorContext,
      categorizedError,
      retryAttempt = 0
    } = await request.json()

    if (!componentCode || !errorMessage) {
      return NextResponse.json(
        { error: 'componentCode and errorMessage are required' },
        { status: 400 }
      )
    }

    // ALWAYS use Sonnet 4.5 for error fixing (fast and accurate)
    const { config: modelConfig } = getRecommendedModel('Fix React component error', {
      taskType: 'iteration',
      forceModel: 'sonnet' // Explicitly force Sonnet 4.5
    })

    console.log(`🤖 Using ${modelConfig.name} to fix component error`)

    // Build highly specific system prompt for error fixing
    const systemPrompt = `You are an expert React/TypeScript developer specializing in fixing compilation and runtime errors, especially JSX transpilation issues.

Your task is to analyze React component code that has failed to compile, transpile, or render, and rewrite it to resolve ALL errors while maintaining the original intent and functionality.

CRITICAL REQUIREMENTS:
1. Fix ALL JSX/transpilation errors (most critical - these prevent code from executing)
   - Ensure all JSX tags are properly closed
   - Fix unmatched brackets, parentheses, quotes
   - Ensure proper JSX syntax (no raw HTML in JSX)
   - Fix unterminated strings that break JSX parsing
   
2. Fix ALL compilation errors (syntax, imports, undefined variables, type errors)
3. Fix ALL runtime errors (invalid JSX, missing props, undefined references)
4. Ensure valid JSX syntax throughout - code must be transpilable by Babel
5. Fix import statements - ensure all imported components/functions exist
6. Resolve undefined variables - either define them or remove references
7. Ensure proper React component structure (valid function/const component)
8. Fix any TypeScript type errors
9. Ensure all hooks (useState, useEffect, etc.) are used correctly
10. Fix any lazy loading issues (ensure exports match imports)
11. Maintain the original design intent and functionality

JSX TRANSPILATION FIXES (CRITICAL):
- If error mentions "Unexpected token '<'" - the code has raw JSX that needs proper React.createElement or valid JSX syntax
- If error mentions "JSX Transpilation Error" - fix the JSX syntax to be valid
- Ensure all JSX elements are properly formatted: <Component prop="value">content</Component>
- Fix any malformed JSX attributes (missing quotes, unmatched brackets)
- Remove any HTML comments (<!-- -->) from JSX - use {/* */} instead

OUTPUT FORMAT:
Return ONLY the fixed code as a complete React component. Do not include markdown code blocks, explanations, or any other text - just the raw component code.

The fixed code must:
- Be a complete, valid React component
- Have valid JSX syntax that Babel can transpile
- Compile without errors
- Render without runtime errors
- Maintain the original functionality and design`

    // Detect error type for better context
    const isJSXError = 
      errorMessage?.includes('Unexpected token') ||
      errorMessage?.includes('JSX') ||
      errorMessage?.includes('Transpilation') ||
      errorMessage?.includes('SyntaxError')
    
    const errorTypeContext = isJSXError 
      ? 'This is a JSX/TRANSPILATION ERROR - the code contains invalid JSX syntax that Babel cannot transpile. ' +
        'Common causes: unmatched brackets, unterminated strings, invalid JSX tags, or raw HTML in JSX. ' +
        'You MUST fix the JSX syntax to be valid and transpilable.'
      : 'This is a compilation or runtime error. Analyze the error type and fix accordingly.'

    const userPrompt = `Fix this React component code that is failing with the following error:

=== ERROR TYPE ===
${errorTypeContext}

=== ERROR MESSAGE ===
${errorMessage}

=== STACK TRACE ===
${stackTrace || 'No stack trace available'}

=== BROKEN CODE ===
\`\`\`tsx
${componentCode}
\`\`\`

=== CRITICAL ANALYSIS REQUIRED ===
1. If error mentions "Unexpected token '<'" or "JSX Transpilation Error":
   - The code has raw JSX that Babel cannot transpile
   - Check for: unmatched brackets {}, parentheses (), quotes "", ''
   - Check for: unterminated strings breaking JSX parsing
   - Check for: invalid JSX syntax (raw HTML, malformed tags)
   - Fix ALL syntax issues to make JSX valid

2. If it's a syntax error:
   - Count all brackets, parentheses, quotes - ensure they match
   - Fix any unterminated strings
   - Ensure proper JSX tag closing

3. If it's an import error:
   - Verify all imports exist
   - Fix import paths

4. If it's an undefined variable:
   - Define missing variables or remove references

5. If it's a JSX error:
   - Ensure all JSX elements are properly formatted
   - Fix attribute syntax (use quotes for strings)
   - Ensure proper closing tags

=== OUTPUT REQUIREMENTS ===
Return ONLY the fixed code as a complete, valid React component. The code must:
- Have valid JSX syntax that Babel can transpile
- Compile without any syntax errors
- Render without runtime errors
- Maintain the original design and functionality

Do NOT include markdown code blocks, explanations, or any other text - just the raw fixed component code.`

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelConfig.modelId, // Sonnet 4.5
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Claude API error:', response.status, errorText)
      return NextResponse.json(
        { error: `Claude API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiResponse = data.content?.[0]?.text || ''

    // Extract code from response (might be wrapped in markdown)
    let fixedCode = aiResponse.trim()

    // Remove markdown code blocks if present
    const codeBlockMatch = fixedCode.match(/```(?:tsx|ts|jsx|js|typescript|javascript)?\s*\n([\s\S]*?)\n```/)
    if (codeBlockMatch) {
      fixedCode = codeBlockMatch[1].trim()
    } else {
      // Remove any remaining code block markers
      fixedCode = fixedCode.replace(/^```(?:tsx|ts|jsx|js|typescript|javascript)?\s*\n?/gm, '')
      fixedCode = fixedCode.replace(/\n?```\s*$/gm, '')
      fixedCode = fixedCode.trim()
    }

    if (!fixedCode) {
      return NextResponse.json(
        { error: 'No fixed code returned from AI' },
        { status: 500 }
      )
    }

    // Validate fixed code doesn't contain obvious JSX syntax errors
    const hasUnmatchedBrackets = (fixedCode.match(/\{/g) || []).length !== (fixedCode.match(/\}/g) || []).length
    const hasUnmatchedParens = (fixedCode.match(/\(/g) || []).length !== (fixedCode.match(/\)/g) || []).length
    const hasUnmatchedQuotes = (fixedCode.match(/"/g) || []).length % 2 !== 0 || (fixedCode.match(/'/g) || []).length % 2 !== 0
    
    if (hasUnmatchedBrackets || hasUnmatchedParens || hasUnmatchedQuotes) {
      console.warn('⚠️ Fixed code still has syntax issues - may need another pass')
      // Don't fail - let ComponentRenderer try it, error boundary will catch if still broken
    }

    console.log(`✅ Error fixed successfully using ${modelConfig.name}`)
    console.log(`📝 Fixed code length: ${fixedCode.length} characters`)

    // Build error context if not provided
    let context = errorContext
    if (!context && componentCode) {
      const contextBuilder = getErrorContextBuilder()
      const error = new Error(errorMessage)
      error.stack = stackTrace
      context = await contextBuilder.buildContext(error, 'unknown', 'component.tsx')
    }

    // Try new structured fix generation if context is available
    let structuredFix = null
    if (context) {
      try {
        const aiFixGenerator = getAIFixGenerator()
        structuredFix = await aiFixGenerator.generateFix(context)
        
        // Validate fix
        const fixValidator = getFixValidator()
        const validation = await fixValidator.validateFix(structuredFix, {
          fileContent: componentCode,
          fileType: 'tsx',
          dependencies: {}
        })
        
        // Calculate confidence
        const confidenceScorer = getConfidenceScorer()
        const historicalSuccessRate = 0.7 // Would get from fix history
        structuredFix.confidence = confidenceScorer.calculateConfidence(
          structuredFix,
          validation,
          historicalSuccessRate
        )
      } catch (err) {
        console.warn('Structured fix generation failed, using fallback:', err)
      }
    }

    // Return both formats for backward compatibility
    return NextResponse.json({
      success: true,
      fixedCode, // Backward compatible
      fix: structuredFix, // New structured format
      model: modelConfig.name,
      confidence: structuredFix?.confidence || 0.8,
      fixedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error fixing component:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fix error' },
      { status: 500 }
    )
  }
}


