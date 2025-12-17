/**
 * Intent Parser - Parses user intent from prompts
 * Part of Cursor-style agentic architecture
 */

export interface ProjectIntent {
  intent: string
  entities: any[]
  projectType?: string
  dependencies?: string[]
  operations?: Array<{ type: string; path?: string }>
  features?: string[]
  pages?: string[]
  [key: string]: any // Allow additional properties
}

// Placeholder - to be implemented
export function parseIntent(prompt: string): ProjectIntent {
  return { intent: 'unknown', entities: [] }
}

