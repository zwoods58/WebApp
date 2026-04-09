// Final Solution - Remove All Duplicate Keys
const fs = require('fs');
const path = require('path');

// Load the translation file
const translationFile = path.join(__dirname, '..', 'translations-new.ts');
let content = fs.readFileSync(translationFile, 'utf8');

// Function to extract all keys and their positions
function extractAllKeysWithPositions(content) {
  const keys = [];
  const keyRegex = /"([^"]+)":/g;
  let match;
  
  while ((match = keyRegex.exec(content)) !== null) {
    const key = match[1];
    const position = match.index;
    const line = content.substring(0, position).split('\n').length;
    
    keys.push({
      key,
      position,
      line
    });
  }
  
  return keys;
}

// Function to remove duplicates by keeping only the first occurrence
function removeAllDuplicates(content) {
  const allKeys = extractAllKeysWithPositions(content);
  const seenKeys = new Set();
  const keysToRemove = [];
  
  // Find all duplicates (keep first occurrence, mark others for removal)
  for (const keyInfo of allKeys) {
    if (seenKeys.has(keyInfo.key)) {
      keysToRemove.push(keyInfo);
    } else {
      seenKeys.add(keyInfo.key);
    }
  }
  
  console.log(`Found ${keysToRemove.length} duplicate keys to remove`);
  
  // Sort by position descending to remove from end to start
  keysToRemove.sort((a, b) => b.position - a.position);
  
  let modifiedContent = content;
  let removedCount = 0;
  
  for (const keyInfo of keysToRemove) {
    const position = keyInfo.position;
    const key = keyInfo.key;
    
    // Find the extent of this key definition
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
    
    // Extract and verify the key definition
    const keyDefinition = modifiedContent.substring(position, keyEnd);
    
    if (keyDefinition.includes(`"${key}":`)) {
      // Remove the duplicate key definition
      modifiedContent = beforeKey + afterKey.substring(keyEnd - position);
      removedCount++;
      
      if (removedCount <= 10) { // Only show first 10 for brevity
        console.log(`Removed duplicate key: ${key} (line ${keyInfo.line})`);
      }
    }
  }
  
  if (removedCount > 10) {
    console.log(`... and ${removedCount - 10} more duplicate keys`);
  }
  
  return modifiedContent;
}

// Function to fix final syntax issues
function fixFinalSyntax(content) {
  let fixedContent = content;
  
  // Remove duplicate export statements
  const exportRegex = /export default translations;\s*/g;
  const exportMatches = fixedContent.match(exportRegex);
  if (exportMatches && exportMatches.length > 1) {
    // Keep only the last export statement
    fixedContent = fixedContent.replace(/export default translations;\s*/g, '');
    fixedContent = fixedContent.trim() + '\n\nexport default translations;';
  }
  
  // Fix orphaned commas
  fixedContent = fixedContent.replace(/^\s*,\s*$/gm, '');
  fixedContent = fixedContent.replace(/,\s*}/g, '\n  }');
  
  // Clean up extra whitespace
  fixedContent = fixedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  fixedContent = fixedContent.replace(/\s+$/gm, '');
  
  return fixedContent;
}

// Apply the final solution
console.log('Applying final solution to remove all duplicate keys...');

const cleanedContent = removeAllDuplicates(content);
const finalContent = fixFinalSyntax(cleanedContent);

// Create backup
const backupFile = translationFile + '.backup-before-final-solution';
fs.writeFileSync(backupFile, content);
console.log(`Backup created: ${backupFile}`);

// Write the final file
fs.writeFileSync(translationFile, finalContent);

console.log(`\nFinal solution complete!`);
console.log(`- Original file backed up to: ${backupFile}`);
console.log(`- All duplicate keys removed`);

// Test compilation
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
  console.log('\nTypeScript compilation successful! All errors resolved.');
} catch (error) {
  console.log('\nTypeScript compilation still has errors:');
  const output = error.stdout ? error.stdout.toString() : error.stderr.toString();
  console.log(output);
  
  // Count remaining errors
  const errorLines = output.split('\n').filter(line => line.includes('error TS'));
  console.log(`\nRemaining errors: ${errorLines.length}`);
}
