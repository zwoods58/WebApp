// Subscription revenue queries for 7 target countries
import { supabase } from './supabase';

export const TARGET_COUNTRIES = {
  KE: { name: 'Kenya', code: 'KE', currency: 'KES' },
  ZA: { name: 'South Africa', code: 'ZA', currency: 'ZAR' },
  NG: { name: 'Nigeria', code: 'NG', currency: 'NGN' },
  GH: { name: 'Ghana', code: 'GH', currency: 'GHS' },
  UG: { name: 'Uganda', code: 'UG', currency: 'UGX' },
  TZ: { name: 'Tanzania', code: 'TZ', currency: 'TZS' },
  RW: { name: 'Rwanda', code: 'RW', currency: 'RWF' },
};

// Actual pricing from Beezee landing page (weekly prices)
export const ACTUAL_PRICING = {
  KE: { local_price: 200, currency: 'KES' },    // KES 200/week
  NG: { local_price: 500, currency: 'NGN' },    // NGN 500/week  
  ZA: { local_price: 30, currency: 'ZAR' },     // ZAR 30/week
  GH: { local_price: 13, currency: 'GHS' },     // GHS 13/week
  UG: { local_price: 4000, currency: 'UGX' },    // UGX 4,000/week
  RW: { local_price: 1500, currency: 'RWF' },    // RWF 1,500/week
  TZ: { local_price: 2000, currency: 'TZS' },    // TZS 2,000/week
};

// Real exchange rates (approximate - should be updated regularly)
export const EXCHANGE_RATES = {
  KE: 0.0078,    // 1 KES = 0.0078 USD
  ZA: 0.053,     // 1 ZAR = 0.053 USD
  NG: 0.00067,   // 1 NGN = 0.00067 USD
  GH: 0.083,     // 1 GHS = 0.083 USD
  UG: 0.00027,   // 1 UGX = 0.00027 USD
  TZ: 0.00043,   // 1 TZS = 0.00043 USD
  RW: 0.00083,   // 1 RWF = 0.00083 USD
};

export interface SubscriptionRevenue {
  country_code: string;
  country_name: string;
  currency: string;
  monthly_revenue: number;
  active_subscriptions: number;
  mrr: number;
  arpu: number;
  growth_rate: number;
}

export interface CountrySubscriptionStats {
  total_mrr: number;
  total_subscriptions: number;
  total_arpu: number;
  countries: SubscriptionRevenue[];
  monthly_trend: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
  }>;
}

// Real subscription data from database
export async function getSubscriptionRevenue(): Promise<CountrySubscriptionStats> {
  try {
    // Get active subscriptions from database
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    // If no subscriptions in database yet, fall back to business count with mock pricing
    if (!subscriptions || subscriptions.length === 0) {
      return await getMockSubscriptionRevenue();
    }

    // Calculate subscription metrics per country
    const countryData: SubscriptionRevenue[] = Object.entries(TARGET_COUNTRIES).map(([code, info]) => {
      const countrySubscriptions = subscriptions?.filter(s => s.country_code === code) || [];
      const activeSubscriptions = countrySubscriptions.length;
      
      const pricing = ACTUAL_PRICING[code as keyof typeof ACTUAL_PRICING];
      const exchangeRate = EXCHANGE_RATES[code as keyof typeof EXCHANGE_RATES];
      
      if (!pricing || !exchangeRate) {
        return {
          country_code: code,
          country_name: info.name,
          currency: info.currency,
          monthly_revenue: 0,
          active_subscriptions: 0,
          mrr: 0,
          arpu: 0,
          growth_rate: 0,
        };
      }

      // Calculate monthly revenue (weekly price * 4.33 weeks per month)
      const monthlyRevenueLocal = activeSubscriptions * pricing.local_price * 4.33;
      const monthlyRevenueUSD = monthlyRevenueLocal * exchangeRate;
      const arpu = activeSubscriptions > 0 ? monthlyRevenueUSD / activeSubscriptions : 0;
      
      return {
        country_code: code,
        country_name: info.name,
        currency: info.currency,
        monthly_revenue: monthlyRevenueLocal,
        active_subscriptions: activeSubscriptions,
        mrr: monthlyRevenueUSD,
        arpu: arpu,
        growth_rate: 0, // TODO: Calculate from historical data
      };
    });

    const totalMRR = countryData.reduce((sum, country) => sum + country.mrr, 0);
    const totalSubscriptions = countryData.reduce((sum, country) => sum + country.active_subscriptions, 0);
    const totalARPU = totalSubscriptions > 0 ? totalMRR / totalSubscriptions : 0;

    // Generate monthly trend from real data
    const monthlyTrend = await generateMonthlyTrend();

    return {
      total_mrr: totalMRR,
      total_subscriptions: totalSubscriptions,
      total_arpu: totalARPU,
      countries: countryData,
      monthly_trend: monthlyTrend,
    };
  } catch (error) {
    console.error('Error fetching subscription revenue:', error);
    return await getMockSubscriptionRevenue();
  }
}

// Fallback to mock data using real pricing
async function getMockSubscriptionRevenue(): Promise<CountrySubscriptionStats> {
  try {
    // Get businesses from target countries
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('country, is_active')
      .eq('is_active', true)
      .in('country', Object.keys(TARGET_COUNTRIES));

    if (error) throw error;

    // Calculate subscription metrics per country using real pricing
    const countryData: SubscriptionRevenue[] = Object.entries(TARGET_COUNTRIES).map(([code, info]) => {
      const countryBusinesses = businesses?.filter(b => b.country === code) || [];
      const activeSubscriptions = countryBusinesses.length;
      
      const pricing = ACTUAL_PRICING[code as keyof typeof ACTUAL_PRICING];
      const exchangeRate = EXCHANGE_RATES[code as keyof typeof EXCHANGE_RATES];
      
      if (!pricing || !exchangeRate) {
        return {
          country_code: code,
          country_name: info.name,
          currency: info.currency,
          monthly_revenue: 0,
          active_subscriptions: 0,
          mrr: 0,
          arpu: 0,
          growth_rate: 0,
        };
      }

      // Calculate monthly revenue (weekly price * 4.33 weeks per month)
      const monthlyRevenueLocal = activeSubscriptions * pricing.local_price * 4.33;
      const monthlyRevenueUSD = monthlyRevenueLocal * exchangeRate;
      const arpu = activeSubscriptions > 0 ? monthlyRevenueUSD / activeSubscriptions : 0;
      
      return {
        country_code: code,
        country_name: info.name,
        currency: info.currency,
        monthly_revenue: monthlyRevenueLocal,
        active_subscriptions: activeSubscriptions,
        mrr: monthlyRevenueUSD,
        arpu: arpu,
        growth_rate: Math.random() * 20 - 5, // Mock growth rate between -5% and +15%
      };
    });

    const totalMRR = countryData.reduce((sum, country) => sum + country.mrr, 0);
    const totalSubscriptions = countryData.reduce((sum, country) => sum + country.active_subscriptions, 0);
    const totalARPU = totalSubscriptions > 0 ? totalMRR / totalSubscriptions : 0;

    // Generate mock monthly trend data
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      // Mock growth trend based on real pricing
      const baseRevenue = totalMRR * 0.7; // Start at 70% of current
      const growth = i * (totalMRR * 0.06) + Math.random() * (totalMRR * 0.1);
      const revenue = Math.min(baseRevenue + growth, totalMRR);
      const subscriptions = Math.floor(revenue / (totalARPU || 5));
      
      return {
        month,
        revenue,
        subscriptions,
      };
    });

    return {
      total_mrr: totalMRR,
      total_subscriptions: totalSubscriptions,
      total_arpu: totalARPU,
      countries: countryData,
      monthly_trend: monthlyTrend,
    };
  } catch (error) {
    console.error('Error in mock subscription revenue:', error);
    return {
      total_mrr: 0,
      total_subscriptions: 0,
      total_arpu: 0,
      countries: [],
      monthly_trend: [],
    };
  }
}

// Generate monthly trend from real subscription data
async function generateMonthlyTrend(): Promise<Array<{month: string; revenue: number; subscriptions: number}>> {
  try {
    // Get subscription history for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error || !subscriptions || subscriptions.length === 0) {
      // Fallback to mock trend
      const currentData = await getMockSubscriptionRevenue();
      return currentData.monthly_trend;
    }

    // Group subscriptions by month and calculate revenue
    const monthlyData = new Map<string, { revenue: number; subscriptions: number }>();
    
    subscriptions.forEach(sub => {
      const date = new Date(sub.created_at);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { revenue: 0, subscriptions: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      data.revenue += sub.usd_price * 4.33; // Convert weekly to monthly
      data.subscriptions += 1;
    });

    // Convert to array and ensure we have 6 months
    const trend: Array<{month: string; revenue: number; subscriptions: number}> = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      const monthData = monthlyData.get(month);
      if (monthData) {
        return { month, ...monthData };
      } else {
        return { month, revenue: 0, subscriptions: 0 };
      }
    });

    return trend;
  } catch (error) {
    console.error('Error generating monthly trend:', error);
    return [];
  }
}

export async function getCountrySubscriptionDetails(countryCode: string): Promise<SubscriptionRevenue | null> {
  const data = await getSubscriptionRevenue();
  return data.countries.find(c => c.country_code === countryCode) || null;
}

export async function getSubscriptionGrowthRate(): Promise<number> {
  // Mock monthly growth rate calculation
  return 12.5;
}
