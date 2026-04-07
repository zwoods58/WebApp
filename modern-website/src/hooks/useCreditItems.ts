import { useIndustryDataNew } from './useIndustryDataNew'

export interface CreditItem {
  id: string;
  credit_id: string;
  business_id: string;
  industry: string;
  description?: string;
  amount: number;
  paid_amount: number;
  currency: string;
  status: 'outstanding' | 'partial' | 'paid' | 'overdue';
  due_date: string;
  date_given: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseCreditItemsOptions {
  businessId?: string;
  industry?: string;
  creditId?: string;
  status?: 'outstanding' | 'partial' | 'paid' | 'overdue';
}

export function useCreditItems(options: UseCreditItemsOptions = {}) {
  const industry = options.industry || 'retail'
  
  const { 
    data, 
    isLoading, 
    create,
    createAsync,
    delete: deleteItem, 
    update,
    updateAsync,
    isCreating,
    error,
    refetch
  } = useIndustryDataNew({
    industry,
    country: 'ke',
    table: 'credit_items',
    businessId: options.businessId,
  })

  // Filter by credit_id if provided
  let filteredData = data || []
  
  if (options.creditId) {
    filteredData = filteredData.filter((item: any) => item.credit_id === options.creditId)
  }
  
  if (options.status) {
    filteredData = filteredData.filter((item: any) => item.status === options.status)
  }

  return {
    data: filteredData as CreditItem[],
    isLoading,
    addCreditItem: create,
    addCreditItemAsync: createAsync,
    deleteCreditItem: deleteItem,
    updateCreditItem: update,
    updateCreditItemAsync: updateAsync,
    isPending: isCreating,
    error,
    refetch
  }
}

// Helper function to apply payment using FIFO logic
export function applyPaymentFIFO(lineItems: CreditItem[], paymentAmount: number) {
  // Sort by due_date ascending (oldest first)
  const sortedItems = [...lineItems]
    .filter(item => item.status !== 'paid')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  
  let remainingPayment = paymentAmount;
  const updates: Array<{id: string, paid_amount: number, status: string}> = [];
  
  for (const item of sortedItems) {
    if (remainingPayment <= 0) break;
    
    const itemRemaining = item.amount - (item.paid_amount || 0);
    const paymentToApply = Math.min(remainingPayment, itemRemaining);
    const newPaidAmount = (item.paid_amount || 0) + paymentToApply;
    const newStatus = newPaidAmount >= item.amount ? 'paid' : 
                     newPaidAmount > 0 ? 'partial' : 'outstanding';
    
    updates.push({
      id: item.id,
      paid_amount: newPaidAmount,
      status: newStatus
    });
    
    remainingPayment -= paymentToApply;
  }
  
  return { updates, remainingPayment };
}

// Helper function to calculate credit account status from line items
export function calculateCreditStatus(lineItems: CreditItem[]) {
  const activeItems = lineItems.filter(item => item.status !== 'paid');
  
  if (activeItems.length === 0) return 'paid';
  
  const hasPartial = activeItems.some(item => item.status === 'partial');
  const allOutstanding = activeItems.every(item => item.status === 'outstanding');
  
  return hasPartial ? 'partial' : 'outstanding';
}

// Helper function to calculate total owed from line items
export function calculateTotalOwed(lineItems: CreditItem[]) {
  return lineItems
    .filter(item => item.status !== 'paid')
    .reduce((sum, item) => sum + (item.amount - (item.paid_amount || 0)), 0);
}

// Helper function to get earliest due date from active line items
export function getEarliestDueDate(lineItems: CreditItem[]) {
  const activeItems = lineItems.filter(item => item.status !== 'paid');
  
  if (activeItems.length === 0) return null;
  
  return activeItems.reduce((earliest, item) => {
    const itemDate = new Date(item.due_date);
    return !earliest || itemDate < new Date(earliest) ? item.due_date : earliest;
  }, activeItems[0].due_date);
}
