// Final Translation Analysis
const fs = require('fs');
const path = require('path');

// Load the usage analysis results
const usageReport = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'analysis-results', 'translation-keys-report.json'), 'utf8')
);

// Load the translation file content for manual inspection
const translationFile = path.join(__dirname, '..', 'translations-new.ts');
const translationContent = fs.readFileSync(translationFile, 'utf8');

// Extract used keys from the usage report
const usedKeys = new Set(Object.keys(usageReport.allKeys));

// Extract all keys from translation file using a simpler approach
function extractAllKeysFromTranslationFile(content) {
  const allKeys = new Set();
  
  // Match patterns like "key.name": { or "key.name": "value"
  const patterns = [
    /"([^"]+)":\s*\{/g,  // Object pattern
    /"([^"]+)":\s*"/g   // String pattern
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      allKeys.add(match[1]);
    }
  }
  
  return allKeys;
}

// Find duplicates by checking for multiple occurrences of the same key
function findDuplicateKeys(content) {
  const keyOccurrences = new Map();
  
  // Find all occurrences of keys
  const keyPattern = /"([^"]+)":/g;
  let match;
  
  while ((match = keyPattern.exec(content)) !== null) {
    const key = match[1];
    const position = match.index;
    
    if (!keyOccurrences.has(key)) {
      keyOccurrences.set(key, []);
    }
    
    keyOccurrences.get(key).push({
      position,
      line: content.substring(0, position).split('\n').length
    });
  }
  
  // Filter for actual duplicates (appears more than once)
  const duplicates = new Map();
  for (const [key, occurrences] of keyOccurrences) {
    if (occurrences.length > 1) {
      duplicates.set(key, occurrences);
    }
  }
  
  return duplicates;
}

// Extract keys and find duplicates
const allTranslationKeys = extractAllKeysFromTranslationFile(translationContent);
const duplicates = findDuplicateKeys(translationContent);

// Find unused keys
const unusedKeys = [];
for (const key of allTranslationKeys) {
  if (!usedKeys.has(key) && !key.includes('.')) {  // Only check base keys, not nested
    unusedKeys.push(key);
  }
}

// Find used but missing keys
const missingKeys = [];
for (const usedKey of usedKeys) {
  const baseKey = usedKey.split('.').pop();  // Get the last part
  if (!allTranslationKeys.has(baseKey) && !baseKey.includes(' ') && baseKey.length > 0) {
    missingKeys.push(usedKey);
  }
}

// Generate final report
const finalReport = {
  summary: {
    totalTranslationKeys: allTranslationKeys.size,
    totalUsedKeys: usedKeys.size,
    duplicateKeyGroups: duplicates.size,
    unusedKeys: unusedKeys.length,
    missingKeys: missingKeys.length
  },
  duplicates: Object.fromEntries(duplicates),
  unusedKeys: unusedKeys.sort(),
  missingKeys: missingKeys.sort(),
  usedKeys: Array.from(usedKeys).sort()
};

// Save the final report
const outputDir = path.join(__dirname, '..', 'analysis-results');
fs.writeFileSync(
  path.join(outputDir, 'final-translation-analysis.json'),
  JSON.stringify(finalReport, null, 2)
);

// Generate a human-readable summary
let summary = `Final Translation Analysis Summary
=====================================

KEY STATISTICS:
- Total keys in translation file: ${finalReport.summary.totalTranslationKeys}
- Keys actually used in code: ${finalReport.summary.totalUsedKeys}
- Duplicate key groups: ${finalReport.summary.duplicateKeyGroups}
- Unused keys: ${finalReport.summary.unusedKeys}
- Missing keys (used but not defined): ${finalReport.summary.missingKeys}

DUPLICATE KEYS (Top 20):
========================
`;

const duplicateArray = Array.from(duplicates.entries()).slice(0, 20);
for (const [key, occurrences] of duplicateArray) {
  summary += `${key} - appears ${occurrences.length} times\n`;
}

summary += `\nUNUSED KEYS (Top 20):
===================
`;
for (const key of unusedKeys.slice(0, 20)) {
  summary += `${key}\n`;
}

summary += `\nMISSING KEYS (Top 20):
===================
`;
for (const key of missingKeys.slice(0, 20)) {
  summary += `${key}\n`;
}

summary += `\nRECOMMENDATIONS:
================
1. Remove all unused keys to reduce file size
2. Resolve duplicate keys by keeping only the first occurrence
3. Add missing keys that are referenced in the code
4. Consider consolidating similar keys across industries

This analysis will help reduce the translation file size and eliminate TypeScript errors.
`;

fs.writeFileSync(
  path.join(outputDir, 'analysis-summary.txt'),
  summary
);

console.log('Final analysis complete!');
console.log(`- Found ${finalReport.summary.duplicateKeyGroups} duplicate key groups`);
console.log(`- Found ${finalReport.summary.unusedKeys} unused keys`);
console.log(`- Found ${finalReport.summary.missingKeys} missing keys`);
console.log(`Reports saved to: ${outputDir}`);
