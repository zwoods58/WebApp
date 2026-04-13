// Test script for mobile money configuration
// Run with: node test-mobile-money-config.js

const { 
  isMobileMoneyCountry, 
  getMobileMoneyConfig, 
  getMobileMoneyProviders, 
  getDefaultProvider,
  getWeeklyAmount,
  getPlanCode,
  getPaymentMethod,
  getPaymentChannels
} = require('./src/lib/mobile-money-config.ts');

console.log('=== Mobile Money Configuration Test ===\n');

// Test Kenya
console.log('1. Testing Kenya (KE):');
console.log(`   isMobileMoneyCountry: ${isMobileMoneyCountry('KE')}`);
console.log(`   getPaymentMethod: ${getPaymentMethod('KE')}`);
console.log(`   getWeeklyAmount: ${getWeeklyAmount('KE')} KES`);
console.log(`   getPlanCode: ${getPlanCode('KE')}`);
console.log(`   getPaymentChannels: ${JSON.stringify(getPaymentChannels('KE'))}`);

const kenyaConfig = getMobileMoneyConfig('KE');
if (kenyaConfig) {
  console.log(`   Country: ${kenyaConfig.name}`);
  console.log(`   Currency: ${kenyaConfig.currency}`);
  console.log(`   Providers: ${kenyaConfig.providers.length}`);
  const defaultProvider = getDefaultProvider('KE');
  if (defaultProvider) {
    console.log(`   Default Provider: ${defaultProvider.name} (${defaultProvider.code})`);
  }
}

// Test Ghana
console.log('\n2. Testing Ghana (GH):');
console.log(`   isMobileMoneyCountry: ${isMobileMoneyCountry('GH')}`);
console.log(`   getPaymentMethod: ${getPaymentMethod('GH')}`);
console.log(`   getWeeklyAmount: ${getWeeklyAmount('GH')} GHS`);
console.log(`   getPlanCode: ${getPlanCode('GH')}`);
console.log(`   getPaymentChannels: ${JSON.stringify(getPaymentChannels('GH'))}`);

const ghanaConfig = getMobileMoneyConfig('GH');
if (ghanaConfig) {
  console.log(`   Country: ${ghanaConfig.name}`);
  console.log(`   Currency: ${ghanaConfig.currency}`);
  console.log(`   Providers: ${ghanaConfig.providers.length}`);
  const defaultProvider = getDefaultProvider('GH');
  if (defaultProvider) {
    console.log(`   Default Provider: ${defaultProvider.name} (${defaultProvider.code})`);
  }
}

// Test Côte d'Ivoire
console.log('\n3. Testing Côte d\'Ivoire (CI):');
console.log(`   isMobileMoneyCountry: ${isMobileMoneyCountry('CI')}`);
console.log(`   getPaymentMethod: ${getPaymentMethod('CI')}`);
console.log(`   getWeeklyAmount: ${getWeeklyAmount('CI')} XOF`);
console.log(`   getPlanCode: ${getPlanCode('CI')}`);
console.log(`   getPaymentChannels: ${JSON.stringify(getPaymentChannels('CI'))}`);

const ciConfig = getMobileMoneyConfig('CI');
if (ciConfig) {
  console.log(`   Country: ${ciConfig.name}`);
  console.log(`   Currency: ${ciConfig.currency}`);
  console.log(`   Providers: ${ciConfig.providers.length}`);
  const defaultProvider = getDefaultProvider('CI');
  if (defaultProvider) {
    console.log(`   Default Provider: ${defaultProvider.name} (${defaultProvider.code})`);
  }
}

// Test Nigeria (non-mobile money country)
console.log('\n4. Testing Nigeria (NG) - Non-mobile money:');
console.log(`   isMobileMoneyCountry: ${isMobileMoneyCountry('NG')}`);
console.log(`   getPaymentMethod: ${getPaymentMethod('NG')}`);
console.log(`   getPaymentChannels: ${JSON.stringify(getPaymentChannels('NG'))}`);
console.log(`   getMobileMoneyConfig: ${getMobileMoneyConfig('NG') || 'null'}`);

// Test invalid country
console.log('\n5. Testing Invalid Country (XX):');
console.log(`   isMobileMoneyCountry: ${isMobileMoneyCountry('XX')}`);
console.log(`   getPaymentMethod: ${getPaymentMethod('XX')}`);
console.log(`   getPaymentChannels: ${JSON.stringify(getPaymentChannels('XX'))}`);
console.log(`   getMobileMoneyConfig: ${getMobileMoneyConfig('XX') || 'null'}`);

console.log('\n=== Test Complete ===');
