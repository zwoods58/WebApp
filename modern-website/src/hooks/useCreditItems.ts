import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface CreditItem {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  status?: 'outstanding' | 'partial' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface UseCreditItemsProps {
  businessId?: string;
  industry?: string;
}

export interface UseCreditItemsReturn {
  data: CreditItem[];
  isLoading: boolean;
  error: Error | null;
  addCreditItem: (item: Omit<CreditItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCreditItem: (id: string, updates: Partial<CreditItem>) => Promise<void>;
  deleteCreditItem: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useCreditItems({ businessId, industry }: UseCreditItemsProps = {}): UseCreditItemsReturn {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['credit-items', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('credit_items')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addCreditItemMutation = useMutation({
    mutationFn: async (item: Omit<CreditItem, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('credit_items')
          .insert(item)
          .select()
          .single();

        if (error) {
          // Handle specific RLS policy errors
          if (error.code === '42501') {
            throw new Error('Permission denied: You can only add credit items to your own business');
          }
          throw error;
        }
        return data;
      } catch (err) {
        console.error('[creditService] Error creating line item:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-items'] });
    },
  });

  const updateCreditItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreditItem> }) => {
      try {
        const { data, error } = await supabase
          .from('credit_items')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          // Handle specific RLS policy errors
          if (error.code === '42501') {
            throw new Error('Permission denied: You can only update credit items from your own business');
          }
          throw error;
        }
        return data;
      } catch (err) {
        console.error('[creditService] Error updating line item:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-items'] });
    },
  });

  const deleteCreditItemMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('credit_items')
          .delete()
          .eq('id', id);

        if (error) {
          // Handle specific RLS policy errors
          if (error.code === '42501') {
            throw new Error('Permission denied: You can only delete credit items from your own business');
          }
          throw error;
        }
      } catch (err) {
        console.error('[creditService] Error deleting line item:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-items'] });
    },
  });

  const addCreditItem = async (item: Omit<CreditItem, 'id' | 'created_at' | 'updated_at'>) => {
    await addCreditItemMutation.mutateAsync(item);
  };

  const updateCreditItem = async (id: string, updates: Partial<CreditItem>) => {
    await updateCreditItemMutation.mutateAsync({ id, updates });
  };

  const deleteCreditItem = async (id: string) => {
    await deleteCreditItemMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addCreditItem,
    updateCreditItem,
    deleteCreditItem,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['credit-items'] }),
  };
}

// Calculate total amount owed from credit items
export function calculateTotalOwed(items: CreditItem[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}

// Apply payment using FIFO (First In, First Out) method
export function applyPaymentFIFO(items: CreditItem[], paymentAmount: number): CreditItem[] {
  let remainingPayment = paymentAmount;
  const updatedItems = [...items];

  for (let i = 0; i < updatedItems.length && remainingPayment > 0; i++) {
    const item = updatedItems[i];
    const itemPrice = item.price;

    if (remainingPayment >= itemPrice) {
      // Pay off this item completely
      updatedItems[i] = { ...item, price: 0 };
      remainingPayment -= itemPrice;
    } else {
      // Partial payment
      updatedItems[i] = { ...item, price: itemPrice - remainingPayment };
      remainingPayment = 0;
    }
  }

  return updatedItems;
}
