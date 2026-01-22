import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatRelativeTime, formatCurrency } from '../utils/i18n';
import { announceToScreenReader } from '../utils/accessibility';

/**
 * Sync Queue Component
 * Shows pending transactions waiting to sync with retry logic
 */
export default function SyncQueue({ userId }) {
  const [pendingItems, setPendingItems] = useState([]);
  const [syncingItems, setSyncingItems] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadPendingItems();
    }
  }, [userId]);

  const loadPendingItems = async () => {
    try {
      const { data, error } = await supabase
        .from('offline_queue')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPendingItems(data || []);
    } catch (error) {
      console.error('Error loading pending items:', error);
    } finally {
      setLoading(false);
    }
  };

  const retrySync = async (itemId, retryCount = 0) => {
    if (syncingItems.has(itemId)) return;

    setSyncingItems(prev => new Set(prev).add(itemId));

    try {
      const item = pendingItems.find(i => i.id === itemId);
      if (!item) return;

      // Exponential backoff: 2^retryCount seconds
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
      
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Process based on action type
      const { action_type, payload } = item;
      
      let success = false;
      
      switch (action_type) {
        case 'create_transaction':
          success = await syncTransaction(payload);
          break;
        case 'update_transaction':
          success = await syncTransactionUpdate(payload);
          break;
        case 'delete_transaction':
          success = await syncTransactionDelete(payload);
          break;
        default:
          console.warn('Unknown action type:', action_type);
      }

      if (success) {
        // Mark as processed
        await supabase
          .from('offline_queue')
          .update({ 
            status: 'processed',
            processed_at: new Date().toISOString(),
          })
          .eq('id', itemId);

        announceToScreenReader('Transaction synced successfully');
        loadPendingItems();
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      
      const item = pendingItems.find(i => i.id === itemId);
      const newRetryCount = (item?.retry_count || 0) + 1;
      
      if (newRetryCount < 5) {
        // Update retry count
        await supabase
          .from('offline_queue')
          .update({ retry_count: newRetryCount })
          .eq('id', itemId);
        
        // Schedule retry
        setTimeout(() => retrySync(itemId, newRetryCount), 1000 * Math.pow(2, newRetryCount));
      } else {
        // Mark as failed after max retries
        await supabase
          .from('offline_queue')
          .update({ status: 'failed' })
          .eq('id', itemId);
        
        announceToScreenReader('Sync failed after multiple attempts');
      }
      
      loadPendingItems();
    } finally {
      setSyncingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const syncTransaction = async (payload) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(payload)
      .select()
      .single();
    
    return !error && data;
  };

  const syncTransactionUpdate = async (payload) => {
    const { id, ...updates } = payload;
    const { error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id);
    
    return !error;
  };

  const syncTransactionDelete = async (payload) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', payload.id);
    
    return !error;
  };

  const retryAll = async () => {
    for (const item of pendingItems) {
      if (!syncingItems.has(item.id)) {
        await retrySync(item.id, item.retry_count || 0);
      }
    }
  };

  if (loading) {
    return (
      <div className="sync-queue-loading">
        <RefreshCw className="animate-spin" size={20} />
        <span>Loading sync queue...</span>
      </div>
    );
  }

  if (pendingItems.length === 0) {
    return null;
  }

  return (
    <div className="sync-queue" role="status" aria-live="polite">
      <div className="sync-queue-header">
        <div className="sync-queue-title">
          <AlertCircle size={20} />
          <span>{pendingItems.length} transaction{pendingItems.length !== 1 ? 's' : ''} waiting to sync</span>
        </div>
        <button
          onClick={retryAll}
          disabled={syncingItems.size > 0}
          className="sync-queue-retry-all"
          aria-label="Retry all syncs"
        >
          <RefreshCw size={16} className={syncingItems.size > 0 ? 'animate-spin' : ''} />
          Retry All
        </button>
      </div>

      <div className="sync-queue-items">
        {pendingItems.map(item => {
          const isSyncing = syncingItems.has(item.id);
          const retryCount = item.retry_count || 0;
          const maxRetries = 5;
          
          return (
            <div
              key={item.id}
              className={`sync-queue-item ${isSyncing ? 'syncing' : ''}`}
            >
              <div className="sync-queue-item-info">
                <div className="sync-queue-item-type">
                  {item.action_type === 'create_transaction' && '➕'}
                  {item.action_type === 'update_transaction' && '✏️'}
                  {item.action_type === 'delete_transaction' && '🗑️'}
                  <span>{item.action_type.replace('_', ' ')}</span>
                </div>
                
                {item.payload?.amount && (
                  <div className="sync-queue-item-amount">
                    {formatCurrency(item.payload.amount)}
                  </div>
                )}
                
                <div className="sync-queue-item-time">
                  <Clock size={12} />
                  {formatRelativeTime(item.created_at)}
                </div>
              </div>

              <div className="sync-queue-item-actions">
                {retryCount > 0 && (
                  <span className="sync-queue-retry-count">
                    Retry {retryCount}/{maxRetries}
                  </span>
                )}
                
                {retryCount >= maxRetries ? (
                  <XCircle size={20} className="text-error" />
                ) : (
                  <button
                    onClick={() => retrySync(item.id, retryCount)}
                    disabled={isSyncing}
                    className="sync-queue-retry-button"
                    aria-label={`Retry sync for ${item.action_type}`}
                  >
                    {isSyncing ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

