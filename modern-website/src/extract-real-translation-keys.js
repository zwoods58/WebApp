const fs = require('fs');
const path = require('path');

// Function to extract ONLY real translation keys from a file
function extractRealKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();
  
  // More precise regex for t('key') calls
  // This excludes imports, exports, console logs, etc.
  const patterns = [
    // t('key') pattern in JSX/TSX
    /t\(\s*['"`]([^'"`\s]+)['"`]\s*(?:,\s*['"`][^'"`]*['"`])?\)/g,
    // {t('key')} pattern 
    /\{[^}]*t\(\s*['"`]([^'"`\s]+)['"`]/g
  ];
  
  patterns.forEach(regex => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const key = match[1];
      // Filter out obvious non-keys
      if (
        !key.includes('\n') &&           // No newlines
        !key.includes('import') &&       // Not import paths
        !key.includes('export') &&       // Not export paths  
        !key.includes('console') &&      // Not console logs
        !key.includes('return') &&       // Not return statements
        !key.includes('function') &&     // Not function definitions
        !key.includes('class') &&        // Not class definitions
        !key.includes('const') &&        // Not const declarations
        !key.includes('let') &&          // Not let declarations
        !key.includes('var') &&          // Not var declarations
        !key.includes('if') &&           // Not if statements
        !key.includes('for') &&          // Not for loops
        !key.includes('while') &&        // Not while loops
        !key.includes('switch') &&       // Not switch statements
        !key.includes('case') &&         // Not case statements
        !key.includes('default') &&      // Not default statements
        !key.includes('break') &&        // Not break statements
        !key.includes('continue') &&     // Not continue statements
        !key.includes('try') &&          // Not try statements
        !key.includes('catch') &&        // Not catch statements
        !key.includes('finally') &&      // Not finally statements
        !key.includes('throw') &&        // Not throw statements
        !key.includes('new') &&          // Not new expressions
        !key.includes('typeof') &&       // Not typeof expressions
        !key.includes('instanceof') &&  // Not instanceof expressions
        !key.includes('void') &&        // Not void expressions
        !key.includes('delete') &&      // Not delete expressions
        !key.includes('in') &&          // Not in expressions
        !key.includes('await') &&        // Not await expressions
        !key.includes('yield') &&       // Not yield expressions
        !key.includes('async') &&       // Not async keywords
        !key.includes('=>') &&           // Not arrow functions
        !key.includes('{') &&            // Not object literals
        !key.includes('}') &&           // Not object literals
        !key.includes('[') &&            // Not array literals
        !key.includes(']') &&           // Not array literals
        !key.includes('(') &&           // Not parentheses
        !key.includes(')') &&           // Not parentheses
        !key.includes(';') &&           // Not semicolons
        !key.includes(',') &&           // Not commas
        !key.includes('.') &&            // Not dots (unless it's a proper key)
        !key.includes('/') &&           // Not paths
        !key.includes('\\') &&          // Not paths
        !key.includes('@') &&           // Not decorators/imports
        !key.includes('#') &&           // Not private fields
        !key.includes('$') &&           // Not template vars
        !key.includes('%') &&           // Not modulo
        !key.includes('^') &&           // Not xor
        !key.includes('&') &&           // Not bitwise and
        !key.includes('|') &&           // Not bitwise or
        !key.includes('!') &&           // Not not
        !key.includes('~') &&           // Not bitwise not
        !key.includes('<') &&           // Not less than
        !key.includes('>') &&           // Not greater than
        !key.includes('=') &&           // Not assignment
        !key.includes('+') &&           // Not plus (unless in key)
        !key.includes('*') &&           // Not multiply
        !key.includes('?') &&           // Not ternary
        !key.includes(':') &&           // Not colon (unless in key)
        !key.match(/^[A-Z_]+$/) &&      // Not all caps constants
        key.length > 1 &&               // Not single character
        key.length < 100 &&             // Not extremely long
        key.match(/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)*$/) // Valid key format
      ) {
        keys.add(key);
      }
    }
  });
  
  return Array.from(keys);
}

// Function to get all TypeScript/TSX files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.') && file !== '.next') {
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

console.log('Extracting REAL translation keys from all TypeScript files...\n');

allFiles.forEach(filePath => {
  const keys = extractRealKeysFromFile(filePath);
  if (keys.length > 0) {
    console.log(`${filePath}: ${keys.length} keys`);
    keys.forEach(key => allKeys.add(key));
  }
});

// Sort and output results
const sortedKeys = Array.from(allKeys).sort();

console.log(`\n=== TOTAL REAL KEYS: ${sortedKeys.length} ===\n`);

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

fs.writeFileSync(path.join(__dirname, 'real-translation-keys.json'), JSON.stringify(output, null, 2));
console.log(`\nSaved to: real-translation-keys.json`);
