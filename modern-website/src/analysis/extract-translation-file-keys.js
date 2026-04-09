// Translation File Keys Extraction Script
const fs = require('fs');
const path = require('path');

// Function to extract all keys from translations-new.ts
function extractKeysFromTranslationFile() {
  const translationFile = path.join(__dirname, '..', 'translations-new.ts');
  const content = fs.readFileSync(translationFile, 'utf8');
  
  const allKeys = new Map();
  
  // Parse the translations object structure
  // This is a simplified parser - for a complete solution, we'd need a proper AST parser
  
  // Extract universal keys
  const universalMatch = content.match(/universal:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*\/\s*===/);
  if (universalMatch) {
    const universalContent = universalMatch[1];
    extractKeysFromSection(universalContent, 'universal', allKeys);
  }
  
  // Extract industry-specific keys
  const industries = ['retail', 'food', 'transport', 'tailor', 'repairs', 'salon', 'freelance'];
  
  for (const industry of industries) {
    const industryPattern = new RegExp(`${industry}:\\s*\\{([\\s\\S]*?)\\n\\s*\\},?\\s*(?:\\n\\s*\\/\\s*===|$)`);
    const industryMatch = content.match(industryPattern);
    
    if (industryMatch) {
      const industryContent = industryMatch[1];
      extractKeysFromSection(industryContent, industry, allKeys);
    }
  }
  
  return allKeys;
}

// Function to extract keys from a section content
function extractKeysFromSection(content, sectionName, allKeys) {
  // Match key patterns like "key.name": { or "key.name": "value"
  const keyPattern = /["']([^"']+)["']:\s*(\{[\s\S]*?\}|"[^"]*")/g;
  let match;
  
  while ((match = keyPattern.exec(content)) !== null) {
    const fullKey = `${sectionName}.${match[1]}`;
    const value = match[2];
    
    // Check if it's an object (nested translations) or a simple string
    const isObject = value.startsWith('{');
    
    if (isObject) {
      // Extract nested keys
      const nestedPattern = /["']([^"']+)["']:\s*["']([^"']*)["']/g;
      let nestedMatch;
      
      while ((nestedMatch = nestedPattern.exec(value)) !== null) {
        const nestedKey = `${fullKey}.${nestedMatch[1]}`;
        const nestedValue = nestedMatch[2];
        
        allKeys.set(nestedKey, {
          section: sectionName,
          category: match[1],
          key: nestedMatch[1],
          fullKey: nestedKey,
          value: nestedValue,
          isObject: false
        });
      }
    } else {
      // Simple string value
      const cleanValue = value.replace(/["']/g, '');
      allKeys.set(fullKey, {
        section: sectionName,
        category: match[1],
        key: match[1],
        fullKey: fullKey,
        value: cleanValue,
        isObject: false
      });
    }
  }
}

// Function to find duplicate keys
function findDuplicates(allKeys) {
  const duplicates = new Map();
  
  for (const [key, info] of allKeys) {
    // Extract the base key without section
    const parts = key.split('.');
    if (parts.length >= 2) {
      const baseKey = parts.slice(1).join('.');
      
      if (!duplicates.has(baseKey)) {
        duplicates.set(baseKey, []);
      }
      
      duplicates.get(baseKey).push({
        fullKey: key,
        section: parts[0],
        info: info
      });
    }
  }
  
  // Filter to only show actual duplicates (appears in multiple sections)
  const actualDuplicates = new Map();
  for (const [baseKey, occurrences] of duplicates) {
    if (occurrences.length > 1) {
      actualDuplicates.set(baseKey, occurrences);
    }
  }
  
  return actualDuplicates;
}

// Main analysis function
function analyzeTranslationFile() {
  console.log('Extracting keys from translation file...');
  const allKeys = extractKeysFromTranslationFile();
  
  console.log(`Found ${allKeys.size} total keys in translation file`);
  
  // Find duplicates
  const duplicates = findDuplicates(allKeys);
  console.log(`Found ${duplicates.size} duplicate key groups`);
  
  // Generate reports
  const report = {
    summary: {
      totalKeys: allKeys.size,
      duplicateGroups: duplicates.size,
      sections: {
        universal: 0,
        retail: 0,
        food: 0,
        transport: 0,
        tailor: 0,
        repairs: 0,
        salon: 0,
        freelance: 0
      }
    },
    allKeys: Object.fromEntries(allKeys),
    duplicates: Object.fromEntries(duplicates)
  };
  
  // Count keys by section
  for (const [key, info] of allKeys) {
    if (report.summary.sections[info.section] !== undefined) {
      report.summary.sections[info.section]++;
    }
  }
  
  // Save reports
  const outputDir = path.join(__dirname, '..', 'analysis-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'translation-file-analysis.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Generate duplicate analysis text file
  let duplicateReport = `Duplicate Translation Keys Analysis
=========================================
Total Duplicate Groups: ${duplicates.size}

Duplicate Key Groups:
===================
`;
  
  for (const [baseKey, occurrences] of duplicates) {
    duplicateReport += `\n${baseKey}:\n`;
    for (const occ of occurrences) {
      duplicateReport += `  - ${occ.fullKey} (${occ.section})\n`;
    }
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'duplicate-keys-analysis.txt'),
    duplicateReport
  );
  
  console.log(`Translation file analysis complete!`);
  console.log(`Reports saved to: ${outputDir}`);
  console.log(`- translation-file-analysis.json (detailed JSON)`);
  console.log(`- duplicate-keys-analysis.txt (duplicates report)`);
  
  return report;
}

// Run the analysis
if (require.main === module) {
  analyzeTranslationFile();
}

module.exports = { analyzeTranslationFile, extractKeysFromTranslationFile, findDuplicates };
