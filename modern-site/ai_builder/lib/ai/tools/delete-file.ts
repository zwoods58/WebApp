/**
 * Delete File Tool
 * Allows AI to delete files from the project
 */

import { Tool } from './index'
import { getSupabaseClient } from '../../supabase/client-db'

export const deleteFileTool: Tool = {
  name: 'delete_file',
  description: 'Delete a file from the project',
  parameters: {
    type: 'object',
    properties: {
      fileId: {
        type: 'string',
        description: 'File path (relative to project root)',
        required: true
      },
      projectId: {
        type: 'string',
        description: 'Project ID (draft_id)',
        required: true
      }
    },
    required: ['fileId', 'projectId']
  },
  execute: async (params: {
    fileId: string
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
    
    // Check if file exists
    if (!fileTree[params.fileId]) {
      throw new Error(`File not found: ${params.fileId}`)
    }

    // Delete file from file tree
    delete fileTree[params.fileId]

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
      throw new Error(`Failed to delete file: ${updateError.message}`)
    }

    return {
      success: true,
      path: params.fileId,
      message: `File deleted: ${params.fileId}`
    }
  }
}





