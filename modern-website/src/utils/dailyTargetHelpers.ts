// Daily Target Helper Functions
import { supabase } from '@/lib/supabase';

// Timezone mapping for supported countries
export const COUNTRY_TIMEZONES: Record<string, string> = {
  'KE': 'Africa/Nairobi',      // UTC+3
  'NG': 'Africa/Lagos',         // UTC+1
  'ZA': 'Africa/Johannesburg',  // UTC+2
  'GH': 'Africa/Accra',         // UTC+0
  'UG': 'Africa/Kampala',       // UTC+3
  'RW': 'Africa/Kigali',        // UTC+2
  'TZ': 'Africa/Dar_es_Salaam'  // UTC+3
};

/**
 * Get current time in a specific country's timezone
 */
export function getCurrentTimeInTimezone(countryCode: string): Date {
  const timezone = COUNTRY_TIMEZONES[countryCode.toUpperCase()] || 'UTC';
  
  try {
    const dateString = new Date().toLocaleString('en-US', { timeZone: timezone });
    return new Date(dateString);
  } catch (error) {
    console.error('Error getting time in timezone:', error);
    return new Date();
  }
}

/**
 * Get current date in a specific country's timezone (YYYY-MM-DD format)
 */
export function getDateInTimezone(countryCode: string): string {
  const currentTime = getCurrentTimeInTimezone(countryCode);
  return currentTime.toISOString().split('T')[0];
}

/**
 * Get yesterday's date in a specific country's timezone
 */
export function getYesterdayInTimezone(countryCode: string): string {
  const currentTime = getCurrentTimeInTimezone(countryCode);
  currentTime.setDate(currentTime.getDate() - 1);
  return currentTime.toISOString().split('T')[0];
}

/**
 * Calculate today's sales total from transactions
 */
export async function getTodaySales(businessId: string, country: string): Promise<number> {
  try {
    const today = getDateInTimezone(country);
    
    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .eq('business_id', businessId)
      .eq('transaction_date', today);

    if (error) throw error;

    return data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  } catch (error) {
    console.error('Error calculating today sales:', error);
    return 0;
  }
}

/**
 * Calculate sales total for a specific date
 */
export async function getSalesForDate(businessId: string, date: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .eq('business_id', businessId)
      .eq('transaction_date', date);

    if (error) throw error;

    return data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  } catch (error) {
    console.error('Error calculating sales for date:', error);
    return 0;
  }
}

/**
 * Get daily sales history for a business
 */
export async function getDailySalesHistory(businessId: string, days: number = 30) {
  try {
    const { data, error } = await supabase
      .from('daily_sales_history')
      .select('*')
      .eq('business_id', businessId)
      .order('date', { ascending: false })
      .limit(days);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching daily sales history:', error);
    return [];
  }
}

/**
 * Get business's daily target
 */
export async function getDailyTarget(businessId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('targets')
      .select('daily_target')
      .eq('business_id', businessId)
      .maybeSingle();

    if (error) throw error;

    return Number(data?.daily_target) || 0;
  } catch (error) {
    console.error('Error fetching daily target:', error);
    return 0;
  }
}

/**
 * Format date for display
 */
export function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Calculate achievement percentage
 */
export function calculateAchievementPercentage(sales: number, target: number): number {
  if (target === 0) return 0;
  return Math.round((sales / target) * 100);
}
