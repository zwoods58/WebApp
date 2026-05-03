// User and Auth Types
export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  business_name?: string
  country: string
  industry: string
  daily_target: number
  currency: string
  avatar_url?: string
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

// Database Entity Types
export interface Appointment {
  id: string
  user_id: string
  client_name: string
  client_phone?: string
  service_id?: string
  service_name: string
  date: string
  time: string
  duration_minutes: number
  price: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  synced: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  user_id: string
  name: string
  description?: string
  price: number
  duration_minutes?: number
  category?: string
  is_active: boolean
  total_sold: number
  revenue_generated: number
  synced: boolean
  created_at: string
  updated_at: string
}

export interface StockItem {
  id: string
  user_id: string
  name: string
  description?: string
  sku?: string
  category?: string
  unit_price: number
  cost_price?: number
  quantity: number
  low_stock_threshold: number
  unit: string
  is_active: boolean
  synced: boolean
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: string
  stock_item_id: string
  user_id: string
  type: 'sale' | 'restock' | 'adjustment' | 'loss'
  quantity_change: number
  quantity_before: number
  quantity_after: number
  unit_price: number
  notes?: string
  transaction_id?: string
  synced: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category?: string
  payment_method: 'cash' | 'mobile_money' | 'credit' | 'other'
  service_id?: string
  stock_item_id?: string
  appointment_id?: string
  credit_id?: string
  date: string
  is_credit: boolean
  synced: boolean
  created_at: string
  updated_at: string
}

export interface CreditRecord {
  id: string
  user_id: string
  type: 'customer' | 'personal'
  contact_name: string
  contact_phone?: string
  amount_original: number
  amount_paid: number
  amount_remaining: number
  status: 'open' | 'partial' | 'paid'
  description?: string
  due_date?: string
  is_open_tab: boolean
  tab_transactions: any[]
  synced: boolean
  created_at: string
  updated_at: string
}

// Sync Types
export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline'

// Notification Types
export interface BuzzNotification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  type?: 'info' | 'success' | 'warning' | 'error'
  actionUrl?: string
}

// Country and Locale Types
export interface CountryConfig {
  code: string
  name: string
  locale: string
  currency: string
  currency_symbol: string
  phone_prefix: string
  flag: string
}

export type SupportedLocale = 'en' | 'sw' | 'rw' | 'fr' | 'so' | 'pt'

// Business Types
export interface Business {
  id: string
  name: string
  industry: string
  country: string
  userId: string
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  name: string
  businessName: string
  industry: string
  country: string
  agreeToTerms: boolean
}
