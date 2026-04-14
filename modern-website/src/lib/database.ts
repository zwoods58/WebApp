import Dexie, { Table } from 'dexie';
import { optimizedQueries } from './db/optimized-queries';

// Define data types for IndexedDB
export interface StoredTransaction {
  id: string;
  business_id: string;
  amount: number;
  type: 'sale' | 'expense' | 'payment';
  description?: string;
  customer_id?: string;
  date: string;
  created_at: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
  _offlineId?: string;
}

export interface StoredInventory {
  id: string;
  business_id: string;
  item_name: string;      // ✅ Changed from "name" to "item_name"
  quantity: number;
  cost_price: number;
  selling_price: number;
  category?: string;
  threshold?: number;      // ✅ Added threshold
  unit?: string;           // ✅ Added unit
  supplier?: string;       // ✅ Added supplier
  last_ordered?: string;   // ✅ Added last_ordered
  syncStatus: 'synced' | 'pending' | 'conflict';
  _offlineId?: string;
  _pendingUpdate?: string;
  _deleted?: boolean;
  _deletedAt?: number;
}

export interface StoredCredit {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  paid_amount: number;
  status: 'outstanding' | 'partial' | 'paid';
  date_given?: string;     // ✅ Added date_given
  due_date?: string;       // ✅ Added due_date
  syncStatus: 'synced' | 'pending' | 'conflict';
  _offlineId?: string;
  _pendingUpdate?: string;
  _deleted?: boolean;
  _deletedAt?: number;
}

export interface StoredExpense {
  id: string;
  business_id: string;
  amount: number;
  category?: string;
  description?: string;
  expense_date: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface StoredTarget {
  id: string;
  business_id: string;
  target_amount: number;
  target_type: string;
  period_start?: string;
  period_end?: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface StoredService {
  id: string;
  business_id: string;
  service_name: string;
  price: number;
  description?: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface StoredAppointment {
  // Primary fields
  id: string;
  business_id: string;
  industry: string;
  
  // Customer info
  customer_name: string;
  customer_contact?: string;
  
  // Service reference
  service_id?: string;
  service_name?: string;
  
  // Timing
  appointment_date: string;
  appointment_time: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  
  // Status & tracking
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminder_sent?: boolean;
  metadata?: Record<string, any>;
  
  // Audit trail
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  
  // Sync metadata
  syncStatus: 'synced' | 'pending' | 'conflict';
  _deleted?: boolean;
  _deletedAt?: number;
}

// Credit items interface (for credit line items)
export interface StoredCreditItem {
  id: string;
  credit_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  syncStatus: 'synced' | 'pending' | 'conflict';
  _offlineId?: string;
  _pendingUpdate?: string;
  _deleted?: boolean;
  _deletedAt?: number;
}

// Offline operation queue
// BeeHive table interfaces matching Supabase schema
export interface StoredBeehiveRequest {
  id: string;
  business_id: string;
  user_id?: string;
  country: string;
  industry: string;
  title: string;
  description: string;
  category?: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  is_featured: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  deleted_by?: string;
  created_by?: string;
  updated_by?: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
  _offlineId?: string;
  _pendingUpdate?: string;
  _deleted?: boolean;
  _deletedAt?: number;
}

export interface StoredBeehiveVote {
  id: string;
  request_id: string;
  business_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
  updated_at: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
  _offlineId?: string;
  _pendingUpdate?: string;
  _deleted?: boolean;
  _deletedAt?: number;
}

export interface StoredBeehiveComment {
  id: string;
  request_id: string;
  business_id: string;
  comment_text: string;
  parent_comment_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  deleted_by?: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
  _offlineId?: string;
  _pendingUpdate?: string;
  _deleted?: boolean;
  _deletedAt?: number;
}

export interface QueuedOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  table: 'transactions' | 'inventory' | 'credit' | 'expenses' | 'services' | 'targets' | 'appointments' | 'beehive_requests' | 'beehive_votes' | 'beehive_comments';
  entityId?: string;
  data: any;
  timestamp: number;
  idempotencyKey: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
  errorMessage?: string;
  businessId: string;
  userId?: string; // User who performed the operation
}

export class BeezeeDatabase extends Dexie {
  transactions!: Table<StoredTransaction, string>;
  inventory!: Table<StoredInventory, string>;
  credit!: Table<StoredCredit, string>;
  credit_items!: Table<StoredCreditItem, string>;
  expenses!: Table<StoredExpense, string>;
  targets!: Table<StoredTarget, string>;
  services!: Table<StoredService, string>;
  appointments!: Table<StoredAppointment, string>;
  beehive_requests!: Table<StoredBeehiveRequest, string>;
  beehive_votes!: Table<StoredBeehiveVote, string>;
  beehive_comments!: Table<StoredBeehiveComment, string>;
  operations_queue!: Table<QueuedOperation, string>;
  sync_metadata!: Table<any, string>;

  constructor() {
    super('beezee_offline_db_v6');
    
    // Version 1
    this.version(1).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    });

    // Version 2: Add missing tables
    this.version(2).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      appointments: 'id, business_id, appointment_date, status, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    });

    // Version 3: Fix credit schema (rename paid to paid_amount)
    this.version(3).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      appointments: 'id, business_id, appointment_date, status, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    }).upgrade(async (tx) => {
      // Migrate existing credit records from "paid" to "paid_amount"
      const creditStore = tx.table('credit');
      const allCredits = await creditStore.toArray();
      
      for (const credit of allCredits) {
        const updatedCredit: any = { ...credit };
        
        // Rename paid to paid_amount
        if (credit.paid !== undefined && credit.paid_amount === undefined) {
          updatedCredit.paid_amount = credit.paid;
          delete updatedCredit.paid;
          await creditStore.update(credit.id, updatedCredit);
        }
        
        // Set default paid_amount if missing
        if (updatedCredit.paid_amount === undefined) {
          updatedCredit.paid_amount = 0;
          await creditStore.update(credit.id, updatedCredit);
        }
      }
    });

    // ✅ Version 4: Fix inventory schema (rename name to item_name, add missing fields)
    this.version(4).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, item_name, category, syncStatus',  // ✅ Changed name to item_name
      credit: 'id, business_id, customer_name, status, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      appointments: 'id, business_id, appointment_date, status, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    }).upgrade(async (tx) => {
      // Migrate existing inventory records from "name" to "item_name"
      const inventoryStore = tx.table('inventory');
      const allItems = await inventoryStore.toArray();
      
      for (const item of allItems) {
        const updatedItem: any = { ...item };
        let needsUpdate = false;
        
        // Rename name to item_name
        if (item.name !== undefined && updatedItem.item_name === undefined) {
          updatedItem.item_name = item.name;
          delete updatedItem.name;
          needsUpdate = true;
        }
        
        // Add default threshold if missing
        if (updatedItem.threshold === undefined) {
          updatedItem.threshold = 10;
          needsUpdate = true;
        }
        
        // Add default unit if missing
        if (updatedItem.unit === undefined) {
          updatedItem.unit = 'units';
          needsUpdate = true;
        }
        
        // Add default supplier if missing
        if (updatedItem.supplier === undefined) {
          updatedItem.supplier = '';
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await inventoryStore.update(item.id, updatedItem);
          console.log(`✅ Migrated inventory ${item.id}: ${item.name || 'unknown'} -> ${updatedItem.item_name}`);
        }
      }
    });

    // ✅ Version 5: Add appointments table with exact frontend interface match
    this.version(5).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, item_name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      appointments: 'id, business_id, appointment_date, status, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      calendar: 'id, business_id, appointment_date, status, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    });

    // ✅ Version 7: Rename calendar to appointments for consistency
    this.version(7).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, item_name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      appointments: 'id, business_id, appointment_date, status, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    }).upgrade(async (tx) => {
      // Migrate existing calendar data to appointments table
      const calendarStore = tx.table('calendar');
      const appointmentsStore = tx.table('appointments');
      
      try {
        const allCalendarItems = await calendarStore.toArray();
        
        for (const calendarItem of allCalendarItems) {
          // Convert calendar to appointment format (same structure)
          const appointmentItem = {
            ...calendarItem,
            // No field changes needed - structure is identical
          };
          
          await appointmentsStore.put(appointmentItem);
        }
        
        console.log(`✅ Migrated ${allCalendarItems.length} calendar items to appointments table`);
      } catch (error) {
        console.warn('⚠️ Failed to migrate calendar to appointments:', error);
      }
    });

    // ✅ Version 8: Clean schema - calendar fully removed
    this.version(8).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, item_name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      appointments: 'id, business_id, appointment_date, status, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    });

    // Version 9: Complete appointment schema alignment with Supabase
    this.version(9).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, item_name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      appointments: 'id, business_id, appointment_date, start_time, end_time, status, service_id, syncStatus',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    });

    // Version 10: Add BeeHive tables for feature requests and community voting
    this.version(10).stores({
      transactions: 'id, business_id, type, date, syncStatus, created_at',
      inventory: 'id, business_id, item_name, category, syncStatus',
      credit: 'id, business_id, customer_name, status, syncStatus',
      credit_items: 'id, credit_id, item_name, quantity, unit_price, total_amount, syncStatus',
      expenses: 'id, business_id, expense_date, category, syncStatus',
      targets: 'id, business_id, target_type, syncStatus',
      services: 'id, business_id, service_name, syncStatus',
      appointments: 'id, business_id, appointment_date, start_time, end_time, status, service_id, syncStatus',
      beehive_requests: 'id, business_id, country, industry, status, category, priority, syncStatus, created_at',
      beehive_votes: 'id, request_id, business_id, vote_type, syncStatus, created_at',
      beehive_comments: 'id, request_id, business_id, syncStatus, created_at',
      operations_queue: 'id, type, table, status, timestamp, businessId',
      sync_metadata: '++id, lastSyncTime, syncStatus, pendingCount'
    });
  }

  async initialize(businessId: string) {
    // Check if we have sync metadata for this business
    const metadata = await this.sync_metadata
      .where('businessId')
      .equals(businessId)
      .first();
    
    if (!metadata) {
      await this.sync_metadata.add({
        businessId,
        lastSyncTime: 0,
        syncStatus: 'idle',
        pendingCount: 0,
        conflicts: []
      });
    }
  }

  async getPendingCount(businessId: string): Promise<number> {
    return await this.operations_queue
      .where('businessId')
      .equals(businessId)
      .and(op => op.status === 'pending')
      .count();
  }

  // =====================================================
  // Optimized Query Integration (Phase 2)
  // =====================================================

  /**
   * Get business summary using optimized database function
   */
  async getBusinessSummaryOptimized(businessId: string) {
    try {
      return await optimizedQueries.getBusinessSummary(businessId);
    } catch (error) {
      console.error('Failed to get optimized business summary:', error);
      return null;
    }
  }

  /**
   * Get dashboard data using optimized database function
   */
  async getDashboardDataOptimized(businessId: string) {
    try {
      return await optimizedQueries.getDashboardData(businessId);
    } catch (error) {
      console.error('Failed to get optimized dashboard data:', error);
      return null;
    }
  }

  /**
   * Get monthly report using optimized database function
   */
  async getMonthlyReportOptimized(businessId: string, year: number, month: number) {
    try {
      return await optimizedQueries.getMonthlyReport(businessId, year, month);
    } catch (error) {
      console.error('Failed to get optimized monthly report:', error);
      return null;
    }
  }

  /**
   * Get customer analytics using optimized database function
   */
  async getCustomerAnalyticsOptimized(businessId: string, limit: number = 50) {
    try {
      return await optimizedQueries.getCustomerAnalytics(businessId, limit);
    } catch (error) {
      console.error('Failed to get optimized customer analytics:', error);
      return null;
    }
  }

  /**
   * Get quick stats using optimized database function
   */
  async getQuickStatsOptimized(businessId: string) {
    try {
      return await optimizedQueries.getQuickStats(businessId);
    } catch (error) {
      console.error('Failed to get optimized quick stats:', error);
      return null;
    }
  }

  /**
   * Get transactions with cursor pagination
   */
  async getTransactionsCursor(businessId: string, cursor?: string, limit: number = 50) {
    try {
      return await optimizedQueries.getTransactionsCursor(businessId, cursor, limit);
    } catch (error) {
      console.error('Failed to get transactions with cursor:', error);
      return { data: [], nextCursor: null, error };
    }
  }

  /**
   * Get expenses with cursor pagination
   */
  async getExpensesCursor(businessId: string, cursor?: string, limit: number = 50) {
    try {
      return await optimizedQueries.getExpensesCursor(businessId, cursor, limit);
    } catch (error) {
      console.error('Failed to get expenses with cursor:', error);
      return { data: [], nextCursor: null, error };
    }
  }

  /**
   * Get appointments with cursor pagination
   */
  async getAppointmentsCursor(businessId: string, cursor?: string, limit: number = 50) {
    try {
      return await optimizedQueries.getAppointmentsCursor(businessId, cursor, limit);
    } catch (error) {
      console.error('Failed to get appointments with cursor:', error);
      return { data: [], nextCursor: null, error };
    }
  }

  /**
   * Get estimated count to avoid full table scans
   */
  async getEstimatedCount(table: string, businessId?: string): Promise<number> {
    try {
      return await optimizedQueries.getEstimatedCount(table, businessId);
    } catch (error) {
      console.error('Failed to get estimated count:', error);
      return 0;
    }
  }

  /**
   * Refresh materialized views for performance
   */
  async refreshMaterializedViews() {
    try {
      return await optimizedQueries.refreshMaterializedViews();
    } catch (error) {
      console.error('Failed to refresh materialized views:', error);
      return { success: false, views: [] };
    }
  }

  /**
   * Get daily transaction summaries from materialized view
   */
  async getDailyTransactionSummaries(businessId: string, startDate: string, endDate: string) {
    try {
      return await optimizedQueries.getDailyTransactionSummaries(businessId, startDate, endDate);
    } catch (error) {
      console.error('Failed to get daily transaction summaries:', error);
      return { data: [], error };
    }
  }

  /**
   * Get monthly business metrics from materialized view
   */
  async getMonthlyBusinessMetrics(businessId: string, year: number) {
    try {
      return await optimizedQueries.getMonthlyBusinessMetrics(businessId, year);
    } catch (error) {
      console.error('Failed to get monthly business metrics:', error);
      return { data: [], error };
    }
  }

  /**
   * Archive old data using optimized functions
   */
  async archiveOldDataOptimized(businessId?: string) {
    try {
      return await optimizedQueries.archiveOldData(businessId);
    } catch (error) {
      console.error('Failed to archive old data:', error);
      return [];
    }
  }
}

export const db = new BeezeeDatabase();