// =====================================================
// DATABASE: Expenses Service
// PURPOSE: CRUD operations using hot/cold tables with cursor pagination
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { optimizedQueries } from './optimized-queries';

export interface Expense {
  id?: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: Date;
  updated_at?: Date;
}

class ExpensesService {
  private supabase;
  private hotTable = 'expenses_hot';
  private coldTable = 'expenses_cold';

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Create a new expense (always goes to hot table)
   */
  async create(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Expense | null; error: Error | null }> {
    const { data, error } = await this.supabase
      .from(this.hotTable)
      .insert(expense)
      .select()
      .single();
    
    return { data, error: error as Error | null };
  }

  /**
   * Get an expense by ID (checks hot first, then cold)
   */
  async getById(id: string): Promise<Expense | null> {
    // Try hot table first
    let { data } = await this.supabase
      .from(this.hotTable)
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) return data;
    
    // Fall back to cold table
    const { data: coldData } = await this.supabase
      .from(this.coldTable)
      .select('*')
      .eq('original_id', id)
      .single();
    
    return coldData;
  }

  /**
   * List user's expenses (recent first, from hot table)
   */
  async listByUser(userId: string, options: { limit?: number; offset?: number; status?: string } = {}): Promise<Expense[]> {
    let query = this.supabase
      .from(this.hotTable)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }
    
    if (options.status) {
      query = query.eq('status', options.status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Failed to list expenses:', error);
      return [];
    }
    
    return data || [];
  }

  /**
   * Update an expense
   */
  async update(id: string, updates: Partial<Expense>): Promise<{ success: boolean; error?: Error }> {
    const { error } = await this.supabase
      .from(this.hotTable)
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id);
    
    if (error) {
      return { success: false, error: error as Error };
    }
    
    return { success: true };
  }

  /**
   * Delete an expense (soft delete by moving to cold)
   */
  async delete(id: string): Promise<boolean> {
    // Move to cold table before deleting
    const expense = await this.getById(id);
    if (!expense) return false;
    
    const { error: insertError } = await this.supabase
      .from(this.coldTable)
      .insert({ ...expense, original_id: id, archived_at: new Date() });
    
    if (insertError) return false;
    
    const { error: deleteError } = await this.supabase
      .from(this.hotTable)
      .delete()
      .eq('id', id);
    
    return !deleteError;
  }

  /**
   * Get expense summary (aggregated)
   */
  async getSummary(userId: string, months: number = 12): Promise<{
    total_amount: number;
    average_amount: number;
    top_categories: Record<string, number>;
    monthly_trend: Array<{ month: string; amount: number }>;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    const { data, error } = await this.supabase
      .from(this.hotTable)
      .select('amount, category, created_at')
      .eq('user_id', userId)
      .gte('created_at', cutoffDate.toISOString());
    
    if (error || !data) {
      return {
        total_amount: 0,
        average_amount: 0,
        top_categories: {},
        monthly_trend: [],
      };
    }
    
    const total_amount = data.reduce((sum, e) => sum + e.amount, 0);
    const average_amount = data.length ? total_amount / data.length : 0;
    
    const top_categories: Record<string, number> = {};
    for (const expense of data) {
      top_categories[expense.category] = (top_categories[expense.category] || 0) + expense.amount;
    }
    
    // Monthly trend
    const monthly_map: Record<string, number> = {};
    for (const expense of data) {
      const month = new Date(expense.created_at).toISOString().slice(0, 7);
      monthly_map[month] = (monthly_map[month] || 0) + expense.amount;
    }
    
    const monthly_trend = Object.entries(monthly_map)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    return {
      total_amount,
      average_amount,
      top_categories,
      monthly_trend,
    };
  }

  // =====================================================
  // Phase 2 Optimizations: Cursor Pagination & Batch Operations
  // =====================================================

  /**
   * Get expenses with cursor pagination (optimized for large datasets)
   */
  async getExpensesCursor(
    businessId: string,
    cursor?: string,
    limit: number = 50
  ): Promise<{
    data: Expense[];
    nextCursor: string | null;
    hasMore: boolean;
    error?: any;
  }> {
    try {
      // Use optimized queries for cursor pagination
      const result = await optimizedQueries.getExpensesCursor(businessId, cursor, limit);
      
      // Transform to match Expense interface
      const expenses = result.data?.map(item => ({
        id: item.id,
        user_id: item.business_id, // Map business_id to user_id for compatibility
        amount: item.amount,
        description: item.description || '',
        category: item.category || 'uncategorized',
        status: 'approved' as const, // Default status since schema doesn't have it
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        updated_at: new Date()
      })) || [];

      return {
        data: expenses,
        nextCursor: result.nextCursor,
        hasMore: !!result.nextCursor,
        error: result.error
      };
    } catch (cursorError) {
      console.error('Cursor pagination failed, falling back to offset:', cursorError);
      
      // Fallback to traditional offset-based pagination
      let query = this.supabase
        .from(this.hotTable)
        .select('*')
        .eq('user_id', businessId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (cursor) {
        const cursorDate = new Date(cursor);
        query = query.lt('created_at', cursorDate.toISOString());
      }
      
      const { data, error } = await query;
      
      const expenses = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        amount: item.amount,
        description: item.description,
        category: item.category,
        status: item.status,
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
      })) || [];

      const nextCursor = data?.length === limit 
        ? data[data.length - 1].created_at 
        : null;

      return {
        data: expenses,
        nextCursor,
        hasMore: !!nextCursor,
        error
      };
    }
  }

  /**
   * Batch insert expenses (optimized for high-volume operations)
   */
  async batchInsertExpenses(
    expenses: Array<Omit<Expense, 'id' | 'created_at' | 'updated_at'>>,
    batchSize: number = 100
  ): Promise<{ data: Expense[]; errors: any[] }> {
    const results: Expense[] = [];
    const errors: any[] = [];
    
    for (let i = 0; i < expenses.length; i += batchSize) {
      const batch = expenses.slice(i, i + batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from(this.hotTable)
          .insert(batch)
          .select();
        
        if (error) {
          errors.push({ batch: i / batchSize + 1, error });
        } else if (data) {
          results.push(...data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            amount: item.amount,
            description: item.description,
            category: item.category,
            status: item.status,
            created_at: item.created_at ? new Date(item.created_at) : new Date(),
            updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
          })));
        }
      } catch (error) {
        errors.push({ batch: i / batchSize + 1, error });
      }
    }
    
    return { data: results, errors };
  }

  /**
   * Get expenses by date range (optimized)
   */
  async getExpensesByDateRange(
    businessId: string,
    startDate: string,
    endDate: string,
    limit: number = 100
  ): Promise<{ data: Expense[]; error?: any }> {
    try {
      // Use optimized query
      const result = await optimizedQueries.getTransactionsByDateRange(
        businessId, 
        startDate, 
        endDate, 
        limit
      );
      
      // Transform to match Expense interface
      const expenses = result.data?.map(item => ({
        id: item.id,
        user_id: item.business_id,
        amount: item.amount,
        description: item.description || '',
        category: item.category || 'uncategorized',
        status: 'approved' as const,
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        updated_at: new Date()
      })) || [];

      return { data: expenses, error: result.error };
    } catch (dateRangeError) {
      console.error('Optimized date range query failed, falling back:', dateRangeError);
      
      // Fallback to regular query
      const { data, error } = await this.supabase
        .from(this.hotTable)
        .select('*')
        .eq('user_id', businessId)
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .order('expense_date', { ascending: false })
        .limit(limit);
      
      const expenses = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        amount: item.amount,
        description: item.description,
        category: item.category,
        status: item.status,
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
      })) || [];

      return { data: expenses, error };
    }
  }

  /**
   * Get expenses by supplier (optimized)
   */
  async getExpensesBySupplier(
    businessId: string,
    supplier: string,
    limit: number = 20
  ): Promise<{ data: Expense[]; error?: any }> {
    try {
      // Use optimized query
      const result = await optimizedQueries.getExpensesBySupplier(businessId, supplier, limit);
      
      // Transform to match Expense interface
      const expenses = result.data?.map(item => ({
        id: item.id,
        user_id: item.business_id,
        amount: item.amount,
        description: item.description || '',
        category: item.category || 'uncategorized',
        status: 'approved' as const,
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        updated_at: new Date()
      })) || [];

      return { data: expenses, error: result.error };
    } catch (supplierError) {
      console.error('Optimized supplier query failed, falling back:', supplierError);
      
      // Fallback to regular query
      const { data, error } = await this.supabase
        .from(this.hotTable)
        .select('*')
        .eq('user_id', businessId)
        .ilike('supplier', `%${supplier}%`)
        .order('expense_date', { ascending: false })
        .limit(limit);
      
      const expenses = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        amount: item.amount,
        description: item.description,
        category: item.category,
        status: item.status,
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
      })) || [];

      return { data: expenses, error };
    }
  }

  /**
   * Get estimated count (avoids full table scans)
   */
  async getEstimatedCount(businessId: string): Promise<number> {
    try {
      return await optimizedQueries.getEstimatedCount('expenses', businessId);
    } catch (error) {
      console.error('Estimated count failed, using fallback:', error);
      return 0; // Conservative estimate
    }
  }
}

export const expensesService = new ExpensesService();

