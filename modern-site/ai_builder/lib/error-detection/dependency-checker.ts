/**
 * Dependency Checker
 * P0 Feature 2: Build Error Detection System - Dependency Errors
 */

export interface DependencyError {
  package: string
  version?: string
  requiredVersion?: string
  type: 'missing' | 'version_conflict' | 'peer_dependency' | 'circular'
  severity: 'error' | 'warning'
  message: string
  autoFixable: boolean
  suggestedFix?: {
    action: 'install' | 'update' | 'remove'
    version?: string
  }
}

export interface DependencyInfo {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies?: Record<string, string>
}

class DependencyChecker {
  /**
   * Check for dependency issues
   */
  async checkDependencies(
    packageJson: DependencyInfo,
    installedPackages: Record<string, string> = {}
  ): Promise<DependencyError[]> {
    const errors: DependencyError[] = []

    // Check missing dependencies
    const missingDeps = this.checkMissingDependencies(packageJson, installedPackages)
    errors.push(...missingDeps)

    // Check version conflicts
    const conflicts = this.checkVersionConflicts(packageJson)
    errors.push(...conflicts)

    // Check peer dependencies
    const peerDeps = this.checkPeerDependencies(packageJson, installedPackages)
    errors.push(...peerDeps)

    // Check circular dependencies (basic check)
    const circular = this.checkCircularDependencies(packageJson)
    errors.push(...circular)

    return errors
  }

  /**
   * Check for missing dependencies
   */
  private checkMissingDependencies(
    packageJson: DependencyInfo,
    installedPackages: Record<string, string>
  ): DependencyError[] {
    const errors: DependencyError[] = []

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }

    for (const [name, version] of Object.entries(allDeps)) {
      if (!installedPackages[name]) {
        errors.push({
          package: name,
          version,
          type: 'missing',
          severity: 'error',
          message: `Missing dependency: ${name}@${version}`,
          autoFixable: true,
          suggestedFix: {
            action: 'install',
            version
          }
        })
      }
    }

    return errors
  }

  /**
   * Check for version conflicts
   */
  private checkVersionConflicts(packageJson: DependencyInfo): DependencyError[] {
    const errors: DependencyError[] = []

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }

    // Check for same package in both dependencies and devDependencies
    for (const name of Object.keys(packageJson.dependencies)) {
      if (packageJson.devDependencies[name]) {
        const depVersion = packageJson.dependencies[name]
        const devVersion = packageJson.devDependencies[name]

        if (depVersion !== devVersion) {
          errors.push({
            package: name,
            version: depVersion,
            requiredVersion: devVersion,
            type: 'version_conflict',
            severity: 'warning',
            message: `Version conflict: ${name} appears in both dependencies (${depVersion}) and devDependencies (${devVersion})`,
            autoFixable: true,
            suggestedFix: {
              action: 'update',
              version: depVersion // Use dependency version
            }
          })
        }
      }
    }

    return errors
  }

  /**
   * Check peer dependencies
   */
  private checkPeerDependencies(
    packageJson: DependencyInfo,
    installedPackages: Record<string, string>
  ): DependencyError[] {
    const errors: DependencyError[] = []

    if (!packageJson.peerDependencies) {
      return errors
    }

    for (const [name, version] of Object.entries(packageJson.peerDependencies)) {
      if (!installedPackages[name]) {
        errors.push({
          package: name,
          version,
          type: 'peer_dependency',
          severity: 'warning',
          message: `Peer dependency missing: ${name}@${version}`,
          autoFixable: true,
          suggestedFix: {
            action: 'install',
            version
          }
        })
      }
    }

    return errors
  }

  /**
   * Check for circular dependencies (basic check)
   */
  private checkCircularDependencies(packageJson: DependencyInfo): DependencyError[] {
    const errors: DependencyError[] = []

    // This is a simplified check - full circular dependency detection requires
    // analyzing the entire dependency graph
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }

    // Check if package depends on itself (obvious circular)
    if (allDeps[packageJson.name]) {
      errors.push({
        package: packageJson.name,
        type: 'circular',
        severity: 'error',
        message: `Circular dependency: ${packageJson.name} depends on itself`,
        autoFixable: false
      })
    }

    return errors
  }

  /**
   * Auto-fix dependency error
   */
  async autoFixDependencyError(error: DependencyError): Promise<boolean> {
    if (!error.autoFixable || !error.suggestedFix) {
      return false
    }

    try {
      switch (error.suggestedFix.action) {
        case 'install':
          // Call package install tool
          console.log(`Would install ${error.package}@${error.suggestedFix.version || 'latest'}`)
          return true

        case 'update':
          // Call package update tool
          console.log(`Would update ${error.package} to ${error.suggestedFix.version}`)
          return true

        case 'remove':
          // Call package remove tool
          console.log(`Would remove ${error.package}`)
          return true

        default:
          return false
      }
    } catch (err) {
      console.error('Failed to auto-fix dependency error:', err)
      return false
    }
  }
}

// Singleton instance
let dependencyChecker: DependencyChecker | null = null

export function getDependencyChecker(): DependencyChecker {
  if (!dependencyChecker) {
    dependencyChecker = new DependencyChecker()
  }
  return dependencyChecker
}





