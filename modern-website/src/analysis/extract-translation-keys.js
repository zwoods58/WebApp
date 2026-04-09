// Translation Key Extraction Script
const fs = require('fs');
const path = require('path');

// Function to extract translation keys from a file
function extractKeysFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const keys = [];
    
    // Match t('key', 'default') pattern
    const tCallPattern = /t\(\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]*)['"`]\s*\)/g;
    let match;
    
    while ((match = tCallPattern.exec(content)) !== null) {
      keys.push({
        key: match[1],
        default: match[2],
        file: path.basename(filePath)
      });
    }
    
    // Match t('key') pattern (no default)
    const tCallNoDefaultPattern = /t\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    
    while ((match = tCallNoDefaultPattern.exec(content)) !== null) {
      keys.push({
        key: match[1],
        default: null,
        file: path.basename(filePath)
      });
    }
    
    return keys;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Function to recursively find all TSX/TS files
function findFiles(dir, extensions = ['.tsx', '.ts']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main extraction function
function extractAllTranslationKeys() {
  const srcDir = path.join(__dirname, '..');
  const files = findFiles(srcDir);
  
  const allKeys = new Map();
  const keyUsage = new Map();
  
  console.log(`Scanning ${files.length} files for translation keys...`);
  
  for (const file of files) {
    const keys = extractKeysFromFile(file);
    
    for (const { key, default: defaultValue, file: fileName } of keys) {
      // Track all unique keys
      if (!allKeys.has(key)) {
        allKeys.set(key, {
          defaultValue,
          files: []
        });
      }
      
      allKeys.get(key).files.push(fileName);
      
      // Track usage by file
      if (!keyUsage.has(fileName)) {
        keyUsage.set(fileName, []);
      }
      keyUsage.get(fileName).push(key);
    }
  }
  
  // Generate reports
  const report = {
    summary: {
      totalKeys: allKeys.size,
      totalFiles: files.length,
      keysWithDefaults: Array.from(allKeys.values()).filter(k => k.defaultValue !== null).length,
      keysWithoutDefaults: Array.from(allKeys.values()).filter(k => k.defaultValue === null).length
    },
    allKeys: Object.fromEntries(allKeys),
    usageByFile: Object.fromEntries(keyUsage)
  };
  
  // Save reports
  const outputDir = path.join(__dirname, '..', 'analysis-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'translation-keys-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Generate a summary text file
  let summary = `Translation Key Analysis Report
=====================================
Total Unique Keys: ${report.summary.totalKeys}
Total Files Scanned: ${report.summary.totalFiles}
Keys with Defaults: ${report.summary.keysWithDefaults}
Keys without Defaults: ${report.summary.keysWithoutDefaults}

All Translation Keys:
====================
`;
  
  for (const [key, info] of allKeys) {
    summary += `\n${key}`;
    if (info.defaultValue) {
      summary += ` (default: "${info.defaultValue}")`;
    }
    summary += ` - Used in: ${info.files.join(', ')}`;
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'translation-keys-summary.txt'),
    summary
  );
  
  console.log(`Analysis complete! Reports saved to: ${outputDir}`);
  console.log(`- translation-keys-report.json (detailed JSON)`);
  console.log(`- translation-keys-summary.txt (human-readable)`);
  
  return report;
}

// Run the analysis
if (require.main === module) {
  extractAllTranslationKeys();
}

module.exports = { extractAllTranslationKeys, extractKeysFromFile, findFiles };
