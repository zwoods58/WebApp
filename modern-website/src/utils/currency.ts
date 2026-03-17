// Country configurations with currency
export const countryConfigs = {
  ke: { name: 'Kenya', flag: '🇰🇪', currency: 'KES', currencySymbol: 'KES' },
  za: { name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', currencySymbol: 'R' },
  ng: { name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', currencySymbol: '₦' },
  gh: { name: 'Ghana', flag: '🇬🇭', currency: 'GHS', currencySymbol: 'GH₵' },
  ug: { name: 'Uganda', flag: '🇺🇬', currency: 'UGX', currencySymbol: 'UGX' },
  rw: { name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', currencySymbol: 'RWF' },
  tz: { name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', currencySymbol: 'TZS' }
};

// Get currency for a country
export const getCurrency = (country: string): string => {
  const lowerCountry = country.toLowerCase();
  return countryConfigs[lowerCountry as keyof typeof countryConfigs]?.currency || 'KES';
};

// Get currency symbol for a country
export const getCurrencySymbol = (country: string): string => {
  const lowerCountry = country.toLowerCase();
  return countryConfigs[lowerCountry as keyof typeof countryConfigs]?.currencySymbol || 'KES';
};

// Get country config
export const getCountryConfig = (country: string) => {
  const lowerCountry = country.toLowerCase();
  return countryConfigs[lowerCountry as keyof typeof countryConfigs] || countryConfigs.ke;
};

// Validate daily target for country (reasonable ranges)
export const validateDailyTarget = (amount: number, country: string): boolean => {
  const lowerCountry = country.toLowerCase();
  const minTargets = {
    ke: 100,   // Kenya: ~$1 USD minimum
    za: 50,    // South Africa: ~$3 USD minimum  
    ng: 500,   // Nigeria: ~$0.30 USD minimum
    gh: 50,    // Ghana: ~$4 USD minimum
    ug: 1000,  // Uganda: ~$0.27 USD minimum
    rw: 1000,  // Rwanda: ~$0.80 USD minimum
    tz: 2000   // Tanzania: ~$0.80 USD minimum
  };
  
  const maxTargets = {
    ke: 50000,   // Kenya: ~$400 USD maximum
    za: 10000,   // South Africa: ~$550 USD maximum
    ng: 100000,  // Nigeria: ~$65 USD maximum
    gh: 5000,    // Ghana: ~$400 USD maximum
    ug: 50000,   // Uganda: ~$13 USD maximum
    rw: 50000,   // Rwanda: ~$40 USD maximum
    tz: 100000   // Tanzania: ~$40 USD maximum
  };
  
  const min = minTargets[lowerCountry as keyof typeof minTargets] || 100;
  const max = maxTargets[lowerCountry as keyof typeof maxTargets] || 50000;
  
  return amount >= min && amount <= max;
};

// Consistent number formatting function
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format currency with dynamic country currency
export const formatCurrency = (amount: number, country: string): string => {
  const currency = getCurrency(country);
  return `${currency} ${formatNumber(amount)}`;
};

// Format currency with symbol
export const formatCurrencyWithSymbol = (amount: number, country: string): string => {
  const symbol = getCurrencySymbol(country);
  return `${symbol} ${formatNumber(amount)}`;
};

// Consistent date formatting function
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};
