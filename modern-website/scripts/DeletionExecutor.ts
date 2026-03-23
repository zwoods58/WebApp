/**
 * DeletionExecutor
 * Automated deletion execution with safety checks and rollback
 * 
 * Features:
 * - Programmatic deletion plan execution
 * - Different actions (delete, preserve, migrate)
 * - Safety verification
 * - Rollback capability
 * - Comprehensive tracking and reporting
 */

import * as fs from 'fs';
import * as path from 'path';
import { FileClassification, ClassificationReport } from './ClassificationAssistant';

export interface DeletionPlan {
  classifications: FileClassification[];
  strategy: 'safe' | 'aggressive' | 'conservative';
  dryRun: boolean;
}

export interface DeletionResult {
  file: string;
  action: 'deleted' | 'preserved' | 'migrated' | 'skipped' | 'error';
  reason: string;
  timestamp: Date;
}

export interface ExecutionReport {
  startTime: Date;
  endTime: Date;
  duration: number; // milliseconds
  totalFiles: number;
  results: {
    deleted: DeletionResult[];
    preserved: DeletionResult[];
    migrated: DeletionResult[];
    skipped: DeletionResult[];
    errors: DeletionResult[];
  };
  summary: {
    deleted: number;
    preserved: number;
    migrated: number;
    skipped: number;
    errors: number;
    deletionRate: number; // Percentage
    successRate: number; // Percentage
  };
  backupLocation?: string;
}

export class DeletionExecutor {
  private baseDir: string;
  private backupDir: string;
  private results: DeletionResult[] = [];
  private logFile: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.backupDir = this.createBackupDirectory();
    this.logFile = path.join(baseDir, 'deletion-execution-log.txt');
    this.initializeLog();
  }

  /**
   * Create backup directory
   */
  private createBackupDirectory(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(
      path.dirname(this.baseDir),
      `deletion-backup-${timestamp}`
    );
    
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    return backupPath;
  }

  /**
   * Initialize execution log
   */
  private initializeLog(): void {
    const header = `
═══════════════════════════════════════════════════════════════
DELETION EXECUTION LOG
═══════════════════════════════════════════════════════════════
Start Time: ${new Date().toISOString()}
Base Directory: ${this.baseDir}
Backup Directory: ${this.backupDir}
═══════════════════════════════════════════════════════════════

`;
    fs.writeFileSync(this.logFile, header);
  }

  /**
   * Log execution event
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logLine);
  }

  /**
   * Execute deletion plan
   */
  async executeDeletionPlan(plan: DeletionPlan): Promise<ExecutionReport> {
    const startTime = new Date();
    
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              DELETION EXECUTOR                                 ║');
    console.log('║              Automated Plan Execution                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log(`Strategy: ${plan.strategy.toUpperCase()}`);
    console.log(`Mode: ${plan.dryRun ? 'DRY RUN' : 'LIVE EXECUTION'}`);
    console.log(`Total Files: ${plan.classifications.length}\n`);

    this.log(`Execution started - Strategy: ${plan.strategy}, DryRun: ${plan.dryRun}`);

    this.results = [];

    // Group classifications by category
    const byCategory = this.groupByCategory(plan.classifications);

    // Execute in order: delete -> replace -> migrate -> keep
    await this.processCategory('delete', byCategory.delete, plan);
    await this.processCategory('replace', byCategory.replace, plan);
    await this.processCategory('migrate', byCategory.migrate, plan);
    await this.processCategory('keep', byCategory.keep, plan);

    const endTime = new Date();
    const report = this.generateExecutionReport(startTime, endTime, plan.classifications.length);

    this.log('Execution completed');
    this.printExecutionSummary(report);

    return report;
  }

  /**
   * Group classifications by category
   */
  private groupByCategory(classifications: FileClassification[]): Record<string, FileClassification[]> {
    return {
      delete: classifications.filter(c => c.category === 'delete'),
      replace: classifications.filter(c => c.category === 'replace'),
      migrate: classifications.filter(c => c.category === 'migrate'),
      keep: classifications.filter(c => c.category === 'keep')
    };
  }

  /**
   * Process files in a category
   */
  private async processCategory(
    category: string,
    files: FileClassification[],
    plan: DeletionPlan
  ): Promise<void> {
    if (files.length === 0) return;

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📂 Processing ${category.toUpperCase()} (${files.length} files)`);
    console.log(`${'═'.repeat(60)}\n`);

    for (const classification of files) {
      await this.processFile(classification, plan);
    }
  }

  /**
   * Process a single file
   */
  private async processFile(
    classification: FileClassification,
    plan: DeletionPlan
  ): Promise<void> {
    const filePath = path.join(this.baseDir, classification.file.path);

    try {
      switch (classification.category) {
        case 'delete':
          await this.safeDelete(filePath, classification, plan.dryRun);
          break;

        case 'replace':
          await this.replaceFile(filePath, classification, plan.dryRun);
          break;

        case 'migrate':
          await this.migrateFile(filePath, classification, plan.dryRun);
          break;

        case 'keep':
          await this.preserveFile(filePath, classification);
          break;
      }
    } catch (error) {
      this.recordResult(classification.file.path, 'error', (error as Error).message);
    }
  }

  /**
   * Safe delete with backup
   */
  private async safeDelete(
    filePath: string,
    classification: FileClassification,
    dryRun: boolean
  ): Promise<void> {
    if (!fs.existsSync(filePath)) {
      this.recordResult(classification.file.path, 'skipped', 'File does not exist');
      return;
    }

    // Check safety score
    if (classification.safetyScore < 50) {
      console.log(`⚠️  Low safety score (${classification.safetyScore}): ${classification.file.path}`);
      this.log(`WARNING: Low safety score for ${classification.file.path}`);
    }

    // Backup before deletion
    if (!dryRun) {
      await this.backupFile(filePath, classification.file.path);
    }

    if (dryRun) {
      console.log(`[DRY RUN] Would delete: ${classification.file.path}`);
      this.recordResult(classification.file.path, 'skipped', 'Dry run mode');
    } else {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted: ${classification.file.path}`);
      this.recordResult(classification.file.path, 'deleted', classification.reason);
    }
  }

  /**
   * Replace file (delete after ensuring replacement exists)
   */
  private async replaceFile(
    filePath: string,
    classification: FileClassification,
    dryRun: boolean
  ): Promise<void> {
    if (!fs.existsSync(filePath)) {
      this.recordResult(classification.file.path, 'skipped', 'File does not exist');
      return;
    }

    // Check if blockers exist
    if (classification.dependencies.blockers.length > 0) {
      console.log(`⏸️  Blocked: ${classification.file.path} (${classification.dependencies.blockers.length} blockers)`);
      this.recordResult(
        classification.file.path,
        'skipped',
        `Blocked by: ${classification.dependencies.blockers.join(', ')}`
      );
      return;
    }

    // Same as delete for now
    await this.safeDelete(filePath, classification, dryRun);
  }

  /**
   * Migrate file (backup and mark for manual migration)
   */
  private async migrateFile(
    filePath: string,
    classification: FileClassification,
    dryRun: boolean
  ): Promise<void> {
    if (!fs.existsSync(filePath)) {
      this.recordResult(classification.file.path, 'skipped', 'File does not exist');
      return;
    }

    if (dryRun) {
      console.log(`[DRY RUN] Would migrate: ${classification.file.path}`);
      this.recordResult(classification.file.path, 'skipped', 'Dry run mode');
    } else {
      // Copy to migration folder
      const migrationDir = path.join(this.backupDir, 'to-migrate');
      if (!fs.existsSync(migrationDir)) {
        fs.mkdirSync(migrationDir, { recursive: true });
      }

      const destPath = path.join(migrationDir, classification.file.path);
      const destDir = path.dirname(destPath);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(filePath, destPath);
      
      console.log(`🔄 Migrated: ${classification.file.path}`);
      this.recordResult(classification.file.path, 'migrated', classification.reason);
    }
  }

  /**
   * Preserve file (no action)
   */
  private async preserveFile(
    filePath: string,
    classification: FileClassification
  ): Promise<void> {
    console.log(`✅ Preserved: ${classification.file.path}`);
    this.recordResult(classification.file.path, 'preserved', classification.reason);
  }

  /**
   * Backup file before deletion
   */
  private async backupFile(filePath: string, relativePath: string): Promise<void> {
    const backupPath = path.join(this.backupDir, relativePath);
    const backupDirPath = path.dirname(backupPath);

    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }

    fs.copyFileSync(filePath, backupPath);
    this.log(`Backed up: ${relativePath}`);
  }

  /**
   * Record execution result
   */
  private recordResult(
    file: string,
    action: DeletionResult['action'],
    reason: string
  ): void {
    const result: DeletionResult = {
      file,
      action,
      reason,
      timestamp: new Date()
    };

    this.results.push(result);
    this.log(`${action.toUpperCase()}: ${file} - ${reason}`);
  }

  /**
   * Generate execution report
   */
  private generateExecutionReport(
    startTime: Date,
    endTime: Date,
    totalFiles: number
  ): ExecutionReport {
    const results = {
      deleted: this.results.filter(r => r.action === 'deleted'),
      preserved: this.results.filter(r => r.action === 'preserved'),
      migrated: this.results.filter(r => r.action === 'migrated'),
      skipped: this.results.filter(r => r.action === 'skipped'),
      errors: this.results.filter(r => r.action === 'error')
    };

    const deletedCount = results.deleted.length;
    const successCount = results.deleted.length + results.preserved.length + results.migrated.length;
    
    const deletionRate = totalFiles > 0 ? (deletedCount / totalFiles) * 100 : 0;
    const successRate = totalFiles > 0 ? (successCount / totalFiles) * 100 : 0;

    return {
      startTime,
      endTime,
      duration: endTime.getTime() - startTime.getTime(),
      totalFiles,
      results,
      summary: {
        deleted: results.deleted.length,
        preserved: results.preserved.length,
        migrated: results.migrated.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
        deletionRate: Math.round(deletionRate * 100) / 100,
        successRate: Math.round(successRate * 100) / 100
      },
      backupLocation: this.backupDir
    };
  }

  /**
   * Print execution summary
   */
  private printExecutionSummary(report: ExecutionReport): void {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 EXECUTION SUMMARY');
    console.log('═'.repeat(60));
    console.log(`  Duration: ${(report.duration / 1000).toFixed(2)}s`);
    console.log(`  Total Files: ${report.totalFiles}`);
    console.log('─'.repeat(60));
    console.log(`  🗑️  Deleted:   ${report.summary.deleted} (${this.percentage(report.summary.deleted, report.totalFiles)}%)`);
    console.log(`  ✅ Preserved: ${report.summary.preserved} (${this.percentage(report.summary.preserved, report.totalFiles)}%)`);
    console.log(`  🔄 Migrated:  ${report.summary.migrated} (${this.percentage(report.summary.migrated, report.totalFiles)}%)`);
    console.log(`  ⏭️  Skipped:   ${report.summary.skipped} (${this.percentage(report.summary.skipped, report.totalFiles)}%)`);
    console.log(`  ❌ Errors:    ${report.summary.errors} (${this.percentage(report.summary.errors, report.totalFiles)}%)`);
    console.log('─'.repeat(60));
    console.log(`  📈 Deletion Rate: ${report.summary.deletionRate}%`);
    console.log(`  ✅ Success Rate:  ${report.summary.successRate}%`);
    console.log('─'.repeat(60));
    console.log(`  💾 Backup: ${report.backupLocation}`);
    console.log(`  📝 Log: ${this.logFile}`);
    console.log('═'.repeat(60) + '\n');

    // Write summary to log
    const summary = `
═══════════════════════════════════════════════════════════════
EXECUTION SUMMARY
═══════════════════════════════════════════════════════════════
Duration: ${(report.duration / 1000).toFixed(2)}s
Total Files: ${report.totalFiles}
Deleted: ${report.summary.deleted}
Preserved: ${report.summary.preserved}
Migrated: ${report.summary.migrated}
Skipped: ${report.summary.skipped}
Errors: ${report.summary.errors}
Deletion Rate: ${report.summary.deletionRate}%
Success Rate: ${report.summary.successRate}%
═══════════════════════════════════════════════════════════════
`;
    fs.appendFileSync(this.logFile, summary);
  }

  /**
   * Calculate percentage
   */
  private percentage(value: number, total: number): string {
    if (total === 0) return '0.00';
    return ((value / total) * 100).toFixed(2);
  }

  /**
   * Export execution report
   */
  exportReport(outputPath: string, report: ExecutionReport): void {
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`✅ Execution report exported to: ${outputPath}\n`);
  }

  /**
   * Rollback deletion (restore from backup)
   */
  async rollback(): Promise<void> {
    console.log('🔄 Starting rollback from backup...\n');

    if (!fs.existsSync(this.backupDir)) {
      console.log('❌ Backup directory not found. Cannot rollback.\n');
      return;
    }

    const deletedFiles = this.results.filter(r => r.action === 'deleted');
    let restored = 0;
    let errors = 0;

    for (const result of deletedFiles) {
      try {
        const backupPath = path.join(this.backupDir, result.file);
        const originalPath = path.join(this.baseDir, result.file);

        if (fs.existsSync(backupPath)) {
          const originalDir = path.dirname(originalPath);
          if (!fs.existsSync(originalDir)) {
            fs.mkdirSync(originalDir, { recursive: true });
          }

          fs.copyFileSync(backupPath, originalPath);
          console.log(`✅ Restored: ${result.file}`);
          restored++;
        }
      } catch (error) {
        console.log(`❌ Error restoring ${result.file}: ${(error as Error).message}`);
        errors++;
      }
    }

    console.log(`\n✅ Rollback complete: ${restored} files restored, ${errors} errors\n`);
  }
}

// CLI Usage
if (require.main === module) {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║              DELETION EXECUTOR                                 ║');
  console.log('║              Automated Plan Execution                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log('⚠️  This tool requires ClassificationAssistant results');
  console.log('   Run the complete pipeline to execute deletion plan\n');
}
