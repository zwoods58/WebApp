// Business ID generation utilities
// Format: {COUNTRY}-{INDUSTRY}-{7_DIGIT_RANDOM}

export const COUNTRY_ABBREVIATIONS = {
  KE: 'KE', // Kenya
  NG: 'NG', // Nigeria
  TZ: 'TZ', // Tanzania
  GH: 'GH', // Ghana
  UG: 'UG', // Uganda
  ZA: 'ZA', // South Africa
  RW: 'RW'  // Rwanda
} as const;

export const INDUSTRY_ABBREVIATIONS = {
  retail: 'RE',     // Retail
  repairs: 'RP',    // Repairs
  salon: 'SL',      // Salon
  transport: 'TR',  // Transport
  tailor: 'TA',     // Tailor
  freelance: 'FA',  // Freelance
  food: 'FD'        // Food
} as const;

export type CountryCode = keyof typeof COUNTRY_ABBREVIATIONS;
export type IndustryCode = keyof typeof INDUSTRY_ABBREVIATIONS;

/**
 * Generate a 7-digit random number
 */
export function generateRandomNumber(): string {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

/**
 * Get country abbreviation from country code
 */
export function getCountryAbbreviation(country: string): string {
  const upperCountry = country.toUpperCase();
  return COUNTRY_ABBREVIATIONS[upperCountry as CountryCode] || upperCountry;
}

/**
 * Get industry abbreviation from industry ID
 */
export function getIndustryAbbreviation(industry: string): string {
  return INDUSTRY_ABBREVIATIONS[industry as IndustryCode] || industry.toUpperCase();
}

/**
 * Generate a unique business ID
 * Format: {COUNTRY}-{INDUSTRY}-{7_DIGIT_RANDOM}
 */
export function generateBusinessId(country: string, industry: string): string {
  const countryAbbr = getCountryAbbreviation(country);
  const industryAbbr = getIndustryAbbreviation(industry);
  const randomNumber = generateRandomNumber();
  
  return `${countryAbbr}-${industryAbbr}-${randomNumber}`;
}

/**
 * Validate business ID format
 */
export function validateBusinessId(businessId: string): boolean {
  const pattern = /^[A-Z]{2}-[A-Z]{2}-\d{7}$/;
  return pattern.test(businessId);
}

/**
 * Extract components from business ID
 */
export function parseBusinessId(businessId: string): {
  country: string;
  industry: string;
  number: string;
} | null {
  if (!validateBusinessId(businessId)) {
    return null;
  }
  
  const [country, industry, number] = businessId.split('-');
  return { country, industry, number };
}
