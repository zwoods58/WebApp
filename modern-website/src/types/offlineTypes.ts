/**
 * Offline-First Architecture Type Definitions
 * Covers all app features: Beehive, Cash, Inventory, Calendar, Credit
 */

// Base offline operation interface
export interface BaseOfflineOperation {
  id: string;
  timestamp: number;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  retryCount: number;
  priority: 'high' | 'medium' | 'low';
  userId: string;
  idempotencyKey: string;
  syncedAt?: number;
  errorDetails?: string;
  retryAfter?: number;
}

// Beehive offline operations
export interface BeehiveOfflineOperation extends BaseOfflineOperation {
  feature: 'beehive';
  type: 'create_post' | 'comment' | 'like' | 'profile_update' | 'upload_image';
  data: {
    postId?: string;
    content: string;
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
    industry?: string;
    country?: string;
    userId?: string;
    businessId?: string;
    images?: File[];
    commentId?: string;
    profileData?: {
      businessName?: string;
      avatar?: string;
      bio?: string;
    };
  };
}

// Cash/Transactions offline operations
export interface CashOfflineOperation extends BaseOfflineOperation {
  feature: 'cash';
  type: 'sale' | 'expense' | 'transfer' | 'payment_method_update';
  data: {
    amount: number;
    customerId?: string;
    category: string;
    description: string;
    paymentMethod: string;
    transferTo?: string;
    expenseCategory?: string;
    receiptNumber?: string;
  };
}

// Inventory/Services offline operations
export interface InventoryOfflineOperation extends BaseOfflineOperation {
  feature: 'inventory';
  type: 'add_item' | 'update_stock' | 'price_change' | 'service_update' | 'stock_adjustment';
  data: {
    itemId?: string;
    itemName: string;
    stockLevel?: number;
    price?: number;
    costPrice?: number;
    serviceName?: string;
    availability?: boolean;
    category?: string;
    unit?: string;
    threshold?: number;
    supplier?: string;
    adjustmentReason?: string;
    previousStock?: number;
  };
}

// Calendar/Appointments offline operations
export interface CalendarOfflineOperation extends BaseOfflineOperation {
  feature: 'calendar';
  type: 'create_appointment' | 'reschedule' | 'cancel' | 'reminder' | 'booking_update';
  data: {
    appointmentId?: string;
    customerId: string;
    dateTime: Date;
    service: string;
    duration: number;
    notes?: string;
    previousDateTime?: Date;
    reminderTime?: Date;
    status?: 'scheduled' | 'completed' | 'cancelled';
  };
}

// Credit Management offline operations
export interface CreditOfflineOperation extends BaseOfflineOperation {
  feature: 'credit';
  type: 'issue_credit' | 'repayment' | 'limit_update' | 'customer_update' | 'credit_score_update';
  data: {
    customerId: string;
    amount?: number;
    creditType: string;
    terms?: string;
    newLimit?: number;
    repaymentAmount?: number;
    paymentMethod?: string;
    customerData?: {
      name?: string;
      phone?: string;
      address?: string;
    };
    creditScore?: number;
  };
}

// Union type for all offline operations
export type OfflineOperation = 
  | BeehiveOfflineOperation 
  | CashOfflineOperation 
  | InventoryOfflineOperation 
  | CalendarOfflineOperation 
  | CreditOfflineOperation;

// Sync status interface
export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number;
  pendingItems: {
    total: number;
    beehive: number;
    cash: number;
    inventory: number;
    calendar: number;
    credit: number;
  };
  errors: string[];
  featureStatus: {
    beehive: 'online' | 'offline' | 'syncing' | 'error';
    cash: 'online' | 'offline' | 'syncing' | 'error';
    inventory: 'online' | 'offline' | 'syncing' | 'error';
    calendar: 'online' | 'offline' | 'syncing' | 'error';
    credit: 'online' | 'offline' | 'syncing' | 'error';
  };
}

// Offline queue interface
export interface OfflineQueue {
  operations: OfflineOperation[];
  lastProcessed: number;
  totalProcessed: number;
  failedOperations: OfflineOperation[];
}

// Feature-specific data interfaces
export interface PendingPost {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  status: 'pending' | 'synced';
  images?: string[];
  comments?: PendingComment[];
  likes?: number;
}

export interface PendingComment {
  id: string;
  postId: string;
  content: string;
  author: string;
  timestamp: number;
  status: 'pending' | 'synced';
}

export interface PendingTransaction {
  id: string;
  type: 'sale' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  timestamp: number;
  status: 'pending' | 'synced';
  customerId?: string;
  paymentMethod: string;
}

export interface PendingInventoryItem {
  id: string;
  name: string;
  currentStock: number;
  previousStock: number;
  price: number;
  lastUpdated: number;
  status: 'pending' | 'synced';
  adjustmentType: 'increase' | 'decrease' | 'price_change';
}

export interface PendingAppointment {
  id: string;
  customerId: string;
  service: string;
  dateTime: Date;
  duration: number;
  status: 'pending' | 'synced';
  notes?: string;
  type: 'new' | 'rescheduled' | 'cancelled';
}

export interface PendingCreditTransaction {
  id: string;
  customerId: string;
  type: 'issue' | 'repayment';
  amount: number;
  timestamp: number;
  status: 'pending' | 'synced';
  terms?: string;
}

// Offline storage keys
export const OFFLINE_STORAGE_KEYS = {
  QUEUE: 'offline_queue',
  SYNC_STATUS: 'sync_status',
  PENDING_POSTS: 'pending_posts',
  PENDING_TRANSACTIONS: 'pending_transactions',
  PENDING_INVENTORY: 'pending_inventory',
  PENDING_APPOINTMENTS: 'pending_appointments',
  PENDING_CREDIT: 'pending_credit',
  USER_PROFILE: 'user_profile',
  BUSINESS_SETTINGS: 'business_settings',
  LAST_SYNC: 'last_sync_timestamp',
  OFFLINE_MODE: 'offline_mode_enabled'
} as const;

// Priority levels for sync operations
export const SYNC_PRIORITY = {
  HIGH: 'high' as const,
  MEDIUM: 'medium' as const,
  LOW: 'low' as const
} as const;

// Feature priority order for syncing
export const FEATURE_SYNC_ORDER = [
  'cash',      // Financial transactions highest priority
  'inventory', // Stock management critical
  'calendar',  // Appointments time-sensitive
  'credit',    // Credit management important
  'beehive'    // Social features lowest priority
] as const;
