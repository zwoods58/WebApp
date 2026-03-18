/**
 * Offline Sync Handler Service
 * Listens for offline-operation-ready events and syncs them to the backend
 * Supports all app features: cash, inventory, calendar, credit, beehive
 */

import { supabase } from '@/lib/supabase';
import { getQueue, removeFromQueue, PendingAction } from '@/utils/offlineQueue';
import type { OfflineOperation } from '@/types/offlineTypes';

class OfflineSyncHandler {
  private isInitialized = false;

  /**
   * Initialize the sync handler
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.log('ℹ️ Offline sync handler already initialized');
      return;
    }

    if (typeof window === 'undefined') {
      console.log('⚠️ Cannot initialize sync handler on server side');
      return;
    }

    // Listen for offline-operation-ready events
    window.addEventListener('offline-operation-ready', this.handleOperation.bind(this));
    
    // Listen for online events to trigger sync
    window.addEventListener('online', this.handleOnline.bind(this));

    this.isInitialized = true;
    console.log('✅ Offline sync handler initialized');
  }

  /**
   * Get appropriate currency for business based on country/industry
   */
  private getCurrencyForBusiness(businessId: string, industry: string): string {
    // Default currency mapping based on common business locations
    const currencyMap: Record<string, string> = {
      'ke': 'KES', // Kenya
      'ug': 'UGX', // Uganda
      'tz': 'TZS', // Tanzania
      'ng': 'NGN', // Nigeria
      'gh': 'GHS', // Ghana
      'za': 'ZAR', // South Africa
      'us': 'USD', // United States
      'gb': 'GBP', // United Kingdom
      'eu': 'EUR', // European Union
    };

    // Try to get country from business auth or default to KES
    const businessAuth = localStorage.getItem('beezee_business_auth');
    if (businessAuth) {
      try {
        const authData = JSON.parse(businessAuth);
        const country = authData.business?.country || authData.session?.country;
        if (country && currencyMap[country.toLowerCase()]) {
          return currencyMap[country.toLowerCase()];
        }
      } catch (e) {
        console.warn('Failed to parse business auth for currency:', e);
      }
    }

    // Default to KES for Kenyan market
    return 'KES';
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    console.log('🌐 Network restored, triggering sync...');
    // Note: With Service Worker architecture, sync is handled by Background Sync
    // This is kept for compatibility but may not be needed
  }

  /**
   * Handle offline operation ready event
   */
  private async handleOperation(event: Event): Promise<void> {
    const customEvent = event as CustomEvent<OfflineOperation>;
    const operation = customEvent.detail;

    console.log(`🔄 Processing offline operation:`, {
      feature: operation.feature,
      type: operation.type,
      id: operation.id
    });

    try {
      // Route to appropriate sync function based on feature
      switch (operation.feature) {
        case 'cash':
          await this.syncCashOperation(operation);
          break;
        case 'inventory':
          await this.syncInventoryOperation(operation);
          break;
        case 'calendar':
          await this.syncCalendarOperation(operation);
          break;
        case 'credit':
          await this.syncCreditOperation(operation);
          break;
        case 'beehive':
          await this.syncBeehiveOperation(operation);
          break;
        default:
          throw new Error(`Unknown feature: ${(operation as any).feature}`);
      }

      // Note: With new architecture, removal from queue is handled by Service Worker
      console.log(`✅ Operation ${operation.id} synced successfully`);

      // Emit sync complete event for UI updates
      window.dispatchEvent(new CustomEvent('offline-sync-complete', {
        detail: { operationId: operation.id, feature: operation.feature }
      }));

    } catch (error) {
      console.error(`❌ Failed to sync operation ${operation.id}:`, error);
      // Note: With new architecture, failure handling is managed by Service Worker
    }
  }

  /**
   * Sync cash operations (transactions and expenses)
   */
  private async syncCashOperation(operation: OfflineOperation): Promise<void> {
    const { type, data, userId, idempotencyKey } = operation as any;

    // Get business context from localStorage
    const businessAuth = localStorage.getItem('beezee_business_auth');
    let businessId = userId;
    let industry = 'retail';

    if (businessAuth) {
      try {
        const authData = JSON.parse(businessAuth);
        businessId = authData.business?.id || authData.session?.businessId || userId;
        industry = authData.business?.industry || 'retail';
      } catch (e) {
        console.warn('Failed to parse business auth:', e);
      }
    }

    if (type === 'sale') {
      // Sync transaction
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          business_id: businessId,
          industry: industry,
          amount: data.amount,
          category: data.category,
          description: data.description,
          customer_name: data.customerName,
          payment_method: data.paymentMethod,
          transaction_date: data.transactionDate || new Date().toISOString().split('T')[0],
          metadata: data.metadata || {}
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync transaction');
      }

    } else if (type === 'expense') {
      // Sync expense
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          business_id: businessId,
          industry: industry,
          amount: data.amount,
          category: data.expenseCategory || data.category,
          description: data.description,
          vendor_name: data.vendorName,
          expense_date: data.expenseDate || new Date().toISOString().split('T')[0],
          metadata: data.metadata || {}
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync expense');
      }
    }
  }

  /**
   * Sync inventory operations
   */
  private async syncInventoryOperation(operation: OfflineOperation): Promise<void> {
    const { type, data, userId } = operation as any;

    // Get business context from localStorage
    const businessAuth = localStorage.getItem('beezee_business_auth');
    let businessId = userId;
    let industry = 'retail';

    if (businessAuth) {
      try {
        const authData = JSON.parse(businessAuth);
        businessId = authData.business?.id || authData.session?.businessId || userId;
        industry = authData.business?.industry || 'retail';
      } catch (e) {
        console.warn('Failed to parse business auth:', e);
      }
    }

    if (type === 'add_item' || type === 'update_stock') {
      console.log(`🔄 Syncing inventory item: ${data.itemName}`, {
        businessId,
        industry,
        currency: this.getCurrencyForBusiness(businessId, industry),
        data
      });

      const { error } = await supabase
        .from('inventory')
        .upsert({
          business_id: businessId,
          industry: industry,
          item_name: data.itemName,
          quantity: data.stockLevel,
          category: data.category || 'general',
          selling_price: data.price || 0,
          cost_price: data.costPrice || 0,
          currency: this.getCurrencyForBusiness(businessId, industry),
          unit: data.unit || 'pieces',
          threshold: data.threshold || 0,
          supplier: data.supplier || null,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Supabase error during inventory sync:', error);
        throw error;
      }

      console.log(`✅ Successfully synced inventory item: ${data.itemName}`);

    } else if (type === 'stock_adjustment') {
      const { error } = await supabase
        .from('inventory')
        .update({
          quantity: data.stockLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.itemId);

      if (error) throw error;
    }
  }

  /**
   * Sync calendar operations (appointments)
   */
  private async syncCalendarOperation(operation: OfflineOperation): Promise<void> {
    const { type, data, userId } = operation as any;

    // Get business context from localStorage
    const businessAuth = localStorage.getItem('beezee_business_auth');
    let businessId = userId;
    let industry = 'retail';

    if (businessAuth) {
      try {
        const authData = JSON.parse(businessAuth);
        businessId = authData.business?.id || authData.session?.businessId || userId;
        industry = authData.business?.industry || 'retail';
      } catch (e) {
        console.warn('Failed to parse business auth:', e);
      }
    }

    if (type === 'create_appointment') {
      const { error } = await supabase
        .from('appointments')
        .insert({
          business_id: businessId,
          industry: industry,
          customer_name: data.customerId, // Using customerId as customer_name for now
          service_name: data.service,
          appointment_date: new Date(data.dateTime).toISOString().split('T')[0],
          appointment_time: new Date(data.dateTime).toTimeString().split(' ')[0],
          duration: data.duration,
          notes: data.notes,
          status: data.status || 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

    } else if (type === 'reschedule') {
      const { error } = await supabase
        .from('appointments')
        .update({
          appointment_date: new Date(data.dateTime).toISOString().split('T')[0],
          appointment_time: new Date(data.dateTime).toTimeString().split(' ')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', data.appointmentId);

      if (error) throw error;

    } else if (type === 'cancel') {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.appointmentId);

      if (error) throw error;
    }
  }

  /**
   * Sync credit operations
   */
  private async syncCreditOperation(operation: OfflineOperation): Promise<void> {
    const { type, data, userId } = operation as any;

    // Get business context from localStorage
    const businessAuth = localStorage.getItem('beezee_business_auth');
    let businessId = userId;
    let industry = 'retail';

    if (businessAuth) {
      try {
        const authData = JSON.parse(businessAuth);
        businessId = authData.business?.id || authData.session?.businessId || userId;
        industry = authData.business?.industry || 'retail';
      } catch (e) {
        console.warn('Failed to parse business auth:', e);
      }
    }

    if (type === 'issue_credit') {
      const { error } = await supabase
        .from('credit')
        .insert({
          business_id: businessId,
          industry: industry,
          customer_name: data.customerData?.name || data.customerId,
          customer_phone: data.customerData?.phone,
          amount: data.amount,
          paid_amount: 0,
          status: 'outstanding',
          date_given: new Date().toISOString().split('T')[0],
          notes: data.terms,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

    } else if (type === 'repayment') {
      // Fetch current credit record
      const { data: creditRecord, error: fetchError } = await supabase
        .from('credit')
        .select('*')
        .eq('id', data.creditId)
        .single();

      if (fetchError) throw fetchError;

      const newPaidAmount = (creditRecord.paid_amount || 0) + data.amount;
      const newStatus = newPaidAmount >= creditRecord.amount ? 'paid' : 'partial';

      const { error } = await supabase
        .from('credit')
        .update({
          paid_amount: newPaidAmount,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.creditId);

      if (error) throw error;
    }
  }

  /**
   * Sync beehive operations
   */
  private async syncBeehiveOperation(operation: OfflineOperation): Promise<void> {
    const { type, data, userId, idempotencyKey } = operation as any;

    if (type === 'create_post') {
      // Use API route to bypass RLS
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          action: 'addRequest',
          userId: data.userId || userId,
          data: {
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            industry: data.industry,
            country: data.country,
            user_id: data.userId || userId,
            business_id: data.businessId,
            status: 'open',
            upvotes_count: 0,
            downvotes_count: 0,
            comments_count: 0,
            is_featured: false,
            metadata: {}
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync beehive post');
      }

    } else if (type === 'like' || type === 'comment') {
      // Use API route for votes
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          action: 'voteOnRequest',
          userId: data.userId || userId,
          data: {
            requestId: data.postId,
            voteType: type === 'like' ? 'up' : 'down'
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync beehive vote');
      }
    }
  }

  /**
   * Destroy the sync handler
   */
  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('offline-operation-ready', this.handleOperation.bind(this));
      window.removeEventListener('online', this.handleOnline.bind(this));
    }
    this.isInitialized = false;
    console.log('🔌 Offline sync handler destroyed');
  }

  /**
   * Safari fallback: Flush queue from client side
   * Used when Background Sync API is not supported
   */
  public async flushQueueFromClient(): Promise<void> {
    console.log('🔄 Client-side queue flush started (Safari fallback)')
    
    try {
      const queue = await getQueue()
      
      if (queue.length === 0) {
        console.log('✅ No queued actions to process')
        return
      }

      console.log(`📋 Processing ${queue.length} queued actions`)

      let successCount = 0
      let failureCount = 0

      for (const action of queue) {
        try {
          // Convert PendingAction to OfflineOperation format for existing handlers
          const operation = {
            id: action.id?.toString() || '',
            feature: action.type as any,
            type: action.operation,
            data: action.payload,
            userId: 'anonymous', // Will be extracted from context in handlers
            timestamp: action.timestamp,
            status: 'pending' as const,
            retryCount: 0,
            priority: 'medium' as const,
            idempotencyKey: action.idempotencyKey,
          } as OfflineOperation

          // Route to appropriate sync function
          switch (action.type) {
            case 'cash':
              await this.syncCashOperation(operation)
              break
            case 'inventory':
              await this.syncInventoryOperation(operation)
              break
            case 'calendar':
              await this.syncCalendarOperation(operation)
              break
            case 'credit':
              await this.syncCreditOperation(operation)
              break
            case 'beehive':
              await this.syncBeehiveOperation(operation)
              break
            default:
              throw new Error(`Unknown action type: ${action.type}`)
          }

          // Remove from queue on success
          if (action.id !== undefined) {
            await removeFromQueue(action.id)
          }
          
          successCount++
          console.log(`✅ Synced client-side action: ${action.operation} [${action.idempotencyKey}]`)

        } catch (err) {
          failureCount++
          console.warn(`❌ Failed to sync client-side action: ${action.operation}`, err)
          // Leave in queue for retry
        }
      }

      console.log(`🎯 Client-side sync complete: ${successCount} succeeded, ${failureCount} failed`)

      // Notify UI of completion
      window.dispatchEvent(new CustomEvent('SYNC_COMPLETE', {
        detail: { successCount, failureCount, total: queue.length }
      }))

    } catch (error) {
      console.error('❌ Client-side queue flush failed:', error)
    }
  }
}

// Export singleton instance and individual function for import
export const offlineSyncHandler = new OfflineSyncHandler();

// Export the flush function separately for Safari fallback
export async function flushQueueFromClient(): Promise<void> {
  return offlineSyncHandler.flushQueueFromClient();
}

export default OfflineSyncHandler;
