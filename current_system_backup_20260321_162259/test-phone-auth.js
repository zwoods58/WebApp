// Test script to verify phone authentication works
// This would be run in the browser console

// Test with existing phone numbers from database
const testPhones = [
  '+254712345678', // Kenya - Test Business
  '+254342946954', // Kenya - Test Business  
  '+254123456789'  // Kenya - Test Business
];

// Test phone validation function
function validatePhone(phone) {
  const SUPPORTED_COUNTRIES = {
    ke: { code: '+254', name: 'Kenya', digits: 9, total: 12 },
    za: { code: '+27', name: 'South Africa', digits: 9, total: 11 },
    ng: { code: '+234', name: 'Nigeria', digits: 10, total: 13 },
    gh: { code: '+233', name: 'Ghana', digits: 9, total: 12 },
    ug: { code: '+256', name: 'Uganda', digits: 9, total: 12 },
    rw: { code: '+250', name: 'Rwanda', digits: 9, total: 12 },
    tz: { code: '+255', name: 'Tanzania', digits: 9, total: 12 }
  };

  for (const [key, config] of Object.entries(SUPPORTED_COUNTRIES)) {
    const regex = new RegExp(`^${config.code}\\d{${config.digits}}$`);
    if (regex.test(phone)) {
      return { valid: true, country: key };
    }
  }
  return { valid: false };
}

// Test validation
console.log('Testing phone validation:');
testPhones.forEach(phone => {
  const result = validatePhone(phone);
  console.log(`${phone}: ${result.valid ? '✅ Valid' : '❌ Invalid'} (${result.country})`);
});

// Test invalid phones
const invalidPhones = [
  '07123456789',    // Missing +
  '+123456789',     // Unsupported country
  '+254123',        // Too short
  '+2541234567890'  // Too long
];

console.log('\nTesting invalid phones:');
invalidPhones.forEach(phone => {
  const result = validatePhone(phone);
  console.log(`${phone}: ${result.valid ? '✅ Valid' : '❌ Invalid'} (${result.country})`);
});
