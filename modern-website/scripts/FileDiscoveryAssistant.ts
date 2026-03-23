/**
 * FileDiscoveryAssistant
 * Comprehensive file discovery across all system types
 * 
 * Features:
 * - Multi-pattern file discovery
 * - Dependency graph analysis
 * - Hidden file detection
 * - Smart filtering and categorization
 */

import * as fs from 'fs';
import * as path from 'path';

export interface DiscoveredFile {
  path: string;
  absolutePath: string;
  type: 'code' | 'config' | 'docs' | 'hidden' | 'data' | 'assets' | 'build';
  extension: string;
  size: number;
  lastModified: Date;
  isHidden: boolean;
  dependencies: string[];
}

export interface DependencyGraph {
  [filePath: string]: {
    imports: string[];
    importedBy: string[];
    isOrphan: boolean;
    isDeletable: boolean;
  };
}

export class FileDiscoveryAssistant {
  private baseDir: string;
  private discoveredFiles: DiscoveredFile[] = [];
  private dependencyGraph: DependencyGraph = {};
  
  // Patterns for comprehensive discovery
  private readonly DISCOVERY_PATTERNS = {
    code: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs'],
    config: ['**/*.json', '**/*.yaml', '**/*.yml', '**/*.toml', '**/*.config.*'],
    docs: ['**/*.md', '**/*.txt', '**/*.pdf'],
    hidden: ['**/.*', '**/.env*', '**/.git*'],
    data: ['**/*.sql', '**/*.db', '**/*.sqlite'],
    assets: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.ico', '**/*.woff*'],
    build: ['**/dist/**', '**/build/**', '**/.next/**', '**/node_modules/**']
  };

  // Directories to exclude from discovery
  private readonly EXCLUDE_DIRS = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '.vercel',
    'coverage'
  ];

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  /**
   * Find all system files across all types
   */
  async findAllSystemFiles(): Promise<DiscoveredFile[]> {
    console.log('🔍 Starting comprehensive file discovery...\n');
    
    this.discoveredFiles = [];
    
    // Discover files by category
    for (const [category, patterns] of Object.entries(this.DISCOVERY_PATTERNS)) {
      console.log(`📂 Discovering ${category} files...`);
      
      for (const pattern of patterns) {
        const files = await this.findFilesByPattern(pattern, category as any);
        this.discoveredFiles.push(...files);
      }
    }

    // Remove duplicates
    this.discoveredFiles = this.deduplicateFiles(this.discoveredFiles);

    console.log(`\n✅ Discovery complete: ${this.discoveredFiles.length} files found\n`);
    this.printDiscoverySummary();

    return this.discoveredFiles;
  }

  /**
   * Find files matching a specific pattern
   */
  private async findFilesByPattern(
    pattern: string,
    type: DiscoveredFile['type']
  ): Promise<DiscoveredFile[]> {
    const files: DiscoveredFile[] = [];
    
    // Convert glob pattern to search logic
    const isHiddenPattern = pattern.startsWith('**/.');
    const extension = this.extractExtension(pattern);

    const searchDir = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.baseDir, fullPath);

          // Skip excluded directories
          if (this.shouldExclude(relativePath)) {
            continue;
          }

          if (entry.isDirectory()) {
            searchDir(fullPath);
          } else if (entry.isFile()) {
            // Check if file matches pattern
            if (this.matchesPattern(entry.name, pattern, extension, isHiddenPattern)) {
              const stats = fs.statSync(fullPath);
              
              files.push({
                path: relativePath.replace(/\\/g, '/'),
                absolutePath: fullPath,
                type,
                extension: path.extname(entry.name),
                size: stats.size,
                lastModified: stats.mtime,
                isHidden: entry.name.startsWith('.') || isHiddenPattern,
                dependencies: []
              });
            }
          }
        }
      } catch (error) {
        // Silent fail for permission errors
      }
    };

    searchDir(this.baseDir);
    return files;
  }

  /**
   * Check if file matches pattern
   */
  private matchesPattern(
    fileName: string,
    pattern: string,
    extension: string,
    isHiddenPattern: boolean
  ): boolean {
    if (isHiddenPattern) {
      return fileName.startsWith('.');
    }

    if (extension) {
      return fileName.endsWith(extension);
    }

    // Wildcard match
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\./g, '\\.');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(fileName);
  }

  /**
   * Extract extension from pattern
   */
  private extractExtension(pattern: string): string {
    const match = pattern.match(/\*(\.\w+)$/);
    return match ? match[1] : '';
  }

  /**
   * Check if path should be excluded
   */
  private shouldExclude(relativePath: string): boolean {
    return this.EXCLUDE_DIRS.some(dir => 
      relativePath.includes(dir + path.sep) || relativePath === dir
    );
  }

  /**
   * Remove duplicate files
   */
  private deduplicateFiles(files: DiscoveredFile[]): DiscoveredFile[] {
    const seen = new Set<string>();
    return files.filter(file => {
      if (seen.has(file.absolutePath)) {
        return false;
      }
      seen.add(file.absolutePath);
      return true;
    });
  }

  /**
   * Analyze file dependencies to build dependency graph
   */
  async analyzeFileDependencies(): Promise<DependencyGraph> {
    console.log('🔗 Analyzing file dependencies...\n');

    this.dependencyGraph = {};

    // Only analyze code files for dependencies
    const codeFiles = this.discoveredFiles.filter(f => f.type === 'code');

    for (const file of codeFiles) {
      const imports = await this.extractImports(file.absolutePath);
      
      this.dependencyGraph[file.path] = {
        imports,
        importedBy: [],
        isOrphan: false,
        isDeletable: false
      };
    }

    // Build reverse dependencies (importedBy)
    for (const [filePath, data] of Object.entries(this.dependencyGraph)) {
      for (const importPath of data.imports) {
        if (this.dependencyGraph[importPath]) {
          this.dependencyGraph[importPath].importedBy.push(filePath);
        }
      }
    }

    // Mark orphans (files not imported by anyone)
    for (const [filePath, data] of Object.entries(this.dependencyGraph)) {
      data.isOrphan = data.importedBy.length === 0;
      data.isDeletable = data.isOrphan && !this.isEntryPoint(filePath);
    }

    console.log('✅ Dependency analysis complete\n');
    this.printDependencyStats();

    return this.dependencyGraph;
  }

  /**
   * Extract imports from a file
   */
  private async extractImports(filePath: string): Promise<string[]> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const imports: string[] = [];

      // Match ES6 imports: import ... from '...'
      const es6ImportRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g;
      let match;
      while ((match = es6ImportRegex.exec(content)) !== null) {
        const importPath = this.resolveImportPath(filePath, match[1]);
        if (importPath) {
          imports.push(importPath);
        }
      }

      // Match require: require('...')
      const requireRegex = /require\(['"](.+?)['"]\)/g;
      while ((match = requireRegex.exec(content)) !== null) {
        const importPath = this.resolveImportPath(filePath, match[1]);
        if (importPath) {
          imports.push(importPath);
        }
      }

      return imports;
    } catch (error) {
      return [];
    }
  }

  /**
   * Resolve import path to actual file path
   */
  private resolveImportPath(fromFile: string, importPath: string): string | null {
    // Skip node_modules and external packages
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      return null;
    }

    // Handle @/ alias (common in Next.js)
    if (importPath.startsWith('@/')) {
      importPath = importPath.replace('@/', 'src/');
    }

    const fromDir = path.dirname(fromFile);
    let resolvedPath = path.resolve(fromDir, importPath);

    // Try adding extensions if file doesn't exist
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
    
    if (!fs.existsSync(resolvedPath)) {
      for (const ext of extensions) {
        const withExt = resolvedPath + ext;
        if (fs.existsSync(withExt)) {
          resolvedPath = withExt;
          break;
        }
      }
    }

    // Check for index files
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
      for (const ext of extensions) {
        const indexFile = path.join(resolvedPath, `index${ext}`);
        if (fs.existsSync(indexFile)) {
          resolvedPath = indexFile;
          break;
        }
      }
    }

    // Return relative path from base directory
    if (fs.existsSync(resolvedPath)) {
      return path.relative(this.baseDir, resolvedPath).replace(/\\/g, '/');
    }

    return null;
  }

  /**
   * Check if file is an entry point
   */
  private isEntryPoint(filePath: string): boolean {
    const entryPoints = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'next.config.ts',
      'next.config.js',
      'tailwind.config.ts',
      'postcss.config.js'
    ];

    return entryPoints.some(entry => filePath.includes(entry));
  }

  /**
   * Print discovery summary
   */
  private printDiscoverySummary(): void {
    const summary: Record<string, number> = {};
    
    for (const file of this.discoveredFiles) {
      summary[file.type] = (summary[file.type] || 0) + 1;
    }

    console.log('📊 Discovery Summary:');
    console.log('─'.repeat(50));
    for (const [type, count] of Object.entries(summary)) {
      console.log(`  ${type.padEnd(10)}: ${count} files`);
    }
    console.log('─'.repeat(50));
    console.log(`  Total: ${this.discoveredFiles.length} files\n`);
  }

  /**
   * Print dependency statistics
   */
  private printDependencyStats(): void {
    const orphans = Object.values(this.dependencyGraph).filter(d => d.isOrphan).length;
    const deletable = Object.values(this.dependencyGraph).filter(d => d.isDeletable).length;
    const total = Object.keys(this.dependencyGraph).length;

    console.log('📊 Dependency Statistics:');
    console.log('─'.repeat(50));
    console.log(`  Total code files: ${total}`);
    console.log(`  Orphan files: ${orphans}`);
    console.log(`  Safe to delete: ${deletable}`);
    console.log('─'.repeat(50) + '\n');
  }

  /**
   * Get discovered files
   */
  getDiscoveredFiles(): DiscoveredFile[] {
    return this.discoveredFiles;
  }

  /**
   * Get dependency graph
   */
  getDependencyGraph(): DependencyGraph {
    return this.dependencyGraph;
  }

  /**
   * Export results to JSON
   */
  exportResults(outputPath: string): void {
    const results = {
      discoveredFiles: this.discoveredFiles,
      dependencyGraph: this.dependencyGraph,
      summary: {
        totalFiles: this.discoveredFiles.length,
        byType: this.discoveredFiles.reduce((acc, file) => {
          acc[file.type] = (acc[file.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        orphanFiles: Object.values(this.dependencyGraph).filter(d => d.isOrphan).length,
        deletableFiles: Object.values(this.dependencyGraph).filter(d => d.isDeletable).length
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`✅ Results exported to: ${outputPath}\n`);
  }
}

// CLI Usage
if (require.main === module) {
  const baseDir = process.cwd();
  const assistant = new FileDiscoveryAssistant(baseDir);

  (async () => {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              FILE DISCOVERY ASSISTANT                          ║');
    console.log('║              Comprehensive System Analysis                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Discover all files
    await assistant.findAllSystemFiles();

    // Analyze dependencies
    await assistant.analyzeFileDependencies();

    // Export results
    assistant.exportResults('file-discovery-results.json');

    console.log('✅ File discovery and analysis complete!');
  })();
}
