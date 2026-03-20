// Metric calculation functions for admin panel
import { supabase } from './supabase';

export async function calculateConversionRate(period: 'week' | 'month'): Promise<number> {
  try {
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    // Get total businesses that signed up in the period
    const { data: newBusinesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, created_at')
      .gte('created_at', startDate.toISOString());

    if (businessError) throw businessError;

    // Get active subscriptions from the same period
    const { data: activeSubscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('business_id, created_at')
      .eq('status', 'active')
      .gte('created_at', startDate.toISOString());

    if (subscriptionError) throw subscriptionError;

    // Calculate conversion rate: (active subscriptions / total businesses) * 100
    const totalBusinesses = newBusinesses?.length || 0;
    const convertedBusinesses = activeSubscriptions?.length || 0;
    
    if (totalBusinesses === 0) return 0;
    
    const conversionRate = (convertedBusinesses / totalBusinesses) * 100;
    return Math.round(conversionRate * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating conversion rate:', error);
    return 0;
  }
}

export async function calculateChurnRate(period: 'week' | 'month' | 'quarter'): Promise<number> {
  try {
    const now = new Date();
    const startDate = new Date();
    
    // Set the date range based on period
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setMonth(now.getMonth() - 3);
    }

    // Get subscriptions that were active at the start of the period
    const { data: startSubscriptions, error: startError } = await supabase
      .from('subscriptions')
      .select('id, status, updated_at')
      .lt('updated_at', startDate.toISOString());

    if (startError) throw startError;

    // Get subscriptions that were cancelled during the period
    const { data: cancelledSubscriptions, error: cancelError } = await supabase
      .from('subscriptions')
      .select('id, status, updated_at')
      .eq('status', 'cancelled')
      .gte('updated_at', startDate.toISOString())
      .lte('updated_at', now.toISOString());

    if (cancelError) throw cancelError;

    // Calculate churn rate: (cancelled subscriptions / total active subscriptions) * 100
    const totalActiveAtStart = startSubscriptions?.filter(s => s.status === 'active').length || 1;
    const cancelledCount = cancelledSubscriptions?.length || 0;
    
    const churnRate = (cancelledCount / totalActiveAtStart) * 100;
    return Math.round(churnRate * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating churn rate:', error);
    return 0;
  }
}

export async function calculateLTV(): Promise<number> {
  try {
    // Get real ARPU from subscription data
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('usd_price, created_at, cancelled_at')
      .eq('status', 'active');

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return 0;
    }

    // Calculate ARPU (Average Revenue Per User)
    const weeklyRevenue = subscriptions.reduce((sum, sub) => sum + (sub.usd_price || 0), 0);
    const monthlyRevenue = weeklyRevenue * 4.33; // Convert weekly to monthly
    const arpu = monthlyRevenue / subscriptions.length;

    // Calculate average customer lifespan in months
    const now = new Date();
    const customerLifespans = subscriptions.map(sub => {
      const created = new Date(sub.created_at);
      const ended = sub.cancelled_at ? new Date(sub.cancelled_at) : now;
      const lifespanDays = Math.ceil((ended.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return lifespanDays / 30.44; // Convert days to months
    }).filter(lifespan => lifespan > 0);

    const avgLifespanMonths = customerLifespans.length > 0 
      ? customerLifespans.reduce((sum, lifespan) => sum + lifespan, 0) / customerLifespans.length
      : 12; // Default to 12 months if no data
    
    // LTV = ARPU × Average customer lifespan (months)
    const ltv = arpu * avgLifespanMonths;
    return Math.round(ltv * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error calculating LTV:', error);
    return 0;
  }
}

export async function calculateMRRBreakdown() {
  try {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    // Get current active subscriptions
    const { data: currentSubscriptions, error: currentError } = await supabase
      .from('subscriptions')
      .select('usd_price, created_at, status')
      .eq('status', 'active');

    if (currentError) throw currentError;

    // Get subscriptions from last month for comparison
    const { data: lastMonthSubscriptions, error: lastMonthError } = await supabase
      .from('subscriptions')
      .select('usd_price, created_at, status')
      .eq('status', 'active')
      .lt('created_at', lastMonth.toISOString());

    if (lastMonthError) throw lastMonthError;

    // Get new subscriptions this month
    const { data: newSubscriptions, error: newError } = await supabase
      .from('subscriptions')
      .select('usd_price, created_at')
      .eq('status', 'active')
      .gte('created_at', lastMonth.toISOString());

    if (newError) throw newError;

    // Get cancelled subscriptions this month
    const { data: cancelledSubscriptions, error: cancelError } = await supabase
      .from('subscriptions')
      .select('usd_price, updated_at')
      .eq('status', 'cancelled')
      .gte('updated_at', lastMonth.toISOString());

    if (cancelError) throw cancelError;

    // Calculate MRR components (convert weekly to monthly)
    const weeklyToMonthly = 4.33;
    
    const totalMRR = (currentSubscriptions || [])
      .reduce((sum, sub) => sum + ((sub.usd_price || 0) * weeklyToMonthly), 0);
    
    const newMRR = (newSubscriptions || [])
      .reduce((sum, sub) => sum + ((sub.usd_price || 0) * weeklyToMonthly), 0);
    
    const churnedMRR = (cancelledSubscriptions || [])
      .reduce((sum, sub) => sum + ((sub.usd_price || 0) * weeklyToMonthly), 0);
    
    // Expansion MRR is the difference between current and last month's existing subscriptions
    const lastMonthMRR = (lastMonthSubscriptions || [])
      .reduce((sum, sub) => sum + ((sub.usd_price || 0) * weeklyToMonthly), 0);
    
    const expansionMRR = Math.max(0, (totalMRR - newMRR) - lastMonthMRR);
    const netMRRGrowth = newMRR + expansionMRR - churnedMRR;

    return {
      total_mrr: Math.round(totalMRR * 100) / 100,
      new_mrr: Math.round(newMRR * 100) / 100,
      expansion_mrr: Math.round(expansionMRR * 100) / 100,
      churned_mrr: Math.round(churnedMRR * 100) / 100,
      net_mrr_growth: Math.round(netMRRGrowth * 100) / 100,
    };
  } catch (error) {
    console.error('Error calculating MRR breakdown:', error);
    return {
      total_mrr: 0,
      new_mrr: 0,
      expansion_mrr: 0,
      churned_mrr: 0,
      net_mrr_growth: 0,
    };
  }
}

export async function getTableStats(tableName: string) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return {
      table_name: tableName,
      row_count: count || 0,
      last_updated: new Date().toISOString(),
      size_bytes: 0, // Would need database-level query
    };
  } catch (error) {
    console.error(`Error fetching stats for ${tableName}:`, error);
    return {
      table_name: tableName,
      row_count: 0,
      last_updated: new Date().toISOString(),
      size_bytes: 0,
    };
  }
}
