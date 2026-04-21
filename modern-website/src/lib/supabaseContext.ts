/**
 * Sets the business context for RLS policies
 * This must be called after authentication to enable data isolation
 * Now calls a secure API route instead of accessing service role key client-side
 */
export async function setBusinessContext(
  businessId: string,
  country: string,
  industry: string
): Promise<void> {
  try {
    // Validate required parameters
    if (!businessId || !country || !industry) {
      console.warn('â ï¸ Missing required parameters for business context:', { businessId, country, industry });
      return;
    }

    // Import supabase here to get the current session token
    const { supabase } = await import('@/lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.warn('â ï¸ No session token available for business context');
      return;
    }

    // Call the secure API route to set business context
    const response = await fetch('/api/auth/set-business-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`, // â THIS was missing
      },
      body: JSON.stringify({ businessId, country, industry }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('â ï¸ Failed to set business context:', error.error || 'Unknown error');
      return;
    }

    const result = await response.json();
    
    if (result.skipped) {
      // Function doesn't exist in database - not critical
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('â Business context set:', { businessId, country, industry });
    }
  } catch (error: any) {
    // Gracefully handle errors - business context is not critical for app functionality
    console.warn('â ï¸ Could not set business context (non-critical):', error?.message || 'Unknown error');
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

