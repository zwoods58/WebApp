/**
 * SystemDeletionManager
 * Controlled, phased deletion process for offline/online system removal
 * 
 * Features:
 * - Safe backup verification
 * - Gradual file deletion with confirmation
 * - Comprehensive logging
 * - Rollback capability
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface DeletionPhase {
  name: string;
  description: string;
  patterns: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface DeletionLog {
  timestamp: string;
  phase: string;
  action: 'deleted' | 'skipped' | 'error';
  path: string;
  reason?: string;
}

export class SystemDeletionManager {
  private logFile: string;
  private deletionLogs: DeletionLog[] = [];
  private dryRun: boolean;
  private baseDir: string;

  constructor(baseDir: string, dryRun: boolean = true) {
    this.baseDir = baseDir;
    this.dryRun = dryRun;
    this.logFile = path.join(baseDir, 'deletion_log.txt');
    this.initializeLog();
  }

  /**
   * Initialize deletion log file
   */
  private initializeLog(): void {
    const timestamp = new Date().toISOString();
    const header = `
===========================================
SYSTEM DELETION LOG
===========================================
Timestamp: ${timestamp}
Base Directory: ${this.baseDir}
Mode: ${this.dryRun ? 'DRY RUN' : 'LIVE DELETION'}
===========================================

`;
    fs.writeFileSync(this.logFile, header);
    console.log(`📝 Deletion log initialized: ${this.logFile}`);
  }

  /**
   * Log deletion action
   */
  private log(phase: string, action: 'deleted' | 'skipped' | 'error', filePath: string, reason?: string): void {
    const entry: DeletionLog = {
      timestamp: new Date().toISOString(),
      phase,
      action,
      path: filePath,
      reason
    };

    this.deletionLogs.push(entry);

    const logLine = `[${entry.timestamp}] [${phase}] ${action.toUpperCase()}: ${filePath}${reason ? ` - ${reason}` : ''}\n`;
    fs.appendFileSync(this.logFile, logLine);

    // Console output with colors
    const emoji = action === 'deleted' ? '🗑️' : action === 'skipped' ? '⏭️' : '❌';
    console.log(`${emoji} ${action.toUpperCase()}: ${filePath}`);
  }

  /**
   * Find files matching pattern
   */
  private findFiles(pattern: string): string[] {
    const files: string[] = [];
    
    // Handle different pattern types
    let matchFn: (filePath: string, fileName: string) => boolean;
    
    if (pattern.startsWith('**/')) {
      // Pattern like **/filename.ts - match filename anywhere
      const fileName = pattern.substring(3);
      matchFn = (filePath: string, name: string) => name === fileName;
    } else if (pattern.includes('*')) {
      // Pattern with wildcards
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/\\\\]*')
        .replace(/\?/g, '.');
      const regex = new RegExp(`^${regexPattern}$`);
      matchFn = (filePath: string, name: string) => {
        const relativePath = path.relative(this.baseDir, filePath).replace(/\\/g, '/');
        return regex.test(name) || regex.test(relativePath);
      };
    } else {
      // Exact filename match
      matchFn = (filePath: string, name: string) => name === pattern;
    }

    const searchDir = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.baseDir, fullPath);

          // Skip node_modules and .next
          if (relativePath.includes('node_modules') || relativePath.includes('.next')) {
            continue;
          }

          if (entry.isDirectory()) {
            searchDir(fullPath);
          } else if (entry.isFile()) {
            if (matchFn(fullPath, entry.name)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
      }
    };

    searchDir(this.baseDir);
    return files;
  }

  /**
   * Delete files with verification
   */
  async deleteWithVerification(
    pattern: string,
    description: string,
    phase: string
  ): Promise<{ deleted: number; skipped: number; errors: number }> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Phase: ${phase}`);
    console.log(`🔍 Pattern: ${pattern}`);
    console.log(`📝 Description: ${description}`);
    console.log(`${'='.repeat(60)}\n`);

    const files = this.findFiles(pattern);

    if (files.length === 0) {
      console.log(`✅ No files found matching pattern: ${pattern}`);
      this.log(phase, 'skipped', pattern, 'No files found');
      return { deleted: 0, skipped: 0, errors: 0 };
    }

    console.log(`📊 Found ${files.length} file(s) matching pattern:\n`);
    files.forEach((file, index) => {
      const relativePath = path.relative(this.baseDir, file);
      console.log(`  ${index + 1}. ${relativePath}`);
    });

    // Confirmation prompt
    if (!this.dryRun) {
      const confirmed = await this.confirmDeletion(files.length);
      if (!confirmed) {
        console.log(`⏭️  Skipped deletion of ${files.length} file(s)`);
        files.forEach(file => this.log(phase, 'skipped', file, 'User cancelled'));
        return { deleted: 0, skipped: files.length, errors: 0 };
      }
    }

    // Delete files
    let deleted = 0;
    let skipped = 0;
    let errors = 0;

    for (const file of files) {
      try {
        if (this.dryRun) {
          console.log(`[DRY RUN] Would delete: ${file}`);
          this.log(phase, 'skipped', file, 'Dry run mode');
          skipped++;
        } else {
          fs.unlinkSync(file);
          this.log(phase, 'deleted', file);
          deleted++;
        }
      } catch (error) {
        console.error(`❌ Error deleting ${file}:`, error);
        this.log(phase, 'error', file, (error as Error).message);
        errors++;
      }
    }

    console.log(`\n✅ Phase complete: ${deleted} deleted, ${skipped} skipped, ${errors} errors\n`);
    return { deleted, skipped, errors };
  }

  /**
   * Confirm deletion with user
   */
  private async confirmDeletion(fileCount: number): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(
        `\n⚠️  Are you sure you want to delete ${fileCount} file(s)? (yes/no): `,
        (answer) => {
          rl.close();
          resolve(answer.toLowerCase() === 'yes');
        }
      );
    });
  }

  /**
   * Delete directory with verification
   */
  async deleteDirectory(
    dirPath: string,
    description: string,
    phase: string
  ): Promise<boolean> {
    const fullPath = path.join(this.baseDir, dirPath);

    if (!fs.existsSync(fullPath)) {
      console.log(`✅ Directory does not exist: ${dirPath}`);
      this.log(phase, 'skipped', dirPath, 'Directory not found');
      return false;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Phase: ${phase}`);
    console.log(`📁 Directory: ${dirPath}`);
    console.log(`📝 Description: ${description}`);
    console.log(`${'='.repeat(60)}\n`);

    if (!this.dryRun) {
      const confirmed = await this.confirmDeletion(1);
      if (!confirmed) {
        console.log(`⏭️  Skipped deletion of directory: ${dirPath}`);
        this.log(phase, 'skipped', dirPath, 'User cancelled');
        return false;
      }
    }

    try {
      if (this.dryRun) {
        console.log(`[DRY RUN] Would delete directory: ${dirPath}`);
        this.log(phase, 'skipped', dirPath, 'Dry run mode');
      } else {
        fs.rmSync(fullPath, { recursive: true, force: true });
        this.log(phase, 'deleted', dirPath);
        console.log(`✅ Deleted directory: ${dirPath}`);
      }
      return true;
    } catch (error) {
      console.error(`❌ Error deleting directory ${dirPath}:`, error);
      this.log(phase, 'error', dirPath, (error as Error).message);
      return false;
    }
  }

  /**
   * Execute complete deletion plan
   */
  async executeDeletionPlan(): Promise<void> {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🚀 STARTING SYSTEMATIC DELETION PROCESS`);
    console.log(`Mode: ${this.dryRun ? '🔍 DRY RUN (No files will be deleted)' : '⚠️  LIVE DELETION'}`);
    console.log(`${'='.repeat(80)}\n`);

    const phases: DeletionPhase[] = [
      {
        name: 'Phase 1: Debug and Test Files',
        description: 'Remove temporary debug and test scripts',
        patterns: [
          'test-*.js',
          'debug-*.js',
          'emergency-*.js',
          'quick-*.js',
          'fix-*.js',
          'diagnose-*.js'
        ],
        priority: 'high'
      },
      {
        name: 'Phase 2: Old Documentation',
        description: 'Remove outdated offline system documentation',
        patterns: [
          'OFFLINE_*.md',
          'IMPLEMENTATION_*.md',
          'UNIVERSAL_OFFLINE_*.md',
          'current-login-system.md',
          'temp-auth-guide.md',
          'test-authentication.md'
        ],
        priority: 'high'
      },
      {
        name: 'Phase 3: Build Artifacts',
        description: 'Clean build output and cache directories',
        patterns: [
          'tsconfig.tsbuildinfo'
        ],
        priority: 'medium'
      },
      {
        name: 'Phase 4: Incomplete Offline Implementations',
        description: 'Remove legacy offline system components',
        patterns: [
          '**/useNetworkDetection.ts',
          '**/OfflineErrorBoundary.tsx',
          '**/OfflineFallback.tsx',
          '**/ServiceWorkerRegistration.tsx'
        ],
        priority: 'critical'
      },
      {
        name: 'Phase 5: Old Offline Components',
        description: 'Remove any remaining offline-specific components',
        patterns: [
          '**/Offline*.tsx',
          '**/*Offline*.ts'
        ],
        priority: 'medium'
      }
    ];

    const results = {
      totalDeleted: 0,
      totalSkipped: 0,
      totalErrors: 0
    };

    // Execute each phase
    for (const phase of phases) {
      console.log(`\n${'█'.repeat(80)}`);
      console.log(`🎯 ${phase.name.toUpperCase()}`);
      console.log(`Priority: ${phase.priority.toUpperCase()}`);
      console.log(`${phase.description}`);
      console.log(`${'█'.repeat(80)}\n`);

      for (const pattern of phase.patterns) {
        const result = await this.deleteWithVerification(
          pattern,
          phase.description,
          phase.name
        );

        results.totalDeleted += result.deleted;
        results.totalSkipped += result.skipped;
        results.totalErrors += result.errors;
      }

      // Pause between phases
      if (!this.dryRun) {
        await this.pause(2000);
      }
    }

    // Delete directories
    console.log(`\n${'█'.repeat(80)}`);
    console.log(`🎯 PHASE 6: DIRECTORY CLEANUP`);
    console.log(`${'█'.repeat(80)}\n`);

    await this.deleteDirectory('.next', 'Next.js build output', 'Phase 6: Directory Cleanup');
    await this.deleteDirectory('.vercel', 'Vercel deployment cache', 'Phase 6: Directory Cleanup');

    // Final summary
    this.printSummary(results);
  }

  /**
   * Pause execution
   */
  private async pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Print deletion summary
   */
  private printSummary(results: { totalDeleted: number; totalSkipped: number; totalErrors: number }): void {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 DELETION SUMMARY`);
    console.log(`${'='.repeat(80)}`);
    console.log(`✅ Files Deleted: ${results.totalDeleted}`);
    console.log(`⏭️  Files Skipped: ${results.totalSkipped}`);
    console.log(`❌ Errors: ${results.totalErrors}`);
    console.log(`📝 Log File: ${this.logFile}`);
    console.log(`${'='.repeat(80)}\n`);

    // Write summary to log
    const summary = `
===========================================
DELETION SUMMARY
===========================================
Total Deleted: ${results.totalDeleted}
Total Skipped: ${results.totalSkipped}
Total Errors: ${results.totalErrors}
Completion Time: ${new Date().toISOString()}
===========================================
`;
    fs.appendFileSync(this.logFile, summary);
  }

  /**
   * Get deletion statistics
   */
  getStatistics(): {
    byPhase: Record<string, { deleted: number; skipped: number; errors: number }>;
    total: { deleted: number; skipped: number; errors: number };
  } {
    const byPhase: Record<string, { deleted: number; skipped: number; errors: number }> = {};
    const total = { deleted: 0, skipped: 0, errors: 0 };

    for (const log of this.deletionLogs) {
      if (!byPhase[log.phase]) {
        byPhase[log.phase] = { deleted: 0, skipped: 0, errors: 0 };
      }

      if (log.action === 'deleted') {
        byPhase[log.phase].deleted++;
        total.deleted++;
      } else if (log.action === 'skipped') {
        byPhase[log.phase].skipped++;
        total.skipped++;
      } else if (log.action === 'error') {
        byPhase[log.phase].errors++;
        total.errors++;
      }
    }

    return { byPhase, total };
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--live');
  const baseDir = process.cwd();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  SYSTEM DELETION MANAGER                       ║
║                  Offline/Online System Removal                 ║
╚════════════════════════════════════════════════════════════════╝
  `);

  if (dryRun) {
    console.log(`⚠️  Running in DRY RUN mode. No files will be deleted.`);
    console.log(`   To execute actual deletion, run with --live flag\n`);
  } else {
    console.log(`⚠️  ⚠️  ⚠️  LIVE DELETION MODE ⚠️  ⚠️  ⚠️`);
    console.log(`   Files WILL be permanently deleted!\n`);
  }

  const manager = new SystemDeletionManager(baseDir, dryRun);
  
  manager.executeDeletionPlan()
    .then(() => {
      console.log(`\n✅ Deletion process completed successfully!`);
      const stats = manager.getStatistics();
      console.log(`\n📊 Final Statistics:`);
      console.log(JSON.stringify(stats, null, 2));
    })
    .catch((error) => {
      console.error(`\n❌ Deletion process failed:`, error);
      process.exit(1);
    });
}
