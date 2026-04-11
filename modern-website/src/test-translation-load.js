// Test if translations are loading correctly
console.log('Testing translation loading...');

try {
  // Test import
  const universalTranslations = require('./universal-translations.ts').default;
  console.log('universal-translations imported successfully');
  
  // Check structure
  console.log('Has universal property:', 'universal' in universalTranslations);
  console.log('Universal keys count:', Object.keys(universalTranslations.universal || {}).length);
  
  // Check for specific keys
  const testKeys = [
    'credit.no_customers',
    'credit.add_first',
    'appointments.no_upcoming',
    'services.no_services',
    'inventory.no_items'
  ];
  
  testKeys.forEach(key => {
    const exists = universalTranslations.universal && universalTranslations.universal[key];
    console.log(`Key ${key}: ${exists ? 'EXISTS' : 'MISSING'}`);
    if (exists) {
      console.log(`  English: ${universalTranslations.universal[key].en}`);
    }
  });
  
  // Test smart translation
  const smartTranslate = require('./translations/smart-translation.ts').default;
  console.log('\nTesting smartTranslate function...');
  
  testKeys.forEach(key => {
    const result = smartTranslate(key, 'en', 'retail');
    console.log(`${key} -> "${result}"`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}
