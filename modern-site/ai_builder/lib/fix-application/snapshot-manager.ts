/**
 * Snapshot Manager
 * P0 Feature 6: Safe Fix Application System - Snapshots
 */

import { getSupabaseClient } from '../supabase/client-db'

export interface Snapshot {
  id: string
  projectId: string
  componentCode: string
  metadata: any
  timestamp: Date
}

class SnapshotManager {
  private snapshots: Map<string, Snapshot> = new Map()

  /**
   * Create snapshot
   */
  async createSnapshot(projectId: string): Promise<string> {
    try {
      const supabase = getSupabaseClient()
      const { data: draft } = await supabase
        .from('draft_projects')
        .select('component_code, metadata')
        .eq('id', projectId)
        .single()

      if (!draft) {
        throw new Error('Project not found')
      }

      const snapshotId = `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const snapshot: Snapshot = {
        id: snapshotId,
        projectId,
        componentCode: draft.component_code || '',
        metadata: draft.metadata || {},
        timestamp: new Date()
      }

      this.snapshots.set(snapshotId, snapshot)

      return snapshotId
    } catch (error: any) {
      throw new Error(`Failed to create snapshot: ${error.message}`)
    }
  }

  /**
   * Get snapshot
   */
  getSnapshot(snapshotId: string): Snapshot | null {
    return this.snapshots.get(snapshotId) || null
  }

  /**
   * Restore snapshot
   */
  async restoreSnapshot(snapshotId: string): Promise<void> {
    const snapshot = this.snapshots.get(snapshotId)
    if (!snapshot) {
      throw new Error('Snapshot not found')
    }

    const supabase = getSupabaseClient()
    await supabase
      .from('draft_projects')
      .update({
        component_code: snapshot.componentCode,
        metadata: snapshot.metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', snapshot.projectId)
  }

  /**
   * Delete snapshot
   */
  deleteSnapshot(snapshotId: string): void {
    this.snapshots.delete(snapshotId)
  }

  /**
   * Cleanup old snapshots
   */
  cleanup(maxAge: number = 3600000): void {
    const now = Date.now()
    for (const [id, snapshot] of this.snapshots.entries()) {
      if (now - snapshot.timestamp.getTime() > maxAge) {
        this.snapshots.delete(id)
      }
    }
  }
}

// Singleton instance
let snapshotManager: SnapshotManager | null = null

export function getSnapshotManager(): SnapshotManager {
  if (!snapshotManager) {
    snapshotManager = new SnapshotManager()
  }
  return snapshotManager
}





