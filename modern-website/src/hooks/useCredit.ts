import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';
import { useOfflineData } from '@/hooks/useOfflineData';
import { getQueue } from '@/utils/offlineQueue';

export interface Credit {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  due_date?: string;
  notes?: string;
  paid_amount: number;
  status: 'outstanding' | 'partial' | 'paid';
  date_given: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  syncStatus?: 'synced' | 'pending' | 'error'; // Add sync status for offline support
}

export interface UseCreditOptions {
  businessId?: string;
  industry?: string;
  status?: Credit['status'];
  customerName?: string;
  overdue?: boolean;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useCredit(options: UseCreditOptions = {}) {
  const { business } = useBusiness();
  const { isOnline, addCreditOperation } = useOfflineData();
  const [data, setData] = useState<Credit[]>([]);
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
        .from('credit')
        .select(options.select || '*')
        .eq('business_id', business.id);

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const orderBy = options.orderBy || { column: 'date_given', ascending: false };
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: results, error: queryError } = await query;

      if (queryError) throw queryError;

      // Load pending operations from IndexedDB queue
      const queue = await getQueue();
      const pendingOps = queue.filter(op => op.type === 'credit');
      const pendingCredit: Credit[] = pendingOps
        .filter(op => op.status === 'pending' && op.operation === 'issue_credit')
        .map(op => ({
          id: op.id?.toString() || '',
          business_id: business.id,
          industry: business.industry || 'retail',
          customer_name: (op.payload as any).customerData?.name || (op.payload as any).customerId || 'Unknown',
          customer_phone: (op.payload as any).customerData?.phone,
          amount: (op.payload as any).amount || 0,
          paid_amount: 0,
          status: 'outstanding' as const,
          date_given: new Date(op.timestamp).toISOString().split('T')[0],
          notes: (op.payload as any).terms,
          created_at: new Date(op.timestamp).toISOString(),
          updated_at: new Date(op.timestamp).toISOString(),
          syncStatus: 'pending' as const
        }));

      // Merge pending + fetched data
      const allData = [...pendingCredit, ...(results as unknown as Credit[]) || []];
      setData(allData);
    } catch (err) {
      console.error('Error fetching credit:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Still load pending items even if fetch fails
      if (business?.id) {
        const queue = await getQueue();
        const pendingOps = queue.filter(op => op.type === 'credit');
        const pendingCredit: Credit[] = pendingOps
          .filter(op => op.status === 'pending' && op.operation === 'issue_credit')
          .map(op => ({
            id: op.id?.toString() || '',
            business_id: business.id,
            industry: business.industry || 'retail',
            customer_name: (op.payload as any).customerData?.name || (op.payload as any).customerId || 'Unknown',
            customer_phone: (op.payload as any).customerData?.phone,
            amount: (op.payload as any).amount || 0,
            paid_amount: 0,
            status: 'outstanding' as const,
            date_given: new Date(op.timestamp).toISOString().split('T')[0],
            notes: (op.payload as any).terms,
            created_at: new Date(op.timestamp).toISOString(),
            updated_at: new Date(op.timestamp).toISOString(),
            syncStatus: 'pending' as const
          }));
        setData(pendingCredit);
      } else {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [business?.id, business?.industry, options.select, options.limit, options.orderBy?.column, options.orderBy?.ascending]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insert = async (newData: any) => {
    if (!business) throw new Error('No business context');

    try {
      const creditData = {
        ...newData,
        business_id: business.id
      };

      // If online, try direct API call first
      if (isOnline) {
        try {
          const { data: result, error } = await supabase
            .from('credit')
            .insert(creditData)
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
      const operationId = addCreditOperation('issue_credit', {
        customerId: creditData.customer_name, // Using customer name as ID for now
        amount: creditData.amount,
        creditType: creditData.terms || 'standard',
        terms: creditData.terms,
        customerData: {
          name: creditData.customer_name,
          phone: creditData.customer_phone
        }
      });

      // Return optimistic update
      const optimisticCredit = {
        ...creditData,
        id: operationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        syncStatus: 'pending' // Add sync status field for pending items
      } as Credit;

      setData(prev => [optimisticCredit, ...prev]);
      return optimisticCredit;

    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    if (!business) throw new Error('No business context');

    try {
      const { data: result, error } = await supabase
        .from('credit')
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
        .from('credit')
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

  const markAsPaid = async (id: string) => {
    const creditItem = data.find(c => c.id === id);
    if (!creditItem) throw new Error('Credit record not found');

    const result = await update(id, {
      status: 'paid',
      paid_amount: creditItem.amount
    });
    
    return result;
  };

  const makePartialPayment = async (id: string, paymentAmount: number) => {
    const creditItem = data.find(c => c.id === id);
    if (!creditItem) throw new Error('Credit record not found');

    const newPaidAmount = creditItem.paid_amount + paymentAmount;
    const newStatus = newPaidAmount >= creditItem.amount ? 'paid' : 'partial';

    const result = await update(id, {
      paid_amount: newPaidAmount,
      status: newStatus
    });
    
    return result;
  };

  const getOutstandingCredit = () => {
    return data.filter(c => c.status === 'outstanding');
  };

  const getPartialCredit = () => {
    return data.filter(c => c.status === 'partial');
  };

  const getOverdueCredit = () => {
    const today = new Date();
    return data.filter(c => 
      c.status !== 'paid' && 
      c.due_date && 
      new Date(c.due_date) < today
    );
  };

  const getTotalOwed = () => {
    return data.reduce((sum, c) => {
      if (c.status === 'outstanding') return sum + c.amount;
      if (c.status === 'partial') return sum + (c.amount - c.paid_amount);
      return sum;
    }, 0);
  };

  const getOverdueAmount = () => {
    const today = new Date();
    return data.reduce((sum, c) => {
      if (c.status !== 'paid' && c.due_date && new Date(c.due_date) < today) {
        if (c.status === 'partial') return sum + (c.amount - c.paid_amount);
        return sum + c.amount;
      }
      return sum;
    }, 0);
  };

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    refresh: fetchData,
    markAsPaid,
    makePartialPayment,
    getOutstandingCredit,
    getPartialCredit,
    getOverdueCredit,
    getTotalOwed,
    getOverdueAmount,
    credit: data,
    fetchCredit: fetchData
  };
}
