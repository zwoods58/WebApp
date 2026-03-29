// Test script to verify phone number formatting
// Run this in browser console to test different phone formats

// Import the formatting function (copy from phoneUtils.ts for testing)
function formatPhoneNumber(phone) {
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  if (cleanPhone.startsWith('+')) {
    const supportedFormats = [
      { code: '+254', digits: 9 },  // Kenya
      { code: '+27', digits: 9 },   // South Africa  
      { code: '+234', digits: 10 }, // Nigeria
      { code: '+233', digits: 9 },  // Ghana
      { code: '+256', digits: 9 },  // Uganda
      { code: '+250', digits: 9 },  // Rwanda
      { code: '+255', digits: 9 }   // Tanzania
    ];
    
    for (const format of supportedFormats) {
      if (cleanPhone.startsWith(format.code)) {
        const digitsAfterCode = cleanPhone.substring(format.code.length);
        if (digitsAfterCode.length === format.digits) {
          return cleanPhone;
        }
      }
    }
  }
  
  if (!cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.replace(/^0+/, '');
    
    // Nigeria examples
    if (cleanPhone.startsWith('234') && cleanPhone.length === 13) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      return '+234' + cleanPhone;
    }
    
    // Kenya examples
    if (cleanPhone.startsWith('254') && cleanPhone.length === 12) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.length === 9 && cleanPhone.startsWith('1')) {
      return '+254' + cleanPhone;
    }
    
    // Default to Kenya if no clear match and length is 9
    if (cleanPhone.length === 9) {
      return '+254' + cleanPhone;
    }
  }
  
  return phone;
}

// Test cases
console.log('🧪 Testing phone number formatting...');

const testCases = [
  '+234567123321', // Your example - Nigeria
  '234567123321',  // Nigeria without +
  '0712345678',    // Kenya local format
  '+254712345678', // Kenya international
  '0761234567',    // Uganda local format
  '+256712345678', // Uganda international
  '08012345678',   // Nigeria local format
  '+2348012345678', // Nigeria international
  '0612345678',    // South Africa local format
  '+27612345678',  // South Africa international
];

testCases.forEach(phone => {
  const formatted = formatPhoneNumber(phone);
  console.log(`Input: ${phone} -> Output: ${formatted}`);
});

console.log('✅ Phone formatting test complete');
console.log('Expected: +234567123321 should remain unchanged');
console.log('Expected: 234567123321 should become +234567123321');
console.log('Expected: 0712345678 should become +254712345678');
