"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UseIndustryDataProps {
  industry: string;
  dataType: 'transactions' | 'expenses' | 'credit' | 'inventory' | 'targets';
  businessId?: string;
}

export function useIndustryData({ industry, dataType, businessId }: UseIndustryDataProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map dataType to actual table names
  const tableNameMap = {
    transactions: 'transactions',
    expenses: 'expenses',
    credit: 'credit',
    inventory: 'inventory',
    targets: 'targets'
  };

  const tableName = tableNameMap[dataType];

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from(tableName)
          .select('*')
          .eq('business_id', businessId);

        // Add ordering based on data type
        if (dataType === 'transactions') {
          query = query.order('transaction_date', { ascending: false });
        } else if (dataType === 'expenses') {
          query = query.order('expense_date', { ascending: false });
        } else if (dataType === 'credit') {
          query = query.order('date_given', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error: dbError } = await query;

        if (dbError) {
          console.error(`❌ Error fetching ${dataType}:`, dbError);
          throw dbError;
        }

        setItems(data || []);
        console.log(`✅ Loaded ${data?.length || 0} ${dataType}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        console.error(`❌ Error fetching ${dataType}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [industry, dataType, businessId, tableName]);

  const create = async (data: any) => {
    if (!businessId) {
      throw new Error('Business ID required for creating items');
    }

    try {
      const newItem = {
        business_id: businessId,
        industry,
        created_at: new Date().toISOString(),
        ...data
      };

      const { data: result, error: dbError } = await supabase
        .from(tableName)
        .insert([newItem])
        .select()
        .single();

      if (dbError) {
        console.error(`❌ Error creating ${dataType}:`, dbError);
        throw dbError;
      }

      setItems(prev => [result, ...prev]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      setError(errorMessage);
      throw err;
    }
  };

  const update = async (id: string, data: any) => {
    try {
      const updateData = {
        updated_at: new Date().toISOString(),
        ...data
      };

      const { data: result, error: dbError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (dbError) {
        console.error(`❌ Error updating ${dataType}:`, dbError);
        throw dbError;
      }

      setItems(prev => 
        prev.map(item => 
          item.id === id ? result : item
        )
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: dbError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error(`❌ Error deleting ${dataType}:`, dbError);
        throw dbError;
      }

      setItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    create,
    update,
    remove
  };
}
