// Quick test to check if translations are working
const fs = require('fs');
const path = require('path');

// Test a few specific keys
const testKeys = [
  'services.title',
  'services.services_tab', 
  'services.inventory_tab',
  'services.no_services',
  'services.add_first',
  'credit.customer_name',
  'credit.cancel',
  'nav.home',
  'payment.cash'
];

console.log('=== QUICK TRANSLATION KEY TEST ===\n');

// Read universal translations
try {
  const content = fs.readFileSync(path.join(__dirname, 'universal-translations.ts'), 'utf8');
  
  testKeys.forEach(key => {
    // Look for the key in the file
    const regex = new RegExp(`["']${key}["']:\\s*\\{`, 'g');
    const match = content.match(regex);
    
    if (match) {
      console.log(`\u2705 ${key}: FOUND`);
      
      // Extract the English translation
      const keySection = content.substring(content.indexOf(match[0]));
      const enMatch = keySection.match(/en:\s*["']([^"']+)["']/);
      if (enMatch) {
        console.log(`   English: "${enMatch[1]}"`);
      }
      
      // Extract the Swahili translation
      const swMatch = keySection.match(/sw:\s*["']([^"']+)["']/);
      if (swMatch) {
        console.log(`   Swahili: "${swMatch[1]}"`);
      }
    } else {
      console.log(`\u274c ${key}: NOT FOUND`);
    }
  });
  
} catch (error) {
  console.error('Error reading translations:', error.message);
}

console.log('\n=== RECOMMENDATION ===');
console.log('If keys show as FOUND above, then:');
console.log('1. Your translation files are correct');
console.log('2. The issue is likely with LanguageProvider or component usage');
console.log('3. Add the TranslationDebugTest component to test in browser');
