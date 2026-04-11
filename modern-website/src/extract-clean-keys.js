const fs = require('fs');
const path = require('path');

// Function to extract translation keys from a file
function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();
  
  // Match t('key') or t("key") patterns - more precise
  const regex = /t\(\s*['"`]([^'"`]+)['"`](?:\s*,\s*['"`][^'"`]*['"`])?\s*\)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    // Filter out obvious non-translation keys
    if (
      !key.includes('/') && // No file paths
      !key.includes('@') && // No imports
      !key.includes(' ') && // No spaces (except in compound keys like 'common.save')
      !key.includes('\n') && // No newlines
      !key.includes('$') && // No template literals
      !key.includes(',') && // No comma-separated lists
      !key.includes('*') && // No wildcards
      key.length > 0 && // Not empty
      key.length < 100 && // Not too long
      /^[a-zA-Z0-9._-]+$/.test(key) // Only valid characters
    ) {
      keys.add(key);
    }
  }
  
  return Array.from(keys);
}

// Function to get all TypeScript/TSX files in components and pages only
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.') && !file.includes('backup') && !file.includes('analysis')) {
      getAllFiles(filePath, fileList);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !file.includes('extract-') && !file.includes('test-')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main extraction
const srcDir = path.join(__dirname);
const allFiles = getAllFiles(srcDir);
const allKeys = new Set();
const keySources = {};

console.log('Extracting CLEAN translation keys from TypeScript files...\n');

allFiles.forEach(filePath => {
  const keys = extractKeysFromFile(filePath);
  if (keys.length > 0) {
    console.log(`${filePath}: ${keys.length} keys`);
    keys.forEach(key => {
      allKeys.add(key);
      if (!keySources[key]) keySources[key] = [];
      keySources[key].push(filePath);
    });
  }
});

// Sort and output results
const sortedKeys = Array.from(allKeys).sort();

console.log(`\n=== TOTAL CLEAN KEYS: ${sortedKeys.length} ===\n`);

// Group by prefix
const groupedKeys = {};
sortedKeys.forEach(key => {
  const prefix = key.split('.')[0] || 'other';
  if (!groupedKeys[prefix]) groupedKeys[prefix] = [];
  groupedKeys[prefix].push(key);
});

// Output grouped results
Object.keys(groupedKeys).sort().forEach(prefix => {
  console.log(`\n${prefix.toUpperCase()} (${groupedKeys[prefix].length} keys):`);
  groupedKeys[prefix].forEach(key => console.log(`  - ${key}`));
});

// Save to JSON file
const output = {
  totalKeys: sortedKeys.length,
  keys: sortedKeys,
  groupedByPrefix: groupedKeys,
  keySources: keySources
};

fs.writeFileSync(path.join(__dirname, 'clean-translation-keys.json'), JSON.stringify(output, null, 2));
console.log(`\nSaved to: clean-translation-keys.json`);
