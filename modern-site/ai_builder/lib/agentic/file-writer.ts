/**
 * File Writer - Writes VirtualFileSystem to database and extracts main components
 * Part of Cursor-style agentic architecture
 */

import { VirtualFileSystem } from './virtual-filesystem'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface WriteResult {
  success: boolean
  error?: string
  fileCount?: number
}

/**
 * Write VirtualFileSystem to Supabase database
 * Stores the file tree in draft_projects.metadata.file_tree
 */
export async function writeVFSToDatabase(
  vfs: VirtualFileSystem,
  supabase: SupabaseClient,
  draftId: string
): Promise<WriteResult> {
  try {
    const fileTree = vfs.getFileTree()
    const fileCount = Object.keys(fileTree).length

    if (fileCount === 0) {
      return {
        success: false,
        error: 'No files to write',
        fileCount: 0
      }
    }

    // Get current draft metadata
    const { data: draft, error: fetchError } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', draftId)
      .single()

    if (fetchError) {
      return {
        success: false,
        error: `Failed to fetch draft: ${fetchError.message}`,
        fileCount
      }
    }

    // Merge file_tree into existing metadata
    const currentMetadata = draft?.metadata || {}
    const updatedMetadata = {
      ...currentMetadata,
      file_tree: fileTree,
      project_structure: {
        ...(currentMetadata.project_structure || {}),
        totalFiles: fileCount,
        totalSize: Object.values(fileTree).reduce((sum, content) => sum + content.length, 0),
        updatedAt: new Date().toISOString()
      }
    }

    // Update draft with file tree
    const { error: updateError } = await supabase
      .from('draft_projects')
      .update({
        metadata: updatedMetadata
      })
      .eq('id', draftId)

    if (updateError) {
      return {
        success: false,
        error: `Failed to write file tree: ${updateError.message}`,
        fileCount
      }
    }

    return {
      success: true,
      fileCount
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error writing to database',
      fileCount: 0
    }
  }
}

/**
 * Extract main component code from file tree
 * Looks for common entry points in priority order
 */
export function getMainComponentFromTree(fileTree: Record<string, string>): string {
  // Priority order for main component files
  const priorityPaths = [
    'src/components/LandingPage.tsx',
    'src/App.tsx',
    'src/pages/index.tsx',
    'src/index.tsx',
    'app/page.tsx',
    'pages/index.tsx',
    'index.tsx'
  ]

  // Try priority paths first
  for (const path of priorityPaths) {
    if (fileTree[path]) {
      return fileTree[path]
    }
  }

  // Fallback: find first .tsx or .jsx file
  for (const [path, content] of Object.entries(fileTree)) {
    if (path.match(/\.(tsx|jsx)$/)) {
      return content
    }
  }

  // Last resort: return first file
  const firstFile = Object.values(fileTree)[0]
  return firstFile || ''
}







