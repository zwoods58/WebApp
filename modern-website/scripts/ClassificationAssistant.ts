/**
 * ClassificationAssistant
 * Intelligent automated file classification system
 * 
 * Features:
 * - Automated file analysis
 * - Smart categorization (keep, migrate, replace, delete)
 * - Safety checks and recommendations
 * - Batch processing
 */

import * as fs from 'fs';
import * as path from 'path';
import { DiscoveredFile, DependencyGraph } from './FileDiscoveryAssistant';

export interface FileClassification {
  file: DiscoveredFile;
  category: 'keep' | 'migrate' | 'replace' | 'delete';
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  safetyScore: number; // 0-100, higher = safer to delete
  recommendation: string;
  dependencies: {
    imports: string[];
    importedBy: string[];
    blockers: string[]; // Files that prevent deletion
  };
}

export interface ClassificationReport {
  totalFiles: number;
  classified: {
    keep: FileClassification[];
    migrate: FileClassification[];
    replace: FileClassification[];
    delete: FileClassification[];
  };
  summary: {
    keep: number;
    migrate: number;
    replace: number;
    delete: number;
    deletionRate: number; // Percentage
  };
}

export class ClassificationAssistant {
  private baseDir: string;
  private dependencyGraph: DependencyGraph;
  private classifications: FileClassification[] = [];

  // Patterns for automatic classification
  private readonly KEEP_PATTERNS = {
    modern: [
      '**/ConnectionStatus.tsx',
      '**/connection-manager.ts',
      '**/persistentStorage.ts',
      '**/idempotency.ts',
      '**/currency.ts',
      '**/phoneUtils.ts'
    ],
    config: [
      'package.json',
      'tsconfig.json',
      'next.config.*',
      'tailwind.config.*',
      'postcss.config.*'
    ],
    essential: [
      '**/layout.tsx',
      '**/page.tsx',
      '**/providers/**',
      '**/contexts/**'
    ]
  };

  private readonly DELETE_PATTERNS = {
    legacy: [
      '**/useNetworkDetection.ts',
      '**/OfflineErrorBoundary.tsx',
      '**/OfflineFallback.tsx',
      '**/ServiceWorkerRegistration.tsx'
    ],
    debug: [
      'test-*.js',
      'debug-*.js',
      'emergency-*.js',
      'quick-*.js',
      'fix-*.js',
      'diagnose-*.js'
    ],
    docs: [
      'OFFLINE_*.md',
      'IMPLEMENTATION_*.md',
      'UNIVERSAL_OFFLINE_*.md',
      'current-login-system.md',
      'temp-*.md',
      'test-*.md'
    ],
    build: [
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/*.tsbuildinfo'
    ]
  };

  constructor(baseDir: string, dependencyGraph: DependencyGraph) {
    this.baseDir = baseDir;
    this.dependencyGraph = dependencyGraph;
  }

  /**
   * Classify every discovered file
   */
  async classifyEveryFile(files: DiscoveredFile[]): Promise<ClassificationReport> {
    console.log('🤖 Starting intelligent file classification...\n');
    
    this.classifications = [];

    for (const file of files) {
      const classification = await this.analyzeFile(file);
      this.classifications.push(classification);
    }

    const report = this.generateReport();
    
    console.log('✅ Classification complete\n');
    this.printClassificationSummary(report);

    return report;
  }

  /**
   * Analyze a single file and determine classification
   */
  async analyzeFile(file: DiscoveredFile): Promise<FileClassification> {
    // Get dependency information
    const depInfo = this.dependencyGraph[file.path] || {
      imports: [],
      importedBy: [],
      isOrphan: false,
      isDeletable: false
    };

    // Determine category based on patterns and analysis
    const category = this.determineCategory(file, depInfo);
    const safetyScore = this.calculateSafetyScore(file, depInfo, category);
    const reason = this.generateReason(file, category, depInfo);
    const priority = this.determinePriority(file, category, depInfo);
    const recommendation = this.generateRecommendation(file, category, safetyScore);
    const blockers = this.findBlockers(file, depInfo);

    return {
      file,
      category,
      reason,
      priority,
      safetyScore,
      recommendation,
      dependencies: {
        imports: depInfo.imports,
        importedBy: depInfo.importedBy,
        blockers
      }
    };
  }

  /**
   * Determine file category
   */
  private determineCategory(
    file: DiscoveredFile,
    depInfo: any
  ): FileClassification['category'] {
    // Check KEEP patterns first (highest priority)
    if (this.matchesAnyPattern(file.path, [
      ...this.KEEP_PATTERNS.modern,
      ...this.KEEP_PATTERNS.config,
      ...this.KEEP_PATTERNS.essential
    ])) {
      return 'keep';
    }

    // Check DELETE patterns
    if (this.matchesAnyPattern(file.path, [
      ...this.DELETE_PATTERNS.legacy,
      ...this.DELETE_PATTERNS.debug,
      ...this.DELETE_PATTERNS.docs,
      ...this.DELETE_PATTERNS.build
    ])) {
      return 'delete';
    }

    // Special cases
    if (file.type === 'build') {
      return 'delete';
    }

    if (file.isHidden && !file.path.includes('.env')) {
      return 'delete';
    }

    // Check for migration candidates
    if (this.isMigrationCandidate(file)) {
      return 'migrate';
    }

    // Check for replacement candidates
    if (this.isReplacementCandidate(file, depInfo)) {
      return 'replace';
    }

    // Default: keep if uncertain
    return 'keep';
  }

  /**
   * Check if file is a migration candidate
   */
  private isMigrationCandidate(file: DiscoveredFile): boolean {
    const migrationKeywords = [
      'persistent',
      'storage',
      'cache',
      'offline',
      'sync'
    ];

    const fileName = path.basename(file.path).toLowerCase();
    return migrationKeywords.some(keyword => fileName.includes(keyword)) &&
           !this.matchesAnyPattern(file.path, this.DELETE_PATTERNS.legacy);
  }

  /**
   * Check if file is a replacement candidate
   */
  private isReplacementCandidate(file: DiscoveredFile, depInfo: any): boolean {
    // Files that are imported but have better alternatives
    return depInfo.importedBy.length > 0 &&
           (file.path.includes('Offline') || file.path.includes('offline'));
  }

  /**
   * Calculate safety score (0-100)
   */
  private calculateSafetyScore(
    file: DiscoveredFile,
    depInfo: any,
    category: FileClassification['category']
  ): number {
    let score = 50; // Base score

    // Increase safety if file is orphaned
    if (depInfo.isOrphan) {
      score += 30;
    }

    // Decrease safety if file is imported
    score -= depInfo.importedBy.length * 10;

    // Increase safety for delete category
    if (category === 'delete') {
      score += 20;
    }

    // Decrease safety for keep category
    if (category === 'keep') {
      score -= 40;
    }

    // File type adjustments
    if (file.type === 'build') {
      score += 20;
    }

    if (file.type === 'config') {
      score -= 30;
    }

    // Clamp to 0-100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate reason for classification
   */
  private generateReason(
    file: DiscoveredFile,
    category: FileClassification['category'],
    depInfo: any
  ): string {
    switch (category) {
      case 'keep':
        if (this.matchesAnyPattern(file.path, this.KEEP_PATTERNS.modern)) {
          return 'Modern implementation using TanStack Query patterns';
        }
        if (this.matchesAnyPattern(file.path, this.KEEP_PATTERNS.config)) {
          return 'Essential configuration file';
        }
        if (this.matchesAnyPattern(file.path, this.KEEP_PATTERNS.essential)) {
          return 'Core application component';
        }
        return 'Required for application functionality';

      case 'delete':
        if (this.matchesAnyPattern(file.path, this.DELETE_PATTERNS.legacy)) {
          return 'Legacy offline system component - replaced by TanStack Query';
        }
        if (this.matchesAnyPattern(file.path, this.DELETE_PATTERNS.debug)) {
          return 'Temporary debug/test file';
        }
        if (this.matchesAnyPattern(file.path, this.DELETE_PATTERNS.docs)) {
          return 'Outdated documentation';
        }
        if (this.matchesAnyPattern(file.path, this.DELETE_PATTERNS.build)) {
          return 'Build artifact - auto-generated';
        }
        if (depInfo.isOrphan) {
          return 'Orphaned file with no dependencies';
        }
        return 'Marked for deletion';

      case 'migrate':
        return 'Contains useful logic that should be integrated with new system';

      case 'replace':
        return 'Has better modern alternative available';

      default:
        return 'Classification pending';
    }
  }

  /**
   * Determine priority
   */
  private determinePriority(
    file: DiscoveredFile,
    category: FileClassification['category'],
    depInfo: any
  ): FileClassification['priority'] {
    // Critical: Files that block other deletions
    if (depInfo.importedBy.length > 5) {
      return 'critical';
    }

    // High: Legacy components or essential configs
    if (category === 'delete' && this.matchesAnyPattern(file.path, this.DELETE_PATTERNS.legacy)) {
      return 'high';
    }

    if (category === 'keep' && file.type === 'config') {
      return 'high';
    }

    // Medium: Most files
    if (category === 'migrate' || category === 'replace') {
      return 'medium';
    }

    // Low: Build artifacts, orphans
    if (file.type === 'build' || depInfo.isOrphan) {
      return 'low';
    }

    return 'medium';
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(
    file: DiscoveredFile,
    category: FileClassification['category'],
    safetyScore: number
  ): string {
    switch (category) {
      case 'keep':
        return 'Preserve as-is. No action needed.';

      case 'delete':
        if (safetyScore >= 80) {
          return 'Safe to delete immediately.';
        } else if (safetyScore >= 50) {
          return 'Delete after updating dependent files.';
        } else {
          return 'Review dependencies before deletion.';
        }

      case 'migrate':
        return 'Extract useful logic and integrate with TanStack Query before deletion.';

      case 'replace':
        return 'Update imports to use modern alternative, then delete.';

      default:
        return 'Manual review required.';
    }
  }

  /**
   * Find files that block deletion
   */
  private findBlockers(file: DiscoveredFile, depInfo: any): string[] {
    const blockers: string[] = [];

    // Files that import this file are blockers
    for (const importer of depInfo.importedBy) {
      // Check if importer is also marked for deletion
      const importerDep = this.dependencyGraph[importer];
      if (!importerDep || !importerDep.isDeletable) {
        blockers.push(importer);
      }
    }

    return blockers;
  }

  /**
   * Check if file matches any pattern
   */
  private matchesAnyPattern(filePath: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\./g, '\\.');
      
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(filePath) || filePath.includes(pattern.replace(/\*/g, ''));
    });
  }

  /**
   * Generate classification report
   */
  private generateReport(): ClassificationReport {
    const classified = {
      keep: this.classifications.filter(c => c.category === 'keep'),
      migrate: this.classifications.filter(c => c.category === 'migrate'),
      replace: this.classifications.filter(c => c.category === 'replace'),
      delete: this.classifications.filter(c => c.category === 'delete')
    };

    const totalFiles = this.classifications.length;
    const deletableFiles = classified.delete.length + classified.replace.length;
    const deletionRate = totalFiles > 0 ? (deletableFiles / totalFiles) * 100 : 0;

    return {
      totalFiles,
      classified,
      summary: {
        keep: classified.keep.length,
        migrate: classified.migrate.length,
        replace: classified.replace.length,
        delete: classified.delete.length,
        deletionRate: Math.round(deletionRate * 100) / 100
      }
    };
  }

  /**
   * Print classification summary
   */
  private printClassificationSummary(report: ClassificationReport): void {
    console.log('📊 Classification Summary:');
    console.log('═'.repeat(60));
    console.log(`  Total Files: ${report.totalFiles}`);
    console.log('─'.repeat(60));
    console.log(`  ✅ Keep:     ${report.summary.keep} files (${this.percentage(report.summary.keep, report.totalFiles)}%)`);
    console.log(`  🔄 Migrate:  ${report.summary.migrate} files (${this.percentage(report.summary.migrate, report.totalFiles)}%)`);
    console.log(`  🔁 Replace:  ${report.summary.replace} files (${this.percentage(report.summary.replace, report.totalFiles)}%)`);
    console.log(`  🗑️  Delete:   ${report.summary.delete} files (${this.percentage(report.summary.delete, report.totalFiles)}%)`);
    console.log('─'.repeat(60));
    console.log(`  📈 Deletion Rate: ${report.summary.deletionRate}%`);
    console.log('═'.repeat(60) + '\n');
  }

  /**
   * Calculate percentage
   */
  private percentage(value: number, total: number): string {
    if (total === 0) return '0.00';
    return ((value / total) * 100).toFixed(2);
  }

  /**
   * Export classification report
   */
  exportReport(outputPath: string, report: ClassificationReport): void {
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`✅ Classification report exported to: ${outputPath}\n`);
  }

  /**
   * Get classifications by category
   */
  getClassificationsByCategory(category: FileClassification['category']): FileClassification[] {
    return this.classifications.filter(c => c.category === category);
  }

  /**
   * Get high-risk deletions (low safety score)
   */
  getHighRiskDeletions(): FileClassification[] {
    return this.classifications.filter(
      c => c.category === 'delete' && c.safetyScore < 50
    );
  }

  /**
   * Get safe deletions (high safety score)
   */
  getSafeDeletions(): FileClassification[] {
    return this.classifications.filter(
      c => c.category === 'delete' && c.safetyScore >= 80
    );
  }
}

// CLI Usage
if (require.main === module) {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║              CLASSIFICATION ASSISTANT                          ║');
  console.log('║              Intelligent File Analysis                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log('⚠️  This tool requires FileDiscoveryAssistant results');
  console.log('   Run FileDiscoveryAssistant first to generate file-discovery-results.json\n');
}
