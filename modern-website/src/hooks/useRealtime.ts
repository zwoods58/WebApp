import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { RealtimeChannel } from '@supabase/supabase-js';

// Debounce function to prevent excessive calls
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

export interface RealtimeSubscriptionOptions {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback?: (payload: any) => void;
  businessId?: string;
  userId?: string;
}

export interface UseRealtimeOptions {
  subscriptions: RealtimeSubscriptionOptions[];
  enabled?: boolean;
}

// Global registry to prevent duplicate subscriptions
const globalSubscriptions = new Map<string, RealtimeChannel>();

export function useRealtime({ subscriptions, enabled = true }: UseRealtimeOptions) {
  const channelsRef = useRef<RealtimeChannel[]>([]);

  const subscribeToTable = useCallback((options: RealtimeSubscriptionOptions) => {
    if (!enabled) return null;

    const { table, filter, event = '*', callback, businessId, userId } = options;
    
    let channelName = `${table}_changes`;
    if (businessId) channelName += `_${businessId}`;
    if (userId) channelName += `_${userId}`;

    // Check if subscription already exists globally
    if (globalSubscriptions.has(channelName)) {
      console.log(`📡 Using existing subscription for ${table}`);
      return globalSubscriptions.get(channelName)!;
    }

    const channel = supabaseAdmin
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          filter
        } as any,
        (payload: any) => {
          console.log(`🔄 Real-time update on ${table}:`, payload);
          
          // Only call callback for INSERT events - UPDATE and DELETE don't need full refresh
          // This dramatically reduces the number of refreshes
          if (callback && payload.eventType === 'INSERT') {
            callback(payload);
          } else if (callback && payload.eventType === 'DELETE') {
            // Only handle DELETE if it's critical data
            callback(payload);
          }
          // Skip UPDATE events entirely - they cause excessive refreshes
        }
      )
      .subscribe();

    console.log(`📡 Created new subscription for ${table}`);
    globalSubscriptions.set(channelName, channel);
    return channel;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing channels from this hook instance
    channelsRef.current.forEach(channel => {
      // Only remove if not used by other instances (check global count)
      const isUsedElsewhere = Array.from(globalSubscriptions.values())
        .filter(c => c === channel).length > 1;
      
      if (!isUsedElsewhere) {
        supabaseAdmin.removeChannel(channel);
        // Remove from global registry by finding the key
        for (const [key, value] of globalSubscriptions.entries()) {
          if (value === channel) {
            globalSubscriptions.delete(key);
            break;
          }
        }
      }
    });
    channelsRef.current = [];

    // Create new subscriptions
    const newChannels = subscriptions.map(options => subscribeToTable(options)).filter(Boolean);
    channelsRef.current = newChannels as RealtimeChannel[];

    return () => {
      // Cleanup channels on unmount - but keep them in global registry
      channelsRef.current = [];
    };
  }, [subscriptions, enabled, subscribeToTable]);

  const unsubscribeAll = useCallback(() => {
    channelsRef.current.forEach(channel => {
      supabaseAdmin.removeChannel(channel);
      // Remove from global registry by finding the key
      for (const [key, value] of globalSubscriptions.entries()) {
        if (value === channel) {
          globalSubscriptions.delete(key);
          break;
        }
      }
    });
    channelsRef.current = [];
  }, []);

  return {
    unsubscribeAll,
    isSubscribed: channelsRef.current.length > 0
  };
}

// Specific hooks for different data types
export function useExpensesRealtime(businessId?: string, onExpenseChange?: (payload: any) => void) {
  const subscriptions: RealtimeSubscriptionOptions[] = [];
  
  if (businessId) {
    // Debounce the callback to prevent excessive fetches
    const debouncedCallback = debounce(onExpenseChange || (() => {}), 2000);
    
    subscriptions.push({
      table: 'expenses',
      filter: `business_id=eq.${businessId}`,
      callback: debouncedCallback
    });
  }

  return useRealtime({ subscriptions, enabled: !!businessId });
}

export function useTransactionsRealtime(businessId?: string, onTransactionChange?: (payload: any) => void) {
  const subscriptions: RealtimeSubscriptionOptions[] = [];
  
  if (businessId) {
    // Debounce the callback to prevent excessive fetches
    const debouncedCallback = debounce(onTransactionChange || (() => {}), 2000);
    
    subscriptions.push({
      table: 'transactions',
      filter: `business_id=eq.${businessId}`,
      callback: debouncedCallback
    });
  }

  return useRealtime({ subscriptions, enabled: !!businessId });
}

export function useInventoryRealtime(businessId?: string, onInventoryChange?: (payload: any) => void) {
  const subscriptions: RealtimeSubscriptionOptions[] = [];
  
  if (businessId) {
    // Debounce the callback to prevent excessive fetches
    const debouncedCallback = debounce(onInventoryChange || (() => {}), 2000);
    
    subscriptions.push({
      table: 'inventory',
      filter: `business_id=eq.${businessId}`,
      callback: debouncedCallback
    });
  }

  return useRealtime({ subscriptions, enabled: !!businessId });
}

export function useCreditRealtime(businessId?: string, onCreditChange?: (payload: any) => void) {
  const subscriptions: RealtimeSubscriptionOptions[] = [];
  
  if (businessId) {
    // Debounce the callback to prevent excessive fetches
    const debouncedCallback = debounce(onCreditChange || (() => {}), 2000);
    
    subscriptions.push({
      table: 'credit',
      filter: `business_id=eq.${businessId}`,
      callback: debouncedCallback
    });
  }

  return useRealtime({ subscriptions, enabled: !!businessId });
}

export function useTargetsRealtime(businessId?: string, onTargetChange?: (payload: any) => void) {
  const subscriptions: RealtimeSubscriptionOptions[] = [];
  
  if (businessId) {
    // Debounce the callback to prevent excessive fetches
    const debouncedCallback = debounce(onTargetChange || (() => {}), 2000);
    
    subscriptions.push({
      table: 'targets',
      filter: `business_id=eq.${businessId}`,
      callback: debouncedCallback
    });
  }

  return useRealtime({ subscriptions, enabled: !!businessId });
}

export function useBusinessRealtime(businessId?: string, onBusinessChange?: (payload: any) => void) {
  const subscriptions: RealtimeSubscriptionOptions[] = [];
  
  if (businessId) {
    // Debounce the callback to prevent excessive fetches
    const debouncedCallback = debounce(onBusinessChange || (() => {}), 2000);
    
    subscriptions.push({
      table: 'businesses',
      filter: `id=eq.${businessId}`,
      callback: debouncedCallback
    });
  }

  return useRealtime({ subscriptions, enabled: !!businessId });
}
