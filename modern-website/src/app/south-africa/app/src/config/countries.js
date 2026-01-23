/**
 * Country Configuration System
 * Defines country-specific settings for BeeZee Finance app
 */

export const COUNTRIES = {
  KE: {
    code: 'KE',
    name: 'Kenya',
    dialCode: '+254',
    currency: {
      code: 'KES',
      symbol: 'KSh',
      name: 'Kenyan Shilling'
    },
    languages: [
      { code: 'en', name: 'English', default: true },
      { code: 'sw', name: 'Kiswahili' },
      { code: 'ki', name: 'Kikuyu' },
      { code: 'lu', name: 'Luo' },
      { code: 'kl', name: 'Kalenjin' },
      { code: 'ka', name: 'Kamba' },
      { code: 'mg', name: 'Meru' },
      { code: 'em', name: 'Embu' }
    ],
    pricing: {
      billingCycle: 'monthly',
      plans: {
        manual: { price: 299, currency: 'KES', displayPrice: 'KSh 299', features: ['10_transactions', 'basic_reports'] },
        ai: { price: 799, currency: 'KES', displayPrice: 'KSh 799', features: ['unlimited_transactions', 'advanced_reports', 'inventory', 'coach'] }
      }
    },
    features: {
      coach: true,
      inventory: true,
      multi_user: true,
      api_access: true,
      offline_mode: true,
      export_data: true
    },
    payment_methods: {
      mobile_money: ['M-Pesa', 'Airtel Money', 'TKash'],
      bank_transfer: true,
      card: true
    },
    locale: {
      date: 'en-KE',
      number: 'en-KE',
      currency: 'en-KE'
    }
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    dialCode: '+27',
    currency: {
      code: 'ZAR',
      symbol: 'R',
      name: 'South African Rand'
    },
    languages: [
      { code: 'en', name: 'English', default: true },
      { code: 'af', name: 'Afrikaans' },
      { code: 'zu', name: 'isiZulu' },
      { code: 'xh', name: 'isiXhosa' },
      { code: 'st', name: 'Sesotho' },
      { code: 'tn', name: 'Setswana' },
      { code: 'nso', name: 'Sepedi' },
      { code: 'nr', name: 'isiNdebele' },
      { code: 'ss', name: 'siSwati' },
      { code: 've', name: 'Tshivenda' },
      { code: 'ts', name: 'Xitsonga' }
    ],
    pricing: {
      billingCycle: 'monthly',
      plans: {
        manual: { price: 49, currency: 'ZAR', displayPrice: 'R49', features: ['10_transactions', 'basic_reports'] },
        ai: { price: 149, currency: 'ZAR', displayPrice: 'R149', features: ['unlimited_transactions', 'advanced_reports', 'inventory', 'coach'] }
      }
    },
    features: {
      coach: true,
      inventory: true,
      multi_user: true,
      api_access: true,
      offline_mode: true,
      export_data: true
    },
    payment_methods: {
      mobile_money: ['VodPay', 'Mobicred', 'SnapScan'],
      bank_transfer: true,
      card: true
    },
    locale: {
      date: 'en-ZA',
      number: 'en-ZA',
      currency: 'en-ZA'
    }
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    dialCode: '+234',
    currency: {
      code: 'NGN',
      symbol: '₦',
      name: 'Nigerian Naira'
    },
    languages: [
      { code: 'en', name: 'English', default: true },
      { code: 'ha', name: 'Hausa' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'ig', name: 'Igbo' },
      { code: 'ff', name: 'Fula' },
      { code: 'ts', name: 'Tiv' },
      { code: 'ib', name: 'Ibibio' },
      { code: 'ed', name: 'Edo' }
    ],
    pricing: {
      billingCycle: 'weekly',
      plans: {
        manual: { price: 600, currency: 'NGN', displayPrice: '₦600', weeklyDisplay: '₦600/week', features: ['10_transactions', 'basic_reports'] },
        ai: { price: 1500, currency: 'NGN', displayPrice: '₦1,500', weeklyDisplay: '₦1,500/week', features: ['unlimited_transactions', 'advanced_reports', 'inventory', 'coach'] }
      }
    },
    features: {
      coach: true,
      inventory: true,
      multi_user: true,
      api_access: true,
      offline_mode: true,
      export_data: true
    },
    payment_methods: {
      mobile_money: ['Opay', 'Paga', 'Kuda', 'Carbon'],
      bank_transfer: true,
      card: true
    },
    locale: {
      date: 'en-NG',
      number: 'en-NG',
      currency: 'en-NG'
    }
  }
};

// Helper functions
export function getCountryByCode(code) {
  return COUNTRIES[code] || null;
}

export function getCountryByDialCode(dialCode) {
  return Object.values(COUNTRIES).find(country => country.dialCode === dialCode) || null;
}

export function formatCurrency(amount, countryCode) {
  const country = getCountryByCode(countryCode);
  if (!country) return amount.toString();

  return new Intl.NumberFormat(country.locale.number, {
    style: 'currency',
    currency: country.currency.code
  }).format(amount);
}

export function formatDate(date, countryCode) {
  const country = getCountryByCode(countryCode);
  if (!country) return date.toLocaleDateString();

  return new Intl.DateTimeFormat(country.locale.date).format(date);
}

export function getCountryLanguages(countryCode) {
  const country = getCountryByCode(countryCode);
  return country ? country.languages : [];
}

export function getCountryPaymentMethods(countryCode) {
  const country = getCountryByCode(countryCode);
  return country ? country.payment_methods : {};
}

export function getCountryPricing(countryCode) {
  const country = getCountryByCode(countryCode);
  return country ? country.pricing : {};
}
