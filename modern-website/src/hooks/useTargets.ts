import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';

export interface Target {
  id: string;
  business_id: string;
  industry: string;
  daily_target: number;
  weekly_target: number;
  monthly_target: number;
  current_streak: number;
  best_day: string;
  best_daily_amount: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseTargetsOptions {
  businessId?: string;
  industry?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useTargets(options: UseTargetsOptions = {}) {
  const { business } = useBusiness();
  const [data, setData] = useState<Target[]>([]);
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
        .from('targets')
        .select(options.select || '*')
        .eq('business_id', business.id);

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const orderBy = options.orderBy || { column: 'created_at', ascending: false };
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: results, error: queryError } = await query;

      if (queryError) throw queryError;

      setData((results as unknown as Target[]) || []);
    } catch (err) {
      console.error('Error fetching targets:', err);
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
        .from('targets')
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
        .from('targets')
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
        .from('targets')
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

  const updateProgress = async (id: string, dailyTarget: number) => {
    return update(id, { daily_target: dailyTarget });
  };

  const getDailyTarget = () => {
    return data[0]?.daily_target || 0;
  };

  const getWeeklyTarget = () => {
    return data[0]?.weekly_target || 0;
  };

  const getMonthlyTarget = () => {
    return data[0]?.monthly_target || 0;
  };

  const getCurrentStreak = () => {
    return data[0]?.current_streak || 0;
  };

  const getBestDay = () => {
    return data[0]?.best_day || null;
  };

  const getBestDailyAmount = () => {
    return data[0]?.best_daily_amount || 0;
  };

  // Simplified helper methods
  const getProgressPercentage = (target: number, current: number) => {
    if (target === 0) return 0;
    return Math.round((current / target) * 100);
  };

  const isTargetAchieved = (target: number, current: number) => {
    return current >= target;
  };

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    refresh: fetchData,
    updateProgress,
    getDailyTarget,
    getWeeklyTarget,
    getMonthlyTarget,
    getCurrentStreak,
    getBestDay,
    getBestDailyAmount,
    getProgressPercentage,
    isTargetAchieved,
    targets: data,
    fetchTargets: fetchData
  };
}
