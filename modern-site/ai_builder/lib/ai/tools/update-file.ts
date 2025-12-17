/**
 * Update File Tool
 * Allows AI to update existing files in the project
 */

import { Tool } from './index'
import { getSupabaseClient } from '../../supabase/client-db'

export const updateFileTool: Tool = {
  name: 'update_file',
  description: 'Update existing file content',
  parameters: {
    type: 'object',
    properties: {
      fileId: {
        type: 'string',
        description: 'File path (relative to project root)',
        required: true
      },
      content: {
        type: 'string',
        description: 'New file content',
        required: true
      },
      operation: {
        type: 'string',
        description: 'Update operation: replace (default), append, prepend',
        required: false
      },
      projectId: {
        type: 'string',
        description: 'Project ID (draft_id)',
        required: true
      }
    },
    required: ['fileId', 'content', 'projectId']
  },
  execute: async (params: {
    fileId: string
    content: string
    operation?: 'replace' | 'append' | 'prepend'
    projectId: string
  }) => {
    const supabase = getSupabaseClient()
    const operation = params.operation || 'replace'

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
    
    // Check if file exists
    if (!fileTree[params.fileId]) {
      throw new Error(`File not found: ${params.fileId}`)
    }

    const currentContent = fileTree[params.fileId] || ''

    // Apply operation
    let newContent: string
    switch (operation) {
      case 'append':
        newContent = currentContent + '\n' + params.content
        break
      case 'prepend':
        newContent = params.content + '\n' + currentContent
        break
      case 'replace':
      default:
        newContent = params.content
        break
    }

    // Update file in file tree
    fileTree[params.fileId] = newContent

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
      throw new Error(`Failed to update file: ${updateError.message}`)
    }

    return {
      success: true,
      path: params.fileId,
      operation,
      size: newContent.length,
      message: `File updated: ${params.fileId} (${operation})`
    }
  }
}





