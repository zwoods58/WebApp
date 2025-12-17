/**
 * P1 Feature 9: Context Awareness Across Files
 * Builds dependency graphs and tracks file relationships
 */

import { VirtualFileSystem } from './virtual-filesystem'

export interface FileDependency {
  from: string
  to: string
  type: 'import' | 'export' | 'require'
}

export interface DependencyGraph {
  files: string[]
  dependencies: FileDependency[]
  dependents: Map<string, string[]> // file -> files that depend on it
  dependenciesOf: Map<string, string[]> // file -> files it depends on
}

/**
 * Build dependency graph from file tree
 */
export function buildDependencyGraph(vfs: VirtualFileSystem): DependencyGraph {
  const files = vfs.getAllFiles()
  const dependencies: FileDependency[] = []
  const dependents = new Map<string, string[]>()
  const dependenciesOf = new Map<string, string[]>()

  // Initialize maps
  files.forEach(file => {
    dependents.set(file.path, [])
    dependenciesOf.set(file.path, [])
  })

  // Parse imports/exports from each file
  files.forEach(file => {
    const content = file.content
    const filePath = file.path

    // Extract imports
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      const importedPath = match[1]
      const resolvedPath = resolveImportPath(filePath, importedPath, files.map(f => f.path))
      
      if (resolvedPath) {
        const dep: FileDependency = {
          from: filePath,
          to: resolvedPath,
          type: 'import'
        }
        dependencies.push(dep)
        
        // Update maps
        const currentDeps = dependenciesOf.get(filePath) || []
        if (!currentDeps.includes(resolvedPath)) {
          dependenciesOf.set(filePath, [...currentDeps, resolvedPath])
        }
        
        const currentDependents = dependents.get(resolvedPath) || []
        if (!currentDependents.includes(filePath)) {
          dependents.set(resolvedPath, [...currentDependents, filePath])
        }
      }
    }

    // Extract requires
    const requireRegex = /require\s*\(['"]([^'"]+)['"]\)/g
    while ((match = requireRegex.exec(content)) !== null) {
      const requiredPath = match[1]
      const resolvedPath = resolveImportPath(filePath, requiredPath, files.map(f => f.path))
      
      if (resolvedPath) {
        const dep: FileDependency = {
          from: filePath,
          to: resolvedPath,
          type: 'require'
        }
        dependencies.push(dep)
        
        const currentDeps = dependenciesOf.get(filePath) || []
        if (!currentDeps.includes(resolvedPath)) {
          dependenciesOf.set(filePath, [...currentDeps, resolvedPath])
        }
        
        const currentDependents = dependents.get(resolvedPath) || []
        if (!currentDependents.includes(filePath)) {
          dependents.set(resolvedPath, [...currentDependents, filePath])
        }
      }
    }
  })

  return {
    files: files.map(f => f.path),
    dependencies,
    dependents,
    dependenciesOf
  }
}

/**
 * Resolve import path to actual file path
 */
function resolveImportPath(
  fromFile: string,
  importPath: string,
  availableFiles: string[]
): string | null {
  // Handle relative imports
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const fromDir = fromFile.substring(0, fromFile.lastIndexOf('/'))
    const resolved = resolveRelativePath(fromDir, importPath)
    
    // Try with different extensions
    const extensions = ['.tsx', '.ts', '.jsx', '.js', '']
    for (const ext of extensions) {
      const candidate = resolved + ext
      if (availableFiles.includes(candidate)) {
        return candidate
      }
    }
    
    // Try index files
    for (const ext of extensions) {
      const candidate = resolved + '/index' + ext
      if (availableFiles.includes(candidate)) {
        return candidate
      }
    }
  }
  
  // Handle absolute imports (node_modules, etc.)
  // For now, just check if file exists
  if (availableFiles.includes(importPath)) {
    return importPath
  }

  return null
}

/**
 * Resolve relative path
 */
function resolveRelativePath(fromDir: string, relativePath: string): string {
  const parts = relativePath.split('/')
  let currentPath = fromDir.split('/').filter(Boolean)
  
  for (const part of parts) {
    if (part === '.') {
      continue
    } else if (part === '..') {
      currentPath.pop()
    } else {
      currentPath.push(part)
    }
  }
  
  return '/' + currentPath.join('/')
}

/**
 * Get related files for context awareness
 */
export function getRelatedFiles(
  filePath: string,
  graph: DependencyGraph
): string[] {
  const related = new Set<string>()
  
  // Files this file depends on
  const deps = graph.dependenciesOf.get(filePath) || []
  deps.forEach(dep => related.add(dep))
  
  // Files that depend on this file
  const dependents = graph.dependents.get(filePath) || []
  dependents.forEach(dep => related.add(dep))
  
  return Array.from(related)
}

/**
 * Build context prompt with file relationships
 */
export function buildContextPrompt(
  filePath: string,
  vfs: VirtualFileSystem,
  graph: DependencyGraph
): string {
  const relatedFiles = getRelatedFiles(filePath, graph)
  const fileTree = vfs.getFileTree()
  
  let context = `=== FILE DEPENDENCIES ===\n`
  
  // Show dependencies
  const deps = graph.dependenciesOf.get(filePath) || []
  if (deps.length > 0) {
    context += `This file imports from:\n`
    deps.forEach(dep => {
      context += `  - ${dep}\n`
    })
  }
  
  // Show dependents
  const dependents = graph.dependents.get(filePath) || []
  if (dependents.length > 0) {
    context += `\nFiles that import this file:\n`
    dependents.forEach(dep => {
      context += `  - ${dep}\n`
    })
  }
  
  // Include related file contents
  if (relatedFiles.length > 0) {
    context += `\n=== RELATED FILES ===\n`
    relatedFiles.slice(0, 5).forEach(relatedPath => {
      const content = fileTree[relatedPath]
      if (content) {
        context += `\n--- ${relatedPath} ---\n`
        context += content.substring(0, 500) // First 500 chars
        if (content.length > 500) {
          context += '\n... (truncated)'
        }
        context += '\n'
      }
    })
  }
  
  return context
}





