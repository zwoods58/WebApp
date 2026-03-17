import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';

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
  const [data, setData] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!business?.id) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

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

      setData((results as unknown as Inventory[]) || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [business?.id, options.select, options.limit, options.orderBy?.column, options.orderBy?.ascending]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insert = async (newData: any) => {
    if (!business) throw new Error('No business context');

    try {
      const { data: result, error } = await supabase
        .from('inventory')
        .insert({
          ...newData,
          business_id: business.id
        })
        .select()
        .single();

      if (error) throw error;

      setData(prev => [result, ...prev]);
      return result;
    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    if (!business) throw new Error('No business context');

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
