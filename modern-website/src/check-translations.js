// Direct check of the universal translations file
console.log('Checking universal translations file directly...');

// Read the file content
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'universal-translations.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Count the number of keys
const keyMatches = content.match(/"[^"]+":\s*{/g);
console.log(`Found ${keyMatches ? keyMatches.length : 0} translation keys in the file`);

// Check for specific keys
const specificKeys = [
  'credit.no_customers',
  'credit.add_first',
  'appointments.no_upcoming',
  'services.no_services',
  'inventory.no_items'
];

specificKeys.forEach(key => {
  const exists = content.includes(`"${key}":`);
  console.log(`${key}: ${exists ? 'EXISTS' : 'MISSING'}`);
});

// Check the structure
const hasUniversalObject = content.includes('export const translations = {') && content.includes('universal: {');
console.log(`Has proper structure: ${hasUniversalObject}`);

// Check the end of the file
const lines = content.split('\n');
const lastLines = lines.slice(-5);
console.log('Last 5 lines:', lastLines);
