const fs = require('fs');
const path = require('path');

// Read the universal translations file
function readUniversalTranslations() {
  try {
    const content = fs.readFileSync(path.join(__dirname, 'universal-translations.ts'), 'utf8');
    // Extract the universal section
    const universalMatch = content.match(/universal:\s*\{([\s\S]*?)\n\s*\},?\s*(?:industry|\/\/)/);
    if (universalMatch) {
      const universalSection = universalMatch[1];
      // Extract all keys from universal section
      const keyRegex = /["']([^"']+)["']:\s*\{/g;
      const keys = [];
      let match;
      while ((match = keyRegex.exec(universalSection)) !== null) {
        keys.push(match[1]);
      }
      return keys;
    }
  } catch (error) {
    console.error('Error reading universal translations:', error);
  }
  return [];
}

// Read the actual translation keys used in components
function getUsedTranslationKeys() {
  try {
    const content = fs.readFileSync(path.join(__dirname, 'real-translation-keys.json'), 'utf8');
    const data = JSON.parse(content);
    return data.keys;
  } catch (error) {
    console.error('Error reading used translation keys:', error);
    return [];
  }
}

// Find missing keys
function findMissingKeys() {
  const universalKeys = readUniversalTranslations();
  const usedKeys = getUsedTranslationKeys();
  
  console.log(`\n=== TRANSLATION DIAGNOSTIC REPORT ===\n`);
  console.log(`Universal translations available: ${universalKeys.length}`);
  console.log(`Keys used in components: ${usedKeys.length}`);
  
  // Find used keys that are NOT in universal translations
  const missingKeys = usedKeys.filter(key => !universalKeys.includes(key));
  
  if (missingKeys.length > 0) {
    console.log(`\n\n=== MISSING KEYS (${missingKeys.length}) ===`);
    console.log('These keys are used in components but NOT found in universal translations:');
    missingKeys.forEach(key => console.log(`  - ${key}`));
  } else {
    console.log('\n\n=== GOOD NEWS! ===');
    console.log('All used translation keys exist in universal translations!');
  }
  
  // Find universal keys that are never used
  const unusedKeys = universalKeys.filter(key => !usedKeys.includes(key));
  if (unusedKeys.length > 0) {
    console.log(`\n\n=== UNUSED KEYS (${unusedKeys.length}) ===`);
    console.log('These keys exist in translations but are never used in components:');
    unusedKeys.slice(0, 20).forEach(key => console.log(`  - ${key}`));
    if (unusedKeys.length > 20) {
      console.log(`  ... and ${unusedKeys.length - 20} more`);
    }
  }
  
  return {
    universalKeys,
    usedKeys,
    missingKeys,
    unusedKeys
  };
}

// Test specific problematic keys that are commonly used
function testCommonKeys() {
  console.log(`\n\n=== TESTING COMMON KEYS ===`);
  
  const commonKeys = [
    'services.title',
    'services.services_tab',
    'services.inventory_tab',
    'common.save',
    'common.cancel',
    'common.delete',
    'payment.cash',
    'nav.home'
  ];
  
  const universalKeys = readUniversalTranslations();
  
  commonKeys.forEach(key => {
    const exists = universalKeys.includes(key);
    console.log(`  ${key}: ${exists ? 'EXISTS' : 'MISSING'}`);
  });
}

// Main diagnostic
console.log('Running comprehensive translation diagnostic...\n');

const results = findMissingKeys();
testCommonKeys();

console.log(`\n\n=== RECOMMENDATIONS ===`);

if (results.missingKeys.length > 0) {
  console.log('1. Add missing keys to universal-translations.ts');
  console.log('2. Check if components are using correct key format');
  console.log('3. Verify LanguageProvider is wrapping components');
} else {
  console.log('1. Translation files look good!');
  console.log('2. Issue might be with LanguageProvider setup');
  console.log('3. Check if components are properly using useLanguage hook');
}

console.log('\n=== NEXT STEPS ===');
console.log('1. Add TranslationDebugTest component to a page');
console.log('2. Check browser console for translation debug logs');
console.log('3. Test language switching functionality');
console.log('4. Verify currentLanguage changes when switching languages');
