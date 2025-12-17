/**
 * P2 Feature 12: Auto-Save & Recovery
 * Auto-saves code on every change with debouncing and recovery support
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

export interface AutoSaveState {
  draftId: string
  componentCode: string
  lastSaved: Date | null
  isSaving: boolean
  hasUnsavedChanges: boolean
  saveError: string | null
}

/**
 * Debounce function for auto-save
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Auto-save code to database
 */
export async function autoSaveCode(
  draftId: string,
  componentCode: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()

  try {
    // Get current metadata
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', draftId)
      .single()

    const updatedMetadata = {
      ...draft?.metadata,
      component_code: componentCode,
      last_auto_saved: new Date().toISOString(),
      ...metadata
    }

    const { error } = await supabase
      .from('draft_projects')
      .update({
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', draftId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Create debounced auto-save function
 */
export function createAutoSave(
  draftId: string,
  delay: number = 2000 // 2 seconds default
): (componentCode: string, metadata?: Record<string, any>) => void {
  return debounce(async (componentCode: string, metadata?: Record<string, any>) => {
    await autoSaveCode(draftId, componentCode, metadata)
  }, delay)
}

/**
 * Save to localStorage as backup
 */
export function saveToLocalStorage(draftId: string, componentCode: string): void {
  if (typeof window === 'undefined') return

  try {
    const key = `draft_backup_${draftId}`
    const backup = {
      draftId,
      componentCode,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(key, JSON.stringify(backup))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

/**
 * Recover from localStorage backup
 */
export function recoverFromLocalStorage(draftId: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    const key = `draft_backup_${draftId}`
    const backupStr = localStorage.getItem(key)
    
    if (!backupStr) {
      return null
    }

    const backup = JSON.parse(backupStr)
    return backup.componentCode || null
  } catch (e) {
    console.warn('Failed to recover from localStorage:', e)
    return null
  }
}

/**
 * Clear localStorage backup
 */
export function clearLocalStorageBackup(draftId: string): void {
  if (typeof window === 'undefined') return

  try {
    const key = `draft_backup_${draftId}`
    localStorage.removeItem(key)
  } catch (e) {
    console.warn('Failed to clear localStorage backup:', e)
  }
}

/**
 * Check if draft has unsaved changes
 */
export async function hasUnsavedChanges(
  draftId: string,
  currentCode: string
): Promise<boolean> {
  const supabase = getSupabaseClient()

  const { data: draft } = await supabase
    .from('draft_projects')
    .select('metadata')
    .eq('id', draftId)
    .single()

  const savedCode = draft?.metadata?.component_code || ''
  return savedCode !== currentCode
}





