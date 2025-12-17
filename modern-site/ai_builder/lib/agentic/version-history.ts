/**
 * P2 Feature 11: Version History & Undo/Redo
 * Saves code versions/snapshots and provides undo/redo functionality
 */

import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

export interface CodeVersion {
  id: string
  draftId: string
  componentCode: string
  version: number
  createdAt: string
  description?: string
  metadata?: Record<string, any>
}

export interface VersionHistory {
  versions: CodeVersion[]
  currentVersion: number
  canUndo: boolean
  canRedo: boolean
}

/**
 * Save code version snapshot
 */
export async function saveCodeVersion(
  draftId: string,
  componentCode: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<CodeVersion> {
  const supabase = getSupabaseClient()

  // Get current version number
  const { data: existingVersions } = await supabase
    .from('code_versions')
    .select('version')
    .eq('draft_id', draftId)
    .order('version', { ascending: false })
    .limit(1)

  const nextVersion = existingVersions && existingVersions.length > 0
    ? existingVersions[0].version + 1
    : 1

  // Save version
  const { data, error } = await supabase
    .from('code_versions')
    .insert({
      draft_id: draftId,
      component_code: componentCode,
      version: nextVersion,
      description: description || `Version ${nextVersion}`,
      metadata: metadata || {}
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save version: ${error.message}`)
  }

  return {
    id: data.id,
    draftId: data.draft_id,
    componentCode: data.component_code,
    version: data.version,
    createdAt: data.created_at,
    description: data.description,
    metadata: data.metadata
  }
}

/**
 * Get version history for a draft
 */
export async function getVersionHistory(draftId: string): Promise<VersionHistory> {
  const supabase = getSupabaseClient()

  const { data: versions, error } = await supabase
    .from('code_versions')
    .select('*')
    .eq('draft_id', draftId)
    .order('version', { ascending: false })

  if (error) {
    throw new Error(`Failed to get version history: ${error.message}`)
  }

  // Get current version from draft
  const { data: draft } = await supabase
    .from('draft_projects')
    .select('metadata')
    .eq('id', draftId)
    .single()

  const currentVersion = draft?.metadata?.current_version || versions?.[0]?.version || 1

  return {
    versions: versions.map(v => ({
      id: v.id,
      draftId: v.draft_id,
      componentCode: v.component_code,
      version: v.version,
      createdAt: v.created_at,
      description: v.description,
      metadata: v.metadata
    })),
    currentVersion,
    canUndo: currentVersion > 1,
    canRedo: currentVersion < (versions?.[0]?.version || 1)
  }
}

/**
 * Get specific version
 */
export async function getVersion(draftId: string, version: number): Promise<CodeVersion | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('code_versions')
    .select('*')
    .eq('draft_id', draftId)
    .eq('version', version)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    draftId: data.draft_id,
    componentCode: data.component_code,
    version: data.version,
    createdAt: data.created_at,
    description: data.description,
    metadata: data.metadata
  }
}

/**
 * Restore version (undo/redo)
 */
export async function restoreVersion(
  draftId: string,
  version: number
): Promise<CodeVersion> {
  const versionData = await getVersion(draftId, version)
  
  if (!versionData) {
    throw new Error(`Version ${version} not found`)
  }

  const supabase = getSupabaseClient()

  // Update draft with restored code
  const { data: draft } = await supabase
    .from('draft_projects')
    .select('metadata')
    .eq('id', draftId)
    .single()

  const updatedMetadata = {
    ...draft?.metadata,
    component_code: versionData.componentCode,
    current_version: version,
    restored_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('draft_projects')
    .update({ metadata: updatedMetadata })
    .eq('id', draftId)

  if (error) {
    throw new Error(`Failed to restore version: ${error.message}`)
  }

  return versionData
}

/**
 * Compare two versions
 */
export function compareVersions(v1: CodeVersion, v2: CodeVersion): {
  added: number
  removed: number
  changed: number
  diff: string
} {
  const lines1 = v1.componentCode.split('\n')
  const lines2 = v2.componentCode.split('\n')

  // Simple line-by-line comparison
  const maxLines = Math.max(lines1.length, lines2.length)
  let added = 0
  let removed = 0
  let changed = 0
  const diffLines: string[] = []

  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i]
    const line2 = lines2[i]

    if (line1 === undefined) {
      added++
      diffLines.push(`+ ${line2}`)
    } else if (line2 === undefined) {
      removed++
      diffLines.push(`- ${line1}`)
    } else if (line1 !== line2) {
      changed++
      diffLines.push(`- ${line1}`)
      diffLines.push(`+ ${line2}`)
    } else {
      diffLines.push(`  ${line1}`)
    }
  }

  return {
    added,
    removed,
    changed,
    diff: diffLines.join('\n')
  }
}





