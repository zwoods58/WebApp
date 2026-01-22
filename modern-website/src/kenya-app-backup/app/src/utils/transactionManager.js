import { supabase } from './supabase';
import { formatCurrency, parseCurrency } from './currency';
import { formatDate, formatDateTime, getRelativeTime, isToday, isYesterday, isThisWeek, isThisMonth } from './dateTime';

/**
 * Comprehensive Transaction Management System
 * Handles all transaction operations with filtering, sorting, and export capabilities
 */

export class TransactionManager {
  constructor() {
    this.storageKey = 'beezee_transactions_cache';
    this.categories = {
      income: [
        'Sales', 'Services', 'Investments', 'Loans Received', 
        'Gifts', 'Refunds', 'Other Income'
      ],
      expense: [
        'Supplies', 'Rent', 'Utilities', 'Marketing', 'Transport',
        'Food', 'Equipment', 'Taxes', 'Loan Payments', 'Other Expenses'
      ]
    };
  }

  /**
   * Get transactions with filtering and pagination
   */
  async getTransactions(userId, filters = {}, pagination = {}) {
    try {
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      query = this.applyFilters(query, filters);

      // Apply sorting
      if (filters.sortBy) {
        const ascending = filters.sortOrder === 'asc';
        query = query.order(filters.sortBy, { ascending });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (pagination.limit) {
        query = query.limit(pagination.limit);
      }
      if (pagination.offset) {
        query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Format transactions for display
      const formattedTransactions = data.map(transaction => this.formatTransaction(transaction));

      return {
        success: true,
        transactions: formattedTransactions,
        total: count || 0,
        filters: this.getAppliedFilters(filters)
      };
    } catch (error) {
      console.error('Error getting transactions:', error);
      return {
        success: false,
        transactions: [],
        total: 0,
        error: 'Failed to load transactions'
      };
    }
  }

  /**
   * Apply filters to query
   */
  applyFilters(query, filters) {
    // Date range filter
    if (filters.dateRange) {
      const { startDate, endDate } = this.getDateRange(filters.dateRange);
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
    } else if (filters.startDate && filters.endDate) {
      query = query.gte('date', filters.startDate).lte('date', filters.endDate);
    }

    // Transaction type filter
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      query = query.eq('payment_method', filters.paymentMethod);
    }

    // Amount range filter
    if (filters.minAmount) {
      query = query.gte('amount', parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      query = query.lte('amount', parseFloat(filters.maxAmount));
    }

    // Search filter
    if (filters.search) {
      query = query.or(`description.ilike.%${filters.search}%,reference.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
    }

    return query;
  }

  /**
   * Get date range for predefined periods
   */
  getDateRange(period) {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'thisWeek':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'lastWeek':
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
        startDate = new Date(lastWeekStart.getFullYear(), lastWeekStart.getMonth(), lastWeekStart.getDate());
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 7);
        endDate = new Date(lastWeekEnd.getFullYear(), lastWeekEnd.getMonth(), lastWeekEnd.getDate());
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        startDate = null;
        endDate = null;
    }

    return {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    };
  }

  /**
   * Get applied filters summary
   */
  getAppliedFilters(filters) {
    const applied = [];
    
    if (filters.dateRange) {
      applied.push(`Period: ${filters.dateRange}`);
    }
    if (filters.type && filters.type !== 'all') {
      applied.push(`Type: ${filters.type}`);
    }
    if (filters.category && filters.category !== 'all') {
      applied.push(`Category: ${filters.category}`);
    }
    if (filters.status && filters.status !== 'all') {
      applied.push(`Status: ${filters.status}`);
    }
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      applied.push(`Payment: ${filters.paymentMethod}`);
    }
    if (filters.search) {
      applied.push(`Search: "${filters.search}"`);
    }

    return applied;
  }

  /**
   * Format transaction for display
   */
  formatTransaction(transaction) {
    return {
      ...transaction,
      formattedAmount: formatCurrency(transaction.amount),
      formattedDate: formatDate(transaction.date),
      formattedDateTime: formatDateTime(transaction.date),
      relativeTime: getRelativeTime(transaction.date),
      statusIcon: this.getStatusIcon(transaction.status),
      typeIcon: this.getTypeIcon(transaction.type),
      isToday: isToday(transaction.date),
      isYesterday: isYesterday(transaction.date),
      isThisWeek: isThisWeek(transaction.date),
      isThisMonth: isThisMonth(transaction.date)
    };
  }

  /**
   * Get status icon
   */
  getStatusIcon(status) {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      case 'cancelled': return '🚫';
      default: return '❓';
    }
  }

  /**
   * Get type icon
   */
  getTypeIcon(type) {
    switch (type) {
      case 'income': return '💰';
      case 'expense': return '💸';
      default: return '📄';
    }
  }

  /**
   * Create new transaction
   */
  async createTransaction(userId, transactionData) {
    try {
      const transaction = {
        user_id: userId,
        type: transactionData.type,
        amount: parseFloat(parseCurrency(transactionData.amount)),
        currency: transactionData.currency || 'KES',
        category: transactionData.category,
        description: transactionData.description,
        date: transactionData.date || new Date().toISOString(),
        payment_method: transactionData.paymentMethod,
        reference: transactionData.reference || this.generateReference(),
        status: transactionData.status || 'completed',
        notes: transactionData.notes,
        receipt_url: transactionData.receiptUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;

      // Cache locally for offline access
      this.cacheTransaction(data);

      return {
        success: true,
        transaction: this.formatTransaction(data)
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return {
        success: false,
        error: 'Failed to create transaction'
      };
    }
  }

  /**
   * Update existing transaction
   */
  async updateTransaction(transactionId, updates) {
    try {
      const updateData = {
        ...updates,
        amount: updates.amount ? parseFloat(parseCurrency(updates.amount)) : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        transaction: this.formatTransaction(data)
      };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return {
        success: false,
        error: 'Failed to update transaction'
      };
    }
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(transactionId) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return {
        success: false,
        error: 'Failed to delete transaction'
      };
    }
  }

  /**
   * Generate transaction reference
   */
  generateReference() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
  }

  /**
   * Export transactions to CSV
   */
  async exportToCSV(userId, filters = {}) {
    try {
      const { transactions } = await this.getTransactions(userId, filters, { limit: 10000 });
      
      const headers = [
        'Transaction ID',
        'Date',
        'Type',
        'Category',
        'Description',
        'Amount',
        'Currency',
        'Payment Method',
        'Reference',
        'Status',
        'Notes'
      ];

      const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
          t.id,
          t.formattedDate,
          t.type,
          t.category,
          `"${t.description}"`,
          t.amount,
          t.currency,
          t.payment_method,
          t.reference,
          t.status,
          `"${t.notes || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const filename = `beezee_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return {
        success: false,
        error: 'Failed to export transactions'
      };
    }
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(userId, filters = {}) {
    try {
      const { transactions } = await this.getTransactions(userId, filters, { limit: 10000 });
      
      const stats = {
        totalTransactions: transactions.length,
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        averageTransaction: 0,
        categories: {},
        paymentMethods: {},
        statusCount: {
          completed: 0,
          pending: 0,
          failed: 0,
          cancelled: 0
        }
      };

      transactions.forEach(transaction => {
        const amount = transaction.amount;
        
        if (transaction.type === 'income') {
          stats.totalIncome += amount;
        } else {
          stats.totalExpenses += amount;
        }

        // Category stats
        if (!stats.categories[transaction.category]) {
          stats.categories[transaction.category] = { count: 0, amount: 0 };
        }
        stats.categories[transaction.category].count++;
        stats.categories[transaction.category].amount += amount;

        // Payment method stats
        if (!stats.paymentMethods[transaction.payment_method]) {
          stats.paymentMethods[transaction.payment_method] = { count: 0, amount: 0 };
        }
        stats.paymentMethods[transaction.payment_method].count++;
        stats.paymentMethods[transaction.payment_method].amount += amount;

        // Status stats
        if (stats.statusCount[transaction.status] !== undefined) {
          stats.statusCount[transaction.status]++;
        }
      });

      stats.netAmount = stats.totalIncome - stats.totalExpenses;
      stats.averageTransaction = transactions.length > 0 ? (stats.totalIncome + stats.totalExpenses) / transactions.length : 0;

      // Format monetary values
      stats.formattedTotalIncome = formatCurrency(stats.totalIncome);
      stats.formattedTotalExpenses = formatCurrency(stats.totalExpenses);
      stats.formattedNetAmount = formatCurrency(stats.netAmount);
      stats.formattedAverageTransaction = formatCurrency(stats.averageTransaction);

      return { success: true, stats };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        success: false,
        stats: null
      };
    }
  }

  /**
   * Cache transaction locally
   */
  cacheTransaction(transaction) {
    try {
      const cached = this.getCachedTransactions();
      cached.push(transaction);
      localStorage.setItem(this.storageKey, JSON.stringify(cached));
    } catch (error) {
      console.error('Error caching transaction:', error);
    }
  }

  /**
   * Get cached transactions
   */
  getCachedTransactions() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading cached transactions:', error);
      return [];
    }
  }

  /**
   * Clear cached transactions
   */
  clearCache() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get available categories
   */
  getCategories(type = null) {
    if (type) {
      return this.categories[type] || [];
    }
    return {
      income: this.categories.income,
      expense: this.categories.expense
    };
  }

  /**
   * Get available payment methods
   */
  getPaymentMethods() {
    return [
      'Cash',
      'M-Pesa',
      'Card',
      'Bank Transfer',
      'Mobile Money',
      'Cheque',
      'Other'
    ];
  }
}

// Create singleton instance
export const transactionManager = new TransactionManager();
