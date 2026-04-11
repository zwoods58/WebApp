const fs = require('fs');
const path = require('path');

// Load existing translations
const universalTranslations = require('./universal-translations.ts').default;
const cleanKeysData = require('./clean-translation-keys.json');
const allKeys = cleanKeysData.keys;

console.log('=== QUICK TRANSLATION DIAGNOSTIC ===\n');

// Check universal section
const universalKeys = Object.keys(universalTranslations.universal || {});
console.log(`Universal translations available: ${universalKeys.length}`);

// Test specific keys that components are calling
const testKeys = [
  'common.save',           // Should exist
  'services.title',        // Should exist  
  'appointments.title',    // Should exist
  'pwa.install_title',     // MISSING - this is the problem!
  'pwa.add_to_home',       // MISSING - this is the problem!
  'settings.title',        // Should exist
  'reports.title',         // Should exist
  'tour.welcome_title',    // Should exist
];

console.log('\n=== TESTING SPECIFIC KEYS ===');
testKeys.forEach(key => {
  const exists = universalKeys.includes(key);
  const status = exists ? 'FOUND' : 'MISSING';
  console.log(`${key}: ${status}`);
  
  if (exists) {
    const translation = universalTranslations.universal[key];
    console.log(`  en: "${translation.en}", sw: "${translation.sw}"`);
  }
});

// Count missing keys
const missingKeys = allKeys.filter(key => !universalKeys.includes(key));
console.log(`\n=== SUMMARY ===`);
console.log(`Total keys used in components: ${allKeys.length}`);
console.log(`Keys available in universal: ${universalKeys.length}`);
console.log(`Missing keys: ${missingKeys.length}`);
console.log(`Coverage: ${((universalKeys.length / allKeys.length) * 100).toFixed(1)}%`);

if (missingKeys.length > 0) {
  console.log(`\n=== TOP 10 MISSING KEYS ===`);
  missingKeys.slice(0, 10).forEach(key => {
    console.log(`- ${key}`);
  });
  
  console.log(`\n=== MISSING KEYS BY PREFIX ===`);
  const groupedMissing = {};
  missingKeys.forEach(key => {
    const prefix = key.split('.')[0] || 'other';
    if (!groupedMissing[prefix]) groupedMissing[prefix] = [];
    groupedMissing[prefix].push(key);
  });
  
  Object.keys(groupedMissing).sort().forEach(prefix => {
    console.log(`\n${prefix.toUpperCase()} (${groupedMissing[prefix].length} keys):`);
    groupedMissing[prefix].slice(0, 5).forEach(key => console.log(`  - ${key}`));
    if (groupedMissing[prefix].length > 5) {
      console.log(`  ... and ${groupedMissing[prefix].length - 5} more`);
    }
  });
}
