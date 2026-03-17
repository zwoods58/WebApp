import { supabaseAdmin } from './supabaseAdmin';

/**
 * Sets the business context for RLS policies
 * This must be called after authentication to enable data isolation
 */
export async function setBusinessContext(
  businessId: string,
  country: string,
  industry: string
): Promise<void> {
  try {
    // Get country code from country name
    const countryCode = getCountryCode(country);
    
    // Call the Supabase function to set session context
    const { error } = await supabaseAdmin.rpc('set_business_context', {
      p_business_id: businessId,
      p_country: countryCode,
      p_industry: industry.toLowerCase()
    });

    if (error) {
      console.error('Failed to set business context:', error);
      throw error;
    }

    console.log('✅ Business context set:', { businessId, country: countryCode, industry });
  } catch (error) {
    console.error('Error setting business context:', error);
    throw error;
  }
}

/**
 * Maps country names to 2-letter codes
 */
function getCountryCode(country: string): string {
  const countryMap: Record<string, string> = {
    'kenya': 'KE',
    'ke': 'KE',
    'nigeria': 'NG',
    'ng': 'NG',
    'south africa': 'ZA',
    'za': 'ZA',
    'ghana': 'GH',
    'gh': 'GH',
    'uganda': 'UG',
    'ug': 'UG',
    'rwanda': 'RW',
    'rw': 'RW',
    'tanzania': 'TZ',
    'tz': 'TZ'
  };

  return countryMap[country.toLowerCase()] || country.toUpperCase().substring(0, 2);
}

/**
 * Gets the currency for a country
 */
export function getCurrencyFromCountry(country: string): string {
  const currencyMap: Record<string, string> = {
    'KE': 'KES',
    'NG': 'NGN',
    'ZA': 'ZAR',
    'GH': 'GHS',
    'UG': 'UGX',
    'RW': 'RWF',
    'TZ': 'TZS'
  };

  const countryCode = getCountryCode(country);
  return currencyMap[countryCode] || 'USD';
}
