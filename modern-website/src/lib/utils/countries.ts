// Types
interface CountryConfig {
  code: string
  name: string
  locale: string
  currency: string
  currency_symbol: string
  phone_prefix: string
  flag: string
}

type SupportedLocale = 'en' | 'sw' | 'rw' | 'fr' | 'so' | 'pt'

// Country Configurations (20 countries)
export const COUNTRIES: CountryConfig[] = [
  // East Africa
  { code: 'KE', name: 'Kenya',            locale: 'en', currency: 'KES', currency_symbol: 'KSh', phone_prefix: '+254', flag: '??' },
  { code: 'TZ', name: 'Tanzania',         locale: 'sw', currency: 'TZS', currency_symbol: 'TSh', phone_prefix: '+255', flag: '??' },
  { code: 'UG', name: 'Uganda',           locale: 'en', currency: 'UGX', currency_symbol: 'USh', phone_prefix: '+256', flag: '??' },
  { code: 'RW', name: 'Rwanda',           locale: 'rw', currency: 'RWF', currency_symbol: 'Fr',  phone_prefix: '+250', flag: '??' },
  { code: 'ET', name: 'Ethiopia',         locale: 'en', currency: 'ETB', currency_symbol: 'Br',  phone_prefix: '+251', flag: '??' },

  // West Africa (Anglophone)
  { code: 'NG', name: 'Nigeria',          locale: 'en', currency: 'NGN', currency_symbol: '?',   phone_prefix: '+234', flag: '??' },
  { code: 'GH', name: 'Ghana',            locale: 'en', currency: 'GHS', currency_symbol: '?',   phone_prefix: '+233', flag: '??' },

  // West Africa (Francophone)
  { code: 'CI', name: "Côte d'Ivoire",   locale: 'fr', currency: 'XOF', currency_symbol: 'CFA', phone_prefix: '+225', flag: '??' },
  { code: 'SN', name: 'Senegal',          locale: 'fr', currency: 'XOF', currency_symbol: 'CFA', phone_prefix: '+221', flag: '??' },
  { code: 'CM', name: 'Cameroon',         locale: 'fr', currency: 'XAF', currency_symbol: 'CFA', phone_prefix: '+237', flag: '??' },
  { code: 'ML', name: 'Mali',             locale: 'fr', currency: 'XOF', currency_symbol: 'CFA', phone_prefix: '+223', flag: '??' },
  { code: 'BF', name: 'Burkina Faso',     locale: 'fr', currency: 'XOF', currency_symbol: 'CFA', phone_prefix: '+226', flag: '??' },

  // Southern Africa
  { code: 'ZA', name: 'South Africa',    locale: 'en', currency: 'ZAR', currency_symbol: 'R',    phone_prefix: '+27',  flag: '??' },
  { code: 'ZW', name: 'Zimbabwe',         locale: 'en', currency: 'USD', currency_symbol: '$',    phone_prefix: '+263', flag: '??' },
  { code: 'ZM', name: 'Zambia',           locale: 'en', currency: 'ZMW', currency_symbol: 'K',    phone_prefix: '+260', flag: '??' },
  { code: 'MW', name: 'Malawi',           locale: 'en', currency: 'MWK', currency_symbol: 'MK',   phone_prefix: '+265', flag: '??' },

  // Central / North Africa
  { code: 'CD', name: 'DR Congo',         locale: 'fr', currency: 'CDF', currency_symbol: 'FC',   phone_prefix: '+243', flag: '??' },

  // Horn / North-East Africa
  { code: 'SO', name: 'Somalia',          locale: 'so', currency: 'SOS', currency_symbol: 'Sh',   phone_prefix: '+252', flag: '??' },

  // Reserve slots
  { code: 'MZ', name: 'Mozambique',       locale: 'pt', currency: 'MZN', currency_symbol: 'MT',   phone_prefix: '+258', flag: '??' },
  { code: 'AO', name: 'Angola',           locale: 'pt', currency: 'AOA', currency_symbol: 'Kz',   phone_prefix: '+244', flag: '??' },
]

export const getCountry = (code: string) =>
  COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]

export const formatCurrency = (amount: number, countryCode: string) => {
  const country = getCountry(countryCode)
  return `${country.currency_symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const INDUSTRIES = [
  { value: 'retail',          label: 'Retail / Shop' },
  { value: 'food_beverage',   label: 'Food & Beverage' },
  { value: 'beauty_wellness', label: 'Beauty & Wellness' },
  { value: 'fashion',         label: 'Fashion & Clothing' },
  { value: 'electronics',     label: 'Electronics & Tech' },
  { value: 'automotive',      label: 'Automotive' },
  { value: 'agriculture',     label: 'Agriculture & Farming' },
  { value: 'construction',    label: 'Construction & Building' },
  { value: 'healthcare',      label: 'Healthcare' },
  { value: 'education',       label: 'Education & Training' },
  { value: 'transport',       label: 'Transport & Logistics' },
  { value: 'hospitality',     label: 'Hospitality & Tourism' },
  { value: 'other',           label: 'Other' },
]
