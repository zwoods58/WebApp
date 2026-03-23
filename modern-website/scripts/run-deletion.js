/**
 * Run Deletion Script
 * JavaScript wrapper to execute SystemDeletionManager
 * Usage: node scripts/run-deletion.js [--live]
 */

const { execSync } = require('child_process');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║              OFFLINE/ONLINE SYSTEM DELETION                    ║
║              Phase 3: Systematic Deletion Process              ║
╚════════════════════════════════════════════════════════════════╝
`);

const args = process.argv.slice(2);
const isLive = args.includes('--live');

if (!isLive) {
  console.log(`🔍 DRY RUN MODE - No files will be deleted`);
  console.log(`   To execute actual deletion, run: node scripts/run-deletion.js --live\n`);
} else {
  console.log(`⚠️  ⚠️  ⚠️  LIVE DELETION MODE ⚠️  ⚠️  ⚠️`);
  console.log(`   Files WILL be permanently deleted!\n`);
}

try {
  // Compile TypeScript file
  console.log(`📦 Compiling SystemDeletionManager...\n`);
  execSync('npx tsx scripts/SystemDeletionManager.ts' + (isLive ? ' --live' : ''), {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} catch (error) {
  console.error(`\n❌ Deletion process failed:`, error.message);
  process.exit(1);
}
