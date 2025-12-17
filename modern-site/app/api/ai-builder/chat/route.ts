/**
 * AI Chat API Route with Function Calling
 * P0 Feature 3: AI Function Calling Integration
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../src/lib/supabase'
import { registerAllTools, getAllToolsForAI } from '../../../ai_builder/lib/ai/tools/register-all'
import { getToolRegistry } from '../../../ai_builder/lib/ai/tools/index'
import { ToolCall, ToolResult } from '../../../ai_builder/lib/ai/tools/index'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// Register all tools on module load
registerAllTools()

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { messages, projectId, userId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Get user authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify project ownership
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get tools for AI
    const tools = getAllToolsForAI()

    // Format messages for Anthropic API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    // Get project context
    const fileTree = draft.metadata?.file_tree || {}
    const fileList = Object.keys(fileTree).slice(0, 20) // Limit to 20 files for context

    // Build system prompt with tool information
    const systemPrompt = `You are an expert AI assistant helping users build web applications.

Available tools:
${tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

Current project context:
- Project ID: ${projectId}
- Files: ${fileList.join(', ')}

When the user asks you to create, update, or delete files, use the appropriate tools.
Always include the projectId parameter in tool calls.`

    // Call Anthropic API with tools
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        messages: formattedMessages,
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.parameters
        }))
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', errorText)
      return NextResponse.json(
        { error: `AI API error: ${response.status}` },
        { status: response.status }
      )
    }

    const aiResponse = await response.json()

    // Handle tool calls if present
    const toolResults: ToolResult[] = []
    if (aiResponse.content && Array.isArray(aiResponse.content)) {
      const toolCalls = aiResponse.content.filter((item: any) => item.type === 'tool_use')
      
      if (toolCalls.length > 0) {
        const registry = getToolRegistry()
        
        // Execute all tool calls
        for (const toolCall of toolCalls) {
          try {
            // Add projectId to tool call arguments
            const toolCallWithProject: ToolCall = {
              id: toolCall.id,
              name: toolCall.name,
              arguments: {
                ...toolCall.input,
                projectId // Always include projectId
              }
            }
            
            const result = await registry.executeToolCall(toolCallWithProject)
            toolResults.push(result)
          } catch (error: any) {
            toolResults.push({
              toolCallId: toolCall.id,
              result: null,
              error: error.message || 'Tool execution failed'
            })
          }
        }

        // If tools were called, make a follow-up request with tool results
        if (toolResults.length > 0) {
          const followUpMessages = [
            ...formattedMessages,
            {
              role: 'assistant',
              content: aiResponse.content
            },
            {
              role: 'user',
              content: toolResults.map(result => ({
                type: 'tool_result',
                tool_use_id: result.toolCallId,
                content: result.error 
                  ? `Error: ${result.error}`
                  : JSON.stringify(result.result)
              }))
            }
          ]

          // Make follow-up request
          const followUpResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_API_KEY!,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 8192,
              system: systemPrompt,
              messages: followUpMessages,
              tools: tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                input_schema: tool.parameters
              }))
            })
          })

          if (followUpResponse.ok) {
            const followUpData = await followUpResponse.json()
            return NextResponse.json({
              message: followUpData.content,
              toolCalls: toolCalls.map((tc: any) => ({
                name: tc.name,
                arguments: tc.input
              })),
              toolResults: toolResults.map(tr => ({
                toolCallId: tr.toolCallId,
                success: !tr.error,
                result: tr.result,
                error: tr.error
              }))
            })
          }
        }
      }
    }

    return NextResponse.json({
      message: aiResponse.content,
      toolCalls: [],
      toolResults: []
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}





