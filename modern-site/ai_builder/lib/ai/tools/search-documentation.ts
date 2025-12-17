/**
 * Search Documentation Tool
 * Allows AI to search library documentation
 */

import { Tool } from './index'

export const searchDocumentationTool: Tool = {
  name: 'search_documentation',
  description: 'Search library documentation for information',
  parameters: {
    type: 'object',
    properties: {
      library: {
        type: 'string',
        description: 'Library name (e.g., "react", "nextjs", "tailwindcss")',
        required: true
      },
      query: {
        type: 'string',
        description: 'Search query',
        required: true
      }
    },
    required: ['library', 'query']
  },
  execute: async (params: {
    library: string
    query: string
  }) => {
    // In a real implementation, this would search actual documentation
    // For now, return a mock response with common documentation URLs
    
    const documentationUrls: Record<string, string> = {
      react: 'https://react.dev',
      nextjs: 'https://nextjs.org/docs',
      tailwindcss: 'https://tailwindcss.com/docs',
      typescript: 'https://www.typescriptlang.org/docs',
      node: 'https://nodejs.org/docs'
    }

    const baseUrl = documentationUrls[params.library.toLowerCase()] || `https://www.npmjs.com/package/${params.library}`

    return {
      success: true,
      library: params.library,
      query: params.query,
      documentationUrl: baseUrl,
      message: `Documentation search: ${params.library} - ${params.query}`,
      note: 'In production, this would search actual documentation and return relevant snippets'
    }
  }
}





