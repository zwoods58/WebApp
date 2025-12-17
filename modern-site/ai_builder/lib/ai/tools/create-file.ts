/**
 * Create File Tool
 * Allows AI to create new files in the project
 */

import { Tool } from './index'
import { getSupabaseClient } from '../../supabase/client-db'

export const createFileTool: Tool = {
  name: 'create_file',
  description: 'Create a new file in the project',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'File path relative to project root (e.g., "src/components/Button.tsx")',
        required: true
      },
      content: {
        type: 'string',
        description: 'File content',
        required: true
      },
      language: {
        type: 'string',
        description: 'Programming language (typescript, javascript, html, css, json)',
        required: false
      },
      projectId: {
        type: 'string',
        description: 'Project ID (draft_id)',
        required: true
      }
    },
    required: ['path', 'content', 'projectId']
  },
  execute: async (params: {
    path: string
    content: string
    language?: string
    projectId: string
  }) => {
    const supabase = getSupabaseClient()

    // Get current draft
    const { data: draft, error: fetchError } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', params.projectId)
      .single()

    if (fetchError || !draft) {
      throw new Error(`Project not found: ${params.projectId}`)
    }

    // Get file tree from metadata
    const fileTree = draft.metadata?.file_tree || {}
    
    // Check if file already exists
    if (fileTree[params.path]) {
      throw new Error(`File already exists: ${params.path}`)
    }

    // Add file to file tree
    fileTree[params.path] = params.content

    // Update draft metadata
    const { error: updateError } = await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          file_tree: fileTree,
          project_structure: {
            ...(draft.metadata?.project_structure || {}),
            totalFiles: Object.keys(fileTree).length,
            totalSize: Object.values(fileTree).reduce((sum: number, content: any) => sum + String(content).length, 0),
            updatedAt: new Date().toISOString()
          }
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', params.projectId)

    if (updateError) {
      throw new Error(`Failed to create file: ${updateError.message}`)
    }

    return {
      success: true,
      path: params.path,
      size: params.content.length,
      message: `File created: ${params.path}`
    }
  }
}





