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
    
    console.log('🔐 Setting business context:', { businessId, country: countryCode, industry });
    
    // Check if admin client is available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found, using regular client');
    }
    
    // Call the Supabase function to set session context
    const { data, error } = await supabaseAdmin.rpc('set_business_context', {
      p_business_id: businessId,
      p_country: countryCode,
      p_industry: industry.toLowerCase()
    });

    if (error) {
      console.error('❌ Failed to set business context:', {
        error,
        details: error.details,
        hint: error.hint,
        code: error.code,
        message: error.message,
        businessId,
        countryCode,
        industry
      });
      throw error;
    }

    console.log('✅ Business context set successfully:', { businessId, country: countryCode, industry, data });
  } catch (error) {
    console.error('❌ Error setting business context:', {
      error,
      businessId,
      country,
      industry,
      serviceKeyAvailable: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
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
