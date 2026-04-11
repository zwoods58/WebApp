// Test script to verify all translation fixes are working
import fs from 'fs';
import path from 'path';

// Load the translation files
const universalTranslations = require('./universal-translations.ts').default;
const industryTranslations = require('./translations/industry-translations.ts').default;

console.log('=== Testing Translation Fixes ===\n');

// Test 1: Verify universal translations structure
console.log('1. Testing universal translations structure...');
try {
  if (!universalTranslations || !universalTranslations.universal) {
    throw new Error('Universal translations not properly structured');
  }
  console.log('   Universal translations: OK');
} catch (error) {
  console.error('   ERROR:', error.message);
}

// Test 2: Check MoneyInButton keys
console.log('\n2. Testing MoneyInButton translation keys...');
const moneyInKeys = [
  'credit.failed_to_add',
  'credit.new_customer_created',
  'credit.added_to_customer',
  'credit.payment_failed',
  'credit.due_date'
];

moneyInKeys.forEach(key => {
  if (universalTranslations.universal[key]) {
    console.log(`   ${key}: Found`);
  } else {
    console.log(`   ${key}: MISSING`);
  }
});

// Test 3: Check MoneyOutButton keys
console.log('\n3. Testing MoneyOutButton translation keys...');
const moneyOutKeys = [
  'expense_tracker.add_expense',
  'expense_tracker.expense_name',
  'expense_tracker.category'
];

moneyOutKeys.forEach(key => {
  if (universalTranslations.universal[key]) {
    console.log(`   ${key}: Found`);
  } else {
    console.log(`   ${key}: MISSING`);
  }
});

// Test 4: Check Services page keys
console.log('\n4. Testing Services page translation keys...');
const servicesKeys = [
  'services.transport_offline',
  'services.transport_offline_mode',
  'services.trip_failed'
];

servicesKeys.forEach(key => {
  if (universalTranslations.universal[key]) {
    console.log(`   ${key}: Found`);
  } else {
    console.log(`   ${key}: MISSING`);
  }
});

// Test 5: Check Credit page keys
console.log('\n5. Testing Credit page translation keys...');
const creditKeys = [
  'credit.updated_successfully',
  'credit.failed_to_update',
  'credit.record_not_found',
  'credit.reminder_from',
  'credit.amount_owed',
  'credit.amount_paid',
  'credit.date_given',
  'credit.days_overdue',
  'credit.payment_request',
  'credit.customers_tab',
  'credit.personal_tab',
  'credit.total_owed_to_you',
  'credit.total_you_owe',
  'credit.add_credit_customer',
  'credit.add_personal_credit',
  'credit.search_customers'
];

creditKeys.forEach(key => {
  if (universalTranslations.universal[key]) {
    console.log(`   ${key}: Found`);
  } else {
    console.log(`   ${key}: MISSING`);
  }
});

// Test 6: Check Appointments keys
console.log('\n6. Testing Appointments translation keys...');
const appointmentsKeys = [
  'appointments.title',
  'appointments.loading',
  'appointments.create_success',
  'appointments.create_error',
  'appointments.complete_success',
  'appointments.complete_error',
  'appointments.cancel_success',
  'appointments.cancel_error',
  'appointments.delete_success',
  'appointments.delete_error',
  'appointments.list_view',
  'appointments.calendar_view',
  'appointments.no_appointments_found',
  'appointments.adjust_filters',
  'appointments.get_started'
];

appointmentsKeys.forEach(key => {
  if (universalTranslations.universal[key]) {
    console.log(`   ${key}: Found`);
  } else {
    console.log(`   ${key}: MISSING`);
  }
});

// Test 7: Check More page keys
console.log('\n7. Testing More page translation keys...');
const moreKeys = [
  'more.share_app_message',
  'more.business_tools',
  'more.reports',
  'more.reports_description',
  'more.settings',
  'more.settings_description',
  'more.subscription',
  'more.subscription_description',
  'more.community_support',
  'more.beehive_community',
  'more.beehive_description',
  'more.share_app',
  'more.member_since'
];

moreKeys.forEach(key => {
  if (universalTranslations.universal[key]) {
    console.log(`   ${key}: Found`);
  } else {
    console.log(`   ${key}: MISSING`);
  }
});

// Test 8: Check Industry translations
console.log('\n8. Testing Industry translation keys...');
const industryKeys = [
  'retail.title',
  'food.title',
  'transport.title',
  'salon.title',
  'tailor.title',
  'repairs.title',
  'freelance.title'
];

industryKeys.forEach(key => {
  const industry = key.split('.')[0];
  if (industryTranslations[industry] && industryTranslations[industry][key]) {
    console.log(`   ${key}: Found in industry-translations`);
  } else {
    console.log(`   ${key}: MISSING in industry-translations`);
  }
});

// Test 9: Verify no duplicate common keys in industry translations
console.log('\n9. Checking for duplicate common keys in industry translations...');
const commonKeysToCheck = ['common.daily', 'common.weekly'];
let duplicatesFound = 0;

Object.keys(industryTranslations).forEach(industry => {
  commonKeysToCheck.forEach(key => {
    if (industryTranslations[industry][key]) {
      console.log(`   WARNING: ${key} found in ${industry} section (should be removed)`);
      duplicatesFound++;
    }
  });
});

if (duplicatesFound === 0) {
  console.log('   No duplicate common keys found: OK');
}

// Test 10: Sample translation test
console.log('\n10. Testing sample translations...');
const testKeys = [
  'common.save',
  'credit.customer_name_required',
  'appointments.title',
  'retail.title',
  'services.title'
];

testKeys.forEach(key => {
  const parts = key.split('.');
  const industry = parts[0];
  
  // Check if it's an industry key
  if (industryTranslations[industry] && industryTranslations[industry][key]) {
    const translation = industryTranslations[industry][key];
    console.log(`   ${key}: ${translation.en} (Industry)`);
  } 
  // Check if it's a universal key
  else if (universalTranslations.universal[key]) {
    const translation = universalTranslations.universal[key];
    console.log(`   ${key}: ${translation.en} (Universal)`);
  }
  else {
    console.log(`   ${key}: NOT FOUND`);
  }
});

console.log('\n=== Test Complete ===');
console.log('\nNote: This is a static test. For full verification, run the app and:');
console.log('1. Navigate to each page (appointments, services, credit, more)');
console.log('2. Switch languages using the language selector');
console.log('3. Verify all text is translated, not showing raw keys');
console.log('4. Check industry-specific content updates correctly');
