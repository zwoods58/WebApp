/**
 * CompletePipeline
 * Orchestrates the complete deletion workflow
 * 
 * Pipeline:
 * 1. FileDiscoveryAssistant - Discover all files
 * 2. ClassificationAssistant - Classify every file
 * 3. DeletionExecutor - Execute deletion plan
 * 4. Report final deletion rate (95-100% target)
 */

import { FileDiscoveryAssistant } from './FileDiscoveryAssistant';
import { ClassificationAssistant } from './ClassificationAssistant';
import { DeletionExecutor } from './DeletionExecutor';
import * as fs from 'fs';
import * as path from 'path';

interface PipelineConfig {
  baseDir: string;
  strategy: 'safe' | 'aggressive' | 'conservative';
  dryRun: boolean;
  targetDeletionRate: number; // Percentage (e.g., 95)
}

export class CompletePipeline {
  private config: PipelineConfig;

  constructor(config: PipelineConfig) {
    this.config = config;
  }

  /**
   * Run the complete pipeline
   */
  async run(): Promise<void> {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              COMPLETE DELETION PIPELINE                        ║');
    console.log('║              95-100% Deletion Rate Target                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log(`Base Directory: ${this.config.baseDir}`);
    console.log(`Strategy: ${this.config.strategy.toUpperCase()}`);
    console.log(`Mode: ${this.config.dryRun ? 'DRY RUN' : 'LIVE EXECUTION'}`);
    console.log(`Target Deletion Rate: ${this.config.targetDeletionRate}%\n`);

    // Step 1: File Discovery
    console.log('═'.repeat(60));
    console.log('STEP 1: FILE DISCOVERY');
    console.log('═'.repeat(60) + '\n');

    const discoveryAssistant = new FileDiscoveryAssistant(this.config.baseDir);
    const discoveredFiles = await discoveryAssistant.findAllSystemFiles();
    const dependencyGraph = await discoveryAssistant.analyzeFileDependencies();

    discoveryAssistant.exportResults('file-discovery-results.json');

    // Step 2: Classification
    console.log('═'.repeat(60));
    console.log('STEP 2: INTELLIGENT CLASSIFICATION');
    console.log('═'.repeat(60) + '\n');

    const classificationAssistant = new ClassificationAssistant(
      this.config.baseDir,
      dependencyGraph
    );

    const classificationReport = await classificationAssistant.classifyEveryFile(discoveredFiles);
    classificationAssistant.exportReport('classification-report.json', classificationReport);

    // Check if target deletion rate is achievable
    this.analyzeTargetFeasibility(classificationReport);

    // Step 3: Deletion Execution
    console.log('═'.repeat(60));
    console.log('STEP 3: DELETION EXECUTION');
    console.log('═'.repeat(60) + '\n');

    const deletionExecutor = new DeletionExecutor(this.config.baseDir);
    const executionReport = await deletionExecutor.executeDeletionPlan({
      classifications: classificationReport.classified.delete.concat(
        classificationReport.classified.replace
      ),
      strategy: this.config.strategy,
      dryRun: this.config.dryRun
    });

    deletionExecutor.exportReport('execution-report.json', executionReport);

    // Step 4: Final Report
    console.log('═'.repeat(60));
    console.log('STEP 4: FINAL DELETION RATE ANALYSIS');
    console.log('═'.repeat(60) + '\n');

    this.generateFinalReport(classificationReport, executionReport);
  }

  /**
   * Analyze if target deletion rate is feasible
   */
  private analyzeTargetFeasibility(report: any): void {
    const currentRate = report.summary.deletionRate;
    const target = this.config.targetDeletionRate;

    console.log('🎯 Target Feasibility Analysis:');
    console.log('─'.repeat(60));
    console.log(`  Current Deletion Rate: ${currentRate}%`);
    console.log(`  Target Deletion Rate:  ${target}%`);
    console.log(`  Gap: ${(target - currentRate).toFixed(2)}%`);
    console.log('─'.repeat(60));

    if (currentRate >= target) {
      console.log(`  ✅ Target ACHIEVED! (${currentRate}% >= ${target}%)`);
    } else {
      console.log(`  ⚠️  Target NOT MET (${currentRate}% < ${target}%)`);
      console.log(`  📊 Additional ${Math.ceil((target - currentRate) * report.totalFiles / 100)} files need deletion`);
    }
    console.log('\n');
  }

  /**
   * Generate final comprehensive report
   */
  private generateFinalReport(classificationReport: any, executionReport: any): void {
    const finalReport = {
      pipeline: {
        timestamp: new Date().toISOString(),
        strategy: this.config.strategy,
        dryRun: this.config.dryRun,
        targetDeletionRate: this.config.targetDeletionRate
      },
      discovery: {
        totalFiles: classificationReport.totalFiles
      },
      classification: {
        keep: classificationReport.summary.keep,
        migrate: classificationReport.summary.migrate,
        replace: classificationReport.summary.replace,
        delete: classificationReport.summary.delete,
        plannedDeletionRate: classificationReport.summary.deletionRate
      },
      execution: {
        deleted: executionReport.summary.deleted,
        preserved: executionReport.summary.preserved,
        migrated: executionReport.summary.migrated,
        skipped: executionReport.summary.skipped,
        errors: executionReport.summary.errors,
        actualDeletionRate: executionReport.summary.deletionRate,
        successRate: executionReport.summary.successRate,
        duration: executionReport.duration
      },
      achievement: {
        targetMet: executionReport.summary.deletionRate >= this.config.targetDeletionRate,
        targetRate: this.config.targetDeletionRate,
        actualRate: executionReport.summary.deletionRate,
        gap: this.config.targetDeletionRate - executionReport.summary.deletionRate
      }
    };

    // Save final report
    fs.writeFileSync('final-deletion-report.json', JSON.stringify(finalReport, null, 2));

    // Print final report
    console.log('📊 FINAL DELETION REPORT');
    console.log('═'.repeat(60));
    console.log(`  Total Files Analyzed: ${finalReport.discovery.totalFiles}`);
    console.log('─'.repeat(60));
    console.log('  Classification:');
    console.log(`    Keep:     ${finalReport.classification.keep}`);
    console.log(`    Migrate:  ${finalReport.classification.migrate}`);
    console.log(`    Replace:  ${finalReport.classification.replace}`);
    console.log(`    Delete:   ${finalReport.classification.delete}`);
    console.log('─'.repeat(60));
    console.log('  Execution:');
    console.log(`    Deleted:   ${finalReport.execution.deleted}`);
    console.log(`    Preserved: ${finalReport.execution.preserved}`);
    console.log(`    Migrated:  ${finalReport.execution.migrated}`);
    console.log(`    Skipped:   ${finalReport.execution.skipped}`);
    console.log(`    Errors:    ${finalReport.execution.errors}`);
    console.log('─'.repeat(60));
    console.log('  Performance:');
    console.log(`    Planned Deletion Rate: ${finalReport.classification.plannedDeletionRate}%`);
    console.log(`    Actual Deletion Rate:  ${finalReport.execution.actualDeletionRate}%`);
    console.log(`    Success Rate:          ${finalReport.execution.successRate}%`);
    console.log(`    Duration:              ${(finalReport.execution.duration / 1000).toFixed(2)}s`);
    console.log('─'.repeat(60));
    console.log('  Target Achievement:');
    console.log(`    Target:  ${finalReport.achievement.targetRate}%`);
    console.log(`    Actual:  ${finalReport.achievement.actualRate}%`);
    console.log(`    Status:  ${finalReport.achievement.targetMet ? '✅ ACHIEVED' : '⚠️  NOT MET'}`);
    if (!finalReport.achievement.targetMet) {
      console.log(`    Gap:     ${finalReport.achievement.gap.toFixed(2)}%`);
    }
    console.log('═'.repeat(60) + '\n');

    console.log(`✅ Final report saved to: final-deletion-report.json\n`);

    // Print recommendations
    this.printRecommendations(finalReport);
  }

  /**
   * Print recommendations based on results
   */
  private printRecommendations(report: any): void {
    console.log('💡 RECOMMENDATIONS');
    console.log('═'.repeat(60));

    if (report.achievement.targetMet) {
      console.log('  ✅ Target deletion rate achieved!');
      console.log('  ✅ System cleanup successful');
      
      if (this.config.dryRun) {
        console.log('\n  📋 Next Steps:');
        console.log('    1. Review classification-report.json');
        console.log('    2. Run pipeline with --live flag to execute');
        console.log('    3. Test application after deletion');
      } else {
        console.log('\n  📋 Next Steps:');
        console.log('    1. Test application: npm run dev');
        console.log('    2. Run build: npm run build');
        console.log('    3. Update documentation');
        console.log('    4. Commit changes to version control');
      }
    } else {
      console.log('  ⚠️  Target deletion rate not met');
      console.log(`  📊 Gap: ${report.achievement.gap.toFixed(2)}%`);
      console.log('\n  📋 Suggestions:');
      console.log('    1. Review "keep" classifications for false positives');
      console.log('    2. Check "migrate" files - can any be deleted?');
      console.log('    3. Analyze "skipped" files for blockers');
      console.log('    4. Consider more aggressive strategy');
      console.log('    5. Review dependency graph for orphans');
    }

    if (report.execution.errors > 0) {
      console.log(`\n  ⚠️  ${report.execution.errors} errors occurred`);
      console.log('    Check deletion-execution-log.txt for details');
    }

    console.log('═'.repeat(60) + '\n');
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--live');
  const strategy = args.includes('--aggressive') ? 'aggressive' :
                   args.includes('--conservative') ? 'conservative' : 'safe';

  const config: PipelineConfig = {
    baseDir: process.cwd(),
    strategy,
    dryRun,
    targetDeletionRate: 95 // 95-100% target
  };

  const pipeline = new CompletePipeline(config);

  pipeline.run()
    .then(() => {
      console.log('✅ Pipeline completed successfully!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Pipeline failed:', error);
      process.exit(1);
    });
}
