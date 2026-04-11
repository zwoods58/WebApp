const fs = require('fs');
const path = require('path');

// Function to extract translation keys from a file
function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();
  
  // Match t('key') or t("key") patterns
  const regex = /t\(\s*['"`]([^'"`]+)['"`]/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

// Function to get all TypeScript/TSX files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main extraction
const srcDir = path.join(__dirname);
const allFiles = getAllFiles(srcDir);
const allKeys = new Set();

console.log('Extracting translation keys from all TypeScript files...\n');

allFiles.forEach(filePath => {
  const keys = extractKeysFromFile(filePath);
  if (keys.length > 0) {
    console.log(`${filePath}: ${keys.length} keys`);
    keys.forEach(key => allKeys.add(key));
  }
});

// Sort and output results
const sortedKeys = Array.from(allKeys).sort();

console.log(`\n=== TOTAL UNIQUE KEYS: ${sortedKeys.length} ===\n`);

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
  groupedByPrefix: groupedKeys
};

fs.writeFileSync(path.join(__dirname, 'all-translation-keys.json'), JSON.stringify(output, null, 2));
console.log(`\nSaved to: all-translation-keys.json`);
