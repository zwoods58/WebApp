/**
 * P2 Feature 10: Dependency Management
 * Auto-detects dependencies from imports and generates package.json
 */

import { VirtualFileSystem } from './virtual-filesystem'

export interface Dependency {
  name: string
  version: string
  type: 'dependency' | 'devDependency' | 'peerDependency'
}

export interface PackageJson {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies?: Record<string, string>
  scripts: Record<string, string>
}

/**
 * Known package mappings for common imports
 */
const PACKAGE_MAPPINGS: Record<string, { package: string; version: string; type: 'dependency' | 'devDependency' }> = {
  'react': { package: 'react', version: '^18.2.0', type: 'dependency' },
  'react-dom': { package: 'react-dom', version: '^18.2.0', type: 'dependency' },
  'next': { package: 'next', version: '^14.0.0', type: 'dependency' },
  'typescript': { package: 'typescript', version: '^5.0.0', type: 'devDependency' },
  '@types/react': { package: '@types/react', version: '^18.2.0', type: 'devDependency' },
  '@types/react-dom': { package: '@types/react-dom', version: '^18.2.0', type: 'devDependency' },
  '@types/node': { package: '@types/node', version: '^20.0.0', type: 'devDependency' },
  'tailwindcss': { package: 'tailwindcss', version: '^3.3.0', type: 'devDependency' },
  'autoprefixer': { package: 'autoprefixer', version: '^10.4.0', type: 'devDependency' },
  'postcss': { package: 'postcss', version: '^8.4.0', type: 'devDependency' },
  'lucide-react': { package: 'lucide-react', version: '^0.294.0', type: 'dependency' },
  '@supabase/supabase-js': { package: '@supabase/supabase-js', version: '^2.38.0', type: 'dependency' },
  'framer-motion': { package: 'framer-motion', version: '^10.16.0', type: 'dependency' },
  'clsx': { package: 'clsx', version: '^2.0.0', type: 'dependency' },
  'class-variance-authority': { package: 'class-variance-authority', version: '^0.7.0', type: 'dependency' },
}

/**
 * Extract dependencies from file tree
 */
export function detectDependencies(vfs: VirtualFileSystem): Dependency[] {
  const files = vfs.getAllFiles()
  const detectedPackages = new Set<string>()
  const dependencies: Dependency[] = []

  // Parse imports from all files
  files.forEach(file => {
    if (!file.path.match(/\.(ts|tsx|js|jsx)$/)) {
      return
    }

    const content = file.content

    // Extract imports
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1]
      
      // Skip relative imports
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        continue
      }

      // Extract package name (handle scoped packages)
      const packageName = extractPackageName(importPath)
      
      if (packageName && !detectedPackages.has(packageName)) {
        detectedPackages.add(packageName)
        
        // Check if we have a mapping for this package
        const mapping = PACKAGE_MAPPINGS[packageName]
        if (mapping) {
          dependencies.push({
            name: mapping.package,
            version: mapping.version,
            type: mapping.type
          })
        } else {
          // Unknown package - add with latest version
          dependencies.push({
            name: packageName,
            version: 'latest',
            type: 'dependency'
          })
        }
      }
    }

    // Extract requires
    const requireRegex = /require\s*\(['"]([^'"]+)['"]\)/g
    while ((match = requireRegex.exec(content)) !== null) {
      const requirePath = match[1]
      
      if (requirePath.startsWith('./') || requirePath.startsWith('../')) {
        continue
      }

      const packageName = extractPackageName(requirePath)
      
      if (packageName && !detectedPackages.has(packageName)) {
        detectedPackages.add(packageName)
        
        const mapping = PACKAGE_MAPPINGS[packageName]
        if (mapping) {
          dependencies.push({
            name: mapping.package,
            version: mapping.version,
            type: mapping.type
          })
        } else {
          dependencies.push({
            name: packageName,
            version: 'latest',
            type: 'dependency'
          })
        }
      }
    }
  })

  return dependencies
}

/**
 * Extract package name from import path
 */
function extractPackageName(importPath: string): string | null {
  // Handle scoped packages: @scope/package
  if (importPath.startsWith('@')) {
    const parts = importPath.split('/')
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`
    }
    return null
  }

  // Handle regular packages: package or package/subpath
  const parts = importPath.split('/')
  return parts[0] || null
}

/**
 * Generate package.json from detected dependencies
 */
export function generatePackageJson(
  vfs: VirtualFileSystem,
  projectName: string = 'ai-builder-project',
  projectVersion: string = '1.0.0'
): PackageJson {
  const dependencies = detectDependencies(vfs)
  
  const packageJson: PackageJson = {
    name: projectName,
    version: projectVersion,
    dependencies: {},
    devDependencies: {},
    scripts: {
      'dev': 'next dev',
      'build': 'next build',
      'start': 'next start',
      'lint': 'next lint'
    }
  }

  // Separate dependencies by type
  dependencies.forEach(dep => {
    if (dep.type === 'dependency') {
      packageJson.dependencies[dep.name] = dep.version
    } else if (dep.type === 'devDependency') {
      packageJson.devDependencies[dep.name] = dep.version
    } else if (dep.type === 'peerDependency') {
      if (!packageJson.peerDependencies) {
        packageJson.peerDependencies = {}
      }
      packageJson.peerDependencies[dep.name] = dep.version
    }
  })

  // Always include React if using React components
  const hasReactFiles = vfs.getAllFiles().some(f => 
    f.path.match(/\.(tsx|jsx)$/) && f.content.includes('React')
  )
  
  if (hasReactFiles && !packageJson.dependencies['react']) {
    packageJson.dependencies['react'] = '^18.2.0'
    packageJson.dependencies['react-dom'] = '^18.2.0'
    packageJson.devDependencies['@types/react'] = '^18.2.0'
    packageJson.devDependencies['@types/react-dom'] = '^18.2.0'
  }

  // Always include TypeScript if using .ts/.tsx files
  const hasTypeScriptFiles = vfs.getAllFiles().some(f => 
    f.path.match(/\.(ts|tsx)$/)
  )
  
  if (hasTypeScriptFiles && !packageJson.devDependencies['typescript']) {
    packageJson.devDependencies['typescript'] = '^5.0.0'
    packageJson.devDependencies['@types/node'] = '^20.0.0'
  }

  return packageJson
}

/**
 * Write package.json to VFS
 */
export function writePackageJsonToVFS(
  vfs: VirtualFileSystem,
  projectName?: string,
  projectVersion?: string
): void {
  const packageJson = generatePackageJson(vfs, projectName, projectVersion)
  const content = JSON.stringify(packageJson, null, 2)
  vfs.writeFile('package.json', content)
}

/**
 * Generate install command for detected dependencies
 */
export function generateInstallCommand(vfs: VirtualFileSystem): string {
  const dependencies = detectDependencies(vfs)
  const deps = dependencies.filter(d => d.type === 'dependency')
  const devDeps = dependencies.filter(d => d.type === 'devDependency')
  
  let command = 'npm install'
  
  if (deps.length > 0) {
    command += ' ' + deps.map(d => `${d.name}@${d.version}`).join(' ')
  }
  
  if (devDeps.length > 0) {
    command += ' --save-dev ' + devDeps.map(d => `${d.name}@${d.version}`).join(' ')
  }
  
  return command
}





