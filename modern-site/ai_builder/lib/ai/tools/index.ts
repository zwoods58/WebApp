/**
 * AI Function Calling System
 * P0 Feature 3: AI Function Calling
 * 
 * Tool/function calling system for AI to interact with the codebase
 */

export interface Tool {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description: string
      required?: boolean
    }>
    required?: string[]
  }
  execute: (params: any) => Promise<any>
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
}

export interface ToolResult {
  toolCallId: string
  result: any
  error?: string
}

/**
 * Registry of available tools
 */
class ToolRegistry {
  private tools: Map<string, Tool> = new Map()

  register(tool: Tool): void {
    this.tools.set(tool.name, tool)
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name)
  }

  getAll(): Tool[] {
    return Array.from(this.tools.values())
  }

  getToolDefinitions(): Array<{
    name: string
    description: string
    parameters: Tool['parameters']
  }> {
    return this.getAll().map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }))
  }

  async executeToolCall(toolCall: ToolCall): Promise<ToolResult> {
    const tool = this.get(toolCall.name)
    if (!tool) {
      return {
        toolCallId: toolCall.id,
        result: null,
        error: `Tool ${toolCall.name} not found`
      }
    }

    try {
      const result = await tool.execute(toolCall.arguments)
      return {
        toolCallId: toolCall.id,
        result
      }
    } catch (error: any) {
      return {
        toolCallId: toolCall.id,
        result: null,
        error: error.message || 'Tool execution failed'
      }
    }
  }
}

// Singleton instance
let toolRegistry: ToolRegistry | null = null

export function getToolRegistry(): ToolRegistry {
  if (!toolRegistry) {
    toolRegistry = new ToolRegistry()
  }
  return toolRegistry
}

/**
 * Format tools for AI API (Anthropic format)
 */
export function formatToolsForAI(tools: Tool[]): Array<{
  name: string
  description: string
  input_schema: Tool['parameters']
}> {
  return tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters
  }))
}





