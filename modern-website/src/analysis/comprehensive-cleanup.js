// Comprehensive Translation Cleanup Script
const fs = require('fs');
const path = require('path');

// Load the translation file
const translationFile = path.join(__dirname, '..', 'translations-new.ts');
let content = fs.readFileSync(translationFile, 'utf8');

// Function to find all duplicate keys with their positions
function findAllDuplicates(content) {
  const keyPositions = new Map();
  
  // Find all key definitions
  const keyRegex = /"([^"]+)":/g;
  let match;
  
  while ((match = keyRegex.exec(content)) !== null) {
    const key = match[1];
    const position = match.index;
    const line = content.substring(0, position).split('\n').length;
    
    if (!keyPositions.has(key)) {
      keyPositions.set(key, []);
    }
    
    keyPositions.get(key).push({
      position,
      line,
      key
    });
  }
  
  // Filter for duplicates (appears more than once)
  const duplicates = new Map();
  for (const [key, positions] of keyPositions) {
    if (positions.length > 1) {
      duplicates.set(key, positions.sort((a, b) => b.position - a.position)); // Sort by position descending
    }
  }
  
  return duplicates;
}

// Function to remove duplicate keys safely
function removeDuplicates(content, duplicates) {
  let modifiedContent = content;
  let removedCount = 0;
  
  console.log(`Processing ${duplicates.size} duplicate key groups...`);
  
  for (const [key, positions] of duplicates) {
    // Keep the first occurrence (lowest position), remove the rest
    for (let i = 0; i < positions.length - 1; i++) {
      const occurrence = positions[i];
      const position = occurrence.position;
      
      // Find the start and end of this key definition
      const beforeKey = modifiedContent.substring(0, position);
      const afterKey = modifiedContent.substring(position);
      
      // Find the end of this key definition
      let keyEnd = position;
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      let foundColon = false;
      
      for (let j = position; j < modifiedContent.length; j++) {
        const char = modifiedContent[j];
        
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && modifiedContent[j-1] !== '\\') {
          inString = false;
        } else if (!inString) {
          if (char === ':') {
            foundColon = true;
          } else if (foundColon && char === '{') {
            braceCount++;
          } else if (foundColon && char === '}') {
            braceCount--;
            if (braceCount === 0) {
              keyEnd = j + 1;
              break;
            }
          } else if (foundColon && braceCount === 0 && char === ',') {
            keyEnd = j + 1;
            break;
          }
        }
      }
      
      // If we didn't find a proper end, look for the next key or closing brace
      if (keyEnd === position) {
        const nextKeyMatch = afterKey.match(/^\s*"/);
        if (nextKeyMatch) {
          keyEnd = position + nextKeyMatch.index;
        } else {
          const closingBraceMatch = afterKey.match(/^\s*}/);
          if (closingBraceMatch) {
            keyEnd = position + closingBraceMatch.index;
          }
        }
      }
      
      // Extract the key definition to verify
      const keyDefinition = modifiedContent.substring(position, keyEnd);
      
      // Verify this is the right key by checking the key name
      if (keyDefinition.includes(`"${key}":`)) {
        // Remove the duplicate key definition
        modifiedContent = beforeKey + afterKey.substring(keyEnd - position);
        
        // Clean up extra whitespace
        modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
        modifiedContent = modifiedContent.replace(/,\s*}/g, '\n  }');
        modifiedContent = modifiedContent.replace(/\s*,\s*}/g, '\n  }');
        
        removedCount++;
        console.log(`Removed duplicate key: ${key} (line ${occurrence.line})`);
      }
    }
  }
  
  return { modifiedContent, removedCount };
}

// Function to fix common syntax issues
function fixSyntaxIssues(content) {
  let fixedContent = content;
  
  // Fix orphaned closing braces
  fixedContent = fixedContent.replace(/,\s*}\s*$/gm, '\n  }');
  
  // Fix missing commas between objects
  fixedContent = fixedContent.replace(/}\s*\n\s*"/g, '},\n    "');
  
  // Fix extra commas before closing braces
  fixedContent = fixedContent.replace(/,\s*}/g, '\n  }');
  
  // Ensure proper structure at the end
  if (!fixedContent.endsWith('export default translations;')) {
    if (fixedContent.endsWith('}')) {
      fixedContent += '\n\nexport default translations;';
    } else {
      fixedContent += '\nexport default translations;';
    }
  }
  
  return fixedContent;
}

// Perform the comprehensive cleanup
console.log('Starting comprehensive translation cleanup...');

const duplicates = findAllDuplicates(content);
console.log(`Found ${duplicates.size} duplicate key groups`);

const { modifiedContent, removedCount } = removeDuplicates(content, duplicates);
const finalContent = fixSyntaxIssues(modifiedContent);

// Create backup
const backupFile = translationFile + '.backup-before-comprehensive-cleanup';
fs.writeFileSync(backupFile, content);
console.log(`Backup created: ${backupFile}`);

// Write the cleaned file
fs.writeFileSync(translationFile, finalContent);

// Generate cleanup report
const report = {
  cleanupDate: new Date().toISOString(),
  duplicateGroups: duplicates.size,
  keysRemoved: removedCount,
  backupFile: backupFile,
  totalKeysBefore: content.split('"').length / 2, // Rough estimate
  totalKeysAfter: finalContent.split('"').length / 2 // Rough estimate
};

const outputDir = path.join(__dirname, '..', 'analysis-results');
fs.writeFileSync(
  path.join(outputDir, 'comprehensive-cleanup-report.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\nComprehensive cleanup complete!`);
console.log(`- Removed ${removedCount} duplicate keys`);
console.log(`- Processed ${duplicates.size} duplicate key groups`);
console.log(`- Original file backed up to: ${backupFile}`);
console.log(`- Cleanup report saved to: ${path.join(outputDir, 'comprehensive-cleanup-report.json')}`);
console.log(`\nThe translation file should now be free of duplicate key errors.`);

// Test TypeScript compilation
console.log('\nTesting TypeScript compilation...');
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit --project .', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
  console.log('TypeScript compilation successful! No errors found.');
} catch (error) {
  console.log('TypeScript compilation still has errors:');
  console.log(error.stdout.toString());
}
