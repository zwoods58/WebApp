/**
 * Safe Fix Application System
 * P0 Feature 6: Safe Fix Application System
 */

import { FixSuggestion } from '../fix-validation/fix-validator'
import { getFixValidator } from '../fix-validation/fix-validator'
import { getFixTester } from '../fix-testing/fix-tester'
import { getSupabaseClient } from '../supabase/client-db'

export interface AppliedFix {
  id: string
  fixType: string
  operations: FileOperation[]
  appliedAt: Date
  originalError: Error
}

export interface FileOperation {
  type: 'update' | 'insert' | 'delete' | 'package'
  fileId?: string
  oldContent?: string
  newContent?: string
  position?: number
  action?: 'install' | 'update' | 'remove'
  package?: string
  version?: string
}

export interface ApplyOptions {
  skipValidation?: boolean
  createSnapshot?: boolean
  autoRollback?: boolean
}

export interface ApplyResult {
  success: boolean
  appliedFix?: AppliedFix
  testResults?: any
  error?: string
  rolledBack?: boolean
}

class FixApplicator {
  private snapshots: Map<string, string> = new Map()

  /**
   * Apply fix safely
   */
  async applyFix(
    fix: FixSuggestion,
    projectId: string,
    options: ApplyOptions = {}
  ): Promise<ApplyResult> {
    // 1. Create snapshot
    let snapshotId: string | null = null
    if (options.createSnapshot !== false) {
      snapshotId = await this.createSnapshot(projectId)
    }

    try {
      // 2. Validate fix before applying
      if (!options.skipValidation) {
        const context = await this.getContext(projectId)
        const validation = await getFixValidator().validateFix(fix, context)

        if (!validation.valid && validation.checks.some(c => !c.passed && c.critical)) {
          throw new Error(
            'Fix validation failed: ' +
            validation.checks
              .filter(c => !c.passed)
              .map(c => c.message)
              .join(', ')
          )
        }
      }

      // 3. Apply fix atomically
      const result = await this.applyFixAtomic(fix, projectId)

      // 4. Test the fix
      const testResult = await getFixTester().testFix(result, projectId)

      if (!testResult.success) {
        // Rollback if tests fail
        if (snapshotId && options.autoRollback !== false) {
          await this.rollback(snapshotId, projectId)
        }

        return {
          success: false,
          error: 'Fix caused test failures',
          testResults: testResult,
          rolledBack: true
        }
      }

      // 5. Success - commit the change
      await this.commitFix(result, projectId)

      return {
        success: true,
        appliedFix: result,
        testResults: testResult
      }
    } catch (error: any) {
      // Rollback on any error
      if (snapshotId && options.autoRollback !== false) {
        await this.rollback(snapshotId, projectId)
      }

      return {
        success: false,
        error: error.message,
        rolledBack: true
      }
    }
  }

  /**
   * Create snapshot before fix
   */
  private async createSnapshot(projectId: string): Promise<string> {
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
      const snapshot = {
        componentCode: draft.component_code,
        metadata: draft.metadata,
        timestamp: new Date().toISOString()
      }

      this.snapshots.set(snapshotId, JSON.stringify(snapshot))

      return snapshotId
    } catch (error: any) {
      throw new Error(`Failed to create snapshot: ${error.message}`)
    }
  }

  /**
   * Apply fix atomically
   */
  private async applyFixAtomic(
    fix: FixSuggestion,
    projectId: string
  ): Promise<AppliedFix> {
    const operations: FileOperation[] = []

    switch (fix.fixType) {
      case 'replace':
        operations.push({
          type: 'update',
          fileId: fix.targetFile,
          oldContent: fix.oldCode,
          newContent: fix.newCode
        })
        break

      case 'insert':
        operations.push({
          type: 'insert',
          fileId: fix.targetFile,
          position: fix.position,
          newContent: fix.newCode
        })
        break

      case 'delete':
        operations.push({
          type: 'delete',
          fileId: fix.targetFile,
          oldContent: fix.oldCode
        })
        break

      case 'install_package':
        operations.push({
          type: 'package',
          action: 'install',
          package: fix.package,
          version: fix.version
        })
        break

      case 'update_import':
        operations.push({
          type: 'update',
          fileId: fix.targetFile,
          oldContent: fix.oldImport,
          newContent: fix.newImport
        })
        break
    }

    // Apply all operations
    const supabase = getSupabaseClient()
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('component_code, metadata')
      .eq('id', projectId)
      .single()

    if (!draft) {
      throw new Error('Project not found')
    }

    let updatedCode = draft.component_code || ''
    const fileTree = draft.metadata?.file_tree || {}

    for (const op of operations) {
      switch (op.type) {
        case 'update':
          if (op.fileId === 'component.tsx' || op.fileId === 'component') {
            if (op.oldContent && updatedCode.includes(op.oldContent)) {
              updatedCode = updatedCode.replace(op.oldContent, op.newContent || '')
            } else {
              updatedCode = op.newContent || ''
            }
          } else if (op.fileId && fileTree[op.fileId]) {
            const fileContent = fileTree[op.fileId]
            if (typeof fileContent === 'string' && op.oldContent && fileContent.includes(op.oldContent)) {
              fileTree[op.fileId] = fileContent.replace(op.oldContent, op.newContent || '')
            }
          }
          break

        case 'insert':
          if (op.fileId === 'component.tsx' || op.fileId === 'component') {
            const position = op.position || updatedCode.length
            updatedCode = updatedCode.slice(0, position) + (op.newContent || '') + updatedCode.slice(position)
          }
          break

        case 'delete':
          if (op.fileId === 'component.tsx' || op.fileId === 'component') {
            if (op.oldContent) {
              updatedCode = updatedCode.replace(op.oldContent, '')
            }
          }
          break

        case 'package':
          // Package operations handled separately
          break
      }
    }

    // Update in database
    await supabase
      .from('draft_projects')
      .update({
        component_code: updatedCode,
        metadata: {
          ...draft.metadata,
          file_tree: fileTree
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    return {
      id: `fix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fixType: fix.fixType,
      operations,
      appliedAt: new Date(),
      originalError: new Error('Original error') // Would pass actual error
    }
  }

  /**
   * Rollback to snapshot
   */
  private async rollback(snapshotId: string, projectId: string): Promise<void> {
    const snapshotData = this.snapshots.get(snapshotId)
    if (!snapshotData) {
      throw new Error('Snapshot not found')
    }

    const snapshot = JSON.parse(snapshotData)

    const supabase = getSupabaseClient()
    await supabase
      .from('draft_projects')
      .update({
        component_code: snapshot.componentCode,
        metadata: snapshot.metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    this.snapshots.delete(snapshotId)
  }

  /**
   * Commit fix (mark as successful)
   */
  private async commitFix(fix: AppliedFix, projectId: string): Promise<void> {
    // Would store fix in fix_history table
    // For now, just log
    console.log(`Fix committed: ${fix.id}`)
  }

  /**
   * Get context for validation
   */
  private async getContext(projectId: string): Promise<{
    fileContent: string
    fileType: string
    dependencies: Record<string, string>
  }> {
    const supabase = getSupabaseClient()
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('component_code, metadata')
      .eq('id', projectId)
      .single()

    if (!draft) {
      return {
        fileContent: '',
        fileType: 'typescript',
        dependencies: {}
      }
    }

    const fileTree = draft.metadata?.file_tree || {}
    const packageJsonContent = fileTree['package.json'] || '{}'
    
    let packageJson: any = {}
    try {
      packageJson = JSON.parse(packageJsonContent)
    } catch {}

    return {
      fileContent: draft.component_code || '',
      fileType: 'tsx',
      dependencies: {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      }
    }
  }
}

// Singleton instance
let fixApplicator: FixApplicator | null = null

export function getFixApplicator(): FixApplicator {
  if (!fixApplicator) {
    fixApplicator = new FixApplicator()
  }
  return fixApplicator
}





