/**
 * Unified Credit Service
 * Handles all credit operations for both receivables (customers who owe you) and payables (suppliers you owe)
 * Replaces the old credit system with proper line item tracking
 */

import { supabase } from '@/lib/supabase';

export interface CreditCustomer {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  amount_home?: number;
  exchange_rate?: number;
  paid_amount: number;
  status: 'outstanding' | 'partial' | 'paid' | 'overdue';
  due_date?: string;
  date_given: string;
  notes?: string;
  metadata?: any;
  type: 'receivable' | 'payable';
  created_at: string;
  updated_at: string;
}

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
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface AddCreditResult {
  customer: CreditCustomer;
  item: CreditItem;
  isNew: boolean;
}

export interface PaymentResult {
  item: CreditItem;
  customer: CreditCustomer;
  remainingAmount: number;
}

/**
 * Case-insensitive customer matching - handles variations like "Tony", "TONY", "tony"
 */
function findMatchingCreditCustomer(
  creditCustomers: CreditCustomer[],
  customerName: string,
  type: 'receivable' | 'payable'
): CreditCustomer | null {
  const normalizedName = customerName.trim().toLowerCase();
  
  return creditCustomers.find(customer => 
    customer.customer_name.trim().toLowerCase() === normalizedName &&
    customer.type === type
  ) || null;
}

/**
 * Unified function to add credit - handles both new and existing customers
 * Creates both the credit customer record and the individual line item
 */
export async function addCreditUnified(
  customerName: string,
  amount: number,
  dueDate: string,
  description: string,
  businessId: string,
  industry: string,
  currency: string,
  type: 'receivable' | 'payable'
): Promise<AddCreditResult | null> {
  try {
    console.log(`[creditService] Adding ${type} credit for "${customerName}": ${currency} ${amount}`);
    
    // Get existing credit customers for this business
    const { data: existingCredit, error: fetchError } = await supabase
      .from('credit')
      .select('*')
      .eq('business_id', businessId)
      .eq('type', type);
      
    if (fetchError) {
      console.error('[creditService] Error fetching existing credit:', fetchError);
      throw fetchError;
    }
    
    // Check if customer already exists (case-insensitive matching)
    const existingCustomer = findMatchingCreditCustomer(existingCredit || [], customerName, type);
    
    let creditCustomer: CreditCustomer;
    let isNewCustomer = false;
    
    if (existingCustomer) {
      // Existing customer - update their total amount
      const newTotal = existingCustomer.amount + amount;
      
      const { data: updatedCustomer, error: updateError } = await supabase
        .from('credit')
        .update({ 
          amount: newTotal,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('[creditService] Error updating existing customer:', updateError);
        throw updateError;
      }
      
      creditCustomer = updatedCustomer;
      console.log(`[creditService] Updated existing customer "${customerName}": ${currency} ${newTotal}`);
    } else {
      // New customer - create credit customer record
      const newCustomerData = {
        business_id: businessId,
        industry,
        customer_name: customerName.trim(),
        type,
        amount,
        currency,
        paid_amount: 0,
        status: 'outstanding',
        date_given: new Date().toISOString().split('T')[0],
        due_date: dueDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: newCustomer, error: createError } = await supabase
        .from('credit')
        .insert(newCustomerData)
        .select()
        .single();
        
      if (createError) {
        console.error('[creditService] Error creating new customer:', createError);
        throw createError;
      }
      
      creditCustomer = newCustomer;
      isNewCustomer = true;
      console.log(`[creditService] Created new customer "${customerName}": ${currency} ${amount}`);
    }
    
    // Create the individual line item
    const newItemData = {
      credit_id: creditCustomer.id,
      business_id: businessId,
      industry,
      description: description.trim(),
      amount,
      paid_amount: 0,
      currency,
      status: 'outstanding',
      due_date: dueDate,
      date_given: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newItem, error: itemError } = await supabase
      .from('credit_items')
      .insert(newItemData)
      .select()
      .single();
      
    if (itemError) {
      console.error('[creditService] Error creating line item:', itemError);
      throw itemError;
    }
    
    console.log(`[creditService] Created line item: ${currency} ${amount} - ${description}`);
    
    return {
      customer: creditCustomer,
      item: newItem,
      isNew: isNewCustomer
    };
    
  } catch (error) {
    console.error('[creditService] Error in addCreditUnified:', error);
    throw error;
  }
}

/**
 * Get all line items for a specific customer
 */
export async function getLineItemsForCustomer(creditId: string): Promise<CreditItem[]> {
  try {
    const { data, error } = await supabase
      .from('credit_items')
      .select('*')
      .eq('credit_id', creditId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('[creditService] Error fetching line items:', error);
      throw error;
    }
    
    return data || [];
    
  } catch (error) {
    console.error('[creditService] Error in getLineItemsForCustomer:', error);
    throw error;
  }
}

/**
 * Make payment on an individual line item
 */
export async function makePaymentOnLineItem(
  itemId: string,
  paymentAmount: number
): Promise<PaymentResult | null> {
  try {
    console.log(`[creditService] Making payment of ${paymentAmount} on line item ${itemId}`);
    
    // Get the line item
    const { data: item, error: itemError } = await supabase
      .from('credit_items')
      .select('*')
      .eq('id', itemId)
      .single();
      
    if (itemError || !item) {
      console.error('[creditService] Line item not found:', itemError);
      throw new Error('Line item not found');
    }
    
    // Update line item status to paid
    const { data: updatedItem, error: updateError } = await supabase
      .from('credit_items')
      .update({ 
        paid_amount: paymentAmount,
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();
      
    if (updateError) {
      console.error('[creditService] Error updating line item:', updateError);
      throw updateError;
    }
    
    // Get the credit customer to update their total
    const { data: customer, error: customerError } = await supabase
      .from('credit')
      .select('*')
      .eq('id', item.credit_id)
      .single();
      
    if (customerError || !customer) {
      console.error('[creditService] Customer not found:', customerError);
      throw new Error('Customer not found');
    }
    
    // Calculate new total (subtract paid amount)
    const newTotal = Math.max(0, customer.amount - paymentAmount);
    
    // Update customer total
    const { data: updatedCustomer, error: customerUpdateError } = await supabase
      .from('credit')
      .update({ 
        amount: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('id', customer.id)
      .select()
      .single();
      
    if (customerUpdateError) {
      console.error('[creditService] Error updating customer total:', customerUpdateError);
      throw customerUpdateError;
    }
    
    console.log(`[creditService] Payment successful. New total for ${customer.customer_name}: ${newTotal}`);
    
    return {
      item: updatedItem,
      customer: updatedCustomer,
      remainingAmount: newTotal
    };
    
  } catch (error) {
    console.error('[creditService] Error in makePaymentOnLineItem:', error);
    throw error;
  }
}

/**
 * Get all credit customers for a business
 */
export async function getCreditCustomers(
  businessId: string,
  type?: 'receivable' | 'payable'
): Promise<CreditCustomer[]> {
  try {
    let query = supabase
      .from('credit')
      .select('*')
      .eq('business_id', businessId);
      
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) {
      console.error('[creditService] Error fetching credit customers:', error);
      throw error;
    }
    
    return data || [];
    
  } catch (error) {
    console.error('[creditService] Error in getCreditCustomers:', error);
    throw error;
  }
}

/**
 * Helper function to format currency
 */
export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'KSh') {
    return `KSh ${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Helper function to format date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Helper function to check if a date is overdue
 */
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}
