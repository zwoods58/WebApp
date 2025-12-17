/**
 * Dependency Conflict Resolver
 * P1 Feature 13: Dependency Conflict Resolution
 */

import { DependencyError } from '../error-detection/dependency-checker'

export interface ConflictResolution {
  package: string
  currentVersion: string
  suggestedVersion: string
  reason: string
  compatible: boolean
}

class ConflictResolver {
  /**
   * Detect version conflicts
   */
  async detectConflicts(
    dependencies: Record<string, string>,
    devDependencies: Record<string, string> = {}
  ): Promise<DependencyError[]> {
    const conflicts: DependencyError[] = []

    // Check for same package in both dependencies and devDependencies
    for (const [name, version] of Object.entries(dependencies)) {
      if (devDependencies[name] && devDependencies[name] !== version) {
        conflicts.push({
          package: name,
          version,
          requiredVersion: devDependencies[name],
          type: 'version_conflict',
          severity: 'warning',
          message: `Version conflict: ${name} appears in both dependencies (${version}) and devDependencies (${devDependencies[name]})`,
          autoFixable: true,
          suggestedFix: {
            action: 'update',
            version
          }
        })
      }
    }

    return conflicts
  }

  /**
   * Suggest compatible versions
   */
  async suggestCompatibleVersions(
    packageName: string,
    requiredVersions: string[]
  ): Promise<string | null> {
    // Would check npm registry for compatible versions
    // For now, return first version
    return requiredVersions[0] || null
  }

  /**
   * Resolve conflicts automatically
   */
  async resolveConflicts(conflicts: DependencyError[]): Promise<{
    resolved: boolean
    updatedDependencies: Record<string, string>
  }> {
    const updatedDependencies: Record<string, string> = {}

    for (const conflict of conflicts) {
      if (conflict.autoFixable && conflict.suggestedFix?.version) {
        updatedDependencies[conflict.package] = conflict.suggestedFix.version
      }
    }

    return {
      resolved: Object.keys(updatedDependencies).length > 0,
      updatedDependencies
    }
  }
}

// Singleton instance
let conflictResolver: ConflictResolver | null = null

export function getConflictResolver(): ConflictResolver {
  if (!conflictResolver) {
    conflictResolver = new ConflictResolver()
  }
  return conflictResolver
}





