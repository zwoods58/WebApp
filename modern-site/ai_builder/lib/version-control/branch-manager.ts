/**
 * Branch Manager for Version Control
 * P1 Feature 10: Enhanced Version Control - Branch Management
 */

import { getSupabaseClient } from '../supabase/client-db'

export interface Branch {
  id: string
  name: string
  projectId: string
  baseVersion: number
  currentVersion: number
  createdAt: Date
  createdBy: string
}

export interface BranchCommit {
  id: string
  branchId: string
  version: number
  code: string
  message: string
  createdAt: Date
}

/**
 * Create a new branch
 */
export async function createBranch(
  projectId: string,
  branchName: string,
  baseVersion: number,
  userId: string
): Promise<Branch> {
  const supabase = getSupabaseClient()

  const branch: Branch = {
    id: crypto.randomUUID(),
    name: branchName,
    projectId,
    baseVersion,
    currentVersion: baseVersion,
    createdAt: new Date(),
    createdBy: userId
  }

  // Store branch in metadata
  const { data: draft } = await supabase
    .from('draft_projects')
    .select('metadata')
    .eq('id', projectId)
    .single()

  if (!draft) {
    throw new Error('Project not found')
  }

  const branches = draft.metadata?.branches || []
  branches.push(branch)

  await supabase
    .from('draft_projects')
    .update({
      metadata: {
        ...draft.metadata,
        branches
      }
    })
    .eq('id', projectId)

  return branch
}

/**
 * Get all branches for a project
 */
export async function getBranches(projectId: string): Promise<Branch[]> {
  const supabase = getSupabaseClient()

  const { data: draft } = await supabase
    .from('draft_projects')
    .select('metadata')
    .eq('id', projectId)
    .single()

  if (!draft) {
    return []
  }

  return draft.metadata?.branches || []
}

/**
 * Switch to a branch
 */
export async function switchBranch(
  projectId: string,
  branchId: string
): Promise<void> {
  const supabase = getSupabaseClient()

  const { data: draft } = await supabase
    .from('draft_projects')
    .select('metadata')
    .eq('id', projectId)
    .single()

  if (!draft) {
    throw new Error('Project not found')
  }

  const branches = draft.metadata?.branches || []
  const branch = branches.find((b: Branch) => b.id === branchId)

  if (!branch) {
    throw new Error('Branch not found')
  }

  // Get code from branch's current version
  const { data: version } = await supabase
    .from('code_versions')
    .select('component_code')
    .eq('draft_id', projectId)
    .eq('version', branch.currentVersion)
    .single()

  if (version) {
    // Update draft with branch code
    await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          currentBranch: branchId,
          component_code: version.component_code
        }
      })
      .eq('id', projectId)
  }
}

/**
 * Merge branch into main
 */
export async function mergeBranch(
  projectId: string,
  branchId: string,
  userId: string
): Promise<void> {
  const supabase = getSupabaseClient()

  const { data: draft } = await supabase
    .from('draft_projects')
    .select('metadata')
    .eq('id', projectId)
    .single()

  if (!draft) {
    throw new Error('Project not found')
  }

  const branches = draft.metadata?.branches || []
  const branch = branches.find((b: Branch) => b.id === branchId)

  if (!branch) {
    throw new Error('Branch not found')
  }

  // Get branch's latest code
  const { data: branchVersion } = await supabase
    .from('code_versions')
    .select('component_code')
    .eq('draft_id', projectId)
    .eq('version', branch.currentVersion)
    .single()

  if (!branchVersion) {
    throw new Error('Branch version not found')
  }

  // Create new version with merged code
  const { data: latestVersion } = await supabase
    .from('code_versions')
    .select('version')
    .eq('draft_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .single()

  const newVersion = (latestVersion?.version || 0) + 1

  await supabase
    .from('code_versions')
    .insert({
      draft_id: projectId,
      version: newVersion,
      component_code: branchVersion.component_code,
      description: `Merged branch: ${branch.name}`,
      created_by: userId
    })

  // Update draft with merged code
  await supabase
    .from('draft_projects')
    .update({
      metadata: {
        ...draft.metadata,
        component_code: branchVersion.component_code,
        currentBranch: null
      }
    })
    .eq('id', projectId)
}





