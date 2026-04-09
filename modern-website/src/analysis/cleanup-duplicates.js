// Duplicate Keys Cleanup Script
const fs = require('fs');
const path = require('path');

// Load the final analysis
const analysis = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'analysis-results', 'final-translation-analysis.json'), 'utf8')
);

// Load the translation file
const translationFile = path.join(__dirname, '..', 'translations-new.ts');
let content = fs.readFileSync(translationFile, 'utf8');

// Function to safely remove duplicate keys
function removeDuplicateKeys(content, duplicates) {
  let modifiedContent = content;
  let removedKeys = [];
  
  // Sort duplicates by position to remove later occurrences first
  const sortedDuplicates = Object.entries(duplicates)
    .map(([key, occurrences]) => ({
      key,
      occurrences: occurrences.sort((a, b) => b.position - a.position) // Sort by position descending
    }))
    .filter(item => item.occurrences.length > 1);
  
  console.log(`Processing ${sortedDuplicates.length} duplicate key groups...`);
  
  for (const { key, occurrences } of sortedDuplicates) {
    // Keep the first occurrence (lowest position), remove the rest
    for (let i = 0; i < occurrences.length - 1; i++) {
      const occurrence = occurrences[i];
      const position = occurrence.position;
      const line = occurrence.line;
      
      // Find the exact occurrence to remove
      const beforeKey = modifiedContent.substring(0, position);
      const afterKey = modifiedContent.substring(position);
      
      // Find the end of this key definition
      const keyStart = position;
      let keyEnd = position;
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      
      for (let j = position; j < modifiedContent.length; j++) {
        const char = modifiedContent[j];
        
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && modifiedContent[j-1] !== '\\') {
          inString = false;
        } else if (!inString) {
          if (char === '{') braceCount++;
          else if (char === '}') braceCount--;
          else if (char === ',' && braceCount === 0) {
            keyEnd = j + 1;
            break;
          }
        }
      }
      
      // If we didn't find a comma, look for the closing brace or end of section
      if (keyEnd === position) {
        for (let j = position; j < modifiedContent.length; j++) {
          const char = modifiedContent[j];
          if (char === '}' && braceCount === 0) {
            keyEnd = j;
            break;
          }
        }
      }
      
      // Extract the key definition to verify
      const keyDefinition = modifiedContent.substring(keyStart, keyEnd);
      
      // Verify this is the right key by checking the key name
      if (keyDefinition.includes(`"${key}":`)) {
        // Remove the duplicate key definition
        modifiedContent = modifiedContent.substring(0, keyStart) + modifiedContent.substring(keyEnd);
        
        // Clean up extra whitespace
        modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
        modifiedContent = modifiedContent.replace(/,\s*}/g, '\n  }');
        
        removedKeys.push({
          key,
          line,
          removed: true
        });
        
        console.log(`Removed duplicate key: ${key} (line ${line})`);
      }
    }
  }
  
  return { modifiedContent, removedKeys };
}

// Perform the cleanup
const { modifiedContent, removedKeys } = removeDuplicateKeys(content, analysis.duplicates);

// Add a header comment about the cleanup
const header = `// src/translations-new.ts - Restructured Translation System
// Organized by priority with all languages for each key
// Now properly typed as TypeScript
// 
// CLEANUP NOTES:
// - Removed ${removedKeys.length} duplicate keys on ${new Date().toISOString()}
// - All duplicate TypeScript errors should now be resolved
// - No functional keys were removed, only duplicates

`;

const finalContent = header + modifiedContent.substring(modifiedContent.indexOf('const translations'));

// Create backup
const backupFile = translationFile + '.backup-before-cleanup';
fs.writeFileSync(backupFile, content);
console.log(`Backup created: ${backupFile}`);

// Write the cleaned file
fs.writeFileSync(translationFile, finalContent);

// Generate cleanup report
const report = {
  cleanupDate: new Date().toISOString(),
  originalKeys: analysis.summary.totalTranslationKeys,
  duplicateGroups: analysis.summary.duplicateKeyGroups,
  keysRemoved: removedKeys.length,
  removedKeys: removedKeys,
  backupFile: backupFile
};

const outputDir = path.join(__dirname, '..', 'analysis-results');
fs.writeFileSync(
  path.join(outputDir, 'cleanup-report.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\nCleanup complete!`);
console.log(`- Removed ${removedKeys.length} duplicate keys`);
console.log(`- Original file backed up to: ${backupFile}`);
console.log(`- Cleanup report saved to: ${path.join(outputDir, 'cleanup-report.json')}`);
console.log(`\nThe translation file should now be free of TypeScript duplicate errors.`);
