import Dexie, { Table } from 'dexie';

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

export interface StoredAppointment {
  id: string;
  business_id: string;
  customer_name?: string;
  appointment_date: string;
  status?: string;
  notes?: string;
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

// Offline operation queue
export interface QueuedOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  table: 'transactions' | 'inventory' | 'credit' | 'expenses' | 'services' | 'targets' | 'appointments';
  entityId?: string;
  data: any;
  timestamp: number;
  idempotencyKey: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
  errorMessage?: string;
  businessId: string;
}

export class BeezeeDatabase extends Dexie {
  transactions!: Table<StoredTransaction, string>;
  inventory!: Table<StoredInventory, string>;
  credit!: Table<StoredCredit, string>;
  expenses!: Table<StoredExpense, string>;
  targets!: Table<StoredTarget, string>;
  appointments!: Table<StoredAppointment, string>;
  services!: Table<StoredService, string>;
  operations_queue!: Table<QueuedOperation, string>;
  sync_metadata!: Table<any, string>;

  constructor() {
    super('beezee_offline_db_v4');
    
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
}

export const db = new BeezeeDatabase();