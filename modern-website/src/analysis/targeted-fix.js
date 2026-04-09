// Targeted Fix for Specific Duplicate Key Errors
const fs = require('fs');
const path = require('path');

// Load the translation file
const translationFile = path.join(__dirname, '..', 'translations-new.ts');
let content = fs.readFileSync(translationFile, 'utf8');

// Fix orphaned commas that cause syntax errors
function fixOrphanedCommas(content) {
  let fixedContent = content;
  
  // Remove orphaned commas (lines that just have a comma)
  fixedContent = fixedContent.replace(/^\s*,\s*$/gm, '');
  
  // Fix commas before closing braces
  fixedContent = fixedContent.replace(/,\s*}/g, '\n  }');
  
  // Fix multiple consecutive commas
  fixedContent = fixedContent.replace(/,(\s*,)+/g, ',');
  
  // Clean up extra whitespace
  fixedContent = fixedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return fixedContent;
}

// Function to find and remove specific duplicate keys by line
function fixSpecificDuplicates(content) {
  let modifiedContent = content;
  
  // List of problematic lines from the error messages
  const problematicLines = [2493, 3829, 4065, 4091, 4262, 5426, 5439, 5454, 5467, 7163, 7176, 7189, 7202];
  
  const lines = modifiedContent.split('\n');
  
  // Process each problematic line
  for (const lineNum of problematicLines) {
    if (lineNum <= lines.length) {
      const line = lines[lineNum - 1];
      
      // Check if it's an orphaned comma or malformed key
      if (line.trim() === ',' || line.trim().match(/^,\s*$/)) {
        console.log(`Removing orphaned comma at line ${lineNum}`);
        lines[lineNum - 1] = ''; // Remove the line
      } else if (line.includes(',') && line.includes('"') && line.includes(':')) {
        // Check for duplicate key pattern
        const keyMatch = line.match(/"([^"]+)":/);
        if (keyMatch) {
          const key = keyMatch[1];
          console.log(`Found potential duplicate key: ${key} at line ${lineNum}`);
          
          // Look for the same key earlier in the file
          const earlierContent = lines.slice(0, lineNum - 1).join('\n');
          if (earlierContent.includes(`"${key}":`)) {
            console.log(`Removing duplicate key: ${key} at line ${lineNum}`);
            lines[lineNum - 1] = ''; // Remove the duplicate
          }
        }
      }
    }
  }
  
  return lines.join('\n');
}

// Apply fixes
console.log('Applying targeted fixes...');

let fixedContent = fixOrphanedCommas(content);
fixedContent = fixSpecificDuplicates(fixedContent);

// Additional cleanup for object structure
fixedContent = fixedContent.replace(/}\s*,\s*"/g, '},\n    "');
fixedContent = fixedContent.replace(/,\s*}\s*,/g, '\n  },');
fixedContent = fixedContent.replace(/,\s*}/g, '\n  }');

// Create backup
const backupFile = translationFile + '.backup-before-targeted-fix';
fs.writeFileSync(backupFile, content);
console.log(`Backup created: ${backupFile}`);

// Write the fixed file
fs.writeFileSync(translationFile, fixedContent);

console.log(`Targeted fix complete!`);
console.log(`- Original file backed up to: ${backupFile}`);
console.log(`- Fixed orphaned commas and duplicate keys`);

// Test compilation
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
  console.log('TypeScript compilation successful! No errors found.');
} catch (error) {
  console.log('TypeScript compilation still has errors:');
  const output = error.stdout ? error.stdout.toString() : error.stderr.toString();
  console.log(output);
}
