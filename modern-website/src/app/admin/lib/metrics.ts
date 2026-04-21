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

    // Note: Subscription functionality has been removed
    // This function now calculates business metrics only
    const activeSubscriptions = 0;

    // Note: Subscription functionality has been removed
    // Conversion rate calculation no longer applicable
    const totalBusinesses = newBusinesses?.length || 0;
    
    if (totalBusinesses === 0) return 0;
    
    return 0;
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

    // Note: Subscription functionality has been removed
    // Churn rate calculation is no longer applicable
    const totalActiveAtStart = 0;
    const cancelledCount = 0;
    
    const churnRate = 0;
    return Math.round(churnRate * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating churn rate:', error);
    return 0;
  }
}

export async function calculateLTV(): Promise<number> {
  try {
    // Note: Subscription functionality has been removed
    // LTV calculation is no longer applicable
    return 0;
  } catch (error) {
    console.error('Error calculating LTV:', error);
    return 0;
  }
}

export async function calculateMRRBreakdown() {
  try {
    // Note: Subscription functionality has been removed
    // MRR calculation is no longer applicable
    return {
      total_mrr: 0,
      new_mrr: 0,
      expansion_mrr: 0,
      churned_mrr: 0,
      net_mrr_growth: 0,
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

