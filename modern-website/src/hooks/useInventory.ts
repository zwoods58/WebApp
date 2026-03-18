import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';
import { useOfflineData } from '@/hooks/useOfflineData';
import { getQueue } from '@/utils/offlineQueue';

export interface Inventory {
  id: string;
  business_id: string;
  industry: string;
  item_name: string;
  category?: string;
  quantity: number;
  unit?: string;
  threshold?: number;
  cost_price?: number;
  selling_price?: number;
  supplier?: string;
  last_ordered?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  status?: 'synced' | 'pending' | 'error' | 'adjusted' | 'deleted';
  operationId?: string; // Track the operation ID for pending adjustments
  isDeleted?: boolean; // Mark if item has been deleted
}

export interface UseInventoryOptions {
  businessId?: string;
  industry?: string;
  category?: string;
  lowStock?: boolean;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useInventory(options: UseInventoryOptions = {}) {
  const { business } = useBusiness();
  const { isOnline, addInventoryOperation } = useOfflineData();
  const [data, setData] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearStaleOperations = async () => {
    try {
      const queue = await getQueue();
      const inventoryOps = queue.filter(op => op.type === 'inventory');
      
      // Remove old inventory operations (older than 1 hour)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const staleOps = inventoryOps.filter(op => op.timestamp < oneHourAgo);
      
      if (staleOps.length > 0) {
        console.log(`🧹 Clearing ${staleOps.length} stale inventory operations`);
        // In a real implementation, you would remove these from the queue
        // For now, just log that we found them
      }
    } catch (error) {
      console.warn('Failed to clear stale operations:', error);
    }
  };

  const fetchData = useCallback(async () => {
    if (!business?.id) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to fetch from server if online, otherwise load only pending items
      let serverData: Inventory[] = [];
      
      if (navigator.onLine) {
        try {
          let query = supabase
            .from('inventory')
            .select(options.select || '*')
            .eq('business_id', business.id);

          if (options.filters) {
            Object.entries(options.filters).forEach(([key, value]) => {
              query = query.eq(key, value);
            });
          }

          const orderBy = options.orderBy || { column: 'item_name', ascending: true };
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });

          if (options.limit) {
            query = query.limit(options.limit);
          }

          const { data: results, error: queryError } = await query;

          if (queryError) throw queryError;
          serverData = results as unknown as Inventory[] || [];
        } catch (fetchError) {
          console.log('Server fetch failed, loading only pending items:', fetchError);
          // Continue with only pending items if server fetch fails
        }
      }

      // Load pending operations from IndexedDB queue
      const queue = await getQueue();
      const pendingOps = queue.filter(op => op.type === 'inventory');
      // Generate a proper UUID for pending items
      const generateUUID = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        // Fallback for older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const pendingInventory: Inventory[] = pendingOps
        .filter(op => op.status === 'pending')
        .map(op => {
          const payload = op.payload as any;
          
          // Check if this is a deletion operation
          if (payload.adjustmentReason?.includes('Deleted item')) {
            return {
              id: generateUUID(),
              business_id: business.id,
              industry: business.industry || 'retail',
              item_name: payload.itemName || '',
              category: undefined,
              quantity: 0, // Deleted items have 0 quantity
              selling_price: undefined,
              created_at: new Date(op.timestamp).toISOString(),
              updated_at: new Date(op.timestamp).toISOString(),
              status: 'deleted' as const,
              operationId: op.id?.toString(),
              isDeleted: true // Mark as deleted
            };
          }
          
          // Regular stock adjustment
          return {
            id: generateUUID(),
            business_id: business.id,
            industry: business.industry || 'retail',
            item_name: payload.itemName || '',
            category: payload.category,
            quantity: payload.stockLevel || 0,
            selling_price: payload.price,
            created_at: new Date(op.timestamp).toISOString(),
            updated_at: new Date(op.timestamp).toISOString(),
            status: 'pending' as const,
            operationId: op.id?.toString()
          };
        });

      // Merge pending + fetched data, avoiding duplicates and applying adjustments
      const mergedData = new Map();
      
      // Use item name as the key to prevent duplicates
      const itemsByName = new Map();
      
      // Add server data first, using item name as key
      serverData.forEach(item => {
        const key = `${item.item_name.toLowerCase().trim()}`;
        itemsByName.set(key, item);
        mergedData.set(item.id, item);
      });
      
      // Apply pending operations to server data
      pendingInventory.forEach(pendingItem => {
        const itemKey = `${pendingItem.item_name.toLowerCase().trim()}`;
        
        // Handle deleted items first
        if (pendingItem.isDeleted) {
          const existingItem = itemsByName.get(itemKey);
          if (existingItem) {
            // Remove the deleted item from both maps
            mergedData.delete(existingItem.id);
            itemsByName.delete(itemKey);
            console.log(`🗑️ Removed deleted item: ${pendingItem.item_name}`);
          }
          return; // Skip further processing for deleted items
        }
        
        // For stock adjustments and new items
        const existingItem = itemsByName.get(itemKey);
        
        if (existingItem) {
          // This is a stock adjustment - update the existing item's quantity
          const updatedItem = {
            ...existingItem,
            quantity: pendingItem.quantity, // Use the adjusted quantity
            updated_at: pendingItem.updated_at,
            status: 'adjusted' as const
          };
          mergedData.set(existingItem.id, updatedItem);
          itemsByName.set(itemKey, updatedItem);
          console.log(`🔄 Applied stock adjustment: ${pendingItem.item_name} (new qty: ${pendingItem.quantity})`);
        } else {
          // This is a new item that doesn't exist on server yet
          mergedData.set(pendingItem.id, pendingItem);
          itemsByName.set(itemKey, pendingItem);
          console.log(`➕ Added new pending item: ${pendingItem.item_name}`);
        }
      });
      
      const allData = Array.from(mergedData.values());
      setData(allData);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Still load pending items even if fetch fails
      if (business?.id) {
        const queue = await getQueue();
        const pendingOps = queue.filter(op => op.type === 'inventory');
        
        // Generate a proper UUID for pending items
        const generateUUID = () => {
          if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
          }
          // Fallback for older browsers
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        };

        const pendingInventory: Inventory[] = pendingOps
          .filter(op => op.status === 'pending')
          .map(op => {
            const payload = op.payload as any;
            
            // Check if this is a deletion operation
            if (payload.adjustmentReason?.includes('Deleted item')) {
              return {
                id: generateUUID(),
                business_id: business.id,
                industry: business.industry || 'retail',
                item_name: payload.itemName || '',
                category: undefined,
                quantity: 0, // Deleted items have 0 quantity
                selling_price: undefined,
                created_at: new Date(op.timestamp).toISOString(),
                updated_at: new Date(op.timestamp).toISOString(),
                status: 'deleted' as const,
                operationId: op.id?.toString(),
                isDeleted: true // Mark as deleted
              };
            }
            
            // Regular stock adjustment
            return {
              id: generateUUID(),
              business_id: business.id,
              industry: business.industry || 'retail',
              item_name: payload.itemName || '',
              category: payload.category,
              quantity: payload.stockLevel || 0,
              selling_price: payload.price,
              created_at: new Date(op.timestamp).toISOString(),
              updated_at: new Date(op.timestamp).toISOString(),
              status: 'pending' as const,
              operationId: op.id?.toString()
            };
          });
        
        // Use same deduplication logic as main path
        const itemsByName = new Map();
        const mergedData = new Map();
        
        pendingInventory.forEach(pendingItem => {
          const itemKey = `${pendingItem.item_name.toLowerCase().trim()}`;
          
          // Skip deleted items
          if (pendingItem.isDeleted) {
            return;
          }
          
          // Check for duplicates by name
          if (!itemsByName.has(itemKey)) {
            itemsByName.set(itemKey, pendingItem);
            mergedData.set(pendingItem.id, pendingItem);
          } else {
            console.log(`🔄 Skipping duplicate pending item: ${pendingItem.item_name}`);
          }
        });
        
        const activeItems = Array.from(mergedData.values());
        setData(activeItems);
      } else {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [business?.id, business?.industry, options.select, options.limit, options.orderBy?.column, options.orderBy?.ascending]);

  useEffect(() => {
    fetchData();
    clearStaleOperations(); // Clean up stale operations on mount
  }, [fetchData]);

  // Listen for force refresh events
  useEffect(() => {
    const handleForceRefresh = () => {
      fetchData();
    };

    // Listen for hard refresh events to clear and reload data
    const handleHardRefresh = () => {
      console.log('🔄 Hard refresh detected, clearing inventory cache...');
      setData([]);
      fetchData();
    };

    // Listen for sync complete events to refresh data when items are synced
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.feature === 'inventory') {
        console.log('🔄 Inventory sync completed, refreshing data...');
        fetchData();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('force-refresh-data', handleForceRefresh);
      window.addEventListener('hard-refresh-data', handleHardRefresh);
      window.addEventListener('offline-sync-complete', handleSyncComplete);
      return () => {
        window.removeEventListener('force-refresh-data', handleForceRefresh);
        window.removeEventListener('hard-refresh-data', handleHardRefresh);
        window.removeEventListener('offline-sync-complete', handleSyncComplete);
      };
    }
  }, [fetchData]);

  const insert = async (newData: any) => {
    if (!business) throw new Error('No business context');

    try {
      const inventoryData = {
        ...newData,
        business_id: business.id
      };

      // If online, try direct API call first
      if (isOnline) {
        try {
          const { data: result, error } = await supabase
            .from('inventory')
            .insert(inventoryData)
            .select()
            .single();

          if (error) throw error;

          setData(prev => [result, ...prev]);
          return result;
        } catch (apiError) {
          console.warn('⚠️ API call failed, falling back to offline queue:', apiError);
          // Fall through to offline queue
        }
      }

      // Always queue for offline/sync or as fallback
      const operationId = addInventoryOperation('add_item', {
        itemName: inventoryData.item_name,
        stockLevel: inventoryData.quantity,
        price: inventoryData.selling_price,
        costPrice: inventoryData.cost_price,
        category: inventoryData.category || 'general',
        unit: inventoryData.unit,
        threshold: inventoryData.threshold,
        supplier: inventoryData.supplier
      });

      // Return optimistic update
      const optimisticInventory = {
        ...inventoryData,
        id: operationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending' as const
      } as Inventory;

      setData(prev => [optimisticInventory, ...prev]);
      return optimisticInventory;

    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    if (!business) throw new Error('No business context');

    try {
      // If online, try direct API call first
      if (isOnline) {
        try {
          const { data: result, error } = await supabase
            .from('inventory')
            .update(updates)
            .eq('id', id)
            .eq('business_id', business.id)
            .select()
            .single();

          if (error) throw error;

          setData(prev => prev.map(item => item.id === id ? result : item));
          return result;
        } catch (apiError) {
          console.warn('⚠️ API call failed, falling back to offline queue:', apiError);
          // Fall through to offline queue
        }
      }

      // Queue for offline/sync or as fallback
      const currentItem = data.find(item => item.id === id);
      const operationId = addInventoryOperation('stock_adjustment', {
        itemId: id,
        itemName: currentItem?.item_name || 'Unknown Item',
        stockLevel: updates.quantity,
        previousStock: currentItem?.quantity || 0
      });

      // Return optimistic update
      const optimisticUpdate = {
        ...data.find(item => item.id === id),
        ...updates,
        updated_at: new Date().toISOString(),
        status: 'pending' as const
      } as Inventory;

      setData(prev => prev.map(item => item.id === id ? optimisticUpdate : item));
      return optimisticUpdate;

    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const remove = async (id: string) => {
    if (!business) throw new Error('No business context');

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .eq('business_id', business.id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const getLowStockItems = () => {
    return data.filter(item => 
      item.threshold && item.quantity <= item.threshold
    );
  };

  const getTotalInventoryValue = () => {
    return data.reduce((sum, item) => 
      sum + (item.quantity * (item.selling_price || 0)), 0
    );
  };

  const getInventoryByCategory = () => {
    return data.reduce((acc, item) => {
      const category = item.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    refresh: fetchData,
    getLowStockItems,
    getTotalInventoryValue,
    getInventoryByCategory,
    inventory: data,
    fetchInventory: fetchData
  };
}
