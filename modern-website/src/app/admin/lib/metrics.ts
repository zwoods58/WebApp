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

    // Mock implementation - replace with actual subscription tracking
    const { data: newUsers, error } = await supabase
      .from('business_users')
      .select('id, created_at')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Mock: assume 60% conversion
    return 60.0;
  } catch (error) {
    console.error('Error calculating conversion rate:', error);
    return 0;
  }
}

export async function calculateChurnRate(period: 'week' | 'month' | 'quarter'): Promise<number> {
  try {
    // Mock implementation - replace with actual churn tracking
    const rates = {
      week: 2.5,
      month: 8.0,
      quarter: 20.0,
    };

    return rates[period];
  } catch (error) {
    console.error('Error calculating churn rate:', error);
    return 0;
  }
}

export async function calculateLTV(): Promise<number> {
  try {
    // Mock implementation
    // LTV = ARPU × Average customer lifespan (months)
    const arpu = 5.0;
    const avgLifespanMonths = 12;
    
    return arpu * avgLifespanMonths;
  } catch (error) {
    console.error('Error calculating LTV:', error);
    return 0;
  }
}

export async function calculateMRRBreakdown() {
  try {
    // Mock implementation
    return {
      total_mrr: 10000,
      new_mrr: 1200,
      expansion_mrr: 300,
      churned_mrr: 500,
      net_mrr_growth: 1000,
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
