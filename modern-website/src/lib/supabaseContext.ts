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
    
    // Skip in development if service key not available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      if (process.env.NODE_ENV === 'development') {
        // Silently skip in development - not critical for local dev
        return;
      }
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found, skipping business context');
      return;
    }
    
    // Call the Supabase function to set session context
    const { data, error } = await supabaseAdmin.rpc('set_business_context', {
      p_business_id: businessId,
      p_country: countryCode,
      p_industry: industry.toLowerCase()
    });

    if (error) {
      // Check if function doesn't exist (common in dev)
      if (error.code === '42883' || error.message?.includes('function') || error.message?.includes('does not exist')) {
        if (process.env.NODE_ENV === 'development') {
          // Silently skip in development
          return;
        }
        console.warn('⚠️ set_business_context function not found in database - skipping (non-critical)');
        return;
      }
      
      // For other errors, log but don't throw (non-critical)
      console.warn('⚠️ Failed to set business context (non-critical):', error.message);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Business context set:', { businessId, country: countryCode, industry });
    }
  } catch (error: any) {
    // Gracefully handle errors - business context is not critical for app functionality
    if (process.env.NODE_ENV === 'development') {
      // Silently skip in development
      return;
    }
    console.warn('⚠️ Could not set business context (non-critical):', error?.message || 'Unknown error');
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
