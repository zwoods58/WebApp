// =====================================================
// Optimized queries for 50k users
// Uses cursor-based pagination, materialized views, and batch operations
// =====================================================

import { supabase } from '@/lib/supabase';

export class OptimizedQueries {
  
  /**
   * Cursor-based pagination (faster than OFFSET for large datasets)
   */
  async getTransactionsCursor(
    businessId: string,
    cursor?: string,
    limit: number = 50
  ) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('business_id', businessId)
      .order('transaction_date', { ascending: false })
      .limit(limit);
    
    if (cursor) {
      query = query.lt('transaction_date', cursor);
    }
    
    const { data, error } = await query;
    
    const nextCursor = data?.length === limit 
      ? data[data.length - 1].transaction_date 
      : null;
    
    return { data, nextCursor, error };
  }
  
  /**
   * Batch insert (for high-volume operations)
   */
  async batchInsertTransactions(
    transactions: Array<any>,
    batchSize: number = 100
  ) {
    const results = [];
    
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(batch)
        .select();
      
      if (error) throw error;
      results.push(...data);
    }
    
    return results;
  }
  
  /**
   * Get dashboard data in single query (reduce round trips)
   */
  async getDashboardData(businessId: string) {
    // Single query with multiple CTEs instead of 5 separate queries
    const { data, error } = await supabase
      .rpc('get_dashboard_data', { p_business_id: businessId });
    
    return {
      todayRevenue: data?.today_revenue,
      monthRevenue: data?.month_revenue,
      pendingAppointments: data?.pending_appointments,
      recentTransactions: data?.recent_transactions,
      error
    };
  }
  
  /**
   * Get business summary with metrics
   */
  async getBusinessSummary(businessId: string) {
    const { data, error } = await supabase
      .rpc('get_business_summary', { p_business_id: businessId });
    
    return {
      transactions: data?.transactions,
      expenses: data?.expenses,
      outstandingCredit: data?.outstanding_credit,
      upcomingAppointments: data?.upcoming_appointments,
      netProfit: data?.net_profit,
      error
    };
  }
  
  /**
   * Get monthly report data
   */
  async getMonthlyReport(businessId: string, year: number, month: number) {
    const { data, error } = await supabase
      .rpc('get_monthly_report', { 
        p_business_id: businessId,
        p_year: year,
        p_month: month
      });
    
    return {
      period: data?.period,
      transactions: data?.transactions,
      expenses: data?.expenses,
      dailyBreakdown: data?.daily_breakdown,
      netProfit: data?.net_profit,
      error
    };
  }
  
  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(businessId: string, limit: number = 50) {
    const { data, error } = await supabase
      .rpc('get_customer_analytics', { 
        p_business_id: businessId,
        p_limit: limit
      });
    
    return {
      summary: data?.summary,
      topCustomers: data?.top_customers,
      error
    };
  }
  
  /**
   * Get quick stats for monitoring
   */
  async getQuickStats(businessId: string) {
    const { data, error } = await supabase
      .rpc('get_quick_stats', { p_business_id: businessId });
    
    return {
      totalTransactions: data?.total_transactions,
      totalExpenses: data?.total_expenses,
      totalAppointments: data?.total_appointments,
      totalCredit: data?.total_credit,
      todayActivity: data?.today_activity,
      upcomingAppointments: data?.upcoming_appointments,
      outstandingCredit: data?.outstanding_credit,
      error
    };
  }
  
  /**
   * Cursor-based pagination for expenses
   */
  async getExpensesCursor(
    businessId: string,
    cursor?: string,
    limit: number = 50
  ) {
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('business_id', businessId)
      .order('expense_date', { ascending: false })
      .limit(limit);
    
    if (cursor) {
      query = query.lt('expense_date', cursor);
    }
    
    const { data, error } = await query;
    
    const nextCursor = data?.length === limit 
      ? data[data.length - 1].expense_date 
      : null;
    
    return { data, nextCursor, error };
  }
  
  /**
   * Cursor-based pagination for appointments
   */
  async getAppointmentsCursor(
    businessId: string,
    cursor?: string,
    limit: number = 50
  ) {
    let query = supabase
      .from('appointments')
      .select('*')
      .eq('business_id', businessId)
      .order('appointment_date', { ascending: false })
      .limit(limit);
    
    if (cursor) {
      query = query.lt('appointment_date', cursor);
    }
    
    const { data, error } = await query;
    
    const nextCursor = data?.length === limit 
      ? data[data.length - 1].appointment_date 
      : null;
    
    return { data, nextCursor, error };
  }
  
  /**
   * Get credit items with cursor pagination
   */
  async getCreditCursor(
    businessId: string,
    cursor?: string,
    limit: number = 50
  ) {
    let query = supabase
      .from('credit')
      .select('*')
      .eq('business_id', businessId)
      .order('due_date', { ascending: true })
      .limit(limit);
    
    if (cursor) {
      query = query.gt('due_date', cursor);
    }
    
    const { data, error } = await query;
    
    const nextCursor = data?.length === limit 
      ? data[data.length - 1].due_date 
      : null;
    
    return { data, nextCursor, error };
  }
  
  /**
   * Search transactions by customer name (optimized)
   */
  async searchTransactionsByCustomer(
    businessId: string,
    customerName: string,
    limit: number = 20
  ) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('business_id', businessId)
      .ilike('customer_name', `%${customerName}%`)
      .order('transaction_date', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
  
  /**
   * Get transactions by date range (optimized)
   */
  async getTransactionsByDateRange(
    businessId: string,
    startDate: string,
    endDate: string,
    limit: number = 100
  ) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('business_id', businessId)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
  
  /**
   * Get expenses by supplier (optimized)
   */
  async getExpensesBySupplier(
    businessId: string,
    supplier: string,
    limit: number = 20
  ) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('business_id', businessId)
      .ilike('supplier', `%${supplier}%`)
      .order('expense_date', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
  
  /**
   * Get upcoming appointments (optimized)
   */
  async getUpcomingAppointments(
    businessId: string,
    days: number = 30
  ) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('business_id', businessId)
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .lte('appointment_date', new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .eq('status', 'scheduled')
      .order('appointment_date', { ascending: true });
    
    return { data, error };
  }
  
  /**
   * Get outstanding credit items (optimized)
   */
  async getOutstandingCredit(businessId: string) {
    const { data, error } = await supabase
      .from('credit')
      .select('*')
      .eq('business_id', businessId)
      .in('status', ['pending', 'partial'])
      .order('due_date', { ascending: true });
    
    return { data, error };
  }
  
  /**
   * Archive old data (call database function)
   */
  async archiveOldData(businessId?: string) {
    const results = [];
    
    // Archive transactions
    const { data: txResult } = await supabase.rpc('archive_old_transactions');
    if (txResult) results.push({ type: 'transactions', archived: txResult });
    
    // Archive expenses
    const { data: expResult } = await supabase.rpc('archive_old_expenses');
    if (expResult) results.push({ type: 'expenses', archived: expResult });
    
    // Archive appointments
    const { data: aptResult } = await supabase.rpc('archive_old_appointments');
    if (aptResult) results.push({ type: 'appointments', archived: aptResult });
    
    // Archive credit
    const { data: creditResult } = await supabase.rpc('archive_old_credit');
    if (creditResult) results.push({ type: 'credit', archived: creditResult });
    
    return results;
  }
  
  /**
   * Get estimated count to avoid full table scans
   */
  async getEstimatedCount(table: string, businessId?: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('get_estimated_count', { 
        p_table_name: table,
        p_business_id: businessId 
      });
    
    return data?.estimated_count || 0;
  }
  
  /**
   * Refresh materialized views
   */
  async refreshMaterializedViews(): Promise<{ success: boolean; views: string[] }> {
    const views = ['daily_transaction_summaries', 'monthly_business_metrics'];
    const results = [];
    
    for (const view of views) {
      const { error } = await supabase.rpc(`refresh_${view}`);
      if (!error) {
        results.push(view);
      }
    }
    
    return { success: results.length > 0, views: results };
  }
  
  /**
   * Get daily transaction summaries from materialized view
   */
  async getDailyTransactionSummaries(
    businessId: string, 
    startDate: string, 
    endDate: string
  ) {
    const { data, error } = await supabase
      .from('daily_transaction_summaries')
      .select('*')
      .eq('business_id', businessId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    return { data, error };
  }
  
  /**
   * Get monthly business metrics from materialized view
   */
  async getMonthlyBusinessMetrics(
    businessId: string, 
    year: number
  ) {
    const { data, error } = await supabase
      .from('monthly_business_metrics')
      .select('*')
      .eq('business_id', businessId)
      .eq('year', year)
      .order('month', { ascending: true });
    
    return { data, error };
  }
}

// Singleton instance
export const optimizedQueries = new OptimizedQueries();
