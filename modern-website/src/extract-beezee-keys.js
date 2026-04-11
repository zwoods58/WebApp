const fs = require('fs');
const path = require('path');

// Extract translation keys ONLY from BeeZee app components
function extractBeeZeeKeys() {
  const beezeeDir = path.join(__dirname, 'app', 'Beezee-App');
  const keys = new Set();
  
  function getAllFiles(dir, fileList = []) {
    try {
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
    } catch (error) {
      // Directory might not exist or be inaccessible
    }
    
    return fileList;
  }
  
  function extractKeysFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Find t('key') calls specifically in BeeZee components
      const patterns = [
        /t\(\s*['"`]([^'"`\s]+)['"`]\s*(?:,\s*['"`][^'"`]*['"`])?\)/g,
        /\{[^}]*t\(\s*['"`]([^'"`\s]+)['"`]/g
      ];
      
      patterns.forEach(regex => {
        let match;
        while ((match = regex.exec(content)) !== null) {
          const key = match[1];
          // Filter for actual translation keys
          if (
            key &&
            !key.includes('\n') &&
            !key.includes('import') &&
            !key.includes('export') &&
            !key.includes('console') &&
            !key.includes('return') &&
            !key.includes('function') &&
            !key.includes('class') &&
            !key.includes('const') &&
            !key.includes('let') &&
            !key.includes('var') &&
            key.length > 1 &&
            key.length < 100 &&
            key.match(/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)*$/)
          ) {
            keys.add(key);
          }
        }
      });
    } catch (error) {
      // File might not be readable
    }
  }
  
  const files = getAllFiles(beezeeDir);
  console.log(`Scanning ${files.length} BeeZee files...`);
  
  files.forEach(filePath => {
    const beforeCount = keys.size;
    extractKeysFromFile(filePath);
    if (keys.size > beforeCount) {
      console.log(`${filePath}: ${keys.size - beforeCount} keys`);
    }
  });
  
  return Array.from(keys).sort();
}

// Extract universal translation keys properly
function extractUniversalKeys() {
  try {
    const content = fs.readFileSync(path.join(__dirname, 'universal-translations.ts'), 'utf8');
    const keys = [];
    
    // Find all keys in the universal section
    const universalSectionMatch = content.match(/universal:\s*\{([\s\S]*?)\n\s*\},?\s*(?:industry|\/\/)/);
    if (universalSectionMatch) {
      const universalContent = universalSectionMatch[1];
      
      // Match "key": { pattern
      const keyMatches = universalContent.match(/["']([^"']+)["']:\s*\{/g);
      if (keyMatches) {
        keyMatches.forEach(match => {
          const key = match.match(/["']([^"']+)["']/)[1];
          keys.push(key);
        });
      }
    }
    
    return keys.sort();
  } catch (error) {
    console.error('Error reading universal translations:', error);
    return [];
  }
}

// Main analysis
console.log('=== BEEZEE TRANSLATION KEY ANALYSIS ===\n');

const beezeeKeys = extractBeeZeeKeys();
const universalKeys = extractUniversalKeys();

console.log(`\nBeeZee components use: ${beezeeKeys.length} keys`);
console.log(`Universal translations have: ${universalKeys.length} keys`);

// Find missing keys
const missingKeys = beezeeKeys.filter(key => !universalKeys.includes(key));
const existingKeys = beezeeKeys.filter(key => universalKeys.includes(key));

console.log(`\n=== MISSING KEYS (${missingKeys.length}) ===`);
if (missingKeys.length > 0) {
  missingKeys.forEach(key => console.log(`  - ${key}`));
} else {
  console.log('None! All BeeZee keys exist in universal translations.');
}

console.log(`\n=== EXISTING KEYS (${existingKeys.length}) ===`);
if (existingKeys.length > 0) {
  existingKeys.slice(0, 10).forEach(key => console.log(`  - ${key}`));
  if (existingKeys.length > 10) {
    console.log(`  ... and ${existingKeys.length - 10} more`);
  }
} else {
  console.log('No BeeZee keys found in universal translations!');
}

// Save results
const results = {
  beezeeKeys,
  universalKeys,
  missingKeys,
  existingKeys
};

fs.writeFileSync(path.join(__dirname, 'beezee-translation-analysis.json'), JSON.stringify(results, null, 2));
console.log(`\nResults saved to: beezee-translation-analysis.json`);
