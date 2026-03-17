// Database query functions for admin panel
import { supabase } from './supabase';
import {
  CountryUserStats,
  IndustryUserStats,
  CountryRevenueStats,
  BeehiveRequest,
  BeehiveStats,
  CountryLTVStats,
  ConversionMetrics,
  ChurnMetrics,
  COUNTRY_NAMES,
  INDUSTRY_NAMES,
  CURRENCY_MAP,
} from './types';

// User Metrics
export async function getTotalUsers(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching total users:', error);
    return 0;
  }
}

export async function getActiveUsers(days: number = 30): Promise<number> {
  try {
    // Since user_sessions table doesn't exist, use recent activity from transactions
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from('transactions')
      .select('business_id')
      .gte('transaction_date', cutoffDate.toISOString().split('T')[0]);

    if (error) throw error;
    
    // Get unique business IDs from recent transactions
    const uniqueBusinesses = new Set(data?.map(t => t.business_id));
    return uniqueBusinesses.size;
  } catch (error) {
    console.error('Error fetching active users:', error);
    return 0;
  }
}

export async function getUsersByCountry(): Promise<CountryUserStats[]> {
  try {
    const targetCountries = ['KE', 'ZA', 'NG', 'GH', 'UG', 'TZ', 'RW'];
    
    const { data, error } = await supabase
      .from('businesses')
      .select('country')
      .eq('is_active', true)
      .in('country', targetCountries);

    if (error) throw error;

    const totalUsers = data?.length || 0;
    const countryCounts: Record<string, number> = {};

    // Initialize all target countries with 0
    targetCountries.forEach(country => {
      countryCounts[country] = 0;
    });

    data?.forEach((business) => {
      const country = business.country;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const stats: CountryUserStats[] = Object.entries(countryCounts).map(
      ([code, count]) => ({
        country_code: code,
        country_name: COUNTRY_NAMES[code] || code,
        user_count: count,
        active_users: 0,
        inactive_users: 0,
        percentage: totalUsers > 0 ? (count / totalUsers) * 100 : 0,
      })
    );

    return stats.sort((a, b) => b.user_count - a.user_count);
  } catch (error) {
    console.error('Error fetching users by country:', error);
    return [];
  }
}

export async function getTopBeehiveRequests(limit: number = 5): Promise<BeehiveRequest[]> {
  try {
    // Use admin RPC function to bypass RLS
    const { data, error } = await supabase
      .rpc('admin_get_top_beehive_requests', { limit_count: limit });

    if (error) {
      console.error('Error fetching top beehive requests:', error);
      return [];
    }

    return (data || []).map((req: any) => ({
      id: req.id,
      business_id: req.business_id,
      country: req.country,
      industry: req.industry,
      title: req.title,
      description: req.description,
      category: req.category,
      status: req.status,
      upvote_count: req.upvotes_count || 0,
      comment_count: req.comments_count || 0,
      created_at: req.created_at,
      updated_at: req.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching top beehive requests:', error);
    return [];
  }
}

export async function getARPU(): Promise<number> {
  try {
    // Use admin RPC function to get subscription-based ARPU
    const { data, error } = await supabase
      .rpc('admin_get_arpu');

    if (error) {
      console.error('Error calculating ARPU:', error);
      return 0;
    }

    return Number(data?.[0]?.admin_get_arpu) || 0;
  } catch (error) {
    console.error('Error calculating ARPU:', error);
    return 0;
  }
}

export async function getMRR(): Promise<number> {
  try {
    // Calculate MRR based on active subscriptions
    const { data, error } = await supabase
      .from('subscriptions')
      .select('usd_price')
      .eq('status', 'active');

    if (error) throw error;

    // Calculate monthly revenue from subscriptions (weekly price * 4.33 weeks)
    const totalMRR = data?.reduce((sum, sub) => sum + (sub.usd_price * 4.33), 0) || 0;

    return totalMRR;
  } catch (error) {
    console.error('Error calculating MRR:', error);
    return 0;
  }
}

export async function getBeehiveStats(): Promise<BeehiveStats> {
  try {
    // Use admin RPC function to bypass RLS
    const { data, error } = await supabase
      .rpc('admin_get_beehive_stats');

    if (error) {
      console.error('Error fetching beehive stats:', error);
      return {
        total_requests: 0,
        pending_requests: 0,
        in_progress_requests: 0,
        completed_requests: 0,
        total_votes: 0,
        total_comments: 0,
        top_categories: [],
      };
    }

    const stats = data?.[0];
    if (!stats) {
      return {
        total_requests: 0,
        pending_requests: 0,
        in_progress_requests: 0,
        completed_requests: 0,
        total_votes: 0,
        total_comments: 0,
        top_categories: [],
      };
    }

    // Get top categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .rpc('admin_get_beehive_categories');

    const topCategories = categoriesError ? [] : (categoriesData || []).map((cat: any) => ({
      category: cat.category,
      count: Number(cat.count)
    }));

    return {
      total_requests: Number(stats.total_requests) || 0,
      pending_requests: Number(stats.pending_requests) || 0,
      in_progress_requests: Number(stats.in_progress_requests) || 0,
      completed_requests: Number(stats.completed_requests) || 0,
      total_votes: Number(stats.total_votes) || 0,
      total_comments: Number(stats.total_comments) || 0,
      top_categories: topCategories,
    };
  } catch (error) {
    console.error('Error fetching beehive stats:', error);
    return {
      total_requests: 0,
      pending_requests: 0,
      in_progress_requests: 0,
      completed_requests: 0,
      total_votes: 0,
      total_comments: 0,
      top_categories: [],
    };
  }
}

// Revenue tracking functions using subscription data
export async function getRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'): Promise<any[]> {
  try {
    // Use admin RPC function to get subscription-based revenue
    const { data, error } = await supabase
      .rpc('admin_get_revenue_by_period', { period_type: period });

    if (error) {
      console.error(`Error fetching ${period} revenue:`, error);
      return [];
    }

    return (data || []).map((item: any) => ({
      period: item.period,
      revenue: Number(item.revenue) || 0,
      transaction_count: Number(item.transaction_count) || 0,
      countries: {} // Can be added later if needed
    }));
  } catch (error) {
    console.error(`Error fetching ${period} revenue:`, error);
    return [];
  }
}

export async function getRevenueByCountry(): Promise<CountryRevenueStats[]> {
  try {
    // Use admin RPC function to bypass RLS
    const { data, error } = await supabase
      .rpc('admin_get_revenue_by_country');

    if (error) {
      console.error('Error fetching revenue by country:', error);
      // Return empty array with default structure to prevent UI errors
      const fallbackCountries = ['KE', 'ZA', 'NG', 'GH', 'UG', 'TZ', 'RW'];
      return fallbackCountries.map((country: string) => ({
        country_code: country,
        country_name: COUNTRY_NAMES[country] || country,
        currency: 'USD',
        revenue: 0,
        revenue_usd: 0,
        user_count: 0,
        arpu: 0,
      }));
    }

    return (data || []).map((item: any) => ({
      country_code: item.country_code,
      country_name: item.country_name,
      currency: item.currency,
      revenue: Number(item.revenue) || 0,
      revenue_usd: Number(item.revenue_usd) || 0,
      user_count: Number(item.user_count) || 0,
      arpu: Number(item.arpu) || 0,
    }));
  } catch (error) {
    console.error('Error fetching revenue by country:', error);
    // Return empty array with default structure to prevent UI errors
    const fallbackCountries = ['KE', 'ZA', 'NG', 'GH', 'UG', 'TZ', 'RW'];
    return fallbackCountries.map((country: string) => ({
      country_code: country,
      country_name: COUNTRY_NAMES[country] || country,
      currency: 'USD',
      revenue: 0,
      revenue_usd: 0,
      user_count: 0,
      arpu: 0,
    }));
  }
}

export async function getConversionMetrics(): Promise<ConversionMetrics> {
  try {
    // This would typically track trial-to-paid conversions
    // For now, we'll return mock data based on user activity
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: newUsers, error: newUserError } = await supabase
      .from('businesses')
      .select('id, country, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('is_active', true);

    if (newUserError) throw newUserError;

    const { data: activeUsers, error: activeError } = await supabase
      .from('transactions')
      .select('business_id, transaction_date')
      .gte('transaction_date', thirtyDaysAgo.toISOString());

    if (activeError) throw activeError;

    // Calculate conversion metrics
    const totalNewUsers = newUsers?.length || 0;
    const convertedUsers = new Set(activeUsers?.map(t => t.business_id)).size;
    
    const conversionRate = totalNewUsers > 0 ? (convertedUsers / totalNewUsers) * 100 : 0;

    // Country-specific conversion rates
    const conversionByCountry: Record<string, { new: number; converted: number }> = {};
    
    newUsers?.forEach(user => {
      const country = user.country || 'Unknown';
      if (!conversionByCountry[country]) {
        conversionByCountry[country] = { new: 0, converted: 0 };
      }
      conversionByCountry[country].new++;
    });

    activeUsers?.forEach(transaction => {
      const user = newUsers?.find(u => u.id === transaction.business_id);
      if (user) {
        const country = user.country || 'Unknown';
        if (conversionByCountry[country]) {
          conversionByCountry[country].converted++;
        }
      }
    });

    const countryRates = Object.entries(conversionByCountry).map(([country, data]) => ({
      country,
      rate: data.new > 0 ? (data.converted / data.new) * 100 : 0
    }));

    return {
      trial_to_paid_rate: conversionRate,
      weekly_conversion_rate: conversionRate / 4, // Simplified weekly rate
      monthly_conversion_rate: conversionRate,
      conversion_by_country: countryRates,
      avg_days_to_convert: 7, // Simplified
    };
  } catch (error) {
    console.error('Error fetching conversion metrics:', error);
    return {
      trial_to_paid_rate: 0,
      weekly_conversion_rate: 0,
      monthly_conversion_rate: 0,
      conversion_by_country: [],
      avg_days_to_convert: 0,
    };
  }
}

export async function getChurnMetrics(): Promise<ChurnMetrics> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Get users who were active 90 days ago (using updated_at as proxy for last activity)
    const { data: oldUsers, error: oldError } = await supabase
      .from('businesses')
      .select('id, country, updated_at')
      .lte('updated_at', ninetyDaysAgo.toISOString())
      .eq('is_active', true);

    if (oldError) throw oldError;

    // Get users who are still active now
    const { data: currentUsers, error: currentError } = await supabase
      .from('businesses')
      .select('id, country')
      .eq('is_active', true);

    if (currentError) throw currentError;

    const oldUserIds = new Set(oldUsers?.map(u => u.id) || []);
    const currentUserIds = new Set(currentUsers?.map(u => u.id) || []);
    
    const churnedUsers = [...oldUserIds].filter(id => !currentUserIds.has(id));
    const totalOldUsers = oldUserIds.size;
    
    const weeklyChurnRate = totalOldUsers > 0 ? (churnedUsers.length / totalOldUsers) * 100 : 0;
    const monthlyChurnRate = weeklyChurnRate * 4; // Simplified
    const quarterlyChurnRate = weeklyChurnRate * 12; // Simplified

    // Country-specific churn
    const churnByCountry: Record<string, { old: number; churned: number }> = {};
    
    oldUsers?.forEach(user => {
      const country = user.country || 'Unknown';
      if (!churnByCountry[country]) {
        churnByCountry[country] = { old: 0, churned: 0 };
      }
      churnByCountry[country].old++;
      
      if (!currentUserIds.has(user.id)) {
        churnByCountry[country].churned++;
      }
    });

    const countryRates = Object.entries(churnByCountry).map(([country, data]) => ({
      country,
      rate: data.old > 0 ? (data.churned / data.old) * 100 : 0
    }));

    return {
      weekly_churn_rate: weeklyChurnRate,
      monthly_churn_rate: monthlyChurnRate,
      quarterly_churn_rate: quarterlyChurnRate,
      churn_by_country: countryRates,
    };
  } catch (error) {
    console.error('Error fetching churn metrics:', error);
    return {
      weekly_churn_rate: 0,
      monthly_churn_rate: 0,
      quarterly_churn_rate: 0,
      churn_by_country: [],
    };
  }
}
