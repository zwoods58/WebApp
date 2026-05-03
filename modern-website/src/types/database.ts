export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      appointments: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      services: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      stock_items: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['stock_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['stock_items']['Insert']>
      }
      stock_movements: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['stock_movements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['stock_movements']['Insert']>
      }
      transactions: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      credit_records: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['credit_records']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['credit_records']['Insert']>
      }
    }
  }
}
