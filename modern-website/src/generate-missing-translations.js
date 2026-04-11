const fs = require('fs');
const path = require('path');

// Load existing translations
const universalTranslations = require('./universal-translations.ts').default;
const essentialTranslations = require('./translations/essential-translations.ts');
const industryTranslations = require('./translations/industry-translations.ts');

// Load clean keys
const cleanKeysData = require('./clean-translation-keys.json');
const allKeys = cleanKeysData.keys;

// Languages to support
const languages = ['en', 'sw', 'ha', 'yo', 'ig', 'zu', 'xh', 'af', 'tw', 'rw', 'lg', 'fr', 'dy'];

// Function to check if key exists in any translation file
function keyExists(key) {
  // Check universal
  if (universalTranslations.universal && universalTranslations.universal[key]) {
    return true;
  }
  
  // Check essential
  if (essentialTranslations[key]) {
    return true;
  }
  
  // Check industry sections
  const industryPrefix = key.split('.')[0];
  if (industryTranslations[industryPrefix] && industryTranslations[industryPrefix][key]) {
    return true;
  }
  
  return false;
}

// Function to generate English text from key name
function generateEnglishText(key) {
  // Convert key to readable text
  return key
    .split('.')
    .map(part => part.replace(/_/g, ' '))
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' - ');
}

// Generate missing translations
const missingKeys = [];
const missingTranslations = {};

console.log('Analyzing missing translations...\n');

allKeys.forEach(key => {
  if (!keyExists(key)) {
    missingKeys.push(key);
    
    // Generate translation object
    const translationObj = {};
    languages.forEach(lang => {
      if (lang === 'en') {
        translationObj[lang] = generateEnglishText(key);
      } else {
        translationObj[lang] = `[${lang.toUpperCase()}] ${generateEnglishText(key)}`;
      }
    });
    
    missingTranslations[key] = translationObj;
  }
});

console.log(`Found ${missingKeys.length} missing translations out of ${allKeys.length} total keys`);

// Group missing keys by prefix
const groupedMissing = {};
missingKeys.forEach(key => {
  const prefix = key.split('.')[0] || 'other';
  if (!groupedMissing[prefix]) groupedMissing[prefix] = [];
  groupedMissing[prefix].push(key);
});

console.log('\nMissing keys by category:');
Object.keys(groupedMissing).sort().forEach(prefix => {
  console.log(`\n${prefix.toUpperCase()} (${groupedMissing[prefix].length} keys):`);
  groupedMissing[prefix].forEach(key => console.log(`  - ${key}`));
});

// Generate template file
const template = {
  metadata: {
    totalKeys: allKeys.length,
    existingKeys: allKeys.length - missingKeys.length,
    missingKeys: missingKeys.length,
    generatedAt: new Date().toISOString(),
    languages: languages
  },
  missingTranslations: missingTranslations,
  groupedMissing: groupedMissing
};

fs.writeFileSync(path.join(__dirname, 'missing-translations-template.json'), JSON.stringify(template, null, 2));
console.log(`\nTemplate saved to: missing-translations-template.json`);

// Generate a simple universal translations addition file
const universalAdditions = {};
missingKeys.forEach(key => {
  universalAdditions[key] = missingTranslations[key];
});

const universalTemplate = {
  // Add these to your universal-translations.ts file
  additions: universalAdditions,
  // Instructions:
  // 1. Copy the additions object content
  // 2. Paste it into the universal section of universal-translations.ts
  // 3. Replace placeholder translations with actual translations
  // 4. Remove this file
};

fs.writeFileSync(path.join(__dirname, 'universal-additions-template.json'), JSON.stringify(universalTemplate, null, 2));
console.log(`Universal additions template saved to: universal-additions-template.json`);
