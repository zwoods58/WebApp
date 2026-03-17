"use client";

import { useState, useEffect } from 'react';

// Mock data for demonstration - replace with actual API calls
const mockData = {
  transactions: [],
  expenses: [],
  credit: [],
  inventory: [],
  targets: []
};

interface UseIndustryDataProps {
  industry: string;
  dataType: 'transactions' | 'expenses' | 'credit' | 'inventory' | 'targets';
  userId?: string;
}

export function useIndustryData({ industry, dataType, userId }: UseIndustryDataProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, this would connect to your database
  const tableName = `${industry}_${dataType}`;

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In real app: 
        // const { data, error } = await supabase
        //   .from(tableName)
        //   .select('*')
        //   .eq('user_id', userId);
        
        // For now, return mock data
        setItems(mockData[dataType] || []);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
      setItems(mockData[dataType] || []);
    }
  }, [industry, dataType, userId]);

  const create = async (data: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newItem = {
        id: Date.now(),
        user_id: userId,
        created_at: new Date().toISOString(),
        ...data
      };

      // In real app:
      // const { data, error } = await supabase
      //   .from(tableName)
      //   .insert([newItem])
      //   .select();

      // For now, update local state
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError('Failed to create item');
      throw err;
    }
  };

  const update = async (id: number, data: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In real app:
      // const { data, error } = await supabase
      //   .from(tableName)
      //   .update(data)
      //   .eq('id', id);

      // For now, update local state
      setItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...data } : item
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };

  const remove = async (id: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In real app:
      // const { error } = await supabase
      //   .from(tableName)
      //   .delete()
      //   .eq('id', id);

      // For now, update local state
      setItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete item');
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
