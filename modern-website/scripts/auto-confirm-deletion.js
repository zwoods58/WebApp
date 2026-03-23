/**
 * Auto-confirm deletion script
 * Automatically confirms all deletion prompts
 */

const { spawn } = require('child_process');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║              OFFLINE/ONLINE SYSTEM DELETION                    ║
║              AUTO-CONFIRM MODE                                 ║
╚════════════════════════════════════════════════════════════════╝
`);

console.log(`⚠️  ⚠️  ⚠️  LIVE DELETION MODE ⚠️  ⚠️  ⚠️`);
console.log(`   Files WILL be permanently deleted!\n`);
console.log(`🤖 Auto-confirming all prompts with "yes"\n`);

const child = spawn('npx', ['tsx', 'scripts/SystemDeletionManager.ts', '--live'], {
  cwd: path.join(__dirname, '..'),
  stdio: ['pipe', 'inherit', 'inherit']
});

// Auto-respond "yes" to all prompts
child.stdin.on('data', () => {
  child.stdin.write('yes\n');
});

// Send "yes" periodically to handle prompts
const interval = setInterval(() => {
  try {
    child.stdin.write('yes\n');
  } catch (e) {
    // Process ended
  }
}, 1000);

child.on('close', (code) => {
  clearInterval(interval);
  console.log(`\n✅ Deletion process completed with exit code: ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  clearInterval(interval);
  console.error(`\n❌ Deletion process failed:`, error.message);
  process.exit(1);
});
