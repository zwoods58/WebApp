/**
 * Unified customer name matching for both Credit and Money In pages
 * Ensures consistent behavior across the application
 */

export interface CreditCustomer {
  id: string;
  customer_name: string;
  type?: 'receivable' | 'payable';
  amount: number;
  business_id: string;
  [key: string]: any;
}

/**
 * Find matching credit customer with case-insensitive, trimmed name matching
 * and proper type filtering
 */
export function findMatchingCreditCustomer(
  creditList: CreditCustomer[], 
  customerName: string, 
  creditType: 'receivable' | 'payable'
): CreditCustomer | null {
  if (!creditList || !creditList.length || !customerName) {
    return null;
  }
  
  const normalizedSearchName = customerName.toLowerCase().trim();
  
  return creditList.find((credit) => {
    const normalizedCreditName = credit.customer_name?.toLowerCase().trim();
    const matchesName = normalizedCreditName === normalizedSearchName;
    const matchesType = credit.type === creditType || (!credit.type && creditType === 'receivable');
    
    return matchesName && matchesType;
  }) || null;
}

/**
 * Normalize customer name for consistent storage and searching
 */
export function normalizeCustomerName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Validate credit data before database operations
 */
export function validateCreditData(creditData: any): { isValid: boolean; errors: string[] } {
  const errors = [];
  
  if (!creditData.customer_name?.trim()) {
    errors.push('Customer name is required');
  }
  
  if (!creditData.amount || isNaN(parseFloat(creditData.amount)) || parseFloat(creditData.amount) <= 0) {
    errors.push('Valid amount is required');
  }
  
  if (!creditData.due_date) {
    errors.push('Due date is required');
  }
  
  if (!creditData.business_id) {
    errors.push('Business ID is required');
  }
  
  if (!creditData.industry) {
    errors.push('Industry is required');
  }
  
  if (!creditData.currency) {
    errors.push('Currency is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate default description for credit line items
 */
export function generateDefaultDescription(customerName: string, context?: string): string {
  if (context) {
    return `${context} for ${customerName}`;
  }
  return `Credit purchase for ${customerName}`;
}

/**
 * Calculate new credit total after adding line item
 */
export function calculateNewCreditTotal(currentTotal: number, newAmount: number): number {
  return currentTotal + newAmount;
}

/**
 * Determine if credit status should change based on payments
 */
export function calculateCreditStatus(lineItems: any[]): 'outstanding' | 'partial' | 'paid' {
  if (!lineItems || lineItems.length === 0) {
    return 'outstanding';
  }
  
  const totalAmount = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPaid = lineItems.reduce((sum, item) => sum + (item.paid_amount || 0), 0);
  
  if (totalPaid >= totalAmount) {
    return 'paid';
  } else if (totalPaid > 0) {
    return 'partial';
  } else {
    return 'outstanding';
  }
}

