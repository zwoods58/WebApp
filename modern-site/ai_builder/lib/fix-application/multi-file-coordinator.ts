/**
 * Multi-File Fix Coordinator
 * P2 Feature 22: Multi-File Fix Support
 */

import { FixSuggestion } from '../fix-validation/fix-validator'
import { getFixApplicator } from './fix-applicator'

export interface MultiFileFix {
  fixes: FixSuggestion[]
  dependencies: FileDependency[]
}

export interface FileDependency {
  file: string
  dependsOn: string[]
  affects: string[]
}

class MultiFileCoordinator {
  /**
   * Coordinate multi-file fixes
   */
  async coordinateFixes(
    fixes: FixSuggestion[],
    projectId: string
  ): Promise<{
    success: boolean
    appliedFixes: any[]
    errors: string[]
  }> {
    // Resolve dependencies
    const orderedFixes = this.resolveDependencies(fixes)

    const appliedFixes: any[] = []
    const errors: string[] = []

    // Apply fixes in order
    for (const fix of orderedFixes) {
      try {
        const result = await getFixApplicator().applyFix(fix, projectId, {
          createSnapshot: true,
          autoRollback: true
        })

        if (result.success) {
          appliedFixes.push(result.appliedFix)
        } else {
          errors.push(`Failed to apply fix to ${fix.targetFile}: ${result.error}`)
          // Rollback all previous fixes
          // Would implement rollback logic
          break
        }
      } catch (error: any) {
        errors.push(`Error applying fix to ${fix.targetFile}: ${error.message}`)
        break
      }
    }

    return {
      success: errors.length === 0,
      appliedFixes,
      errors
    }
  }

  /**
   * Resolve file dependencies
   */
  private resolveDependencies(fixes: FixSuggestion[]): FixSuggestion[] {
    // Topological sort based on file dependencies
    // For now, return fixes in order
    return fixes
  }

  /**
   * Detect cross-file dependencies
   */
  detectCrossFileDependencies(fixes: FixSuggestion[]): FileDependency[] {
    const dependencies: FileDependency[] = []

    fixes.forEach(fix => {
      // Would analyze imports/exports to detect dependencies
      // For now, return empty array
    })

    return dependencies
  }
}

// Singleton instance
let multiFileCoordinator: MultiFileCoordinator | null = null

export function getMultiFileCoordinator(): MultiFileCoordinator {
  if (!multiFileCoordinator) {
    multiFileCoordinator = new MultiFileCoordinator()
  }
  return multiFileCoordinator
}





