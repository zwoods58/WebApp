// Test if the import works correctly
console.log('Testing import...');

try {
  // This should work in the Next.js environment
  const universalTranslations = require('./universal-translations.json');
  console.log('Import successful!');
  console.log('Universal object exists:', !!universalTranslations.universal);
  console.log('Keys count:', Object.keys(universalTranslations.universal || {}).length);
  
  // Test specific keys
  const testKey = 'credit.no_customers';
  const translation = universalTranslations.universal[testKey];
  console.log(`${testKey}:`, translation ? translation.en : 'NOT FOUND');
  
} catch (error) {
  console.error('Import failed:', error.message);
}
