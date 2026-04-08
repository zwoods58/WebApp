// =====================================================
// DATABASE: Expenses Service
// PURPOSE: CRUD operations using hot/cold tables
// =====================================================

import { createClient } from '@supabase/supabase-js';

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
}

export const expensesService = new ExpensesService();
